-- =============================================
-- Migration: Deduplicate Cities
-- The calendar_events migration seeded ~20 major cities (Bogotá, Cali, etc.)
-- and later seed_latam_states_cities re-inserted them with different UUIDs.
-- This migration reassigns calendar_event references and removes duplicates.
-- =============================================

-- Strategy: For each group of duplicate cities (same name + same department_id),
-- keep one and reassign any calendar_event references, then delete the rest.

DO $$
DECLARE
    rec RECORD;
    keeper_id UUID;
    dupe_id UUID;
BEGIN
    -- Find all duplicate city groups (same name + same department_id)
    FOR rec IN
        SELECT name, department_id, array_agg(city_id ORDER BY created_at DESC) AS city_ids
        FROM "public"."city"
        GROUP BY name, department_id
        HAVING COUNT(*) > 1
    LOOP
        -- Keep the most recent one (from the comprehensive seed), delete older ones
        keeper_id := rec.city_ids[1];

        FOR i IN 2..array_length(rec.city_ids, 1) LOOP
            dupe_id := rec.city_ids[i];

            -- Reassign any calendar_event references
            UPDATE "public"."calendar_event"
            SET city_id = keeper_id
            WHERE city_id = dupe_id;

            -- Delete the duplicate
            DELETE FROM "public"."city"
            WHERE city_id = dupe_id;

            RAISE NOTICE 'Dedup city: "%" - kept %, deleted %', rec.name, keeper_id, dupe_id;
        END LOOP;
    END LOOP;
END $$;

-- Add a unique constraint to prevent future city duplicates within the same department
ALTER TABLE "public"."city"
    ADD CONSTRAINT "city_name_department_unique" UNIQUE (name, department_id);
