-- Orders table + RLS for Giordora
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users,
  order_number text,
  status text default 'processing',
  total_amount numeric,
  currency text default 'EUR',
  items jsonb,
  created_at timestamptz default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);

alter table public.orders enable row level security;

drop policy if exists "Users can view their orders" on public.orders;
create policy "Users can view their orders"
on public.orders
for select
using (auth.uid() = user_id);
