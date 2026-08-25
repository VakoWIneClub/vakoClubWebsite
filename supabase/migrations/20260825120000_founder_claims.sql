-- Tracks the first N real purchases of "El Mundo de la Copa" so the "Fundador/a" bonus
-- scarcity on the landing (today a manually-checked-against-Stripe number) becomes a live,
-- automatic count instead. One row per paid Stripe checkout session (session_id is unique,
-- so a page reload after payment can never double-count the same purchase).
--
-- Rows are written only from the server (api/verify-session.js) using the service-role key,
-- which bypasses RLS entirely — no policy grants anon/authenticated INSERT or raw SELECT here
-- on purpose, so nobody can spam-inflate the counter (or read buyer emails) by calling the
-- Supabase REST API directly with the public anon key. Public read access is exposed only
-- through the count-only RPC below.
CREATE TABLE IF NOT EXISTS "public"."founder_claims" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "text" NOT NULL,
    "email" "text",
    "guide_id" "text" DEFAULT 'guia-general'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."founder_claims" OWNER TO "postgres";

ALTER TABLE ONLY "public"."founder_claims"
    ADD CONSTRAINT "founder_claims_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."founder_claims"
    ADD CONSTRAINT "founder_claims_session_id_key" UNIQUE ("session_id");

ALTER TABLE "public"."founder_claims" ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON TABLE "public"."founder_claims" TO "service_role";

-- Count-only accessor: lets the landing page show "quedan X cupos" via the public anon key
-- without ever exposing the table itself (no buyer emails, no raw row access for anon/auth).
CREATE OR REPLACE FUNCTION "public"."founder_claims_count"() RETURNS integer
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT count(*)::integer FROM "public"."founder_claims";
$$;

ALTER FUNCTION "public"."founder_claims_count"() OWNER TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."founder_claims_count"() TO "anon";
GRANT EXECUTE ON FUNCTION "public"."founder_claims_count"() TO "authenticated";
GRANT EXECUTE ON FUNCTION "public"."founder_claims_count"() TO "service_role";
