-- Migration 002: Upgrade audit schema for SEO + AEO + GEO three-pillar audit
-- Run in Supabase SQL editor or via: supabase db push

-- ── audit_leads: make email nullable (new flow starts without email) ──────────
alter table public.audit_leads
  alter column email drop not null;

-- ── audit_leads: add new columns ─────────────────────────────────────────────
alter table public.audit_leads
  add column if not exists first_name      text,
  add column if not exists industry        text,
  add column if not exists phone           text,
  add column if not exists consent         boolean not null default false,
  add column if not exists seo_score       integer check (seo_score >= 0 and seo_score <= 100),
  add column if not exists aeo_score       integer check (aeo_score >= 0 and aeo_score <= 100),
  add column if not exists geo_score       integer check (geo_score >= 0 and geo_score <= 100),
  add column if not exists ux_score        integer check (ux_score >= 0 and ux_score <= 100),
  add column if not exists teaser_results_json jsonb,
  add column if not exists lead_quality_score  integer,
  add column if not exists lead_quality_label  text,
  add column if not exists email_sent_at   timestamptz,
  add column if not exists updated_at      timestamptz not null default now();

-- ── audit_leads: expand status constraint to include new states ──────────────
alter table public.audit_leads
  drop constraint if exists audit_leads_status_check;

alter table public.audit_leads
  add constraint audit_leads_status_check
    check (status in ('queued', 'running', 'teaser_ready', 'email_sent', 'completed', 'failed'));

-- ── Backfill: map old 'completed' records to new email_sent state ─────────────
-- (old flow sent email during run, so completed = emailed)
-- Leave existing 'completed' rows as-is; the old UI still works.

-- ── updated_at trigger ───────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists audit_leads_updated_at on public.audit_leads;
create trigger audit_leads_updated_at
  before update on public.audit_leads
  for each row execute procedure public.set_updated_at();
