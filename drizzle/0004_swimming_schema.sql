-- Swimming management schema for FECNA 2026 / LINANORT 2026
-- Includes constraints, indexes, materialized views, and triggers.

create extension if not exists pgcrypto;

-- Federations
create table federations (
    id              uuid primary key default gen_random_uuid(),
    code            text not null unique,
    name            text not null,
    country_code    text not null default 'CO',
    created_at      timestamp not null default now()
);

-- Leagues
create table leagues (
    id              uuid primary key default gen_random_uuid(),
    federation_id   uuid not null references federations(id) on delete cascade,
    name            text not null,
    region          text,
    unique (federation_id, name)
);

-- Clubs
create table clubs (
    id          uuid primary key default gen_random_uuid(),
    league_id   uuid not null references leagues(id) on delete cascade,
    name        text not null,
    code        text,
    unique (league_id, name)
);

-- Athletes
create table athletes (
    id              uuid primary key default gen_random_uuid(),
    first_name      text not null,
    last_name       text not null,
    birth_year      int not null check (birth_year between 1900 and 2026),
    gender          char(1) not null check (gender in ('M','F')),
    club_id         uuid not null references clubs(id) on delete restrict,
    federated       boolean not null default false,
    created_at      timestamp not null default now()
);

create index idx_athletes_club on athletes(club_id);
create index idx_athletes_birth on athletes(birth_year);

-- Categories
create table categories (
    id              uuid primary key default gen_random_uuid(),
    name            text not null unique,
    max_events      int not null check (max_events >= 0),
    note            text
);

-- Age groups
create table age_groups (
    id              uuid primary key default gen_random_uuid(),
    category_id     uuid not null references categories(id) on delete cascade,
    name            text not null,
    min_age         int not null check (min_age >= 0),
    max_age         int not null check (max_age >= min_age),
    birth_years     text,
    is_relay_group  boolean not null default false,
    unique (category_id, name)
);

create index idx_age_groups_category on age_groups(category_id);

-- Events
create table events (
    id              uuid primary key default gen_random_uuid(),
    name            text not null,
    style           text not null check (style in ('Libre','Espalda','Pecho','Mariposa','Combinado','Patadas')),
    distance_m      int not null check (distance_m in (25,50,100,200,400,800,1500)),
    event_type      text not null check (event_type in ('individual','relay')),
    relay_swimmers  int,
    gender          text not null check (gender in ('M','F','Mixed')),
    unique (name, gender, event_type)
);

create table category_events (
    category_id     uuid not null references categories(id) on delete cascade,
    event_id        uuid not null references events(id) on delete cascade,
    primary key (category_id, event_id)
);

create index idx_category_events_event on category_events(event_id);

-- Championship types
create table championship_types (
    id          uuid primary key default gen_random_uuid(),
    code        text not null unique,
    name        text not null
);

-- Championships
create table championships (
    id              uuid primary key default gen_random_uuid(),
    federation_id   uuid not null references federations(id) on delete cascade,
    name            text not null,
    type_id         uuid not null references championship_types(id),
    date_start      date not null,
    date_end        date not null,
    location        text not null,
    is_qualifier    boolean not null default false,
    unique (federation_id, name, date_start)
);

-- Tournaments
create table tournaments (
    id                      uuid primary key default gen_random_uuid(),
    championship_id         uuid not null references championships(id) on delete cascade,
    name                    text not null,
    date_start              date not null,
    date_end                date not null,
    venue                   text not null,
    fees_individual_cop     numeric(12,2),
    fees_foreign_usd        numeric(12,2),
    allow_time_trials       boolean not null default false,
    allow_claims            boolean not null default true,
    unique (championship_id, name, date_start)
);

-- Minimum marks
create table minimum_marks (
    id                   uuid primary key default gen_random_uuid(),
    event_id             uuid not null references events(id) on delete cascade,
    category_id          uuid references categories(id) on delete cascade,
    age_group_id         uuid references age_groups(id) on delete cascade,
    gender               char(1) not null check (gender in ('M','F')),
    championship_type_id uuid not null references championship_types(id),
    time_value           text not null,
    year                 int not null check (year between 2000 and 2100),
    constraint chk_category_or_agegroup
        check (
            (category_id is not null and age_group_id is null) or
            (category_id is null and age_group_id is not null)
        ),
    unique (event_id, category_id, age_group_id, gender, championship_type_id, year)
);

