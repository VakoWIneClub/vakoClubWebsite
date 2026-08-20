-- slugify() dropped accented letters and ñ instead of transliterating them
-- (e.g. "así está" -> "as-est", "española" -> "espaola"), producing broken-looking slugs.
-- unaccent() transliterates to plain ASCII first, so accents/ñ degrade to readable letters.

CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."slugify"("text") RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $_$
  SELECT trim(both '-' from regexp_replace(lower(regexp_replace(extensions.unaccent($1), '[^a-zA-Z0-9\s-]', '', 'g')), '\s+', '-', 'g'));
$_$;

ALTER FUNCTION "public"."slugify"("text") OWNER TO "postgres";

GRANT ALL ON FUNCTION "public"."slugify"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."slugify"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."slugify"("text") TO "service_role";

-- Backfill the two articles published today with slugs mangled by the old bug.
UPDATE "public"."articles"
SET "slug" = "public"."slugify"("title")
WHERE "slug" IN (
  'la-vendimia-2026-llega-antes-que-nunca-as-est-cambiando-el-clima-el-calendario-del-vino',
  'la-bodega-que-le-gan-a-la-siberia-espaola-vino-a-1000-metros-de-altitud-en-guadalajara'
);
