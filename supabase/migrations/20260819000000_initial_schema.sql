

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."add_article_points"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    UPDATE public.profiles
    SET points = points + 100
    WHERE id = NEW.author_id;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."add_article_points"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_forum_points"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    UPDATE public.profiles
    SET points = points + 10
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."add_forum_points"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."email_exists"("email_to_check" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM auth.users WHERE email = email_to_check);
END;
$$;


ALTER FUNCTION "public"."email_exists"("email_to_check" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_profiles_with_follow_status"("current_user_id" "uuid" DEFAULT NULL::"uuid") RETURNS TABLE("id" "uuid", "name" "text", "bio" "text", "interest_topic" "text", "avatar_url" "text", "updated_at" timestamp with time zone, "profile" "text", "role" "text", "points" integer, "level" "text", "followers_count" bigint, "is_followed_by_current_user" boolean)
    LANGUAGE "sql"
    AS $$
  SELECT
    p.id,
    p.name,
    p.bio,
    p.interest_topic,
    p.avatar_url,
    p.updated_at,
    p.profile,
    p.role,
    p.points,
    p.level,
    (SELECT count(*) FROM public.followers WHERE following_id = p.id) as followers_count,
    CASE
      WHEN current_user_id IS NOT NULL THEN EXISTS (
        SELECT 1 FROM public.followers WHERE follower_id = current_user_id AND following_id = p.id
      )
      ELSE false
    END as is_followed_by_current_user
  FROM
    public.profiles p
  ORDER BY
    p.updated_at DESC;
$$;


ALTER FUNCTION "public"."get_profiles_with_follow_status"("current_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_profiles_with_follow_status"("current_user_id" "uuid" DEFAULT NULL::"uuid", "search_term" "text" DEFAULT ''::"text") RETURNS TABLE("id" "uuid", "name" "text", "bio" "text", "interest_topic" "text", "avatar_url" "text", "updated_at" timestamp with time zone, "profile" "text", "role" "text", "points" integer, "level" "text", "followers_count" bigint, "is_followed_by_current_user" boolean)
    LANGUAGE "sql"
    AS $$
  SELECT
    p.id,
    p.name,
    p.bio,
    p.interest_topic,
    p.avatar_url,
    p.updated_at,
    p.profile,
    p.role,
    p.points,
    p.level,
    (SELECT count(*) FROM public.followers WHERE following_id = p.id) as followers_count,
    CASE
      WHEN current_user_id IS NOT NULL THEN EXISTS (
        SELECT 1 FROM public.followers WHERE follower_id = current_user_id AND following_id = p.id
      )
      ELSE false
    END as is_followed_by_current_user
  FROM
    public.profiles p
  WHERE
    p.name ILIKE '%' || search_term || '%'
  ORDER BY
    CASE WHEN p.role = 'superadmin' THEN 0 ELSE 1 END,
    p.updated_at DESC;
$$;


ALTER FUNCTION "public"."get_profiles_with_follow_status"("current_user_id" "uuid", "search_term" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_id"() RETURNS "uuid"
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
  RETURN auth.uid();
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."get_user_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_article_update"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_article_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url, profile, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'profile',
    'user' -- Default role
  );
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_winery_update"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_winery_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_article_slug"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.slug := slugify(NEW.title);
  -- Check for uniqueness and append a random suffix if a conflict exists
  WHILE EXISTS (SELECT 1 FROM public.articles WHERE slug = NEW.slug AND id != NEW.id) LOOP
    NEW.slug := NEW.slug || '-' || substr(md5(random()::text), 1, 6);
  END LOOP;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_article_slug"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_event_slug"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.slug := slugify(NEW.title);
  -- Check for uniqueness and append a random suffix if a conflict exists
  WHILE EXISTS (SELECT 1 FROM public.events WHERE slug = NEW.slug AND id != NEW.id) LOOP
    NEW.slug := NEW.slug || '-' || substr(md5(random()::text), 1, 6);
  END LOOP;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_event_slug"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_winery_slug"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.slug := slugify(NEW.title);
  -- Check for uniqueness and append a random suffix if a conflict exists
  WHILE EXISTS (SELECT 1 FROM public.wineries WHERE slug = NEW.slug AND id != NEW.id) LOOP
    NEW.slug := NEW.slug || '-' || substr(md5(random()::text), 1, 6);
  END LOOP;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_winery_slug"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."slugify"("text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $_$
  SELECT trim(both '-' from regexp_replace(lower(regexp_replace($1, '[^a-zA-Z0-9\s-]', '', 'g')), '\s+', '-', 'g'));
$_$;


ALTER FUNCTION "public"."slugify"("text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_level"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.role = 'superadmin' THEN
    NEW.level := 'Experto';
  ELSIF NEW.points >= 300 THEN
    NEW.level := 'Experto';
  ELSIF NEW.points >= 150 THEN
    NEW.level := 'Aficionado';
  ELSE
    NEW.level := 'Novato';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_user_level"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."article_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "content" "text" NOT NULL,
    "article_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."article_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."articles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "image_url" "text",
    "author_id" "uuid" NOT NULL,
    "slug" "text" NOT NULL,
    "tag1" "text",
    "tag2" "text"
);


ALTER TABLE "public"."articles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "image_url" "text",
    "event_date" timestamp with time zone NOT NULL,
    "location" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "country" "text",
    "city" "text"
);


ALTER TABLE "public"."events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."favorite_wineries" (
    "user_id" "uuid" NOT NULL,
    "winery_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."favorite_wineries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."followers" (
    "id" bigint NOT NULL,
    "follower_id" "uuid" NOT NULL,
    "following_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."followers" OWNER TO "postgres";


ALTER TABLE "public"."followers" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."followers_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "name" "text",
    "bio" "text",
    "interest_topic" "text",
    "avatar_url" "text",
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "profile" "text",
    "role" "text" DEFAULT 'user'::"text" NOT NULL,
    "points" integer DEFAULT 0 NOT NULL,
    "level" "text" DEFAULT 'Novato'::"text" NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."replies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "content" "text" NOT NULL,
    "thread_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."replies" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."replies_with_author_profile" WITH ("security_invoker"='true') AS
 SELECT "r"."id",
    "r"."created_at",
    "r"."content",
    "r"."thread_id",
    "r"."user_id",
    "jsonb_build_object"('name', "p"."name", 'avatar_url', "p"."avatar_url") AS "author"
   FROM ("public"."replies" "r"
     LEFT JOIN "public"."profiles" "p" ON (("r"."user_id" = "p"."id")));


ALTER VIEW "public"."replies_with_author_profile" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."threads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "category" "text",
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."threads" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."threads_with_author_profile" WITH ("security_invoker"='true') AS
 SELECT "t"."id",
    "t"."created_at",
    "t"."title",
    "t"."content",
    "t"."category",
    "t"."user_id",
    "jsonb_build_object"('name', "p"."name", 'avatar_url', "p"."avatar_url") AS "author"
   FROM ("public"."threads" "t"
     LEFT JOIN "public"."profiles" "p" ON (("t"."user_id" = "p"."id")));


ALTER VIEW "public"."threads_with_author_profile" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wineries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "image_urls" "jsonb",
    "author_id" "uuid" NOT NULL,
    "slug" "text" NOT NULL,
    "address" "text",
    "latitude" double precision,
    "longitude" double precision,
    "country" "text" NOT NULL,
    "city" "text" NOT NULL,
    "website_url" "text"
);


ALTER TABLE "public"."wineries" OWNER TO "postgres";


ALTER TABLE ONLY "public"."article_comments"
    ADD CONSTRAINT "article_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."articles"
    ADD CONSTRAINT "articles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."articles"
    ADD CONSTRAINT "articles_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."favorite_wineries"
    ADD CONSTRAINT "favorite_wineries_pkey" PRIMARY KEY ("user_id", "winery_id");



ALTER TABLE ONLY "public"."followers"
    ADD CONSTRAINT "followers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."replies"
    ADD CONSTRAINT "replies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."threads"
    ADD CONSTRAINT "threads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."followers"
    ADD CONSTRAINT "unique_follow" UNIQUE ("follower_id", "following_id");



ALTER TABLE ONLY "public"."wineries"
    ADD CONSTRAINT "wineries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wineries"
    ADD CONSTRAINT "wineries_slug_key" UNIQUE ("slug");



CREATE OR REPLACE TRIGGER "on_article_insert_or_update" BEFORE INSERT OR UPDATE OF "title" ON "public"."articles" FOR EACH ROW EXECUTE FUNCTION "public"."set_article_slug"();



CREATE OR REPLACE TRIGGER "on_article_update" BEFORE UPDATE ON "public"."articles" FOR EACH ROW EXECUTE FUNCTION "public"."handle_article_update"();



CREATE OR REPLACE TRIGGER "on_event_insert_or_update" BEFORE INSERT OR UPDATE ON "public"."events" FOR EACH ROW EXECUTE FUNCTION "public"."set_event_slug"();



CREATE OR REPLACE TRIGGER "on_new_article" AFTER INSERT ON "public"."articles" FOR EACH ROW EXECUTE FUNCTION "public"."add_article_points"();



CREATE OR REPLACE TRIGGER "on_new_reply" AFTER INSERT ON "public"."replies" FOR EACH ROW EXECUTE FUNCTION "public"."add_forum_points"();



CREATE OR REPLACE TRIGGER "on_new_thread" AFTER INSERT ON "public"."threads" FOR EACH ROW EXECUTE FUNCTION "public"."add_forum_points"();



CREATE OR REPLACE TRIGGER "on_profile_points_update" BEFORE UPDATE OF "points" ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_user_level"();



CREATE OR REPLACE TRIGGER "on_winery_insert_or_update" BEFORE INSERT OR UPDATE ON "public"."wineries" FOR EACH ROW EXECUTE FUNCTION "public"."set_winery_slug"();



CREATE OR REPLACE TRIGGER "on_winery_update" BEFORE UPDATE ON "public"."wineries" FOR EACH ROW EXECUTE FUNCTION "public"."handle_winery_update"();



ALTER TABLE ONLY "public"."article_comments"
    ADD CONSTRAINT "article_comments_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."article_comments"
    ADD CONSTRAINT "article_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."articles"
    ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."favorite_wineries"
    ADD CONSTRAINT "favorite_wineries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."favorite_wineries"
    ADD CONSTRAINT "favorite_wineries_winery_id_fkey" FOREIGN KEY ("winery_id") REFERENCES "public"."wineries"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."followers"
    ADD CONSTRAINT "followers_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."followers"
    ADD CONSTRAINT "followers_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."replies"
    ADD CONSTRAINT "replies_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."replies"
    ADD CONSTRAINT "replies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."threads"
    ADD CONSTRAINT "threads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wineries"
    ADD CONSTRAINT "wineries_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id");



