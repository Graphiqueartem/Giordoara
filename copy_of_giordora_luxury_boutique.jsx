// GiordoraLuxuryBoutique.jsx
// Boutique en ligne de luxe GIORDORA PARIS - 2 produits, i18n, mini-panier, quick view, recherche, inscription / connexion

import React, { useState, useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ===== i18n =====
const LOCALES = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "it", label: "IT" },
  { code: "es", label: "ES" },
];

const TRANSLATIONS = {
  fr: {
    nav_home: "Accueil",
    nav_routine: "Routine Essentielle",
    nav_products: "Nos soins",
    nav_shop: "Boutique",
    nav_journal: "Journal beauté",
    nav_about: "La Maison Giordora",
    nav_contact: "Contact",
    shop_title: "Boutique Giordora",
    shop_subtitle: "Catalogue en direct synchronisé depuis Shopify.",
    shop_in_stock: "En stock",
    shop_sold_out: "Rupture",
    auth_login: "Connexion",
    auth_signup: "Inscription",
    hero_title: "La Beauté Essentielle.",
    hero_subtitle:
      "Deux soins d'exception. Hydratation profonde & éclat lumineux. Créés à Paris, fabriqués en France.",
    hero_cta_routine: "Découvrir la routine",
    hero_cta_shop: "Voir les soins",
    hero_cta_newsletter: "Rejoindre La Maison Giordora",
    hero_slider_eyebrow: "Rituels Giordora",
    hero_slider_title: "Nourrissez votre corps, sublimez votre beauté",
    hero_slider_subtitle:
      "Racontez l'histoire de votre marque avec des visuels et un message concis qui capte l'attention.",
    hero_slider_cta: "Acheter maintenant",
    section_routine_title: "La Routine Essentielle",
    section_routine_text:
      "Une routine simple, pensée pour hydrater, illuminer et révéler l'éclat naturel de votre peau.",
    filter_search_placeholder: "Rechercher un soin (hydratation, éclat...)",
    filter_need_label: "Besoins de la peau",
    filter_need_all: "Tous",
    filter_need_hydration: "Hydratation",
    filter_need_radiance: "Éclat",
    essence_name: "Essence Hydralis - Sérum Hydratant +",
    essence_tagline: "Hydratation profonde. Peau repulpée et lumineuse.",
    essence_short:
      "Une essence légère enrichie en acide hyaluronique, niacinamide et panthénol pour une hydratation longue durée.",
    essence_long:
      "Essence Hydralis fusionne instantanément avec la peau pour lui offrir une hydratation intense et durable, tout en renforçant la barrière cutanée.",
    radiant_name: "Radiant Infusion - Sérum Vitamine C Éclat",
    radiant_tagline: "Éclat immédiat. Teint uniforme et protégé.",
    radiant_short:
      "Sérum à la vitamine C stabilisée pour illuminer, uniformiser et protéger la peau au quotidien.",
    radiant_long:
      "Radiant Infusion révèle un éclat visible dès les premières applications et aide à lisser le grain de peau tout en protégeant des agressions extérieures.",
    routine_step1_title: "Étape 1 : Hydratation",
    routine_step1_text:
      "Essence Hydralis prépare la peau, la repulpe et renforce la barrière cutanée grâce à l'acide hyaluronique et à la niacinamide.",
    routine_step2_title: "Étape 2 : Éclat",
    routine_step2_text:
      "Radiant Infusion apporte lumière, uniformité et protection antioxydante grâce à la vitamine C stabilisée.",
    about_title: "La Maison Giordora",
    about_text:
      "GIORDORA PARIS allie l'élégance française, la science de la peau et une approche minimaliste : deux soins essentiels, une routine complète.",
    contact_title: "Contact",
    contact_text:
      "Une question sur votre commande ou votre routine ? Écrivez-nous, nous serons ravis de vous répondre.",
    footer_rights: `© ${new Date().getFullYear()} GIORDORA PARIS - Tous droits réservés.`,
    footer_made_in: "Créé à Paris, fabriqué en France.",
    btn_add_to_cart: "Ajouter au rituel",
    btn_view_routine: "Voir la Routine Essentielle",
    btn_view_product: "Découvrir le soin",
    btn_quick_view: "Aperçu rapide",
    btn_checkout: "Finaliser ma commande",
    btn_continue_shopping: "Continuer mes achats",
    btn_close: "Fermer",
    price_label: "Prix",
    mini_cart_title: "Votre rituel",
    mini_cart_empty: "Votre rituel est encore vide.",
    mini_cart_total: "Total",
    newsletter_title: "Rejoignez La Maison Giordora",
    newsletter_subtitle:
      "Recevez en avant-première nos rituels, conseils beauté et offres privées.",
    newsletter_email_placeholder: "Votre adresse e-mail",
    newsletter_cta: "S'inscrire",
    form_email: "Adresse e-mail",
    form_password: "Mot de passe",
    form_name: "Nom complet",
    form_login_title: "Connexion à votre compte",
    form_signup_title: "Créer un compte",
    auth_placeholder_email: "vous@example.com",
    auth_placeholder_password: "********",
    auth_placeholder_name: "Votre nom",
    auth_submit_login: "Se connecter",
    auth_submit_signup: "S'inscrire",
    auth_account: "Mon compte",
    auth_logout: "Déconnexion",
    auth_switch_to_signup: "Créer un compte",
    auth_switch_to_login: "Déjà inscrit ? Se connecter",
    auth_notice_check_email: "Vérifiez votre e-mail pour confirmer votre compte.",
    auth_notice_welcome: "Bienvenue dans la Maison Giordora.",
    auth_error_no_supabase: "Connectez Supabase pour activer les comptes.",
    auth_loading: "Chargement...",
    auth_error_required: "Adresse e-mail et mot de passe requis.",
    auth_error_name_required: "Nom complet requis.",
    account_title: "Votre compte",
    account_subtitle: "Commandes & profil",
    account_orders: "Vos commandes",
    account_no_orders: "Aucune commande pour l'instant.",
    account_login_prompt: "Connectez-vous pour voir vos commandes.",
    account_profile: "Profil",
    account_order_number: "Commande",
    account_status: "Statut",
    account_total: "Total",
    account_date: "Date",
    badge_made_in_france: "Made in France",
    badge_clean_beauty: "Clean Beauty",
    badge_cruelty_free: "Cruelty-Free",
    quickview_more: "En savoir plus",
    quickview_routine_hint:
      "Astuce : utilisé avec Radiant Infusion, les résultats sont encore plus visibles.",
    ingredients_title: "Ingrédients clés",
    benefits_title: "Bénéfices",
    routine_title: "Rituel d'utilisation",
    faq_title: "Questions fréquentes",
    reviews_title: "Avis clients",
    no_reviews: "Pas encore d'avis. Soyez le premier !",
  },
  en: {
    nav_routine: "Essential Routine",
    nav_home: "Home",
    nav_products: "Our Treatments",
    nav_shop: "Shop",
    nav_journal: "Beauty Journal",
    nav_about: "Giordora House",
    nav_contact: "Contact",
    shop_title: "Giordora Shop",
    shop_subtitle: "Live catalogue synced from Shopify.",
    shop_in_stock: "In stock",
    shop_sold_out: "Sold out",
    auth_login: "Login",
    auth_signup: "Sign up",
    hero_title: "Essential Beauty.",
    hero_subtitle:
      "Two exceptional treatments. Deep hydration & luminous radiance. Created in Paris, made in France.",
    hero_cta_routine: "Discover the routine",
    hero_cta_shop: "View products",
    hero_cta_newsletter: "Join Giordora House",
    hero_slider_eyebrow: "Giordora Rituals",
    hero_slider_title: "Nurture Your Body, Enhance Your Beauty",
    hero_slider_subtitle:
      "Tell your brand's story with imagery and concise messaging that captures attention.",
    hero_slider_cta: "Shop now",
    section_routine_title: "The Essential Routine",
    section_routine_text:
      "A simple ritual designed to hydrate, illuminate and reveal your skin's natural glow.",
    filter_search_placeholder: "Search a treatment (hydration, radiance...)",
    filter_need_label: "Skin needs",
    filter_need_all: "All",
    filter_need_hydration: "Hydration",
    filter_need_radiance: "Radiance",
    essence_name: "Essence Hydralis - Hydrating Serum +",
    essence_tagline: "Deep hydration. Plumped, luminous skin.",
    essence_short:
      "A lightweight essence enriched with hyaluronic acid, niacinamide and panthenol for long-lasting hydration.",
    essence_long:
      "Essence Hydralis melts instantly into the skin to deliver deep, lasting hydration while strengthening the skin barrier.",
    radiant_name: "Radiant Infusion - Vitamin C Radiance Serum",
    radiant_tagline: "Instant glow. Even, protected complexion.",
    radiant_short:
      "Stabilised vitamin C serum to brighten, even out and protect the skin every day.",
    radiant_long:
      "Radiant Infusion reveals visible radiance from the first uses and helps smooth skin texture while protecting against external aggressions.",
    routine_step1_title: "Step 1: Hydration",
    routine_step1_text:
      "Essence Hydralis prepares the skin, plumps it and reinforces the skin barrier thanks to hyaluronic acid and niacinamide.",
    routine_step2_title: "Step 2: Radiance",
    routine_step2_text:
      "Radiant Infusion brings light, even tone and antioxidant protection thanks to stabilised vitamin C.",
    about_title: "Giordora House",
    about_text:
      "GIORDORA PARIS blends French elegance, skin science and a minimalist approach: two essential care products, one complete routine.",
    contact_title: "Contact",
    contact_text:
      "Questions about your order or your routine? Write to us, we will be delighted to assist you.",
    footer_rights: `© ${new Date().getFullYear()} GIORDORA PARIS - All rights reserved.`,
    footer_made_in: "Created in Paris, made in France.",
    btn_add_to_cart: "Add to ritual",
    btn_view_routine: "View Essential Routine",
    btn_view_product: "Discover product",
    btn_quick_view: "Quick view",
    btn_checkout: "Checkout",
    btn_continue_shopping: "Continue shopping",
    btn_close: "Close",
    price_label: "Price",
    mini_cart_title: "Your ritual",
    mini_cart_empty: "Your ritual is still empty.",
    mini_cart_total: "Total",
    newsletter_title: "Join Giordora House",
    newsletter_subtitle:
      "Receive rituals, beauty tips and private offers in preview.",
    newsletter_email_placeholder: "Your email address",
    newsletter_cta: "Subscribe",
    form_email: "Email address",
    form_password: "Password",
    form_name: "Full name",
    form_login_title: "Log in to your account",
    form_signup_title: "Create an account",
    auth_placeholder_email: "you@example.com",
    auth_placeholder_password: "********",
    auth_placeholder_name: "Your name",
    auth_submit_login: "Login",
    auth_submit_signup: "Sign up",
    auth_account: "My account",
    auth_logout: "Logout",
    auth_switch_to_signup: "Create an account",
    auth_switch_to_login: "Already have an account? Log in",
    auth_notice_check_email: "Check your email to confirm your account.",
    auth_notice_welcome: "Welcome to Giordora House.",
    auth_error_no_supabase: "Connect Supabase to enable accounts.",
    auth_loading: "Loading...",
    auth_error_required: "Email and password are required.",
    auth_error_name_required: "Full name is required.",
    account_title: "Your account",
    account_subtitle: "Orders & profile",
    account_orders: "Your orders",
    account_no_orders: "No orders yet.",
    account_login_prompt: "Log in to view your orders.",
    account_profile: "Profile",
    account_order_number: "Order",
    account_status: "Status",
    account_total: "Total",
    account_date: "Date",
    badge_made_in_france: "Made in France",
    badge_clean_beauty: "Clean Beauty",
    badge_cruelty_free: "Cruelty-Free",
    quickview_more: "Learn more",
    quickview_routine_hint:
      "Tip: used together with Radiant Infusion, results are even more visible.",
    ingredients_title: "Key Ingredients",
    benefits_title: "Benefits",
    routine_title: "How to use",
    faq_title: "FAQ",
    reviews_title: "Reviews",
    no_reviews: "No reviews yet. Be the first!",
  },
  it: {
    nav_home: "Home",
    nav_routine: "Routine Essenziale",
    nav_products: "I nostri trattamenti",
    nav_shop: "Shop",
    nav_journal: "Journal bellezza",
    nav_about: "Maison Giordora",
    nav_contact: "Contatto",
    shop_title: "Shop Giordora",
    shop_subtitle: "Catalogo live sincronizzato da Shopify.",
    shop_in_stock: "Disponibile",
    shop_sold_out: "Esaurito",
    auth_login: "Accedi",
    auth_signup: "Registrati",
    hero_title: "La Bellezza Essenziale.",
    hero_subtitle:
      "Due trattamenti d'eccezione. Idratazione profonda e luminosità. Creati a Parigi, prodotti in Francia.",
    hero_cta_routine: "Scopri la routine",
    hero_cta_shop: "Vedi i prodotti",
    hero_cta_newsletter: "Unirti a Maison Giordora",
    hero_slider_eyebrow: "Rituali Giordora",
    hero_slider_title: "Nutri il tuo corpo, esalta la tua bellezza",
    hero_slider_subtitle:
      "Racconta la storia del tuo brand con immagini e un messaggio conciso che cattura l'attenzione.",
    hero_slider_cta: "Acquista ora",
    section_routine_title: "La Routine Essenziale",
    section_routine_text:
      "Una routine semplice, pensata per idratare, illuminare e rivelare la naturale luminosità della pelle.",
    filter_search_placeholder: "Cerca un trattamento (idratazione, luminosità...)",
    filter_need_label: "Bisogni della pelle",
    filter_need_all: "Tutti",
    filter_need_hydration: "Idratazione",
    filter_need_radiance: "Luminosità",
    essence_name: "Essence Hydralis - Siero Idratante +",
    essence_tagline: "Idratazione profonda. Pelle rimpolpata e luminosa.",
    essence_short:
      "Essenza leggera con acido ialuronico, niacinamide e pantenolo per un'idratazione a lunga durata.",
    essence_long:
      "Essence Hydralis si fonde immediatamente con la pelle per donare idratazione intensa e durevole, rafforzando al contempo la barriera cutanea.",
    radiant_name: "Radiant Infusion - Siero Vitamina C",
    radiant_tagline: "Luminosità immediata. Incarnato uniforme e protetto.",
    radiant_short:
      "Siero con vitamina C stabilizzata per illuminare, uniformare e proteggere la pelle ogni giorno.",
    radiant_long:
      "Radiant Infusion rivela una luminosità visibile fin dalle prime applicazioni e aiuta a levigare la grana della pelle proteggendola dalle aggressioni esterne.",
    routine_step1_title: "Step 1: Idratazione",
    routine_step1_text:
      "Essence Hydralis prepara la pelle, la rimpolpa e rafforza la barriera cutanea grazie all'acido ialuronico e alla niacinamide.",
    routine_step2_title: "Step 2: Luminosità",
    routine_step2_text:
      "Radiant Infusion dona luce, uniformità e protezione antiossidante grazie alla vitamina C stabilizzata.",
    about_title: "Maison Giordora",
    about_text:
      "GIORDORA PARIS unisce eleganza francese, scienza della pelle e un approccio minimalista: due trattamenti essenziali, una routine completa.",
    contact_title: "Contatto",
    contact_text:
      "Domande sul tuo ordine o sulla tua routine? Scrivici, saremo lieti di aiutarti.",
    footer_rights: `© ${new Date().getFullYear()} GIORDORA PARIS - Tutti i diritti riservati.`,
    footer_made_in: "Creato a Parigi, prodotto in Francia.",
    btn_add_to_cart: "Aggiungi al rituale",
    btn_view_routine: "Vedi la Routine Essenziale",
    btn_view_product: "Scopri il trattamento",
    btn_quick_view: "Anteprima",
    btn_checkout: "Conferma ordine",
    btn_continue_shopping: "Continua gli acquisti",
    btn_close: "Chiudi",
    price_label: "Prezzo",
    mini_cart_title: "Il tuo rituale",
    mini_cart_empty: "Il tuo rituale è ancora vuoto.",
    mini_cart_total: "Totale",
    newsletter_title: "Unirti a Maison Giordora",
    newsletter_subtitle:
      "Ricevi in anteprima rituali, consigli di bellezza e offerte esclusive.",
    newsletter_email_placeholder: "Il tuo indirizzo email",
    newsletter_cta: "Iscriviti",
    form_email: "Indirizzo email",
    form_password: "Password",
    form_name: "Nome completo",
    form_login_title: "Accedi al tuo account",
    form_signup_title: "Crea un account",
    auth_placeholder_email: "tu@example.com",
    auth_placeholder_password: "********",
    auth_placeholder_name: "Il tuo nome",
    auth_submit_login: "Accedi",
    auth_submit_signup: "Registrati",
    auth_account: "Il mio account",
    auth_logout: "Esci",
    auth_switch_to_signup: "Crea un account",
    auth_switch_to_login: "Hai già un account? Accedi",
    auth_notice_check_email: "Controlla la tua email per confermare l'account.",
    auth_notice_welcome: "Benvenuto in Maison Giordora.",
    auth_error_no_supabase: "Collega Supabase per attivare gli account.",
    auth_loading: "Caricamento...",
    auth_error_required: "Email e password richiesti.",
    auth_error_name_required: "Nome completo richiesto.",
    account_title: "Il tuo account",
    account_subtitle: "Ordini e profilo",
    account_orders: "I tuoi ordini",
    account_no_orders: "Nessun ordine per ora.",
    account_login_prompt: "Accedi per vedere i tuoi ordini.",
    account_profile: "Profilo",
    account_order_number: "Ordine",
    account_status: "Stato",
    account_total: "Totale",
    account_date: "Data",
    badge_made_in_france: "Made in France",
    badge_clean_beauty: "Clean Beauty",
    badge_cruelty_free: "Cruelty-Free",
    quickview_more: "Scopri di più",
    quickview_routine_hint:
      "Consiglio: usato insieme a Radiant Infusion, i risultati sono ancora più visibili.",
    ingredients_title: "Ingredienti principali",
    benefits_title: "Benefici",
    routine_title: "Come si usa",
    faq_title: "Domande frequenti",
    reviews_title: "Recensioni",
    no_reviews: "Ancora nessuna recensione. Sii il primo!",
  },
  es: {
    nav_home: "Inicio",
    nav_routine: "Rutina Esencial",
    nav_products: "Nuestros tratamientos",
    nav_shop: "Tienda",
    nav_journal: "Diario de belleza",
    nav_about: "Maison Giordora",
    nav_contact: "Contacto",
    shop_title: "Tienda Giordora",
    shop_subtitle: "Catálogo en vivo sincronizado desde Shopify.",
    shop_in_stock: "En stock",
    shop_sold_out: "Agotado",
    auth_login: "Iniciar sesión",
    auth_signup: "Crear cuenta",
    hero_title: "La Belleza Esencial.",
    hero_subtitle:
      "Dos tratamientos de excepción. Hidratación profunda y luminosidad. Creados en París, fabricados en Francia.",
    hero_cta_routine: "Descubrir la rutina",
    hero_cta_shop: "Ver productos",
    hero_cta_newsletter: "Unirte a Maison Giordora",
    hero_slider_eyebrow: "Rituales Giordora",
    hero_slider_title: "Nutre tu cuerpo, realza tu belleza",
    hero_slider_subtitle:
      "Cuenta la historia de tu marca con imágenes y un mensaje conciso que capte la atención.",
    hero_slider_cta: "Comprar ahora",
    filter_search_placeholder: "Buscar un tratamiento (hidratación, luminosidad...)",
    filter_need_label: "Necesidades de la piel",
    filter_need_all: "Todos",
    filter_need_hydration: "Hidratación",
    filter_need_radiance: "Luminosidad",
    essence_name: "Essence Hydralis - Sérum Hidratante +",
    essence_tagline: "Hidratación profunda. Piel rellena y luminosa.",
    essence_short:
      "Esencia ligera con ácido hialurónico, niacinamida y pantenol para una hidratación duradera.",
    essence_long:
      "Essence Hydralis se funde inmediatamente con la piel para aportar hidratación intensa y duradera, reforzando la barrera cutánea.",
    radiant_name: "Radiant Infusion - Sérum Vitamina C",
    radiant_tagline: "Luminosidad inmediata. Tono uniforme y protegido.",
    radiant_short:
      "Sérum con vitamina C estabilizada para iluminar, unificar y proteger la piel cada día.",
    radiant_long:
      "Radiant Infusion revela una luminosidad visible desde las primeras aplicaciones y ayuda a alisar la textura de la piel protegiéndola de las agresiones externas.",
    routine_step1_title: "Paso 1: Hidratación",
    routine_step1_text:
      "Essence Hydralis prepara la piel, la rellena y refuerza la barrera cutánea gracias al ácido hialurónico y a la niacinamida.",
    routine_step2_title: "Paso 2: Luminosidad",
    routine_step2_text:
      "Radiant Infusion aporta luz, uniformidad y protección antioxidante gracias a la vitamina C estabilizada.",
    about_title: "Maison Giordora",
    about_text:
      "GIORDORA PARIS combina la elegancia francesa, la ciencia de la piel y un enfoque minimalista: dos tratamientos esenciales, una rutina completa.",
    contact_title: "Contacto",
    contact_text:
      "¿Preguntas sobre tu pedido o tu rutinX Escríbenos, estaremos encantados de ayudarte.",
    footer_rights: `© ${new Date().getFullYear()} GIORDORA PARIS - Todos los derechos reservados.`,
    footer_made_in: "Creado en París, fabricado en Francia.",
    btn_add_to_cart: "Añadir al ritual",
    btn_view_routine: "Ver la Rutina Esencial",
    btn_view_product: "Descubrir el tratamiento",
    btn_quick_view: "Vista rápida",
    btn_checkout: "Finalizar compra",
    btn_continue_shopping: "Seguir comprando",
    btn_close: "Cerrar",
    price_label: "Precio",
    mini_cart_title: "Tu ritual",
    mini_cart_empty: "Tu ritual aún está vacío.",
    mini_cart_total: "Total",
    newsletter_title: "Unirte a Maison Giordora",
    newsletter_subtitle:
      "Recibe en primicia rituales, consejos de belleza y ofertas exclusivas.",
    newsletter_email_placeholder: "Tu correo electrónico",
    newsletter_cta: "Suscribirse",
    form_email: "Correo electrónico",
    form_password: "Contraseña",
    form_name: "Nombre completo",
    form_login_title: "Inicia sesión en tu cuenta",
    form_signup_title: "Crear una cuenta",
    auth_placeholder_email: "tu@example.com",
    auth_placeholder_password: "********",
    auth_placeholder_name: "Tu nombre",
    auth_submit_login: "Iniciar sesión",
    auth_submit_signup: "Registrarse",
    auth_account: "Mi cuenta",
    auth_logout: "Cerrar sesión",
    auth_switch_to_signup: "Crear una cuenta",
    auth_switch_to_login: "¿Ya tienes cuenta? Inicia sesión",
    auth_notice_check_email: "Revisa tu correo para confirmar tu cuenta.",
    auth_notice_welcome: "Bienvenido a Maison Giordora.",
    auth_error_no_supabase: "Conecta Supabase para activar las cuentas.",
    auth_loading: "Cargando...",
    auth_error_required: "Se requieren correo y contraseña.",
    auth_error_name_required: "Se requiere nombre completo.",
    account_title: "Tu cuenta",
    account_subtitle: "Pedidos y perfil",
    account_orders: "Tus pedidos",
    account_no_orders: "Aún no hay pedidos.",
    account_login_prompt: "Inicia sesión para ver tus pedidos.",
    account_profile: "Perfil",
    account_order_number: "Pedido",
    account_status: "Estado",
    account_total: "Total",
    account_date: "Fecha",
    quickview_more: "Saber más",
    quickview_routine_hint:
      "Consejo: combinado con Radiant Infusion, los resultados son aún más visibles.",
    ingredients_title: "Ingredientes clave",
    benefits_title: "Beneficios",
    routine_title: "Modo de uso",
    faq_title: "Preguntas frecuentes",
    reviews_title: "Reseñas",
    no_reviews: "Aún no hay reseñas. Sé el primero.",
  },
};

