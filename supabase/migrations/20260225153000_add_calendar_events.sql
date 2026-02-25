-- =============================================
-- Migration: Calendario Deportivo
-- Creates city + calendar_event tables
-- =============================================

-- ─── Table: city ──────────────────────────────
CREATE TABLE IF NOT EXISTS "public"."city" (
    "city_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "country_id" bigint NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"()
);

ALTER TABLE "public"."city" OWNER TO "postgres";

ALTER TABLE ONLY "public"."city"
    ADD CONSTRAINT "city_pkey" PRIMARY KEY ("city_id");

ALTER TABLE ONLY "public"."city"
    ADD CONSTRAINT "city_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id");

-- Index for filtering by country
CREATE INDEX "idx_city_country" ON "public"."city" ("country_id");

-- ─── Table: calendar_event ────────────────────
CREATE TABLE IF NOT EXISTS "public"."calendar_event" (
    "event_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "sport_id" "uuid" NOT NULL,
    "city_id" "uuid" NOT NULL,
    "color" character varying(7) NOT NULL DEFAULT '#3B82F6',
    "reference_start" "date" NOT NULL,
    "reference_end" "date" NOT NULL,
    "start_day_of_week" smallint NOT NULL,
    "end_day_of_week" smallint NOT NULL,
    "is_recurring" boolean DEFAULT true,
    "created_by" "uuid",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "deleted_at" timestamp without time zone
);

ALTER TABLE "public"."calendar_event" OWNER TO "postgres";

ALTER TABLE ONLY "public"."calendar_event"
    ADD CONSTRAINT "calendar_event_pkey" PRIMARY KEY ("event_id");

ALTER TABLE ONLY "public"."calendar_event"
    ADD CONSTRAINT "calendar_event_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "public"."sport"("sport_id");

ALTER TABLE ONLY "public"."calendar_event"
    ADD CONSTRAINT "calendar_event_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."city"("city_id");

ALTER TABLE ONLY "public"."calendar_event"
    ADD CONSTRAINT "calendar_event_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profile"("profile_id");

-- Indexes for common queries
CREATE INDEX "idx_calendar_event_city" ON "public"."calendar_event" ("city_id");
CREATE INDEX "idx_calendar_event_sport" ON "public"."calendar_event" ("sport_id");
CREATE INDEX "idx_calendar_event_deleted" ON "public"."calendar_event" ("deleted_at");

-- Check: start_day_of_week and end_day_of_week between 0-6
ALTER TABLE "public"."calendar_event"
    ADD CONSTRAINT "check_day_of_week_start" CHECK ("start_day_of_week" >= 0 AND "start_day_of_week" <= 6);
ALTER TABLE "public"."calendar_event"
    ADD CONSTRAINT "check_day_of_week_end" CHECK ("end_day_of_week" >= 0 AND "end_day_of_week" <= 6);

-- ─── RLS: city ────────────────────────────────
ALTER TABLE "public"."city" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read cities" ON "public"."city"
    FOR SELECT USING (true);

-- ─── RLS: calendar_event ──────────────────────
ALTER TABLE "public"."calendar_event" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active calendar events" ON "public"."calendar_event"
    FOR SELECT USING ("deleted_at" IS NULL);

CREATE POLICY "Authenticated users can create events" ON "public"."calendar_event"
    FOR INSERT WITH CHECK ("auth"."uid"() = "created_by");

CREATE POLICY "Creators can update own events" ON "public"."calendar_event"
    FOR UPDATE USING ("auth"."uid"() = "created_by");

CREATE POLICY "Creators can delete own events" ON "public"."calendar_event"
    FOR DELETE USING ("auth"."uid"() = "created_by");

-- ─── Grants ───────────────────────────────────
GRANT ALL ON TABLE "public"."city" TO "anon";
GRANT ALL ON TABLE "public"."city" TO "authenticated";
GRANT ALL ON TABLE "public"."city" TO "service_role";

GRANT ALL ON TABLE "public"."calendar_event" TO "anon";
GRANT ALL ON TABLE "public"."calendar_event" TO "authenticated";
GRANT ALL ON TABLE "public"."calendar_event" TO "service_role";

-- ─── Seed: Cities ─────────────────────────────
-- Assumes countries already exist. We insert cities for common LatAm countries.
-- Colombia (iso_code = 'CO')
INSERT INTO "public"."city" ("name", "country_id")
SELECT 'Bogotá', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'CO'
UNION ALL
SELECT 'Medellín', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'CO'
UNION ALL
SELECT 'Cali', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'CO'
UNION ALL
SELECT 'Barranquilla', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'CO'
UNION ALL
SELECT 'Cartagena', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'CO'
UNION ALL
SELECT 'Bucaramanga', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'CO';

-- Argentina (iso_code = 'AR')
INSERT INTO "public"."city" ("name", "country_id")
SELECT 'Buenos Aires', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'AR'
UNION ALL
SELECT 'Córdoba', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'AR'
UNION ALL
SELECT 'Rosario', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'AR'
UNION ALL
SELECT 'Mendoza', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'AR';

-- Brasil (iso_code = 'BR')
INSERT INTO "public"."city" ("name", "country_id")
SELECT 'São Paulo', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'BR'
UNION ALL
SELECT 'Río de Janeiro', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'BR'
UNION ALL
SELECT 'Brasilia', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'BR'
UNION ALL
SELECT 'Salvador', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'BR';

-- México (iso_code = 'MX')
INSERT INTO "public"."city" ("name", "country_id")
SELECT 'Ciudad de México', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'MX'
UNION ALL
SELECT 'Guadalajara', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'MX'
UNION ALL
SELECT 'Monterrey', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'MX';

-- Chile (iso_code = 'CL')
INSERT INTO "public"."city" ("name", "country_id")
SELECT 'Santiago', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'CL'
UNION ALL
SELECT 'Valparaíso', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'CL';

-- Perú (iso_code = 'PE')
INSERT INTO "public"."city" ("name", "country_id")
SELECT 'Lima', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'PE'
UNION ALL
SELECT 'Arequipa', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'PE';

-- Venezuela (iso_code = 'VE')
INSERT INTO "public"."city" ("name", "country_id")
SELECT 'Caracas', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'VE'
UNION ALL
SELECT 'Maracaibo', c."id" FROM "public"."countries" c WHERE c."iso_code" = 'VE';