create index idx_minimum_marks_event on minimum_marks(event_id);
create index idx_minimum_marks_type on minimum_marks(championship_type_id);

-- Entries
create table entries (
    id              uuid primary key default gen_random_uuid(),
    athlete_id      uuid not null references athletes(id) on delete cascade,
    event_id        uuid not null references events(id) on delete cascade,
    tournament_id   uuid not null references tournaments(id) on delete cascade,
    entry_time      text,
    status          text not null default 'pending' check (status in ('pending','approved','rejected','scratch')),
    created_at      timestamp not null default now(),
    unique (athlete_id, event_id, tournament_id)
);

-- Results (individual)
create table results (
    id              uuid primary key default gen_random_uuid(),
    entry_id        uuid not null references entries(id) on delete cascade,
    time_value      text not null,
    place           int not null check (place >= 1),
    points          int not null default 0,
    created_at      timestamp not null default now(),
    unique (entry_id)
);

create index idx_results_place on results(place);

-- Rankings (annual)
create table rankings (
    id              uuid primary key default gen_random_uuid(),
    year            int not null check (year between 2000 and 2100),
    event_id        uuid not null references events(id) on delete cascade,
    category_id     uuid references categories(id) on delete cascade,
    age_group_id    uuid references age_groups(id) on delete cascade,
    gender          char(1) not null check (gender in ('M','F')),
    position        int not null check (position >= 1),
    athlete_id      uuid not null references athletes(id) on delete cascade,
    time_value      text not null,
    constraint chk_ranking_category_or_agegroup
        check (
            (category_id is not null and age_group_id is null) or
            (category_id is null and age_group_id is not null)
        ),
    unique (year, event_id, category_id, age_group_id, gender, position)
);

create index idx_rankings_event on rankings(event_id);
create index idx_rankings_athlete on rankings(athlete_id);

-- Relay teams
create table relay_teams (
    id              uuid primary key default gen_random_uuid(),
    tournament_id   uuid not null references tournaments(id) on delete cascade,
    event_id        uuid not null references events(id) on delete cascade,
    club_id         uuid not null references clubs(id) on delete cascade,
    name            text,
    unique (tournament_id, event_id, club_id)
);

create table relay_team_members (
    relay_team_id   uuid not null references relay_teams(id) on delete cascade,
    athlete_id      uuid not null references athletes(id) on delete cascade,
    lane_order      int not null check (lane_order between 1 and 4),
    primary key (relay_team_id, athlete_id),
    unique (relay_team_id, lane_order)
);

create table relay_results (
    id              uuid primary key default gen_random_uuid(),
    relay_team_id   uuid not null references relay_teams(id) on delete cascade,
    time_value      text not null,
    place           int not null check (place >= 1),
    points          int not null default 0,
    created_at      timestamp not null default now(),
    unique (relay_team_id)
);

-- Scores
create table team_scores (
    id              uuid primary key default gen_random_uuid(),
    tournament_id   uuid not null references tournaments(id) on delete cascade,
    club_id         uuid references clubs(id) on delete cascade,
    league_id       uuid references leagues(id) on delete cascade,
    total_points    int not null default 0,
    constraint chk_score_target
        check (
            (club_id is not null and league_id is null) or
            (club_id is null and league_id is not null)
        ),
    unique (tournament_id, club_id, league_id)
);

-- Awards
create table awards (
    id              uuid primary key default gen_random_uuid(),
    tournament_id   uuid not null references tournaments(id) on delete cascade,
    award_type      text not null check (award_type in ('medal','trophy','best_swimmer')),
    athlete_id      uuid references athletes(id),
    club_id         uuid references clubs(id),
    league_id       uuid references leagues(id),
    event_id        uuid references events(id),
    place           int,
    note            text
);

-- =========================
-- Functions and views
-- =========================

create or replace function time_text_to_interval(t text)
returns interval
language sql immutable
as $$
    select make_interval(
        mins => split_part(t, ':', 1)::int,
        secs => split_part(t, ':', 2)::numeric
    );
