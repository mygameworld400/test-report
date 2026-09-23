-- test-report /v2 ("ME 연애 리포트")용 테이블. psychtest와 같은 Supabase
-- 프로젝트를 공유하므로 tr_ 접두사로 구분한다.
--
-- /v2는 빌드 없는 단일 HTML 파일이라 Next.js env 주입을 못 받는다 — URL/anon 키를
-- 파일에 직접 박아 넣는다. anon 키는 원래 공개되는 값이고(RLS가 실제 보안 경계),
-- psychtest도 이미 같은 방식으로 번들에 anon 키가 그대로 노출되어 있어 일관된 모델이다.
--
-- 로그인 계정은 없다. 첫 방문에 닉네임만 받고 브라우저에 예측 불가능한
-- owner_id(UUID)를 저장해서, 그걸 소유자 식별자로 그대로 쓴다(psychtest와 동일한
-- 신뢰 모델). RLS는 전부 anon에게 열어두고, "내 것"인지는 클라이언트가
-- owner_id로 걸러서 조회한다.
--
-- Supabase 대시보드 → SQL Editor 에 통째로 붙여넣고 실행. 여러 번 실행해도 안전하다.

create table if not exists tr_assessments (
  id text primary key,
  owner_id uuid not null,
  person_id uuid,
  mode text not null default 'self' check (mode in ('self', 'observed')),
  answers jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists tr_persons (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  display_name text not null,
  relationship_label text not null check (relationship_label in ('썸', '연인', '전 연인')),
  response_mode text not null check (response_mode in ('direct', 'observed')),
  created_at timestamptz not null default now()
);

alter table tr_assessments add column if not exists person_id uuid references tr_persons(id) on delete set null;

create table if not exists tr_invites (
  token text primary key,
  owner_id uuid not null,
  person_id uuid not null references tr_persons(id) on delete cascade,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists tr_purchases (
  id bigint generated always as identity primary key,
  owner_id uuid not null,
  sku text not null,
  amount integer not null,
  created_at timestamptz not null default now()
);

alter table tr_assessments enable row level security;
alter table tr_persons enable row level security;
alter table tr_invites enable row level security;
alter table tr_purchases enable row level security;

drop policy if exists "anon insert assessments" on tr_assessments;
create policy "anon insert assessments" on tr_assessments for insert to anon with check (true);
drop policy if exists "anon read assessments" on tr_assessments;
create policy "anon read assessments" on tr_assessments for select to anon using (true);

drop policy if exists "anon insert persons" on tr_persons;
create policy "anon insert persons" on tr_persons for insert to anon with check (true);
drop policy if exists "anon read persons" on tr_persons;
create policy "anon read persons" on tr_persons for select to anon using (true);
drop policy if exists "anon delete persons" on tr_persons;
create policy "anon delete persons" on tr_persons for delete to anon using (true);

drop policy if exists "anon insert invites" on tr_invites;
create policy "anon insert invites" on tr_invites for insert to anon with check (true);
drop policy if exists "anon read invites" on tr_invites;
create policy "anon read invites" on tr_invites for select to anon using (true);
drop policy if exists "anon update invites" on tr_invites;
create policy "anon update invites" on tr_invites for update to anon using (true);

drop policy if exists "anon insert purchases" on tr_purchases;
create policy "anon insert purchases" on tr_purchases for insert to anon with check (true);
drop policy if exists "anon read purchases" on tr_purchases;
create policy "anon read purchases" on tr_purchases for select to anon using (true);