CREATE POLICY "Admins can delete events" ON "public"."events" FOR DELETE USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text"));



CREATE POLICY "Admins can delete their own articles" ON "public"."articles" FOR DELETE USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text"));



CREATE POLICY "Admins can delete wineries" ON "public"."wineries" FOR DELETE USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text"));



CREATE POLICY "Admins can insert articles" ON "public"."articles" FOR INSERT WITH CHECK ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text"));



CREATE POLICY "Admins can insert events" ON "public"."events" FOR INSERT WITH CHECK ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text"));



CREATE POLICY "Admins can insert wineries" ON "public"."wineries" FOR INSERT WITH CHECK ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text"));



CREATE POLICY "Admins can update events" ON "public"."events" FOR UPDATE USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text")) WITH CHECK ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text"));



CREATE POLICY "Admins can update their own articles" ON "public"."articles" FOR UPDATE USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text"));



CREATE POLICY "Admins can update wineries" ON "public"."wineries" FOR UPDATE USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text"));



CREATE POLICY "Allow authenticated users to insert replies" ON "public"."replies" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow authenticated users to insert threads" ON "public"."threads" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow public read access to replies" ON "public"."replies" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to threads" ON "public"."threads" FOR SELECT USING (true);



CREATE POLICY "Allow users to delete their own replies" ON "public"."replies" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow users to delete their own threads" ON "public"."threads" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow users to update their own replies" ON "public"."replies" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow users to update their own threads" ON "public"."threads" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can insert comments" ON "public"."article_comments" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Public can read articles" ON "public"."articles" FOR SELECT USING (true);



