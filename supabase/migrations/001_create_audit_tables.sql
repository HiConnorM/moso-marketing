-- Run this migration in your Supabase SQL editor or via the Supabase CLI
-- supabase db push

create extension if not exists "pgcrypto";

-- ============================================================
-- audit_leads
-- Stores one record per form submission.
-- ============================================================
create table if not exists public.audit_leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text,
  email         text not null,
  business_name text,
  website_url   text not null,
  notes         text,
  source        text not null default 'moso_audit_tool',
  status        text not null default 'queued'
                  check (status in ('queued', 'running', 'completed', 'failed')),
  score         integer check (score >= 0 and score <= 100),
  category      text,
  crm_synced    boolean not null default false
);

-- Index for polling by lead id (used by status endpoint)
create index if not exists audit_leads_id_idx on public.audit_leads (id);

-- Index for finding leads by email (duplicate prevention / CRM lookup)
create index if not exists audit_leads_email_idx on public.audit_leads (email);

-- ============================================================
-- site_audits
-- Stores the full audit output for each lead.
-- ============================================================
create table if not exists public.site_audits (
  id           uuid primary key default gen_random_uuid(),
  lead_id      uuid not null references public.audit_leads (id) on delete cascade,
  created_at   timestamptz not null default now(),
  website_url  text not null,
  raw_results  jsonb not null,
  ai_report    jsonb,
  html_report  text,
  pdf_url      text,
  completed_at timestamptz
);

create index if not exists site_audits_lead_id_idx on public.site_audits (lead_id);

-- ============================================================
-- Row Level Security
-- These tables are accessed only by the service-role key on
-- the server. Disable RLS for simplicity or lock it down below.
-- ============================================================
alter table public.audit_leads enable row level security;
alter table public.site_audits enable row level security;

-- Allow the service role (used by the Next.js API) to do everything
create policy "service_role_all_audit_leads"
  on public.audit_leads
  for all
  to service_role
  using (true)
  with check (true);

create policy "service_role_all_site_audits"
  on public.site_audits
  for all
  to service_role
  using (true)
  with check (true);
