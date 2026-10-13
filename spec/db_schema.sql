-- CogniSignal v4 · Supabase/Postgres
create extension if not exists pgcrypto;

create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  locale text not null check (locale in ('es','en','pt')),
  country_code text not null,
  age_years int not null check (age_years between 55 and 90),
  education_band text not null,
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references participants(id) on delete cascade,
  session_date date not null,
  memory_dprime double precision not null,
  attention_rt_ms double precision not null,
  executive_ies_ms double precision not null,
  quality_pass boolean not null,
  context_issue text not null,
  self_report_change_6m text not null,
  created_at timestamptz not null default now(),
  unique(participant_id, session_date)
);

create table if not exists calculations (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references participants(id) on delete cascade,
  model_version text not null,
  result jsonb not null,
  input_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  calculation_id uuid not null references calculations(id) on delete cascade,
  email_ciphertext text not null,
  email_hash text not null,
  locale text not null check (locale in ('es','en','pt')),
  waitlist boolean not null default false,
  status text not null default 'requested' check (status in ('requested','generated','sent','failed')),
  created_at timestamptz not null default now()
);
create index if not exists leads_email_hash_idx on leads(email_hash);

create table if not exists consent_records (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  participant_id uuid references participants(id) on delete cascade,
  consent_type text not null,
  consent_version text not null,
  granted boolean not null,
  created_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  storage_key text,
  sha256 text,
  locale text not null,
  generated_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  currency text,
  amount_minor int,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists webhook_events (
  provider text not null,
  event_id text not null,
  processed_at timestamptz not null default now(),
  payload_hash text not null,
  primary key(provider, event_id)
);

alter table participants enable row level security;
alter table sessions enable row level security;
alter table calculations enable row level security;
alter table leads enable row level security;
alter table consent_records enable row level security;
alter table reports enable row level security;
alter table orders enable row level security;
alter table webhook_events enable row level security;

-- Deny direct anon/authenticated access by default. Server Route Handlers use service role.
revoke all on participants, sessions, calculations, leads, consent_records, reports, orders, webhook_events from anon, authenticated;
grant all on participants, sessions, calculations, leads, consent_records, reports, orders, webhook_events to service_role;

-- Optional narrow RPCs may be added later; never expose email_ciphertext/result directly to browser.
comment on table leads is 'PII segregada: email cifrado + hash; resultados se referencian por calculation_id.';