$$;

create or replace view ranking_best_times as
select
    year, event_id, category_id, age_group_id, gender,
    min(time_text_to_interval(time_value)) as best_time
from rankings
group by year, event_id, category_id, age_group_id, gender;

create or replace function compute_minimum_mark(
    p_year int,
    p_event_id uuid,
    p_category_id uuid,
    p_age_group_id uuid,
    p_gender char(1),
    p_championship_type text
)
returns text
language plpgsql
as $$
declare
    target_pos int;
    mark text;
begin
    if p_championship_type = 'Interligas' then
        target_pos := 24;
    elsif p_championship_type = 'Interclubes' then
        target_pos := 32;
    else
        target_pos := 24;
    end if;

    select r.time_value into mark
    from rankings r
    where r.year = p_year
      and r.event_id = p_event_id
      and r.gender = p_gender
      and ((p_category_id is not null and r.category_id = p_category_id) or
           (p_age_group_id is not null and r.age_group_id = p_age_group_id))
      and r.position = target_pos
    limit 1;

    return mark;
end;
$$;

create or replace view medals_by_event as
select e.event_id, r.place, r.entry_id
from results r
join entries e on e.id = r.entry_id
where r.place between 1 and 3;

-- Materialized view: tournament stats
create materialized view mv_tournament_stats as
select
    t.id as tournament_id,
    count(distinct e.athlete_id) as athlete_count,
    count(distinct a.club_id) as club_count,
    count(e.id) filter (where ev.event_type = 'individual') as individual_entries,
    count(rt.id) as relay_entries
from tournaments t
left join entries e on e.tournament_id = t.id
left join events ev on ev.id = e.event_id
left join athletes a on a.id = e.athlete_id
left join relay_teams rt on rt.tournament_id = t.id
group by t.id;

create unique index mv_tournament_stats_pk on mv_tournament_stats(tournament_id);

-- Materialized view: club total points
create materialized view mv_club_scores as
select
    s.tournament_id,
    s.club_id,
    sum(s.points) as total_points
from (
    select t.id as tournament_id, a.club_id as club_id, r.points
    from results r
    join entries e on e.id = r.entry_id
    join athletes a on a.id = e.athlete_id
    join tournaments t on t.id = e.tournament_id

    union all

    select t.id as tournament_id, rt.club_id as club_id, rr.points
    from relay_results rr
    join relay_teams rt on rt.id = rr.relay_team_id
    join tournaments t on t.id = rt.tournament_id
) s
where s.club_id is not null
group by s.tournament_id, s.club_id;

create unique index mv_club_scores_pk on mv_club_scores(tournament_id, club_id);

-- =========================
-- Trigger: enforce max individual events per athlete/category
-- =========================

create or replace function trg_check_max_individual_events()
returns trigger
language plpgsql
as $$
declare
    v_tournament_year int;
    v_age int;
    v_category_id uuid;
    v_max_events int;
    v_current_count int;
    v_event_type text;
begin
    select event_type into v_event_type from events where id = new.event_id;
    if v_event_type <> 'individual' then
        return new;
    end if;

    select extract(year from t.date_start)::int into v_tournament_year
    from tournaments t
    where t.id = new.tournament_id;

    select v_tournament_year - a.birth_year into v_age
    from athletes a
    where a.id = new.athlete_id;

    select c.id, c.max_events into v_category_id, v_max_events
    from age_groups ag
    join categories c on c.id = ag.category_id
    where ag.is_relay_group = false
      and v_age between ag.min_age and ag.max_age
    order by ag.min_age asc
    limit 1;

    if v_category_id is null then
        raise exception 'No category found for athlete age %', v_age;
    end if;

    select count(*) into v_current_count
    from entries e
    join events ev on ev.id = e.event_id
    where e.tournament_id = new.tournament_id
      and e.athlete_id = new.athlete_id
      and ev.event_type = 'individual'
      and (tg_op = 'INSERT' or e.id <> new.id);

    if v_current_count + 1 > v_max_events then
        raise exception 'Max individual events exceeded (%).', v_max_events;
    end if;

    return new;
end;
$$;

create trigger trg_entries_max_events
before insert or update on entries
for each row
execute function trg_check_max_individual_events();