// Use cleaned translations fallback (currently mapping to TRANSLATIONS)
const CLEAN_TRANSLATIONS = TRANSLATIONS;

const CART_STORAGE_KEY = "giordora-cart";
const REVIEWS_STORAGE_KEY = "giordora-reviews";

// ===== Shopify config & helpers =====
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN || "";
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || "";
const SHOPIFY_PRODUCT_HANDLES = {
  essence: import.meta.env.VITE_SHOPIFY_ESSENCE_HANDLE || "essence-hydralis",
  radiant: import.meta.env.VITE_SHOPIFY_RADIANT_HANDLE || "radiant-infusion",
};
const SHOPIFY_API_VERSION = "2024-10";
const SHOPIFY_ENDPOINT = SHOPIFY_DOMAIN
  ? `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`
  : "";
const SHOPIFY_HANDLE_TO_KEY = Object.fromEntries(
  Object.entries(SHOPIFY_PRODUCT_HANDLES).map(([key, handle]) => [handle, key])
);

// ===== Supabase config =====
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

async function shopifyFetch(query, variables = {}) {
  if (!SHOPIFY_ENDPOINT || !SHOPIFY_STOREFRONT_TOKEN) {
    throw new Error("Shopify environment variables are not set.");
  }
  const response = await fetch(SHOPIFY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  if (!response.ok || json.errors) {
    const message =
      json?.errors?.map((e) => e.message).join(", ") ||
      response.statusText ||
      "Unknown Shopify error";
    throw new Error(message);
  }
  return json.data;
}

async function fetchShopifyProduct(handle) {
  const query = `
    query productByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        availableForSale
        totalInventory
        featuredImage { url altText }
        variants(first: 1) {
          edges {
            node {
              id
              title
              availableForSale
              quantityAvailable
              price { amount currencyCode }
              image { url altText }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query, { handle });
  return data?.productByHandle;
}

async function fetchShopifyCartById(cartId) {
  const data = await shopifyFetch(
    `
    query cart($cartId: ID!) {
      cart(id: $cartId) {
        ${SHOPIFY_CART_FRAGMENT}
      }
    }
  `,
    { cartId }
  );
  return data?.cart;
}

const SHOPIFY_CART_FRAGMENT = `
  id
  checkoutUrl
  attributes { key value }
  cost {
    subtotalAmount { amount currencyCode }
  }
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        cost {
          amountPerQuantity { amount currencyCode }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            quantityAvailable
            product { handle title }
          }
        }
      }
    }
  }
