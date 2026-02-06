CREATE INDEX IF NOT EXISTS "cities_country_lower_name_prefix_idx"
ON "cities" ("country_code", lower("name") text_pattern_ops);
