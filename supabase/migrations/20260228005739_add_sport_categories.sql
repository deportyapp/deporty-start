-- =============================================
-- Migration: Add Sport Categories
-- Creates sport_category table, participant_type ENUM,
-- and calendar_event_category junction table.
-- Seeds competitive swimming categories for 2026.
-- =============================================

-- ─── ENUM: participant_type ────────────────────
CREATE TYPE "public"."participant_type" AS ENUM ('federado', 'no_federado', 'ambos');

-- ─── Alter: calendar_event ─────────────────────
ALTER TABLE "public"."calendar_event"
    ADD COLUMN "participant_type" "public"."participant_type" DEFAULT 'ambos';

-- ─── Table: sport_category ─────────────────────
CREATE TABLE IF NOT EXISTS "public"."sport_category" (
    "category_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sport_id" "uuid" NOT NULL,
    "name" character varying(100) NOT NULL,
    "min_age" smallint NOT NULL,
    "max_age" smallint,  -- NULL = sin límite superior (ej: 21+)
    "max_individual_events" smallint NOT NULL DEFAULT 6,
    "sort_order" smallint NOT NULL DEFAULT 0,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);

ALTER TABLE "public"."sport_category" OWNER TO "postgres";

ALTER TABLE ONLY "public"."sport_category"
    ADD CONSTRAINT "sport_category_pkey" PRIMARY KEY ("category_id");

ALTER TABLE ONLY "public"."sport_category"
    ADD CONSTRAINT "sport_category_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "public"."sport"("sport_id");

-- Unique: no duplicate category rows for same sport + name + age range
ALTER TABLE "public"."sport_category"
    ADD CONSTRAINT "sport_category_unique" UNIQUE ("sport_id", "name", "min_age");

CREATE INDEX "idx_sport_category_sport" ON "public"."sport_category" ("sport_id");

-- ─── Table: calendar_event_category ────────────
CREATE TABLE IF NOT EXISTS "public"."calendar_event_category" (
    "event_id" "uuid" NOT NULL,
    "category_id" "uuid" NOT NULL
);

ALTER TABLE "public"."calendar_event_category" OWNER TO "postgres";

ALTER TABLE ONLY "public"."calendar_event_category"
    ADD CONSTRAINT "calendar_event_category_pkey" PRIMARY KEY ("event_id", "category_id");

ALTER TABLE ONLY "public"."calendar_event_category"
    ADD CONSTRAINT "calendar_event_category_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."calendar_event"("event_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."calendar_event_category"
    ADD CONSTRAINT "calendar_event_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."sport_category"("category_id") ON DELETE CASCADE;

-- ─── RLS: sport_category ───────────────────────
ALTER TABLE "public"."sport_category" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read sport categories" ON "public"."sport_category"
    FOR SELECT USING (true);

-- ─── RLS: calendar_event_category ──────────────
ALTER TABLE "public"."calendar_event_category" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read event categories" ON "public"."calendar_event_category"
    FOR SELECT USING (true);

CREATE POLICY "Authenticated insert event categories" ON "public"."calendar_event_category"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM "public"."calendar_event" ce
            WHERE ce.event_id = "calendar_event_category"."event_id"
              AND ce.created_by = "auth"."uid"()
        )
    );

CREATE POLICY "Creators delete event categories" ON "public"."calendar_event_category"
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM "public"."calendar_event" ce
            WHERE ce.event_id = "calendar_event_category"."event_id"
              AND ce.created_by = "auth"."uid"()
        )
    );

-- ─── Grants ────────────────────────────────────
GRANT ALL ON TABLE "public"."sport_category" TO "anon";
GRANT ALL ON TABLE "public"."sport_category" TO "authenticated";
GRANT ALL ON TABLE "public"."sport_category" TO "service_role";

GRANT ALL ON TABLE "public"."calendar_event_category" TO "anon";
GRANT ALL ON TABLE "public"."calendar_event_category" TO "authenticated";
GRANT ALL ON TABLE "public"."calendar_event_category" TO "service_role";

-- ─── Seed: Natación Carreras - Categorías Competitivas 2026 ───
-- Based on federation rules: age calculated as of Dec 31 of the event year
DO $$
DECLARE
    swimming_id UUID;
BEGIN
    SELECT sport_id INTO swimming_id FROM "public"."sport" WHERE name ILIKE '%nataci%n%' LIMIT 1;

    IF swimming_id IS NULL THEN
        -- Create the sport if it doesn't exist
        INSERT INTO "public"."sport" (name) VALUES ('Natación Carreras') RETURNING sport_id INTO swimming_id;
    END IF;

    -- Menores (3 sub-groups with different event limits)
    INSERT INTO "public"."sport_category" (sport_id, name, min_age, max_age, max_individual_events, sort_order) VALUES
        (swimming_id, 'Menores', 7, 7, 4, 1),
        (swimming_id, 'Menores', 8, 8, 4, 2),
        (swimming_id, 'Menores', 9, 9, 5, 3);

    -- Infantil A
    INSERT INTO "public"."sport_category" (sport_id, name, min_age, max_age, max_individual_events, sort_order) VALUES
        (swimming_id, 'Infantil A', 10, 11, 6, 4);

    -- Infantil B
    INSERT INTO "public"."sport_category" (sport_id, name, min_age, max_age, max_individual_events, sort_order) VALUES
        (swimming_id, 'Infantil B', 12, 13, 6, 5);

    -- Juvenil A
    INSERT INTO "public"."sport_category" (sport_id, name, min_age, max_age, max_individual_events, sort_order) VALUES
        (swimming_id, 'Juvenil A', 14, 15, 6, 6);

    -- Juvenil B
    INSERT INTO "public"."sport_category" (sport_id, name, min_age, max_age, max_individual_events, sort_order) VALUES
        (swimming_id, 'Juvenil B', 16, 17, 6, 7);

    -- Junior
    INSERT INTO "public"."sport_category" (sport_id, name, min_age, max_age, max_individual_events, sort_order) VALUES
        (swimming_id, 'Junior', 18, 20, 6, 8);

    -- Mayores (sin límite superior de edad)
    INSERT INTO "public"."sport_category" (sport_id, name, min_age, max_age, max_individual_events, sort_order) VALUES
        (swimming_id, 'Mayores', 21, NULL, 6, 9);

END $$;