`;

async function createShopifyCart(attributes = []) {
  const safeAttributes = Array.isArray(attributes)
    ? attributes.filter((attr) => attr?.key)
    : [];
  const data = await shopifyFetch(
    `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { ${SHOPIFY_CART_FRAGMENT} }
        userErrors { message }
      }
    }
  `,
    { input: safeAttributes.length > 0 ? { attributes: safeAttributes } : {} }
  );
  if (data?.cartCreate?.userErrors?.length) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join(", "));
  }
  return data?.cartCreate?.cart;
}

async function updateShopifyCartAttributes(cartId, attributes = []) {
  const safeAttributes = Array.isArray(attributes)
    ? attributes.filter((attr) => attr?.key)
    : [];
  const data = await shopifyFetch(
    `
    mutation cartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
      cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
        cart { ${SHOPIFY_CART_FRAGMENT} }
        userErrors { message }
      }
    }
  `,
    { cartId, attributes: safeAttributes }
  );
  if (data?.cartAttributesUpdate?.userErrors?.length) {
    throw new Error(data.cartAttributesUpdate.userErrors.map((e) => e.message).join(", "));
  }
  return data?.cartAttributesUpdate?.cart;
}

async function addLineToShopifyCart(cartId, merchandiseId, quantity) {
  const data = await shopifyFetch(
    `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${SHOPIFY_CART_FRAGMENT} }
        userErrors { message }
      }
    }
  `,
    { cartId, lines: [{ merchandiseId, quantity }] }
  );
  if (data?.cartLinesAdd?.userErrors?.length) {
    throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join(", "));
  }
  return data?.cartLinesAdd?.cart;
}

async function updateShopifyLine(cartId, lineId, quantity) {
  const data = await shopifyFetch(
    `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${SHOPIFY_CART_FRAGMENT} }
        userErrors { message }
      }
    }
  `,
    { cartId, lines: [{ id: lineId, quantity }] }
  );
  if (data?.cartLinesUpdate?.userErrors?.length) {
    throw new Error(data.cartLinesUpdate.userErrors.map((e) => e.message).join(", "));
  }
  return data?.cartLinesUpdate?.cart;
}

async function removeShopifyLine(cartId, lineId) {
  const data = await shopifyFetch(
    `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${SHOPIFY_CART_FRAGMENT} }
        userErrors { message }
      }
    }
  `,
    { cartId, lineIds: [lineId] }
  );
  if (data?.cartLinesRemove?.userErrors?.length) {
    throw new Error(data.cartLinesRemove.userErrors.map((e) => e.message).join(", "));
  }
  return data?.cartLinesRemove?.cart;
}

function normalizeShopifyProduct(product, key) {
  if (!product) return null;
  const variant = product?.variants?.edges?.[0]?.node;
  const priceData = variant?.price || variant?.priceV2;
  return {
    key,
    id: product.id,
    handle: product.handle,
    variantId: variant?.id,
    price: priceData ? Number(priceData.amount) : null,
    currency: priceData?.currencyCode || "EUR",
    available: variant?.availableForSale ?? product.availableForSale,
    quantityAvailable: variant?.quantityAvailable ?? product.totalInventory,
    image: variant?.image?.url || product.featuredImage?.url,
    title: product.title,
    description: product.description || product.descriptionHtml || "",
  };
}

function normalizeShopifyCart(cart) {
  if (!cart) return null;
  const items =
    cart?.lines?.edges?.map(({ node }) => {
      const merch = node?.merchandise;
      const handle = merch?.product?.handle;
      return {
        lineId: node?.id,
        key: SHOPIFY_HANDLE_TO_KEY[handle] || handle,
        title: merch?.product?.title || merch?.title || handle,
        quantity: node?.quantity || 0,
        price: Number(node?.cost?.amountPerQuantity?.amount || 0),
        currency: node?.cost?.amountPerQuantity?.currencyCode || "EUR",
      };
    }) || [];

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    items,
    total: Number(cart?.cost?.subtotalAmount?.amount || 0),
    currency: cart?.cost?.subtotalAmount?.currencyCode || "EUR",
  };
}

const PRODUCTS = [
  {
    id: "essence-hydralis",
    key: "essence",
    price: 68,
    needs: ["hydration"],
    size: "30 ml",
  },
  {
    id: "radiant-infusion",
    key: "radiant",
    price: 74,
    needs: ["radiance"],
    size: "30 ml",
  },
];

const PRODUCT_DETAILS = {
  essence: {
    title: "Essence Hydralis",
    subtitle: "Hydrating Serum +",
    price: 68,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    ingredients:
      "Hyaluronic acid complex, niacinamide 5%, panthenol, glycerin, tremella extract.",
    benefits: [
      "Plumps and hydrates deeply",
      "Reinforces skin barrier",
      "Soothes visible redness",
      "Preps skin for actives",
    ],
    routine:
      "Apply 2-3 pumps on clean skin morning and night. Follow with Radiant Infusion for amplified glow.",
    usp: ["Derm-tested", "Fragrance-free", "Vegan", "Made in France"],
    faq: [
      {
        q: "Can I use it with retinol?",
        a: "Yes. Apply Essence Hydralis before your retinol to cushion and hydrate.",
      },
      {
        q: "Suitable for sensitive skin?",
        a: "Yes, it is formulated to be gentle and barrier-friendly.",
      },
    ],
    reviews: [],
  },
  radiant: {
    title: "Radiant Infusion",
    subtitle: "Vitamin C Radiance Serum",
    price: 74,
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80",
    ingredients: "Stabilised Vitamin C 15%, niacinamide, ferulic acid, peptides, glycerin.",
    benefits: [
      "Boosts visible radiance immediately",
      "Evens tone and fades dullness",
      "Antioxidant shield against pollution",
      "Layers well under SPF and makeup",
    ],
    routine:
      "Press 2-3 pumps on dry skin in the morning. Follow with moisturizer and SPF. Can be used at night for extra glow.",
    usp: ["No sticky feel", "Makeup-friendly", "Derm-tested", "Made in France"],
    faq: [
      {
        q: "Can I use it daily?",
        a: "Yes, it is designed for daily use on most skin types.",
      },
      {
        q: "Layering order?",
        a: "After Essence Hydralis, before moisturizer and SPF.",
      },
    ],
    reviews: [],
  },
};

function ProductPage({ product, onBack, onAddToCart, onAddReview, locale }) {
  const benefits = product?.benefits || [];
  const usp = product?.usp || [];
  const faq = product?.faq || [];
  const reviews = product?.reviews || [];
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const ingredientList = Array.isArray(product?.ingredients)
    ? product.ingredients
    : typeof product?.ingredients === "string"
      ? product.ingredients.split(",").map((item) => item.trim()).filter(Boolean)
      : [];
  const uspList =
    usp.length > 0
      ? usp
      : ["Clean beauty", "Cruelty-free", "Made in France", "Satisfaction guarantee"];
  const loveItems =
    benefits.length > 0
      ? benefits.slice(0, 3)
      : [
          "Instant glow and lasting hydration",
          "Ultra-light texture that melts into skin",
          "Formulated with dermatology-backed actives",
        ];
  const benefitList = benefits.length > 0 ? benefits : loveItems;
  const displayedReviews =
    reviews.length > 0
      ? reviews
      : [
          {
            name: "Camille",
            rating: 5,
            comment: "Plumped and luminous skin in a few days. The duo is a staple.",
          },
          {
            name: "Nadia",
            rating: 5,
            comment: "Featherlight textures and a refined finish. Feels haute-parfumerie grade.",
          },
          {
            name: "Emma",
            rating: 5,
            comment: "My sensitive skin loved it immediately. No tightness, just glow.",
          },
        ];

  const formatStars = (value = 5) => {
    const score = Math.max(1, Math.round(value));
    return "?".repeat(score).padEnd(5, "?");
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    onAddReview?.({
      name: reviewName,
      comment: reviewComment,
      rating: Number(reviewRating) || 5,
      date: new Date().toISOString(),
    });
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
  };
  return (
    <section className="giordora-template-product">
      <div className="giordora-template-product-header">
        <button className="giordora-btn-outline" onClick={onBack}>
          {"<- Back to products"}
        </button>
      </div>

      <div className="giordora-template-product-hero">
        <div>
          <div className="giordora-template-gallery">
            {product.image ? (
              <img className="giordora-template-gallery-img" src={product.image} alt={product.title} />
            ) : (
              <div className="giordora-template-gallery-inner">
                <span className="giordora-template-pill" style={{ color: "var(--color-gold)" }}>
                  Giordora
                </span>
                <strong>{product.title}</strong>
              </div>
            )}
          </div>
          <div className="giordora-template-thumbs">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="giordora-template-thumb" />
            ))}
          </div>
        </div>

        <div className="giordora-template-product-info">
          <div className="giordora-template-pill">Giordora Paris</div>
          <h1>{product.title}</h1>
          {product.subtitle && <p style={{ color: "#4f4f4f" }}>{product.subtitle}</p>}
          {product.description && <p className="giordora-text-block">{product.description}</p>}

          <div className="giordora-template-price-row">
            <div className="giordora-template-price">
              {formatPrice(product.price, locale || "fr-FR", product.currency || "EUR")}
            </div>
            <div className="giordora-template-pill">Made in France</div>
          </div>

          <button className="giordora-template-primary" onClick={onAddToCart}>
            Add to ritual
          </button>

          <div className="giordora-template-usp giordora-template-divider">
            {uspList.slice(0, 4).map((item) => (
              <div key={item}>
                <p className="giordora-template-usp-title" style={{ color: "#2f2f2f", margin: 0 }}>
                  {item}
                </p>
                <p className="giordora-template-usp-text" style={{ margin: 0 }}>
                  Premium care crafted for daily radiance.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="giordora-template-section">
        <h2>Why you'll love it</h2>
        <div className="giordora-template-benefits">
          {loveItems.map((item, idx) => (
            <div key={idx} className="giordora-template-review-card">
              <div className="giordora-template-bullet">
                <span className="giordora-template-bullet-dot" />
                <span>{item}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="giordora-template-section">
        <h2>Benefits</h2>
        <div className="giordora-template-benefits">
          {benefitList.map((item) => (
            <div key={item} className="giordora-template-bullet">
              <span className="giordora-template-bullet-dot" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="giordora-template-section">
        <h2>Key ingredients</h2>
        <div className="giordora-template-ingredients">
          {ingredientList.length === 0 ? (
            <div className="giordora-template-bullet">
              <span className="giordora-template-bullet-dot" />
              <span>{product.ingredients || "Advanced active complex crafted in France."}</span>
            </div>
          ) : (
            ingredientList.map((item) => (
              <div key={item} className="giordora-template-bullet">
                <span className="giordora-template-bullet-dot" />
                <span>{item}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="giordora-template-section">
        <h2>How to use</h2>
        <p className="giordora-text-block">{product.routine}</p>
      </div>

      {faq.length > 0 && (
        <div className="giordora-template-section">
          <h2>FAQ</h2>
          {faq.map((f) => (
            <details key={f.q} className="giordora-template-review-card">
              <summary style={{ cursor: "pointer", fontWeight: 600 }}>{f.q}</summary>
              <p style={{ marginTop: 6 }}>{f.a}</p>
            </details>
          ))}
        </div>
      )}

      <div className="giordora-template-section">
        <h2>Reviews</h2>
        <div className="giordora-template-review-grid">
          {displayedReviews.map((r, idx) => (
            <div key={idx} className="giordora-template-review-card">
              <div className="giordora-stars">{formatStars(r.rating)}</div>
              <h4>{r.name}</h4>
              <p>{r.comment}</p>
              <div className="giordora-template-review-meta">
                {r.date ? new Date(r.date).toLocaleDateString() : "Verified client"}
              </div>
            </div>
          ))}
        </div>

        <div className="giordora-template-review-card giordora-template-divider">
          <h4 style={{ marginTop: 0 }}>Share your experience</h4>
          <form onSubmit={handleSubmitReview} className="giordora-template-review-form">
            <input
              type="text"
              placeholder="Full name"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              className="giordora-newsletter-input"
              style={{ width: "100%" }}
            />
            <textarea
              placeholder="Your review"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              style={{
                width: "100%",
                marginTop: 8,
                borderRadius: 12,
                border: "1px solid #e2d7c3",
                padding: 10,
                minHeight: 80,
                fontFamily: "inherit",
              }}
            />
            <label style={{ display: "block", marginTop: 10, fontSize: 12, color: "#4f4f4f" }}>
              Rating
              <input
                type="number"
                min="1"
                max="5"
                value={reviewRating}
                onChange={(e) => setReviewRating(e.target.value)}
                style={{
                  marginLeft: 8,
                  width: 64,
                  borderRadius: 8,
                  border: "1px solid #e2d7c3",
                  padding: "6px 8px",
                  background: "#fff",
                }}
              />
            </label>
            <button type="submit" className="giordora-template-primary" style={{ marginTop: 12 }}>
              Submit review
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function useTranslation(locale) {
  return useMemo(() => {
    const dict = CLEAN_TRANSLATIONS[locale] || CLEAN_TRANSLATIONS.en;
    return (key) => dict[key] || key;
  }, [locale]);
}

function formatPrice(price, locale, currency = "EUR") {
  try {
    return new Intl.NumberFormat(locale || "fr-FR", {
      style: "currency",
      currency: currency || "EUR",
      minimumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${price} ${currency || "EUR"}`;
  }
}