CREATE POLICY "Public can read comments" ON "public"."article_comments" FOR SELECT USING (true);



CREATE POLICY "Public can read events" ON "public"."events" FOR SELECT USING (true);



CREATE POLICY "Public can read wineries" ON "public"."wineries" FOR SELECT USING (true);



CREATE POLICY "Public can view followers" ON "public"."followers" FOR SELECT USING (true);



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Users can delete their own comments" ON "public"."article_comments" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own favorites" ON "public"."favorite_wineries" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can follow other users" ON "public"."followers" FOR INSERT WITH CHECK (("auth"."uid"() = "follower_id"));



CREATE POLICY "Users can insert their own favorites" ON "public"."favorite_wineries" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK (("public"."get_user_id"() = "id"));



CREATE POLICY "Users can unfollow users" ON "public"."followers" FOR DELETE USING (("auth"."uid"() = "follower_id"));



CREATE POLICY "Users can update their own profile." ON "public"."profiles" FOR UPDATE USING (("public"."get_user_id"() = "id")) WITH CHECK (("public"."get_user_id"() = "id"));



CREATE POLICY "Users can view their own favorites" ON "public"."favorite_wineries" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."article_comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."articles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."favorite_wineries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."followers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."replies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."threads" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wineries" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."add_article_points"() TO "anon";
GRANT ALL ON FUNCTION "public"."add_article_points"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_article_points"() TO "service_role";



