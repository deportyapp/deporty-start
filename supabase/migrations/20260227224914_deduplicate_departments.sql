-- =============================================
-- Migration: Deduplicate Departments
-- The add_departments migration inserted departments for some countries
-- and the seed_latam_states_cities migration later inserted the full set
-- with different UUIDs, resulting in duplicate department entries.
-- This migration reassigns any city references and removes the duplicates.
-- =============================================

-- Strategy: Keep the canonical departments from seed_latam_states_cities
-- (which have the complete dataset) and delete the ones from add_departments
-- (which had auto-generated UUIDs).

DO $$
DECLARE
    rec RECORD;
    canonical_id UUID;
BEGIN
    -- Find all duplicate departments (same name + same country_id appearing more than once)
    FOR rec IN
        SELECT d1.id AS old_id, d1.name, d1.country_id
        FROM "public"."department" d1
        WHERE EXISTS (
            SELECT 1 FROM "public"."department" d2
            WHERE d2.name = d1.name
              AND d2.country_id = d1.country_id
              AND d2.id <> d1.id
              AND d2.created_at < d1.created_at  -- the earlier one is the duplicate from add_departments
        )
        AND NOT EXISTS (
            SELECT 1 FROM "public"."department" d3
            WHERE d3.name = d1.name
              AND d3.country_id = d1.country_id
              AND d3.id <> d1.id
              AND d3.created_at > d1.created_at
        )
    LOOP
        -- Get the canonical id (the one we want to keep, from the later seed)
        SELECT d2.id INTO canonical_id
        FROM "public"."department" d2
        WHERE d2.name = rec.name
          AND d2.country_id = rec.country_id
          AND d2.id <> rec.old_id
        LIMIT 1;

        IF canonical_id IS NOT NULL THEN
            -- Reassign any cities from old duplicate to canonical
            UPDATE "public"."city"
            SET department_id = canonical_id
            WHERE department_id = rec.old_id;

            -- Delete the old duplicate
            DELETE FROM "public"."department"
            WHERE id = rec.old_id;

            RAISE NOTICE 'Dedup: % -> kept %, deleted %', rec.name, canonical_id, rec.old_id;
        END IF;
    END LOOP;
END $$;

-- Also handle Chile's near-match: "Región Metropolitana" vs "Región Metropolitana de Santiago"
DO $$
DECLARE
    old_rm_id UUID;
    new_rm_id UUID;
    chile_country_id BIGINT;
BEGIN
    SELECT id INTO chile_country_id FROM "public"."countries" WHERE iso_code = 'CL';

    IF chile_country_id IS NOT NULL THEN
        -- Check if both exist
        SELECT id INTO old_rm_id FROM "public"."department"
            WHERE name = 'Región Metropolitana' AND country_id = chile_country_id;

        SELECT id INTO new_rm_id FROM "public"."department"
            WHERE name = 'Región Metropolitana de Santiago' AND country_id = chile_country_id;

        IF old_rm_id IS NOT NULL AND new_rm_id IS NOT NULL THEN
            UPDATE "public"."city"
            SET department_id = new_rm_id
            WHERE department_id = old_rm_id;

            DELETE FROM "public"."department"
            WHERE id = old_rm_id;

            RAISE NOTICE 'Dedup Chile: Región Metropolitana -> Región Metropolitana de Santiago';
        END IF;
    END IF;
END $$;

-- Add a unique constraint to prevent future duplicates
ALTER TABLE "public"."department"
    ADD CONSTRAINT "department_name_country_unique" UNIQUE (name, country_id);