export default function GiordoraLuxuryBoutique() {
  const [locale, setLocale] = useState("fr");
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authUser, setAuthUser] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [page, setPage] = useState("home");
  const [cartItems, setCartItems] = useState([]);
  const [localReviews, setLocalReviews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  });
  const [search, setSearch] = useState("");
  const [needFilter, setNeedFilter] = useState("all");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [productDetail, setProductDetail] = useState(null);
  const [heroSlide, setHeroSlide] = useState(0);
  const shopifyEnabled = Boolean(SHOPIFY_DOMAIN && SHOPIFY_STOREFRONT_TOKEN);
  const supabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
  const [shopifyProducts, setShopifyProducts] = useState({});
  const [shopifyCart, setShopifyCart] = useState(null);
  const [shopifyLoading, setShopifyLoading] = useState(false);
  const [shopifyError, setShopifyError] = useState("");
  const cartAuthAttributes = useMemo(() => {
    if (!authUser) return [];
    const attrs = [{ key: "supabase_user_id", value: authUser.id }];
    if (authUser.email) {
      attrs.push({ key: "supabase_email", value: authUser.email });
    }
    return attrs;
  }, [authUser]);

  const t = useTranslation(locale);

  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(localReviews));
    } catch {
      /* ignore */
    }
  }, [localReviews]);

  useEffect(() => {
    if (!supabaseEnabled || !supabase) return;
    let mounted = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setAuthUser(data?.session?.user || null);
      })
      .catch(() => {
        if (!mounted) return;
        setAuthSession(null);
        setAuthUser(null);
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user || null);
    });

    return () => {
      mounted = false;
      data?.subscription?.unsubscribe();
    };
  }, [supabaseEnabled]);

  useEffect(() => {
    if (!supabaseEnabled || !authUser) {
      setOrders([]);
      return;
    }
    let active = true;
    const loadOrders = async () => {
      setOrdersLoading(true);
      setOrdersError("");
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, status, total_amount, currency, created_at, items")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false });
      if (!active) return;
      if (error) {
        setOrdersError(error.message || "Unable to load orders.");
        setOrders([]);
      } else {
        setOrders(data || []);
      }
      setOrdersLoading(false);
    };
    loadOrders().catch(() => {
      if (!active) return;
      setOrdersError("Unable to load orders.");
      setOrdersLoading(false);
    });
    return () => {
      active = false;
    };
  }, [authUser, supabaseEnabled]);

  const handleNavigate = (nextPage) => {
    setPage(nextPage);
    setProductDetail(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setAuthError("");
    setAuthNotice("");
    if (authMode === "login") {
      setAuthName("");
    }
  }, [authMode]);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthOpen(true);
    setAccountOpen(false);
    setAuthError("");
    setAuthNotice("");
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");
    setAuthNotice("");
    if (!supabaseEnabled || !supabase) {
      setAuthError(t("auth_error_no_supabase"));
      return;
    }

    const email = authEmail.trim();
    const password = authPassword.trim();
    if (!email || !password) {
      setAuthError(t("auth_error_required"));
      return;
    }
    if (authMode === "signup" && !authName.trim()) {
      setAuthError(t("auth_error_name_required"));
      return;
    }

    setAuthLoading(true);
    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setAuthNotice(t("auth_notice_welcome"));
        setAuthOpen(false);
        setAccountOpen(true);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: authName.trim() },
          },
        });
        if (error) throw error;
        if (data?.session) {
          setAuthNotice(t("auth_notice_welcome"));
          setAuthOpen(false);
          setAccountOpen(true);
        } else {
          setAuthNotice(t("auth_notice_check_email"));
        }
      }
    } catch (error) {
      setAuthError(error?.message || "Unable to authenticate.");
    } finally {
      setAuthLoading(false);
      setAuthPassword("");
    }
  };

  const handleSignOut = async () => {
    if (!supabaseEnabled || !supabase) return;
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setAuthUser(null);
      setAccountOpen(false);
    } catch (error) {
      setAuthError(error?.message || "Unable to sign out.");
    } finally {
      setAuthLoading(false);
    }
  };

  const heroSlides = [
    {
      title: t("hero_slider_title"),
      subtitle: t("hero_slider_subtitle"),
      cta: t("hero_slider_cta"),
      action: () => handleNavigate("shop"),
      image: "/images/hero-slide-1.jpg",
      hasText: true,
    },
    {
      image: "/images/hero-slide-2.jpg",
      hasText: false,
    },
    {
      image: "/images/hero-slide-3.jpg",
      hasText: false,
    },
    {
      image: "/images/hero-slide-4.jpg",
      hasText: false,
    },
  ];

  const handleHeroNext = () => setHeroSlide((i) => (i + 1) % heroSlides.length);
  const handleHeroPrev = () => setHeroSlide((i) => (i - 1 + heroSlides.length) % heroSlides.length);
  const currentHeroSlide = heroSlides[heroSlide];
  const userDisplayName =
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.name ||
    (authUser?.email ? authUser.email.split("@")[0] : "");
  const userInitials = userDisplayName
    ? userDisplayName
        .split(" ")
        .map((part) => part.trim()[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "G";

  useEffect(() => {
    const id = setInterval(() => setHeroSlide((i) => (i + 1) % heroSlides.length), 6000);
    return () => clearInterval(id);
  }, [heroSlides.length]);

  const navigateToSection = (id) => {
    handleNavigate("home");
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  };

  const total = shopifyCart ? shopifyCart.total : cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCurrency = shopifyCart?.currency || "EUR";

  const productCatalog = useMemo(() => {
    return PRODUCTS.map((p) => {
      const shopifyData = shopifyProducts[p.key];
      return {
        ...p,
        ...(shopifyData
          ? {
              price: shopifyData.price ?? p.price,
              currency: shopifyData.currency || "EUR",
              available: shopifyData.available,
              quantityAvailable: shopifyData.quantityAvailable,
              variantId: shopifyData.variantId,
              image: shopifyData.image || PRODUCT_DETAILS[p.key]?.image,
            }
          : {}),
      };
    });
  }, [shopifyProducts]);

  const productCatalogMap = useMemo(
    () => Object.fromEntries(productCatalog.map((p) => [p.key, p])),
    [productCatalog]
  );

  useEffect(() => {
    if (!shopifyEnabled) return;
    let cancelled = false;
    const loadShopifyProducts = async () => {
      setShopifyLoading(true);
      setShopifyError("");
      try {
        const entries = await Promise.all(
          Object.entries(SHOPIFY_PRODUCT_HANDLES).map(async ([key, handle]) => {
            const product = await fetchShopifyProduct(handle);
            return [key, normalizeShopifyProduct(product, key)];
          })
        );
        if (!cancelled) {
          setShopifyProducts(Object.fromEntries(entries.filter(([, value]) => value)));
        }
      } catch (err) {
        if (!cancelled) setShopifyError(err?.message || "Shopify sync failed.");
      } finally {
        if (!cancelled) setShopifyLoading(false);
      }
    };
    loadShopifyProducts();
    return () => {
      cancelled = true;
    };
  }, [shopifyEnabled]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "{}");
      if (stored.shopifyCartId) {
        fetchShopifyCartById(stored.shopifyCartId)
          .then((cart) => {
            if (cart) syncShopifyCart(cart);
          })
          .catch(() => {
            localStorage.removeItem(CART_STORAGE_KEY);
          });
      } else if (Array.isArray(stored.items)) {
        setCartItems(stored.items);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (shopifyCart?.id) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: cartItems }));
    } catch {
      /* ignore storage errors */
    }
  }, [cartItems, shopifyCart?.id]);

  const syncShopifyCart = (cart) => {
    const normalized = normalizeShopifyCart(cart);
    setShopifyCart(normalized);
    setCartItems(normalized?.items || []);
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ shopifyCartId: normalized?.id || null })
      );
    } catch {
      /* ignore storage errors */
    }
    return normalized;
  };

  const ensureShopifyCart = async () => {
    if (shopifyCart?.id) return shopifyCart;
    const created = await createShopifyCart(cartAuthAttributes);
    return syncShopifyCart(created);
  };

  useEffect(() => {
    if (!shopifyEnabled || !shopifyCart?.id) return;
    const attributes = authUser
      ? cartAuthAttributes
      : [
          { key: "supabase_user_id", value: "" },
          { key: "supabase_email", value: "" },
        ];
    updateShopifyCartAttributes(shopifyCart.id, attributes)
      .then((updated) => {
        if (updated) syncShopifyCart(updated);
      })
      .catch(() => {
        /* ignore cart attribute errors */
      });
  }, [authUser, cartAuthAttributes, shopifyCart?.id, shopifyEnabled]);

  const handleAddToCart = async (productKey) => {
    const product = productCatalogMap[productKey];
    if (!product) return;
    if (!shopifyEnabled) {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.key === productKey);
        if (existing) {
          return prev.map((item) =>
            item.key === productKey ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [
          ...prev,
          {
            key: product.key,
            id: product.id,
            quantity: 1,
            price: product.price,
            currency: product.currency || "EUR",
          },
        ];
      });
      setCartOpen(true);
      return;
    }
    try {
      setShopifyError("");
      const shopifyData = shopifyProducts[productKey];
      if (!shopifyData.variantId) {
        throw new Error("Product not available on Shopify (missing variant).");
      }
      const cart = await ensureShopifyCart();
      const updated = await addLineToShopifyCart(cart.id, shopifyData.variantId, 1);
      syncShopifyCart(updated);
      setCartOpen(true);
    } catch (err) {
      setShopifyError(err?.message || "Unable to add to cart.");
    }
  };

  const handleUpdateQuantity = async (productKey, delta) => {
    if (!shopifyEnabled || !shopifyCart) {
      setCartItems((prev) =>
        prev
          .map((item) =>
            item.key === productKey
              ? { ...item, quantity: Math.max(1, item.quantity + delta) }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
      return;
    }
    const line = shopifyCart.items.find((item) => item.key === productKey);
    if (!line) return;
    const nextQty = Math.max(0, line.quantity + delta);
    try {
      const updatedCart =
        nextQty === 0
          ? await removeShopifyLine(shopifyCart.id, line.lineId)
          : await updateShopifyLine(shopifyCart.id, line.lineId, nextQty);
      syncShopifyCart(updatedCart);
    } catch (err) {
      setShopifyError(err?.message || "Unable to update cart.");
    }
  };

  const handleRemoveFromCart = async (productKey) => {
    if (!shopifyEnabled || !shopifyCart) {
      setCartItems((prev) => prev.filter((item) => item.key !== productKey));
      return;
    }
    const line = shopifyCart.items.find((item) => item.key === productKey);
    if (!line) return;

    try {
      const updatedCart = await removeShopifyLine(shopifyCart.id, line.lineId);
      syncShopifyCart(updatedCart);
    } catch (err) {
      setShopifyError(err?.message || "Unable to remove item.");
    }
  };

  const handleAddReview = (productKey, review) => {
    if (!productKey || !review) return;
    setLocalReviews((prev) => {
      const existing = prev[productKey] || [];
      const next = [...existing, review];
      return { ...prev, [productKey]: next };
    });
  };

  const priceForKey = (key) => {
    const product = productCatalogMap[key];
    return formatPrice(
      product?.price || PRODUCT_DETAILS[key]?.price || 0,
      locale,
      product?.currency || "EUR"
    );
  };

  const productName = (key) => {
    if (key === "essence") return t("essence_name");
    if (key === "radiant") return t("radiant_name");
    return key;
  };

  const filteredProducts = productCatalog.filter((p) => {
    const text = (
      (p.key === "essence" ? t("essence_name") + t("essence_short") : "") +
      (p.key === "radiant" ? t("radiant_name") + t("radiant_short") : "")
    )
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
    const searchNorm = search
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
    const matchSearch = !searchNorm || text.includes(searchNorm);
    const matchNeed =
      needFilter === "all" ||
      (needFilter === "hydration" && p.needs.includes("hydration")) ||
      (needFilter === "radiance" && p.needs.includes("radiance"));
    return matchSearch && matchNeed;
  });

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterDone(true);
  };

  const detailProduct =
    productDetail && (PRODUCT_DETAILS[productDetail] || shopifyProducts[productDetail])
      ? {
          ...PRODUCT_DETAILS[productDetail],
          ...(productCatalogMap[productDetail] || {}),
          ...(shopifyProducts[productDetail] || {}),
          reviews: [
            ...(PRODUCT_DETAILS[productDetail]?.reviews || []),
            ...(localReviews[productDetail] || []),
          ],
        }
      : null;

  const renderFilters = () => (
    <div className="giordora-filters">
      <input
        type="text"
        className="giordora-search-input"
        placeholder={t("filter_search_placeholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="giordora-select-need"
        value={needFilter}
        onChange={(e) => setNeedFilter(e.target.value)}
      >
        <option value="all">{t("filter_need_all")}</option>
        <option value="hydration">{t("filter_need_hydration")}</option>
        <option value="radiance">{t("filter_need_radiance")}</option>
      </select>
    </div>
  );

  const renderProductGrid = (list) => (
    <div className="giordora-products-grid">
      {list.map((p) => (
        <div key={p.id} className="giordora-product-card">
          <div className="giordora-product-tagline">
            {p.key === "essence" ? t("essence_tagline") : t("radiant_tagline")}
          </div>
          <div className="giordora-product-name">{productName(p.key)}</div>
          <div className="giordora-product-desc">
            {p.key === "essence" ? t("essence_short") : t("radiant_short")}
          </div>
          <div className="giordora-product-meta">{p.size}</div>
          <div className="giordora-product-footer">
            <div className="giordora-product-price">
              {formatPrice(p.price, locale, p.currency || "EUR")}
            </div>
            <div className="giordora-product-actions">
              <button className="giordora-btn-outline" onClick={() => setProductDetail(p.key)}>
                {t("btn_view_product")}
              </button>
              <button
                className="giordora-btn-gold"
                onClick={() => handleAddToCart(p.key)}
                disabled={p.available === false}
              >
                {p.available === false ? t("shop_sold_out") || "Sold out" : t("btn_add_to_cart")}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderShopPage = () => (
    <main className="giordora-shop-page">
      <section className="giordora-section">
        <div className="giordora-section-header">
          <div>
            <div className="giordora-section-title">{t("shop_title")}</div>
            <div className="giordora-section-subtitle">
              {shopifyEnabled ? t("shop_subtitle") : "Demo mode until Shopify is connected"}
            </div>
          </div>
          <div className="giordora-shop-toolbar">
            <button className="giordora-btn-outline" onClick={() => handleNavigate("home")}>
              ← {t("nav_home")}
            </button>
          </div>
        </div>
        {renderFilters()}
        {shopifyEnabled && shopifyLoading && (
          <div className="giordora-sync-note">Syncing live products from Shopify...</div>
        )}
        {shopifyError && <div className="giordora-error">{shopifyError}</div>}
        {renderProductGrid(filteredProducts)}
      </section>
    </main>
  );

  return (
    <div className="giordora-root">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            --color-black: #0C0C0C;
            --color-gold: #C9A75C;
            --color-sage: #A6B8A1;
            --color-ivory: #F9F6F2;
          }
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap');
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
            background-color: var(--color-ivory);
            color: var(--color-black);
            overflow-x: hidden;
          }
          .giordora-root {
            min-height: 100vh;
            background: #f7f2ea;
            color: var(--color-black);
            width: 100%;
            max-width: 100vw;
            overflow-x: hidden;
          }
          .giordora-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px 0;
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
            background: transparent;
          }
          header.giordora-header {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
            padding: 14px 24px 6px;
            position: sticky;
            top: 0;
            z-index: 20;
            background: linear-gradient(180deg, #101010 0%, #080808 100%);
            width: 100vw;
            max-width: 100vw;
            margin-left: calc(50% - 50vw);
            min-height: 84px;
            box-shadow: 0 10px 28px rgba(0,0,0,0.4);
          }

          .giordora-header-top {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            gap: 16px;
            width: 100%;
            padding: 6px 0 12px;
          }

          .giordora-top-left,
          .giordora-top-right {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 0;
          }

          .giordora-top-left {
            justify-content: flex-start;
          }

          .giordora-top-right {
            justify-content: flex-end;
          }

          .giordora-logo {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            text-align: left;
          }
          .giordora-logo-mark {
            font-family: "Playfair Display", serif;
            font-size: 38px;
            color: var(--color-gold);
            line-height: 1;
            letter-spacing: 0.02em;
          }
          .giordora-logo-stack {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .giordora-logo-title {
            font-family: "Playfair Display", serif;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            font-size: 16px;
            color: #f1e6c8;
          }
          .giordora-logo-sub {
            font-size: 11px;
            color: var(--color-gold);
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }
          nav.giordora-nav {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 26px;
            font-size: 12px;
            letter-spacing: 0.14em;
            width: 100%;
            padding: 10px 8px 12px;
            border-top: 1px solid rgba(201,167,92,0.22);
            border-bottom: 0;
            text-transform: uppercase;
          }
          .giordora-nav a {
            color: rgba(249,246,242,0.82);
            text-decoration: none;
            position: relative;
            padding-bottom: 8px;
            font-weight: 700;
            transition: color 0.2s ease;
          }
          .giordora-nav a::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, var(--color-gold), var(--color-sage));
            transition: width 0.25s ease;
          }
          .giordora-nav a:hover::after {
            width: 100%;
          }
          .giordora-nav a:hover {
            color: var(--color-gold);
          }
          .giordora-controls {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .giordora-controls--mobile {
            display: none;
          }

          .giordora-language-select--desktop {
            min-width: 72px;
          }

          /* Burger default (hidden on desktop) */
          .giordora-burger {
            display: none;
          }

          .giordora-burger-lines {
            width: 16px;
            height: 12px;
            position: relative;
          }

          .giordora-burger-lines span {
            position: absolute;
            left: 0;
            right: 0;
            height: 1px;
            background: var(--color-gold);
            transition: transform 0.2s ease, opacity 0.2s ease;
          }

          .giordora-burger-lines span:first-child {
            top: 3px;
          }

          .giordora-burger-lines span:last-child {
            bottom: 3px;
          }

          .giordora-burger--open .giordora-burger-lines span:first-child {
            transform: translateY(3px) rotate(45deg);
          }

          .giordora-burger--open .giordora-burger-lines span:last-child {
            transform: translateY(-3px) rotate(-45deg);
          }

          .giordora-language-select {
            background: linear-gradient(180deg, #0f0f0f 0%, #0a0a0a 100%);
            border: 1px solid rgba(201,167,92,0.85);
            color: var(--color-ivory);
            padding: 7px 28px 7px 12px;
            font-size: 11px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            border-radius: 12px;
            box-shadow: 0 6px 14px rgba(0,0,0,0.35);
          }
          .giordora-language-select option {
            color: #0c0c0c;
            background: #f9f6f2;
            letter-spacing: 0.08em;
            font-weight: 600;
          }
          .giordora-language-select:focus {
            outline: none;
            border-color: var(--color-gold);
            box-shadow: 0 0 0 2px rgba(201,167,92,0.12);
          }
          .giordora-auth-buttons {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .giordora-btn-gold,
          .giordora-btn-ghost,
          .giordora-btn-outline {
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .giordora-btn-ghost {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(201,167,92,0.6);
            color: var(--color-ivory);
            padding: 10px 16px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            font-weight: 600;
            border-radius: 999px;
            cursor: pointer;
            transition: border-color 0.2s ease, background 0.2s ease;
          }
          .giordora-btn-ghost:hover {
            filter: brightness(1.08);
            border-color: rgba(201,167,92,0.9);
          }
          .giordora-btn-gold {
            background: linear-gradient(135deg, var(--color-gold), #e4c97a);
            color: var(--color-black);
            border: none;
            padding: 10px 18px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            font-weight: 700;
            border-radius: 999px;
            cursor: pointer;
            box-shadow: 0 10px 20px rgba(0,0,0,0.35);
          }
          .giordora-btn-gold:disabled,
          .giordora-btn-ghost:disabled,
          .giordora-btn-outline:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            box-shadow: none;
          }
          .giordora-product-card .giordora-btn-gold {
            background: #0c0c0c;
            color: #f9f6f2;
            border: 1px solid #0c0c0c;
            letter-spacing: 0.08em;
          }
          .giordora-product-card .giordora-btn-outline {
            border-color: var(--color-gold);
            color: var(--color-gold);
            background: transparent;
          }
          .giordora-hero .giordora-btn-gold {
            background: linear-gradient(135deg, var(--color-gold), #e4c97a);
            color: var(--color-black);
            border: none;
          }
          .giordora-hero .giordora-btn-outline {
            border-color: var(--color-gold);
            color: var(--color-gold);
            background: transparent;
          }
          .giordora-btn-gold:hover {
            filter: brightness(1.05);
          }
          .giordora-cart-button {
            position: relative;
            border-radius: 14px;
            border: 1px solid rgba(201,167,92,0.55);
            padding: 8px 12px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            background: rgba(255,255,255,0.03);
            color: rgba(249,246,242,0.9);
            letter-spacing: 0.14em;
            text-transform: uppercase;
            font-size: 11px;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }
          .giordora-cart-button:hover {
            border-color: var(--color-gold);
            box-shadow: 0 6px 16px rgba(0,0,0,0.28);
          }
          .giordora-cart-label {
            font-size: 11px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
          }
          .giordora-cart-count {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--color-gold), #e4c97a);
            color: #0c0c0c;
            font-weight: 700;
            font-size: 11px;
          }
          .giordora-cart-icon {
            width: 16px;
            height: 16px;
            border: 1px solid var(--color-gold);
            border-radius: 6px;
            position: relative;
          }
          .giordora-cart-icon::before {
            content: "";
            position: absolute;
            left: 4px;
            right: 4px;
            top: 6px;
            height: 1px;
            background: var(--color-gold);
          }
          .giordora-cart-icon::after {
            content: "";
            position: absolute;
            left: 3px;
            right: 3px;
            top: 1px;
            height: 6px;
            border: 1px solid var(--color-gold);
            border-bottom: none;
            border-radius: 8px 8px 0 0;
          }
          /* Hero */
          .giordora-hero {
            display: grid;
            grid-template-columns: minmax(0, 3fr) minmax(0, 2.2fr);
            gap: 48px;
            padding: 64px 48px;
            color: #ffffff;
            background: #0c0c0c;
            border-radius: 0;
            box-shadow: 0 16px 40px rgba(0,0,0,0.25);
            width: 100vw;
            margin-left: calc(50% - 50vw);
          }
          .giordora-hero-slider {
            background: #0c0c0c;
            border-radius: 18px;
            padding: 0;
            box-shadow: 0 22px 50px rgba(0,0,0,0.42);
            position: relative;
            overflow: hidden;
            border: none;
          }
          .giordora-hero-slide-row {
            display: flex;
            flex-direction: column;
            gap: 14px;
            align-items: stretch;
          }
          .giordora-hero-slide {
            display: flex;
            flex-direction: column;
            gap: 12px;
            color: #1f1a14;
          }
          .giordora-hero-slide-eyebrow {
            font-size: 12px;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: #8c6c2c;
            font-weight: 700;
          }
          .giordora-hero-title {
            font-size: 38px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            margin-bottom: 16px;
            color: #101010;
          }
          .giordora-hero-overlay {
            position: absolute;
            inset: 12px 12px auto 12px;
            max-width: min(60%, 520px);
            padding: 14px 16px;
            background: linear-gradient(90deg, rgba(0,0,0,0.64), rgba(0,0,0,0.2));
            color: #f9f6f2;
            border-radius: 14px;
            box-shadow: 0 12px 30px rgba(0,0,0,0.3);
          }
          .giordora-hero-overlay .giordora-hero-title {
            color: #f9f6f2;
            margin-bottom: 10px;
            letter-spacing: 0.08em;
          }
          .giordora-hero-overlay .giordora-hero-subtitle {
            color: rgba(249,246,242,0.9);
            max-width: none;
          }
          .giordora-hero-overlay .giordora-btn-gold {
            box-shadow: 0 10px 22px rgba(0,0,0,0.3);
          }
          .giordora-hero-slide-media {
            position: relative;
            overflow: hidden;
            border-radius: 16px;
            box-shadow: 0 16px 32px rgba(0,0,0,0.4);
            background: #0a0a0a;
            width: 100%;
            aspect-ratio: 16 / 9;
          }
          .giordora-hero-slide-media img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            border-radius: 16px;
          }
          .giordora-hero-subtitle {
            font-size: 16px;
            line-height: 1.7;
            color: #4a4036;
            max-width: 480px;
            margin-bottom: 24px;
          }
          .giordora-hero-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 24px;
          }
          .giordora-badge {
            font-size: 11px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            padding: 4px 10px;
            border-radius: 999px;
            border: 1px solid rgba(249,246,242,0.25);
            color: rgba(249,246,242,0.9);
          }
          .giordora-hero-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .giordora-hero-visual {
            position: relative;
            border-radius: 32px;
            background: radial-gradient(circle at 20% 0%, rgba(201,167,92,0.4), transparent 55%), #111;
            padding: 20px 20px 24px;
            border: 1px solid rgba(201,167,92,0.4);
            box-shadow: 0 22px 60px rgba(0,0,0,0.75);
          }
          .giordora-hero-visual-inner {
            border-radius: 24px;
            background: linear-gradient(145deg, #151515, #222);
            padding: 16px;
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 12px;
            align-items: stretch;
          }
          .giordora-hero-card {
            border-radius: 18px;
            background: radial-gradient(circle at top, rgba(249,246,242,0.08), rgba(0,0,0,0.9));
            padding: 16px;
            border: 1px solid rgba(249,246,242,0.08);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
          }
          .giordora-hero-card h3 {
            font-size: 13px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            margin: 0 0 4px;
          }
          .giordora-hero-card p {
            font-size: 12px;
            color: rgba(249,246,242,0.75);
            line-height: 1.6;
            margin: 0 0 10px;
          }
          .giordora-hero-pill {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            color: var(--color-gold);
          }
          .giordora-hero-price {
            font-size: 13px;
            margin: 6px 0 12px;
          }
          .giordora-hero-mini {
            border-radius: 16px;
            padding: 12px;
            border: 1px dashed rgba(201,167,92,0.6);
            font-size: 11px;
            line-height: 1.6;
            color: rgba(249,246,242,0.8);
            margin-top: 14px;
          }
          .giordora-hero-mini strong {
            color: var(--color-gold);
          }
          .giordora-hero-slider-nav {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 6px 10px;
            position: absolute;
            bottom: 14px;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 999px;
            background: rgba(0,0,0,0.55);
            box-shadow: 0 12px 22px rgba(0,0,0,0.35);
          }
          .giordora-hero-dots {
            display: flex;
            gap: 8px;
            align-items: center;
          }
          .giordora-hero-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 1px solid #8c6c2c;
            background: transparent;
            cursor: pointer;
            transition: background 0.2s ease, transform 0.2s ease;
          }
          .giordora-hero-dot--active {
            background: #8c6c2c;
            transform: scale(1.05);
          }
          .giordora-hero-arrow {
            border: 1px solid #8c6c2c;
            background: #0c0c0c;
            color: #f9f6f2;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          /* Filters */
          .giordora-filters {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 18px;
            align-items: center;
          }
          .giordora-search-input {
            flex: 1;
            min-width: 180px;
            border-radius: 999px;
            border: 1px solid rgba(201,167,92,0.35);
            padding: 9px 14px;
            background: radial-gradient(circle at 12% 20%, rgba(255,255,255,0.08), transparent 32%), linear-gradient(180deg, #14110d 0%, #0f0c09 100%);
            color: var(--color-ivory);
            font-size: 12px;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 24px rgba(0,0,0,0.16);
            transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          }
          .giordora-search-input::placeholder {
            color: rgba(249,246,242,0.7);
            letter-spacing: 0.04em;
          }
          .giordora-select-need {
            border-radius: 999px;
            border: 1px solid rgba(201,167,92,0.35);
            background: radial-gradient(circle at 10% 15%, rgba(255,255,255,0.06), transparent 30%), linear-gradient(180deg, #14110d 0%, #0f0c09 100%);
            color: var(--color-ivory);
            font-size: 11px;
            padding: 9px 14px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 24px rgba(0,0,0,0.16);
            transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          }
          .giordora-search-input:focus,
          .giordora-select-need:focus,
          .giordora-newsletter-input:focus,
          .giordora-auth-modal input:focus {
            outline: none;
            border-color: var(--color-gold);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 30px rgba(201,167,92,0.18);
            background: radial-gradient(circle at 12% 20%, rgba(255,255,255,0.12), transparent 32%), linear-gradient(180deg, #17130e 0%, #100d0a 100%);
          }
          .giordora-filter-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            color: rgba(249,246,242,0.7);
          }
          /* Sections */
          .giordora-section {
            padding: 44px 0 32px;
            border-top: 1px solid rgba(201,167,92,0.18);
          }
          .giordora-section-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 16px;
            margin-bottom: 20px;
          }
          .giordora-section-title {
            text-transform: none;
            letter-spacing: 0.01em;
            font-size: 25px;
            font-weight: 650;
            color: #0f0f0f;
            margin-bottom: 8px;
          }
          .giordora-section-subtitle {
            font-size: 15px;
            color: #4f4f4f;
            max-width: 580px;
            line-height: 1.65;
          }
          /* Shop */
          .giordora-shop {
            background: linear-gradient(180deg, rgba(201,167,92,0.06), rgba(12,12,12,0));
            border-radius: 20px;
            padding: 40px 18px 32px;
            border: 1px solid rgba(201,167,92,0.18);
          }
          .giordora-shop-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 18px;
          }
          .giordora-shop-card {
            background: radial-gradient(circle at top, rgba(169,184,161,0.14), rgba(12,12,12,0.96));
            border: 1px solid rgba(249,246,242,0.12);
            border-radius: 18px;
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            min-height: 100%;
          }
          .giordora-shop-image {
            position: relative;
            border-radius: 14px;
            overflow: hidden;
            border: 1px solid rgba(201,167,92,0.25);
          }
          .giordora-shop-image img {
            width: 100%;
            height: 180px;
            object-fit: cover;
            display: block;
          }
          .giordora-stock-pill {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 4px 10px;
            border-radius: 999px;
            font-size: 10px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            border: 1px solid rgba(249,246,242,0.25);
            background: rgba(0,0,0,0.6);
          }
          .giordora-stock-pill--in {
            color: var(--color-sage);
            border-color: rgba(169,184,161,0.8);
          }
          .giordora-stock-pill--out {
            color: #ffb3a6;
            border-color: rgba(255,99,71,0.7);
          }
          .giordora-shop-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .giordora-shop-name {
            font-size: 13px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
          }
          .giordora-shop-price {
            font-size: 14px;
            color: var(--color-gold);
          }
          .giordora-shop-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }

          /* Products grid */
          .giordora-products-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
          }
          .giordora-product-card {
            border-radius: 26px;
            padding: 24px 24px 18px;
            border: 1px solid #e2d7c3;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            gap: 10px;
            box-shadow: 0 16px 36px rgba(0,0,0,0.08);
            color: #0f0f0f;
          }
          .giordora-product-tagline {
            font-size: 11px;
            color: var(--color-gold);
            text-transform: uppercase;
            letter-spacing: 0.12em;
            font-weight: 600;
          }
          .giordora-product-name {
            font-size: 20px;
            letter-spacing: 0.02em;
            text-transform: none;
            font-weight: 700;
            color: #0f0f0f;
          }
          .giordora-product-desc {
            font-size: 14px;
            color: #4f4f4f;
            line-height: 1.8;
          }
          .giordora-product-meta {
            font-size: 12px;
            color: #7a7a7a;
          }
          .giordora-product-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 4px;
          }
          .giordora-product-price {
            font-size: 15px;
            color: var(--color-gold);
            font-weight: 700;
          }
          .giordora-product-actions {
            display: flex;
            gap: 8px;
          }
          .giordora-btn-outline {
            background: transparent;
            border-radius: 999px;
            border: 1px solid var(--color-gold);
            color: var(--color-gold);
            padding: 5px 9px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            font-weight: 600;
            cursor: pointer;
          }
          .giordora-btn-outline:hover {
            filter: brightness(1.08);
          }
          /* Routine */
          .giordora-routine-section {
            position: relative;
            padding: 56px 0 42px;
            border-radius: 18px;
            background: linear-gradient(180deg, #f9f3ea 0%, #f3e7d7 100%);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.7), 0 16px 40px rgba(0,0,0,0.06);
          }
          .giordora-routine-section::before {
            content: "";
            position: absolute;
            inset: 18px 0 auto 0;
            height: 1px;
            background: linear-gradient(90deg, rgba(201,167,92,0.35), rgba(201,167,92,0));
            pointer-events: none;
          }
          .giordora-routine-section .giordora-section-header {
            align-items: flex-start;
            margin-bottom: 24px;
            gap: 18px;
          }
          .giordora-routine-section .giordora-section-title {
            color: #1f1a14;
            letter-spacing: 0.08em;
          }
          .giordora-routine-section .giordora-section-subtitle {
            color: #5a5146;
            max-width: 520px;
            line-height: 1.7;
          }
          .giordora-steps {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }
          .giordora-step-card {
            position: relative;
            border-radius: 16px;
            padding: 16px 18px 14px;
            border: 1px solid #e5d8c5;
            background: linear-gradient(135deg, #ffffff, #f8f1e6);
            font-size: 13px;
            color: #2e2720;
            box-shadow: 0 14px 32px rgba(0,0,0,0.08);
            overflow: hidden;
          }
          .giordora-step-card::after {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 12% 20%, rgba(201,167,92,0.18), transparent 36%);
            pointer-events: none;
          }
          .giordora-step-card::before {
            content: "01";
            position: absolute;
            top: 12px;
            right: 16px;
            font-size: 11px;
            letter-spacing: 0.22em;
            color: rgba(31,26,20,0.45);
            font-weight: 700;
          }
          .giordora-step-card:nth-child(2)::before {
            content: "02";
          }
          .giordora-step-card-title {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            margin-bottom: 6px;
            color: #8c6c2c;
          }
          /* Text blocks */
          .giordora-text-block {
            font-size: 13px;
            line-height: 1.8;
            color: rgba(249,246,242,0.8);
            max-width: 620px;
          }
          .giordora-contact-card {
            border-radius: 18px;
            padding: 14px 16px;
            border: 1px solid rgba(249,246,242,0.16);
            background: radial-gradient(circle at top, rgba(201,167,92,0.2), rgba(12,12,12,0.96));
            font-size: 13px;
          }
          .giordora-contact-email {
            color: var(--color-gold);
            text-decoration: none;
          }
          /* Newsletter */
          .giordora-newsletter {
            border-radius: 22px;
            padding: 18px 18px 16px;
            border: 1px solid rgba(201,167,92,0.4);
            background: radial-gradient(circle at top, rgba(201,167,92,0.2), rgba(12,12,12,0.96));
            display: grid;
            grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
            gap: 16px;
            align-items: center;
          }
          .giordora-newsletter-title {
            text-transform: uppercase;
            letter-spacing: 0.18em;
            font-size: 13px;
            margin-bottom: 6px;
          }
          .giordora-newsletter-subtitle {
            font-size: 13px;
            color: rgba(249,246,242,0.85);
          }
          .giordora-newsletter-form {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .giordora-newsletter-input {
            border-radius: 999px;
            border: 1px solid rgba(201,167,92,0.35);
            padding: 9px 14px;
            background: radial-gradient(circle at 12% 20%, rgba(255,255,255,0.08), transparent 32%), linear-gradient(180deg, #14110d 0%, #0f0c09 100%);
            color: var(--color-ivory);
            font-size: 12px;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 24px rgba(0,0,0,0.16);
            transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          }
          .giordora-newsletter-input::placeholder {
            color: rgba(249,246,242,0.7);
            letter-spacing: 0.04em;
          }
          .giordora-newsletter-confirm {
            font-size: 12px;
            color: rgba(249,246,242,0.8);
          }
          /* Product page */
          .giordora-product-page {
            display: flex;
            flex-direction: column;
            gap: 18px;
            padding: 24px 0 8px;
            color: var(--color-ivory);
          }
          .giordora-product-page-header {
            display: flex;
            justify-content: flex-start;
          }
          .giordora-product-hero {
            display: grid;
            grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
            gap: 24px;
            align-items: center;
          }
          .giordora-product-image img {
            width: 100%;
            border-radius: 18px;
            border: 1px solid rgba(201,167,92,0.4);
            box-shadow: 0 18px 40px rgba(0,0,0,0.55);
          }
          .giordora-product-info h1 {
            margin: 0 0 6px;
            font-size: 28px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }
          .giordora-product-subtitle {
            margin: 0 0 12px;
            color: rgba(249,246,242,0.8);
          }
          .giordora-product-price-tag {
            font-size: 20px;
            color: var(--color-gold);
            margin-bottom: 12px;
          }
          .giordora-product-stock {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            border-radius: 12px;
            border: 1px solid rgba(169,184,161,0.6);
            color: var(--color-sage);
            font-size: 12px;
            margin-bottom: 10px;
          }
          .giordora-product-actions {
            display: flex;
            gap: 10px;
          }
          .giordora-product-section {
            border-top: 1px solid rgba(201,167,92,0.18);
            padding-top: 14px;
          }
          .giordora-product-section h2 {
            margin: 0 0 8px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            font-size: 14px;
          }
          .giordora-product-section p,
          .giordora-product-section ul {
            margin: 0;
            color: rgba(249,246,242,0.85);
            line-height: 1.7;
          }
          .giordora-product-section ul {
            padding-left: 18px;
          }
          .giordora-product-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          .giordora-product-tags span {
            padding: 6px 12px;
            border-radius: 999px;
            border: 1px solid rgba(201,167,92,0.5);
            font-size: 12px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }
          .giordora-product-review {
            border: 1px solid rgba(249,246,242,0.12);
            border-radius: 12px;
            padding: 12px;
            margin-bottom: 10px;
          }
          /* Footer */
          footer.giordora-footer {
            margin-top: 32px;
            width: 100vw;
            margin-left: calc(50% - 50vw);
            background: #0c0c0c;
          }
          .giordora-footer-bottom {
            color: rgba(249,246,242,0.78);
            padding: 28px 20px 32px;
            display: grid;
            grid-template-columns: 1.1fr 1.6fr;
            gap: 24px;
            align-items: center;
            border-top: 1px solid rgba(201,167,92,0.22);
          }
          .giordora-footer-brand {
            display: grid;
            gap: 10px;
          }
          .giordora-footer-logo-row {
            display: inline-flex;
            align-items: center;
            gap: 10px;
          }
          .giordora-footer-logo-mark {
            font-family: "Playfair Display", serif;
            font-size: 28px;
            line-height: 1;
            color: var(--color-gold);
            letter-spacing: 0.04em;
          }
          .giordora-footer-logo-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .giordora-footer-logo-title {
            font-family: "Playfair Display", serif;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            font-size: 14px;
            color: #f1e6c8;
          }
          .giordora-footer-logo-sub {
            font-size: 11px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: rgba(249,246,242,0.82);
          }
          .giordora-footer-tagline {
            font-size: 13px;
            color: rgba(249,246,242,0.72);
          }
          .giordora-footer-links {
            display: flex;
            gap: 18px;
            flex-wrap: wrap;
            justify-content: flex-end;
            font-size: 13px;
          }
          .giordora-footer-links a {
            color: rgba(249,246,242,0.82);
            text-decoration: none;
            transition: color 0.2s ease;
          }
          .giordora-footer-links a:hover {
            color: var(--color-gold);
          }
          /* Mini cart overlay */
          .giordora-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            display: flex;
            justify-content: flex-end;
            z-index: 40;
          }
          .giordora-mini-cart {
            width: 320px;
            max-width: 100%;
            background: #101010;
            border-left: 1px solid rgba(201,167,92,0.4);
            padding: 18px 18px 16px;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }
          .giordora-error {
            background: rgba(255,99,71,0.12);
            border: 1px solid rgba(255,99,71,0.4);
            color: #ffb3a6;
            padding: 8px 12px;
            border-radius: 10px;
            font-size: 13px;
            margin: 4px 0;
          }
          .giordora-sync-note {
            font-size: 12px;
            color: rgba(169,184,161,0.9);
            margin: 6px 0 12px;
          }
          .giordora-mini-cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .giordora-mini-cart-title {
            font-size: 13px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }
          .giordora-mini-cart-close {
            background: transparent;
            border: none;
            color: rgba(249,246,242,0.7);
            cursor: pointer;
            font-size: 18px;
          }
          .giordora-mini-cart-items {
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .giordora-mini-cart-item {
            border-radius: 12px;
            padding: 8px 10px;
            border: 1px solid rgba(249,246,242,0.16);
            font-size: 12px;
          }
          .giordora-mini-cart-item-header {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 4px;
          }
          .giordora-mini-cart-item-name {
            max-width: 170px;
          }
          .giordora-mini-cart-qty {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 4px;
          }
          .giordora-mini-cart-qty button {
            width: 20px;
            height: 20px;
            border-radius: 999px;
            border: 1px solid rgba(249,246,242,0.3);
            background: transparent;
            color: rgba(249,246,242,0.85);
            cursor: pointer;
          }
          .giordora-mini-cart-remove {
            border: none;
            background: transparent;
            color: rgba(249,246,242,0.65);
            font-size: 11px;
            cursor: pointer;
          }
          .giordora-mini-cart-footer {
            border-top: 1px solid rgba(249,246,242,0.18);
            padding-top: 10px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .giordora-mini-cart-row {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
          }
          /* Auth modal */
          .giordora-auth-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 50;
          }
          .giordora-auth-modal {
            width: 360px;
            max-width: 90vw;
            background: #101010;
            border: 1px solid rgba(201,167,92,0.35);
            border-radius: 16px;
            padding: 16px 16px 14px;
            color: var(--color-ivory);
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .giordora-auth-modal h3 {
            margin: 0 0 12px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            font-size: 13px;
          }
          .giordora-auth-modal form {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .giordora-auth-modal label {
            display: flex;
            flex-direction: column;
            gap: 6px;
            font-size: 12px;
            color: rgba(249,246,242,0.8);
          }
          .giordora-auth-modal input {
            border-radius: 10px;
            border: 1px solid rgba(201,167,92,0.35);
            padding: 10px 12px;
            background: radial-gradient(circle at 12% 20%, rgba(255,255,255,0.08), transparent 32%), linear-gradient(180deg, #14110d 0%, #0f0c09 100%);
            color: var(--color-ivory);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 24px rgba(0,0,0,0.16);
            transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          }
          .giordora-auth-modal input:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          .giordora-auth-modal input::placeholder {
            color: rgba(249,246,242,0.7);
            letter-spacing: 0.04em;
          }
          .giordora-auth-status {
            font-size: 12px;
            padding: 8px 10px;
            border-radius: 10px;
            border: 1px solid #e2d7c3;
            background: #fff7e6;
            color: #4a3a1f;
          }
          .giordora-auth-status--error {
            background: #fdecea;
            border-color: #f3c4bd;
            color: #6b2a1e;
          }
          .giordora-auth-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }
          .giordora-auth-toggle {
            background: transparent;
            border: none;
            padding: 0;
            font-size: 12px;
            color: #6c5a33;
            text-decoration: underline;
            cursor: pointer;
          }
          .giordora-auth-toggle:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          /* Account modal */
          .giordora-account-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 50;
          }
          .giordora-account-modal {
            width: 680px;
            max-width: 94vw;
            background: #f9f6f2;
            border: 1px solid #e2d7c3;
            border-radius: 18px;
            padding: 18px;
            color: var(--color-black);
            display: flex;
            flex-direction: column;
            gap: 16px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.18);
          }
          .giordora-account-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }
          .giordora-account-title {
            font-family: "Playfair Display", serif;
            font-size: 20px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .giordora-account-subtitle {
            font-size: 12px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #5f5547;
          }
          .giordora-account-body {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .giordora-account-profile {
            display: flex;
            align-items: center;
            gap: 14px;
            background: #fff;
            border: 1px solid #e2d7c3;
            border-radius: 16px;
            padding: 12px 14px;
            box-shadow: 0 10px 24px rgba(0,0,0,0.08);
          }
          .giordora-account-avatar {
            width: 48px;
            height: 48px;
            border-radius: 999px;
            background: linear-gradient(135deg, var(--color-gold), #e4c97a);
            color: #0c0c0c;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            letter-spacing: 0.08em;
          }
          .giordora-account-profile-details {
            flex: 1;
            min-width: 0;
          }
          .giordora-account-name {
            font-weight: 600;
          }
          .giordora-account-email {
            font-size: 12px;
            color: #6b6356;
          }
          .giordora-account-orders {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .giordora-account-section-title {
            font-size: 12px;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: #3a3226;
          }
          .giordora-account-order-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .giordora-account-order-card {
            background: #fff;
            border: 1px solid #e2d7c3;
            border-radius: 16px;
            padding: 12px 14px;
            box-shadow: 0 10px 24px rgba(0,0,0,0.06);
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .giordora-account-order-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
          }
          .giordora-account-order-number {
            font-weight: 600;
          }
          .giordora-account-order-date {
            font-size: 12px;
            color: #6b6356;
          }
          .giordora-account-order-meta {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 6px;
            font-size: 13px;
          }
          .giordora-order-status {
            display: inline-flex;
            align-items: center;
            padding: 4px 8px;
            border-radius: 999px;
            background: #f3ecdf;
            border: 1px solid #e2d7c3;
            font-size: 10px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #5a4b33;
          }
          .giordora-account-order-items {
            display: flex;
            flex-direction: column;
            gap: 6px;
            border-top: 1px solid #ece2d0;
            padding-top: 8px;
            font-size: 13px;
            color: #4f4f4f;
          }
          .giordora-account-order-item {
            display: flex;
            justify-content: space-between;
            gap: 12px;
          }
          .giordora-account-muted {
            font-size: 13px;
            color: #6b6356;
          }
          .giordora-account-empty {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .giordora-account-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }

          /* ===== Template Good inspired light theme overrides ===== */
          .giordora-section {
            border-color: #e2d7c3;
          }
          .giordora-section-title {
            color: var(--color-black);
          }
          .giordora-section-subtitle,
          .giordora-text-block {
            color: #4f4f4f;
          }
          .giordora-product-card,
          .giordora-step-card,
          .giordora-contact-card,
          .giordora-newsletter {
            background: rgba(255,255,255,0.92);
            border-color: #e2d7c3;
            color: var(--color-black);
            box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          }
          .giordora-product-name,
          .giordora-step-card-title {
            color: var(--color-black);
          }
          .giordora-product-desc,
          .giordora-product-meta {
            color: #4f4f4f;
          }
          .giordora-mini-cart,
          .giordora-auth-modal {
            background: #f9f6f2;
            color: var(--color-black);
          }
          .giordora-mini-cart-item,
          .giordora-auth-modal input {
            border-color: #e2d7c3;
          }

          /* Homepage review grid */
          .giordora-home-reviews {
            padding: 56px 0;
          }
          .giordora-home-review-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 16px;
          }
          .giordora-home-review-card {
            background: rgba(255,255,255,0.96);
            border: 1px solid #e2d7c3;
            border-radius: 20px;
            padding: 16px;
            box-shadow: 0 12px 28px rgba(0,0,0,0.08);
            color: #222;
            font-size: 14px;
          }
          .giordora-home-review-meta {
            font-size: 12px;
            color: #555;
          }
          .giordora-stars {
            color: var(--color-gold);
            letter-spacing: 2px;
            font-size: 14px;
          }

          /* Template Good product page */
          .giordora-template-product {
            max-width: 1100px;
            margin: 0 auto;
            padding: 32px 0 40px;
          }
          .giordora-template-product-header {
            margin-bottom: 18px;
          }
          .giordora-template-product-hero {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            gap: 32px;
          }
          .giordora-template-gallery {
            background: linear-gradient(135deg, #f9f6f2, #e2d7c3);
            border-radius: 26px;
            border: 1px solid #e2d7c3;
            min-height: 420px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 18px 38px rgba(0,0,0,0.12);
          }
          .giordora-template-gallery-inner {
            height: 220px;
            width: 150px;
            border-radius: 22px;
            border: 1px solid var(--color-gold);
            background: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 12px;
            gap: 6px;
          }
          .giordora-template-gallery-img {
            max-height: 260px;
            max-width: 80%;
            object-fit: contain;
            filter: drop-shadow(0 12px 24px rgba(0,0,0,0.18));
          }
          .giordora-template-thumbs {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 10px;
            margin-top: 12px;
          }
          .giordora-template-thumb {
            height: 68px;
            background: #f3ecdf;
            border: 1px solid #e2d7c3;
            border-radius: 14px;
          }
          .giordora-template-product-info h1 {
            margin: 0 0 6px;
            color: var(--color-black);
          }
          .giordora-template-product-info p {
            color: #4f4f4f;
          }
          .giordora-template-price-row {
            display: flex;
            gap: 12px;
            align-items: center;
          }
          .giordora-template-price {
            font-size: 22px;
            color: var(--color-gold);
          }
          .giordora-template-pill {
            border: 1px solid var(--color-gold);
            border-radius: 999px;
            padding: 6px 12px;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            font-size: 11px;
            color: var(--color-gold);
          }
          .giordora-template-primary {
            background: var(--color-black);
            color: var(--color-ivory);
            border: none;
            border-radius: 999px;
            padding: 12px 16px;
            width: 100%;
            font-size: 14px;
            letter-spacing: 0.08em;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 12px 22px rgba(0,0,0,0.12);
          }
          .giordora-template-usp {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            font-size: 12px;
            color: #4f4f4f;
          }
          .giordora-template-usp p {
            margin: 0;
          }
          .giordora-template-divider {
            margin-top: 28px;
            padding-top: 18px;
            border-top: 1px solid #e2d7c3;
          }
          .giordora-template-section {
            margin-top: 42px;
          }
          .giordora-template-section h2 {
            margin: 0 0 12px;
            font-size: 18px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--color-black);
          }
          .giordora-template-benefits,
          .giordora-template-ingredients,
          .giordora-template-review-grid {
            display: grid;
            gap: 14px;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          }
          .giordora-template-bullet {
            display: flex;
            gap: 10px;
            align-items: flex-start;
            color: #2f2f2f;
          }
          .giordora-template-bullet-dot {
            margin-top: 7px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--color-gold);
            flex-shrink: 0;
          }
          .giordora-template-review-card {
            border: 1px solid #e2d7c3;
            border-radius: 18px;
            padding: 14px;
            background: #fff;
            box-shadow: 0 12px 24px rgba(0,0,0,0.08);
          }
          .giordora-template-review-card h4 {
            margin: 0 0 4px;
            color: var(--color-black);
          }
          .giordora-template-review-card p {
            margin: 0 0 6px;
            color: #4f4f4f;
          }
          .giordora-template-review-card .giordora-stars {
            color: var(--color-gold);
            letter-spacing: 2px;
          }
          .giordora-template-review-meta {
            font-size: 12px;
            color: #777;
          }

          @media (max-width: 900px) {
            header.giordora-header {
              gap: 8px;
              padding-bottom: 12px;
              width: 100%;
            }

            .giordora-header-top {
              grid-template-columns: auto 1fr auto;
            }

            .giordora-top-right,
            .giordora-language-select--desktop {
              display: none;
            }

            .giordora-container {
              padding: 0 12px 40px;
            }

            .giordora-btn-gold,
            .giordora-btn-ghost,
            .giordora-btn-outline {
              white-space: normal;
            }

            .giordora-controls--desktop {
              display: none;
            }

            .giordora-controls--mobile {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 10px;
              padding: 8px 0;
              width: 100%;
              border-bottom: 1px solid rgba(201,167,92,0.25);
            }

            /* Show burger on mobile */
            .giordora-burger {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 34px;
              height: 34px;
              border-radius: 999px;
              border: 1px solid rgba(201,167,92,0.7);
              background: rgba(0,0,0,0.5);
              cursor: pointer;
            }

            nav.giordora-nav {
              width: 100%;
              order: 3;
              margin-left: 0;
              display: none; /* hidden by default, toggled with .giordora-nav--open */
              flex-direction: column;
              align-items: flex-start;
              justify-content: flex-start;
              gap: 8px;
              padding-top: 8px;
              border-top: 1px solid rgba(201,167,92,0.35);
              font-size: 12px;
              min-width: 0;
              flex: 0 0 auto;
            }

            nav.giordora-nav.giordora-nav--open {
              display: flex;
            }

            .giordora-nav a {
              padding: 6px 0;
              white-space: normal;
            }

            .giordora-controls--mobile .giordora-btn-gold,
            .giordora-controls--mobile .giordora-btn-ghost,
            .giordora-controls--mobile .giordora-btn-outline,
            .giordora-controls--mobile .giordora-cart-button,
            .giordora-controls--mobile .giordora-language-select {
              width: 100%;
            }

            .giordora-footer-bottom {
              grid-template-columns: 1fr;
              text-align: center;
            }
            .giordora-footer-links {
              justify-content: center;
            }

            .giordora-hero {
              grid-template-columns: minmax(0, 1fr);
            }

            .giordora-hero-actions {
              flex-direction: column;
              align-items: stretch;
            }

            .giordora-hero {
              grid-template-columns: minmax(0, 1fr);
            }

            .giordora-newsletter {
              grid-template-columns: minmax(0, 1fr);
            }

            .giordora-product-hero {
              grid-template-columns: minmax(0, 1fr);
            }
          }

          @media (max-width: 640px) {
            .giordora-products-grid {
              grid-template-columns: minmax(0, 1fr);
            }
            .giordora-steps {
              grid-template-columns: minmax(0, 1fr);
            }
            .giordora-hero-title {
              font-size: 26px;
            }

            .giordora-container {
              padding: 14px 12px 0;
            }

            .giordora-hero-subtitle,
            .giordora-section-subtitle,
            .giordora-text-block {
              font-size: 13px;
              line-height: 1.65;
            }

            .giordora-newsletter {
              padding: 16px 14px;
            }

            .giordora-mini-cart {
              width: 100%;
            }

            .giordora-auth-modal {
              width: 100%;
              max-width: 100%;
            }

            .giordora-account-modal {
              width: 100%;
              max-width: 100%;
            }

            .giordora-account-order-top {
              flex-direction: column;
              align-items: flex-start;
            }

            .giordora-account-order-meta {
              align-items: flex-start;
            }
          }
          @media (max-width: 480px) {
            .giordora-hero-title {
              font-size: 22px;
            }
            .giordora-hero-actions a,
            .giordora-btn-gold,
            .giordora-btn-ghost,
            .giordora-btn-outline {
              width: 100%;
              text-align: center;
            }
            .giordora-section-header {
              flex-direction: column;
              align-items: flex-start;
            }
            .giordora-products-grid {
              gap: 14px;
            }
            .giordora-product-card,
            .giordora-newsletter {
              padding: 14px;
            }
            .giordora-filters {
              flex-direction: column;
              align-items: stretch;
            }
            .giordora-search-input,
            .giordora-select-need {
              width: 100%;
            }

            .giordora-account-profile {
              flex-direction: column;
              align-items: flex-start;
            }
          }
        `
      }}
      />
      <div className="giordora-container">
        <header className="giordora-header">
          <div className="giordora-header-top">
            <div className="giordora-top-left">
              {/* Mobile burger */}
              <button
                className={"giordora-burger " + (navOpen ? "giordora-burger--open" : "")}
                onClick={() => setNavOpen((open) => !open)}
                aria-label="Toggle navigation"
              >
                <div className="giordora-burger-lines">
                  <span />
                  <span />
                </div>
              </button>
            </div>

            <div className="giordora-logo">
              <div className="giordora-logo-mark">G</div>
              <div className="giordora-logo-stack">
                <div className="giordora-logo-title">GIORDORA</div>
                <div className="giordora-logo-sub">PARIS</div>
              </div>
            </div>

            <div className="giordora-top-right">
              <select
                className="giordora-language-select giordora-language-select--desktop"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
              >
                {LOCALES.map((loc) => (
                  <option key={loc.code} value={loc.code}>
                    {loc.label}
                  </option>
                ))}
              </select>
              <div className="giordora-auth-buttons">
                {authUser ? (
                  <>
                    <button className="giordora-btn-ghost" onClick={() => setAccountOpen(true)}>
                      {t("auth_account")}
                    </button>
                    <button className="giordora-btn-gold" onClick={handleSignOut} disabled={authLoading}>
                      {authLoading ? t("auth_loading") : t("auth_logout")}
                    </button>
                  </>
                ) : (
                  <>
                    <button className="giordora-btn-ghost" onClick={() => openAuthModal("login")}>
                      {t("auth_login")}
                    </button>
                    <button className="giordora-btn-gold" onClick={() => openAuthModal("signup")}>
                      {t("auth_signup")}
                    </button>
                  </>
                )}
              </div>
              <button className="giordora-cart-button" onClick={() => setCartOpen(true)}>
                <div className="giordora-cart-icon" />
                <span className="giordora-cart-label">Cart</span>
                <div className="giordora-cart-count">
                  {cartItems.reduce((s, i) => s + i.quantity, 0)}
                </div>
              </button>
            </div>
          </div>

          <nav className={"giordora-nav " + (navOpen ? "giordora-nav--open" : "")}>
            <div className="giordora-controls giordora-controls--mobile">
              <select
                className="giordora-language-select"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
              >
                {LOCALES.map((loc) => (
                  <option key={loc.code} value={loc.code}>
                    {loc.label}
                  </option>
                ))}
              </select>
              <div className="giordora-auth-buttons">
                {authUser ? (
                  <>
                    <button className="giordora-btn-ghost" onClick={() => setAccountOpen(true)}>
                      {t("auth_account")}
                    </button>
                    <button className="giordora-btn-gold" onClick={handleSignOut} disabled={authLoading}>
                      {authLoading ? t("auth_loading") : t("auth_logout")}
                    </button>
                  </>
                ) : (
                  <>
                    <button className="giordora-btn-ghost" onClick={() => openAuthModal("login")}>
                      {t("auth_login")}
                    </button>
                    <button className="giordora-btn-gold" onClick={() => openAuthModal("signup")}>
                      {t("auth_signup")}
                    </button>
                  </>
                )}
              </div>
              <button className="giordora-cart-button" onClick={() => setCartOpen(true)}>
                <div className="giordora-cart-icon" />
                <span className="giordora-cart-label">Cart</span>
                <div className="giordora-cart-count">
                  {cartItems.reduce((s, i) => s + i.quantity, 0)}
                </div>
              </button>
            </div>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate("home");
              }}
            >
              {t("nav_home")}
            </a>
            <a
              href="#shop"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate("shop");
              }}
            >
              {t("nav_shop")}
            </a>
            <a
              href="#routine"
              onClick={(e) => {
                e.preventDefault();
                navigateToSection("routine");
              }}
            >
              {t("nav_routine")}
            </a>
            <a
              href="#products"
              onClick={(e) => {
                e.preventDefault();
                navigateToSection("products");
              }}
            >
              {t("nav_products")}
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                navigateToSection("about");
              }}
            >
              {t("nav_about")}
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                navigateToSection("contact");
              }}
            >
              {t("nav_contact")}
            </a>
          </nav>
        </header>

        {productDetail ? (
          <main>
            <ProductPage
              product={detailProduct || PRODUCT_DETAILS[productDetail]}
              locale={locale}
              onBack={() => setProductDetail(null)}
              onAddToCart={() => handleAddToCart(productDetail)}
              onAddReview={(review) => handleAddReview(productDetail, review)}
            />
          </main>
        ) : page === "shop" ? (
          renderShopPage()
        ) : (
          <main>
          <section id="home" className="giordora-hero">
            <div className="giordora-hero-slider">
              <div className="giordora-hero-slide-media">
                <img
                  src={currentHeroSlide.image}
                  alt={currentHeroSlide.title || `Giordora slide ${heroSlide + 1}`}
                  loading="lazy"
                  onError={(e) => {
                    const fallback = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=80";
                    if (e.currentTarget.src === fallback) return;
                    e.currentTarget.src = fallback;
                  }}
                />
                {currentHeroSlide.hasText && (
                  <div className="giordora-hero-overlay">
                    <div className="giordora-hero-slide-eyebrow">{t("hero_slider_eyebrow")}</div>
                    <h1 className="giordora-hero-title">{currentHeroSlide.title}</h1>
                    <p className="giordora-hero-subtitle">{currentHeroSlide.subtitle}</p>
                    <div className="giordora-hero-actions">
                      <button
                        className="giordora-btn-gold"
                        onClick={() => currentHeroSlide.action && currentHeroSlide.action()}
                      >
                        {currentHeroSlide.cta}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="giordora-hero-slider-nav">
                <button className="giordora-hero-arrow" onClick={handleHeroPrev} aria-label="Previous slide">
                  ‹
                </button>
                <button className="giordora-hero-arrow" onClick={handleHeroNext} aria-label="Next slide">
                  ›
                </button>
              </div>
            </div>

            <div className="giordora-hero-visual">
              <div className="giordora-hero-visual-inner">
                <div className="giordora-hero-card">
                  <div>
                    <div className="giordora-hero-pill">{t("essence_tagline")}</div>
                    <h3>{t("essence_name")}</h3>
                    <p>{t("essence_short")}</p>
                  </div>
                  <div>
                    <div className="giordora-hero-price">
                      {t("price_label")}: {priceForKey("essence")}
                    </div>
                    <button
                      className="giordora-btn-gold"
                      onClick={() => handleAddToCart("essence")}
                    >
                      {t("btn_add_to_cart")}
                    </button>
                  </div>
                </div>
                <div className="giordora-hero-card">
                  <div>
                    <div className="giordora-hero-pill">{t("radiant_tagline")}</div>
                    <h3>{t("radiant_name")}</h3>
                    <p>{t("radiant_short")}</p>
                  </div>
                  <div>
                    <div className="giordora-hero-price">
                      {t("price_label")}: {priceForKey("radiant")}
                    </div>
                    <button
                      className="giordora-btn-gold"
                      onClick={() => handleAddToCart("radiant")}
                    >
                      {t("btn_add_to_cart")}
                    </button>
                  </div>
                </div>
              </div>
            <div className="giordora-hero-mini">
              <strong>{t("section_routine_title")}:</strong> {t("section_routine_text")}
            </div>
          </div>
        </section>

          <section id="products" className="giordora-section">
            <div className="giordora-section-header">
              <div>
                <div className="giordora-section-title">{t("nav_products")}</div>
                <div className="giordora-section-subtitle">{t("section_routine_text")}</div>
              </div>
              <div className="giordora-filter-label">{t("filter_need_label")}</div>
            </div>

            {renderFilters()}
            {shopifyEnabled && shopifyLoading && (
              <div className="giordora-sync-note">Syncing live products from Shopify...</div>
            )}
            {shopifyError && <div className="giordora-error">{shopifyError}</div>}

            {renderProductGrid(filteredProducts)}
          </section>

          <section id="routine" className="giordora-section giordora-routine-section">
            <div className="giordora-section-header">
              <div className="giordora-section-title">{t("section_routine_title")}</div>
              <div className="giordora-section-subtitle">{t("section_routine_text")}</div>
            </div>
            <div className="giordora-steps">
              <div className="giordora-step-card">
                <div className="giordora-step-card-title">{t("routine_step1_title")}</div>
                <div>{t("routine_step1_text")}</div>
              </div>
              <div className="giordora-step-card">
                <div className="giordora-step-card-title">{t("routine_step2_title")}</div>
                <div>{t("routine_step2_text")}</div>
              </div>
            </div>
          </section>

          <section className="giordora-section giordora-home-reviews">
            <div className="giordora-section-header">
              <div className="giordora-section-title">{t("reviews_title") || "Client reviews"}</div>
            </div>
            <div className="giordora-home-review-grid">
              {[
                {
                  name: "Camille, 34",
                  quote: "Plumped and luminous skin in a few days. The duo is essential.",
                },
                {
                  name: "Nadia, 41",
                  quote: "Ultra-fine textures, delicate scent, and a high-end finish.",
                },
                {
                  name: "Emma, 29",
                  quote: "My sensitive skin adapted instantly. No tightness, only light.",
                },
              ].map((review) => (
                <div key={review.name} className="giordora-home-review-card">
                  <div className="giordora-stars">★★★★★</div>
                  <p>{review.quote}</p>
                  <div className="giordora-home-review-meta">{review.name}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="about" className="giordora-section">
            <div className="giordora-section-header">
              <div className="giordora-section-title">{t("about_title")}</div>
            </div>
            <div className="giordora-text-block">{t("about_text")}</div>
          </section>

          <section id="contact" className="giordora-section">
            <div className="giordora-section-header">
              <div className="giordora-section-title">{t("contact_title")}</div>
            </div>
            <div className="giordora-contact-card">
              <div className="giordora-text-block">{t("contact_text")}</div>
              <a className="giordora-contact-email" href="mailto:contact@giordora.com">
                contact@giordora.com
              </a>
            </div>
          </section>

          <section id="newsletter" className="giordora-section">
            <div className="giordora-newsletter">
              <div>
                <div className="giordora-newsletter-title">{t("newsletter_title")}</div>
                <div className="giordora-newsletter-subtitle">{t("newsletter_subtitle")}</div>
              </div>
              <form className="giordora-newsletter-form" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  className="giordora-newsletter-input"
                  placeholder={t("newsletter_email_placeholder")}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button className="giordora-btn-gold" type="submit">
                  {t("newsletter_cta")}
                </button>
                {newsletterDone && (
                  <div className="giordora-newsletter-confirm">{t("newsletter_done") || "Merci !"}</div>
                )}
              </form>
            </div>
          </section>
        </main>
        )}

        {!productDetail && (
          <footer className="giordora-footer">
            <div className="giordora-footer-bottom">
              <div className="giordora-footer-brand">
                <div className="giordora-footer-logo-row">
                  <div className="giordora-footer-logo-mark">G</div>
                  <div className="giordora-footer-logo-text">
                    <div className="giordora-footer-logo-title">Giordora</div>
                    <div className="giordora-footer-logo-sub">Paris</div>
                  </div>
                </div>
                <div className="giordora-footer-tagline">
                  La Beauté Essentielle. Deux soins, une routine parfaite, conçue à Paris.
                </div>
              </div>
              <div className="giordora-footer-links">
                <a href="#about" onClick={(e) => { e.preventDefault(); navigateToSection("about"); }}>
                  La Maison Giordora
                </a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); navigateToSection("contact"); }}>
                  Contact
                </a>
                <a href="#faq" onClick={(e) => e.preventDefault()}>
                  FAQ
                </a>
                <a href="#shipping" onClick={(e) => e.preventDefault()}>
                  Livraison & retours
                </a>
                <a href="#privacy" onClick={(e) => e.preventDefault()}>
                  Politique de confidentialité
                </a>
                <a href="#legal" onClick={(e) => e.preventDefault()}>
                  Mentions légales
                </a>
                <a href="#cgv" onClick={(e) => e.preventDefault()}>
                  CGV
                </a>
              </div>
            </div>
          </footer>
        )}
      </div>

      {cartOpen && (
        <div className="giordora-overlay" onClick={() => setCartOpen(false)}>
          <div className="giordora-mini-cart" onClick={(e) => e.stopPropagation()}>
            <div className="giordora-mini-cart-header">
              <div className="giordora-mini-cart-title">{t("mini_cart_title")}</div>
              <button className="giordora-mini-cart-close" onClick={() => setCartOpen(false)}>
                X
              </button>
            </div>
            {shopifyError && (
              <div className="giordora-error">{shopifyError}</div>
            )}

            <div className="giordora-mini-cart-items">
              {cartItems.length === 0 && <div>{t("mini_cart_empty")}</div>}
              {cartItems.map((item) => (
                <div key={item.key} className="giordora-mini-cart-item">
                  <div className="giordora-mini-cart-item-header">
                    <div className="giordora-mini-cart-item-name">{productName(item.key)}</div>
                    <div>{formatPrice(item.price * item.quantity, locale, item.currency || totalCurrency)}</div>
                  </div>
                  <div className="giordora-mini-cart-qty">
                    <button onClick={() => handleUpdateQuantity(item.key, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.key, 1)}>+</button>
                  </div>
                  <button
                    className="giordora-mini-cart-remove"
                    onClick={() => handleRemoveFromCart(item.key)}
                  >
                    {t("btn_close")}
                  </button>
                </div>
              ))}
            </div>
            <div className="giordora-mini-cart-footer">
              <div className="giordora-mini-cart-row">
                <span>{t("mini_cart_total")}</span>
                <strong>{formatPrice(total, locale, totalCurrency)}</strong>
              </div>
              <button
                className="giordora-btn-gold"
                disabled={cartItems.length === 0}
                onClick={() => {
                  if (shopifyCart?.checkoutUrl) {
                    window.open(shopifyCart.checkoutUrl, "_blank");
                  } else {
                    setShopifyError("Checkout is unavailable until a Shopify cart is created.");
                  }
                }}
              >
                {t("btn_checkout")}
              </button>
            </div>
          </div>
        </div>
      )}

      {authOpen && (
        <div className="giordora-auth-overlay" onClick={() => setAuthOpen(false)}>
          <div className="giordora-auth-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{authMode === "login" ? t("form_login_title") : t("form_signup_title")}</h3>
            {!supabaseEnabled && (
              <div className="giordora-auth-status giordora-auth-status--error">
                {t("auth_error_no_supabase")}
              </div>
            )}
            {authError && (
              <div className="giordora-auth-status giordora-auth-status--error">{authError}</div>
            )}
            {authNotice && <div className="giordora-auth-status">{authNotice}</div>}
            <form onSubmit={handleAuthSubmit}>
              <label>
                {t("form_email")}
                <input
                  type="email"
                  placeholder={t("auth_placeholder_email")}
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  disabled={!supabaseEnabled || authLoading}
                  required
                />
              </label>
              <label>
                {t("form_password")}
                <input
                  type="password"
                  placeholder={t("auth_placeholder_password")}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  disabled={!supabaseEnabled || authLoading}
                  required
                />
              </label>
              {authMode === "signup" && (
                <label>
                  {t("form_name")}
                  <input
                    type="text"
                    placeholder={t("auth_placeholder_name")}
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    disabled={!supabaseEnabled || authLoading}
                    required
                  />
                </label>
              )}
              <div className="giordora-auth-footer">
                <button
                  type="button"
                  className="giordora-auth-toggle"
                  onClick={() => openAuthModal(authMode === "login" ? "signup" : "login")}
                  disabled={authLoading}
                >
                  {authMode === "login" ? t("auth_switch_to_signup") : t("auth_switch_to_login")}
                </button>
                <button
                  className="giordora-btn-gold"
                  type="submit"
                  disabled={authLoading || !supabaseEnabled}
                >
                  {authLoading
                    ? t("auth_loading")
                    : authMode === "login"
                      ? t("auth_submit_login")
                      : t("auth_submit_signup")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {accountOpen && (
        <div className="giordora-account-overlay" onClick={() => setAccountOpen(false)}>
          <div className="giordora-account-modal" onClick={(e) => e.stopPropagation()}>
            <div className="giordora-account-header">
              <div>
                <div className="giordora-account-title">{t("account_title")}</div>
                <div className="giordora-account-subtitle">{t("account_subtitle")}</div>
              </div>
              <button className="giordora-mini-cart-close" onClick={() => setAccountOpen(false)}>
                X
              </button>
            </div>

            {!supabaseEnabled && (
              <div className="giordora-auth-status giordora-auth-status--error">
                {t("auth_error_no_supabase")}
              </div>
            )}

            {supabaseEnabled && !authUser && (
              <div className="giordora-account-empty">
                <p>{t("account_login_prompt")}</p>
                <div className="giordora-account-actions">
                  <button className="giordora-btn-ghost" onClick={() => openAuthModal("login")}>
                    {t("auth_login")}
                  </button>
                  <button className="giordora-btn-gold" onClick={() => openAuthModal("signup")}>
                    {t("auth_signup")}
                  </button>
                </div>
              </div>
            )}

            {supabaseEnabled && authUser && (
              <div className="giordora-account-body">
                <div className="giordora-account-profile">
                  <div className="giordora-account-avatar">{userInitials}</div>
                  <div className="giordora-account-profile-details">
                    <div className="giordora-account-name">{userDisplayName || t("account_profile")}</div>
                    <div className="giordora-account-email">{authUser.email}</div>
                  </div>
                  <button className="giordora-btn-outline" onClick={handleSignOut} disabled={authLoading}>
                    {authLoading ? t("auth_loading") : t("auth_logout")}
                  </button>
                </div>

                <div className="giordora-account-orders">
                  <div className="giordora-account-section-title">{t("account_orders")}</div>
                  {ordersLoading && <div className="giordora-account-muted">{t("auth_loading")}</div>}
                  {ordersError && (
                    <div className="giordora-auth-status giordora-auth-status--error">
                      {ordersError}
                    </div>
                  )}
                  {!ordersLoading && !ordersError && orders.length === 0 && (
                    <div className="giordora-account-muted">{t("account_no_orders")}</div>
                  )}
                  {!ordersLoading && !ordersError && orders.length > 0 && (
                    <div className="giordora-account-order-grid">
                      {orders.map((order) => {
                        let items = [];
                        if (Array.isArray(order.items)) {
                          items = order.items;
                        } else if (typeof order.items === "string") {
                          try {
                            const parsed = JSON.parse(order.items);
                            if (Array.isArray(parsed)) items = parsed;
                          } catch {
                            items = [];
                          }
                        }
                        const orderTotal = order.total_amount ?? order.total ?? 0;
                        const orderCurrency = order.currency || "EUR";
                        const orderDate = order.created_at ? new Date(order.created_at) : null;
                        const orderNumber = order.order_number || order.reference || order.id;
                        const orderNumberLabel = order.order_number
                          ? order.order_number
                          : String(orderNumber).slice(-6);
                        return (
                          <div key={order.id} className="giordora-account-order-card">
                            <div className="giordora-account-order-top">
                              <div>
                                <div className="giordora-account-order-number">
                                  {t("account_order_number")} #{orderNumberLabel}
                                </div>
                                <div className="giordora-account-order-date">
                                  {orderDate ? orderDate.toLocaleDateString(locale || "fr-FR") : "-"}
                                </div>
                              </div>
                              <div className="giordora-account-order-meta">
                                <span className="giordora-order-status">{order.status || "Processing"}</span>
                                <strong>{formatPrice(orderTotal, locale, orderCurrency)}</strong>
                              </div>
                            </div>
                            {items.length > 0 && (
                              <div className="giordora-account-order-items">
                                {items.slice(0, 3).map((item, idx) => (
                                  <div key={`${order.id}-item-${idx}`} className="giordora-account-order-item">
                                    <span>{item.name || item.title || "Item"}</span>
                                    {item.quantity ? <span>x{item.quantity}</span> : null}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