GRANT ALL ON FUNCTION "public"."add_forum_points"() TO "anon";
GRANT ALL ON FUNCTION "public"."add_forum_points"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_forum_points"() TO "service_role";



GRANT ALL ON FUNCTION "public"."email_exists"("email_to_check" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."email_exists"("email_to_check" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."email_exists"("email_to_check" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_profiles_with_follow_status"("current_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_profiles_with_follow_status"("current_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_profiles_with_follow_status"("current_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_profiles_with_follow_status"("current_user_id" "uuid", "search_term" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_profiles_with_follow_status"("current_user_id" "uuid", "search_term" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_profiles_with_follow_status"("current_user_id" "uuid", "search_term" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_article_update"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_article_update"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_article_update"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_winery_update"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_winery_update"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_winery_update"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_article_slug"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_article_slug"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_article_slug"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_event_slug"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_event_slug"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_event_slug"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_winery_slug"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_winery_slug"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_winery_slug"() TO "service_role";



GRANT ALL ON FUNCTION "public"."slugify"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."slugify"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."slugify"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_level"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_level"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_level"() TO "service_role";



GRANT ALL ON TABLE "public"."article_comments" TO "anon";
GRANT ALL ON TABLE "public"."article_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."article_comments" TO "service_role";



GRANT ALL ON TABLE "public"."articles" TO "anon";
GRANT ALL ON TABLE "public"."articles" TO "authenticated";
GRANT ALL ON TABLE "public"."articles" TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON TABLE "public"."favorite_wineries" TO "anon";
GRANT ALL ON TABLE "public"."favorite_wineries" TO "authenticated";
GRANT ALL ON TABLE "public"."favorite_wineries" TO "service_role";



GRANT ALL ON TABLE "public"."followers" TO "anon";
GRANT ALL ON TABLE "public"."followers" TO "authenticated";
GRANT ALL ON TABLE "public"."followers" TO "service_role";



GRANT ALL ON SEQUENCE "public"."followers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."followers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."followers_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."replies" TO "anon";
GRANT ALL ON TABLE "public"."replies" TO "authenticated";
GRANT ALL ON TABLE "public"."replies" TO "service_role";



GRANT ALL ON TABLE "public"."replies_with_author_profile" TO "anon";
GRANT ALL ON TABLE "public"."replies_with_author_profile" TO "authenticated";
GRANT ALL ON TABLE "public"."replies_with_author_profile" TO "service_role";



GRANT ALL ON TABLE "public"."threads" TO "anon";
GRANT ALL ON TABLE "public"."threads" TO "authenticated";
GRANT ALL ON TABLE "public"."threads" TO "service_role";



GRANT ALL ON TABLE "public"."threads_with_author_profile" TO "anon";
GRANT ALL ON TABLE "public"."threads_with_author_profile" TO "authenticated";
GRANT ALL ON TABLE "public"."threads_with_author_profile" TO "service_role";



GRANT ALL ON TABLE "public"."wineries" TO "anon";
GRANT ALL ON TABLE "public"."wineries" TO "authenticated";
GRANT ALL ON TABLE "public"."wineries" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






