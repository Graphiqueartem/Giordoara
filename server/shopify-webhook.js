import http from "http";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnv({ path: resolve(__dirname, ".env") });

const {
  PORT = "8787",
  SHOPIFY_WEBHOOK_SECRET,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env;

if (!SHOPIFY_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing env vars. See server/.env.example");
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const verifyWebhook = (hmacHeader, rawBody) => {
  if (!hmacHeader) return false;
  const digest = crypto
    .createHmac("sha256", SHOPIFY_WEBHOOK_SECRET)
    .update(rawBody, "utf8")
    .digest("base64");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader));
};

const parseOrderItems = (payload) =>
  (payload?.line_items || []).map((item) => ({
    name: item?.title || item?.name || "Item",
    quantity: item?.quantity || 1,
    sku: item?.sku || null,
    price: item?.price ? Number(item.price) : null,
  }));

const resolveOrderNumber = (payload) =>
  String(payload?.order_number || payload?.name || payload?.id || "").trim();

const extractAttribute = (attributes, key) => {
  if (!Array.isArray(attributes)) return null;
  const match = attributes.find((attr) => (attr?.name || attr?.key) === key);
  return match?.value || null;
};

const extractSupabaseUserId = (payload) => {
  const fromNotes = extractAttribute(payload?.note_attributes, "supabase_user_id");
  if (fromNotes) return fromNotes;
  const fromAttributes = extractAttribute(payload?.attributes, "supabase_user_id");
  if (fromAttributes) return fromAttributes;
  const fromCheckout = extractAttribute(payload?.checkout?.note_attributes, "supabase_user_id");
  if (fromCheckout) return fromCheckout;
  return null;
};

const findUserByEmail = async (email) => {
  if (!email) return null;
  const target = email.toLowerCase();
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (error) throw error;
  return data?.users?.find((user) => user.email?.toLowerCase() === target) || null;
};

const findOrderByNumber = async (orderNumber) => {
  if (!orderNumber) return null;
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("id, user_id, order_number")
    .eq("order_number", orderNumber)
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) throw error;
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
};

const normalizeStatus = (value) => String(value || "").trim().toLowerCase();

const resolveOrderStatus = (payload) => {
  const financialStatus = normalizeStatus(payload?.financial_status);
  const fulfillmentStatus = normalizeStatus(payload?.fulfillment_status);
  const displayFulfillmentStatus = normalizeStatus(
    payload?.display_fulfillment_status || payload?.displayFulfillmentStatus
  );
  const cancelledAt = payload?.cancelled_at;

  if (cancelledAt) return "cancelled";
  if (financialStatus === "refunded" || financialStatus === "partially_refunded" || financialStatus === "voided") {
    return "refunded";
  }
  if (fulfillmentStatus === "fulfilled") return "delivered";
  if (fulfillmentStatus === "partial") return "shipped";
  if (
    fulfillmentStatus === "in_progress" ||
    fulfillmentStatus === "in progress" ||
    fulfillmentStatus === "in-progress" ||
    fulfillmentStatus === "open" ||
    fulfillmentStatus === "pending"
  ) {
    return "processing";
  }
  if (/(in[ _-]?progress|processing|open|pending)/.test(displayFulfillmentStatus)) {
    return "processing";
  }
  if (/(partially|partial|in[ _-]?transit|out[ _-]?for[ _-]?delivery|shipped)/.test(displayFulfillmentStatus)) {
    return "shipped";
  }
  if (/(delivered|fulfilled)/.test(displayFulfillmentStatus)) {
    return "delivered";
  }
  if (financialStatus === "paid" || financialStatus === "authorized" || financialStatus === "partially_paid") {
    return "confirmed";
  }
  return fulfillmentStatus || financialStatus || "processing";
};

const upsertOrder = async (payload, userId) => {
  const normalizedOrderNumber = resolveOrderNumber(payload);
  if (!normalizedOrderNumber) {
    throw new Error("Missing order number in Shopify payload.");
  }
  const status = resolveOrderStatus(payload);
  const totalAmount = payload?.total_price ? Number(payload.total_price) : null;
  const currency = payload?.currency || payload?.presentment_currency || "EUR";
  const items = parseOrderItems(payload);
  const record = {
    user_id: userId,
    order_number: normalizedOrderNumber,
    status: String(status || ""),
    total_amount: totalAmount,
    currency: String(currency || "EUR"),
    items,
  };
  console.log(
    "Order sync:",
    JSON.stringify({
      order_number: normalizedOrderNumber,
      financial_status: payload?.financial_status || null,
      fulfillment_status: payload?.fulfillment_status || null,
      display_fulfillment_status:
        payload?.display_fulfillment_status || payload?.displayFulfillmentStatus || null,
      resolved_status: record.status,
    })
  );

  const { data: updatedRows, error: updateError } = await supabaseAdmin
    .from("orders")
    .update(record)
    .eq("user_id", userId)
    .eq("order_number", normalizedOrderNumber)
    .select("id")
    .limit(1);

  if (updateError) throw updateError;
  if (Array.isArray(updatedRows) && updatedRows.length > 0) return;

  const { error: insertError } = await supabaseAdmin.from("orders").insert(record);

  if (insertError) throw insertError;
};

const server = http.createServer((req, res) => {
  const topic = req.headers["x-shopify-topic"] || "unknown-topic";
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} (${topic})`);

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
    return;
  }

  if (req.method !== "POST" || req.url !== "/webhooks/shopify") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", async () => {
    const rawBody = Buffer.concat(chunks);
    const hmac = req.headers["x-shopify-hmac-sha256"];

    if (!verifyWebhook(hmac, rawBody)) {
      console.warn("Invalid Shopify webhook signature");
      res.writeHead(401);
      res.end("Invalid signature");
      return;
    }
    console.log("Webhook signature OK");

    try {
      const payload = JSON.parse(rawBody.toString("utf8"));
      const orderNumber = resolveOrderNumber(payload);

      // For update webhooks, order metadata may not include the same user hints.
      // If we already have this order in DB, update it directly.
      const existingOrder = await findOrderByNumber(orderNumber);
      if (existingOrder?.user_id) {
        await upsertOrder(payload, existingOrder.user_id);
        res.writeHead(200);
        res.end("OK");
        return;
      }

      const supabaseUserId = extractSupabaseUserId(payload);
      if (supabaseUserId) {
        console.log("Using supabase_user_id attribute:", supabaseUserId);
        await upsertOrder(payload, supabaseUserId);
        res.writeHead(200);
        res.end("OK");
        return;
      }
      const email =
        payload?.email ||
        payload?.customer?.email ||
        payload?.contact_email ||
        payload?.billing_address?.email ||
        null;
      console.log("No supabase_user_id attribute. Falling back to email:", email);
      const user = await findUserByEmail(email);
      if (!user) {
        console.warn("No matching Supabase user for email:", email);
        res.writeHead(202);
        res.end("No matching user");
        return;
      }
      await upsertOrder(payload, user.id);
      res.writeHead(200);
      res.end("OK");
    } catch (error) {
      console.error("Webhook error:", error);
      res.writeHead(500);
      res.end("Server error");
    }
  });
});

server.listen(Number(PORT), () => {
  console.log(`Shopify webhook listening on http://localhost:${PORT}/webhooks/shopify`);
});
