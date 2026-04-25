create extension if not exists "pgcrypto";

create table if not exists content_ops_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_type text check (source_type in ('feature_update', 'bug_fix', 'release_note', 'idea', 'launch_post', 'beta_call', 'education')),
  raw_input text not null,
  audience text,
  cta text,
  tone text,
  media_url text,
  status text not null default 'draft',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_ops_drafts (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references content_ops_sources(id) on delete cascade,
  platform text not null check (platform in ('x', 'facebook', 'linkedin')),
  variant_name text not null default 'main',
  draft_text text not null,
  hook text,
  cta text,
  hashtags text[] not null default '{}',
  approval_status text not null default 'draft' check (approval_status in ('draft', 'approved', 'rejected', 'held', 'scheduled', 'posted', 'failed')),
  approved boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_ops_publish_jobs (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references content_ops_drafts(id) on delete cascade,
  platform text not null check (platform in ('x', 'facebook', 'linkedin')),
  job_status text not null default 'pending' check (job_status in ('pending', 'scheduled', 'publishing', 'published', 'failed', 'cancelled')),
  scheduled_for timestamptz,
  published_at timestamptz,
  external_post_id text,
  error_message text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_ops_platform_accounts (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('x', 'facebook', 'linkedin')),
  account_name text,
  account_id text,
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_ops_logs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references content_ops_sources(id) on delete set null,
  draft_id uuid references content_ops_drafts(id) on delete set null,
  publish_job_id uuid references content_ops_publish_jobs(id) on delete set null,
  event_type text not null check (event_type in (
    'source_created',
    'draft_generated',
    'draft_edited',
    'draft_approved',
    'draft_rejected',
    'draft_held',
    'publish_requested',
    'publish_success',
    'publish_failed',
    'system_error'
  )),
  message text,
  payload_json jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists content_ops_sources_created_at_idx on content_ops_sources(created_at desc);
create index if not exists content_ops_drafts_source_id_idx on content_ops_drafts(source_id);
create index if not exists content_ops_drafts_approval_status_idx on content_ops_drafts(approval_status);
create index if not exists content_ops_publish_jobs_draft_id_idx on content_ops_publish_jobs(draft_id);
create index if not exists content_ops_publish_jobs_status_idx on content_ops_publish_jobs(job_status);
create index if not exists content_ops_logs_created_at_idx on content_ops_logs(created_at desc);

alter table content_ops_sources enable row level security;
alter table content_ops_drafts enable row level security;
alter table content_ops_publish_jobs enable row level security;
alter table content_ops_platform_accounts enable row level security;
alter table content_ops_logs enable row level security;

drop policy if exists "content ops sources own rows" on content_ops_sources;
create policy "content ops sources own rows"
  on content_ops_sources for all
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

drop policy if exists "content ops drafts own rows" on content_ops_drafts;
create policy "content ops drafts own rows"
  on content_ops_drafts for all
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

drop policy if exists "content ops publish jobs own rows" on content_ops_publish_jobs;
create policy "content ops publish jobs own rows"
  on content_ops_publish_jobs for all
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

drop policy if exists "content ops platform accounts own rows" on content_ops_platform_accounts;
create policy "content ops platform accounts own rows"
  on content_ops_platform_accounts for all
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

drop policy if exists "content ops logs own rows" on content_ops_logs;
create policy "content ops logs own rows"
  on content_ops_logs for all
  using (created_by = auth.uid())
  with check (created_by = auth.uid());
