# Database Production Guide

This document defines how the database schema is managed in production and which sources are canonical.

## Source of Truth

- The canonical database schema is defined by SQL migrations in the [drizzle/](drizzle/) directory.
- The TypeScript schema in [src/lib/server/schema.ts](src/lib/server/schema.ts) mirrors the database to provide types and query helpers for Drizzle ORM.
- SQL migrations remain authoritative for:
  - extensions
  - functions
  - triggers
  - views and materialized views
  - CHECK constraints and advanced indexes

## Migration Policy

- Production deployments must use `db:migrate` only.
- Do not use `db:push` in production.
- Any schema change must be delivered as a migration file under [drizzle/](drizzle/).

## Seeding Policy

- Seed data should be idempotent.
- Base seed data (small reference sets) must be safe to run repeatedly.
- Large or external seeds (for example, GeoDB) should be executed only on demand.
- Avoid mixing large seed DML inside migrations. Keep DDL and seeds separate.

## Environments

- `DATABASE_URL` is required in all runtime environments.
- For production, use a dedicated database and a dedicated user with least privileges.

## Roles and Least Privilege

- Create a dedicated app role with only the required permissions.
- Avoid using the database owner for application traffic.
- Grant `SELECT/INSERT/UPDATE/DELETE` only on the tables the app uses.
- Limit `CREATE/ALTER/DROP` to migration roles or CI jobs.

Example role setup (adjust database and schema names as needed):

```sql
-- Create an app role with least privileges
create role deporty_app login password 'REPLACE_ME_STRONG';

-- Allow usage on schema
grant usage on schema public to deporty_app;

-- Grant table permissions (only the tables the app needs)
grant select, insert, update, delete on
  users,
  password_reset_tokens,
  countries,
  cities
to deporty_app;

-- Future tables: grant explicitly when a feature requires it
```

## Operational Notes

- Functions, triggers, and materialized views are not represented in Drizzle TS and must be preserved via SQL migrations.
- Before any production migration, verify:
  - a backup or snapshot exists
  - the migration is idempotent or safe to apply once
  - the migration has been tested in staging

## Change Workflow

1. Update SQL migrations in [drizzle/](drizzle/) for any schema change.
2. Update [src/lib/server/schema.ts](src/lib/server/schema.ts) to mirror the database.
3. Run migrations in staging.
4. Deploy to production using `db:migrate`.

## CI/CD Checklist (DB)

- Ensure `DATABASE_URL` points to the correct environment.
- Run `db:migrate` only; block `db:push` in production pipelines.
- Verify backups/snapshots exist before migration.
- Validate migration order and idempotency.
- Run smoke checks for critical queries after migration.
- Confirm that SQL-only objects still exist (functions, triggers, views).

## Incident Runbook (DB)

### Symptoms

- Elevated error rates from API endpoints.
- Migration failures or partial deploys.
- Unexpected latency spikes in DB calls.

### Immediate Actions

1. Freeze deployments.
2. Check the latest migration status and logs.
3. Confirm DB connectivity and credentials.

### Rollback Strategy

- Prefer restoring from the latest snapshot when a migration caused data loss.
- If the migration is reversible, apply a new rollback migration.
- Avoid manual schema edits in production.

### Verification Steps

- Re-run smoke checks for auth, locations, and any critical flows.
- Confirm materialized views and triggers are present.
- Validate data integrity constraints in affected tables.

## Smoke Checks (Queries)

Run these as read-only checks after migrations and during incident validation.

```sql
-- Auth: user uniqueness
select email, count(*)
from users
group by email
having count(*) > 1;

-- Auth: password reset tokens not expired in the past
select count(*) as expired_tokens
from password_reset_tokens
where expires_at < now();

-- Locations: countries should exist
select count(*) as country_count
from countries;

-- Locations: orphan cities
select count(*) as orphan_cities
from cities c
left join countries co on co.code = c.country_code
where co.code is null;

-- Locations: quick lookup sanity
select code, name
from countries
order by name
limit 5;

-- Swimming: core reference data exists
select count(*) as federations_count from federations;
select count(*) as championships_count from championships;
select count(*) as tournaments_count from tournaments;

-- Swimming: orphan checks
select count(*) as orphan_leagues
from leagues l
left join federations f on f.id = l.federation_id
where f.id is null;

select count(*) as orphan_clubs
from clubs c
left join leagues l on l.id = c.league_id
where l.id is null;

select count(*) as orphan_athletes
from athletes a
left join clubs c on c.id = a.club_id
where c.id is null;

-- Swimming: entry/result integrity
select count(*) as orphan_entries
from entries e
left join athletes a on a.id = e.athlete_id
left join events ev on ev.id = e.event_id
left join tournaments t on t.id = e.tournament_id
where a.id is null or ev.id is null or t.id is null;

select count(*) as orphan_results
from results r
left join entries e on e.id = r.entry_id
where e.id is null;
```
