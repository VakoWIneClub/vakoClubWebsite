INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('avatars', 'avatars', NULL, '2025-08-01 21:14:17.336882+00', '2025-08-01 21:14:17.336882+00', true, false, 5242880, '{image/jpeg,image/png,image/gif}', NULL, 'STANDARD'),
	('article-images', 'article-images', NULL, '2025-08-21 16:03:40.69665+00', '2025-08-21 16:03:40.69665+00', true, false, NULL, NULL, NULL, 'STANDARD'),
	('winery-images', 'winery-images', NULL, '2025-09-05 12:49:51.475334+00', '2025-09-05 12:49:51.475334+00', true, false, 5242880, '{image/jpeg,image/png,image/gif,image/webp}', NULL, 'STANDARD');



CREATE POLICY "Admin can delete winery images" ON "storage"."objects" FOR DELETE USING ((("bucket_id" = 'winery-images'::"text") AND (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text")));

CREATE POLICY "Admin can update winery images" ON "storage"."objects" FOR UPDATE WITH CHECK ((("bucket_id" = 'winery-images'::"text") AND (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text")));

CREATE POLICY "Admin can upload winery images" ON "storage"."objects" FOR INSERT WITH CHECK ((("bucket_id" = 'winery-images'::"text") AND (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text")));

CREATE POLICY "Allow admin to delete article images" ON "storage"."objects" FOR DELETE USING ((("bucket_id" = 'article-images'::"text") AND (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text")));

CREATE POLICY "Allow admin to delete event images" ON "storage"."objects" FOR DELETE USING ((("bucket_id" = 'article-images'::"text") AND (("storage"."foldername"("name"))[1] = 'events'::"text") AND (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text")));

CREATE POLICY "Allow admin to update article images" ON "storage"."objects" FOR UPDATE USING ((("bucket_id" = 'article-images'::"text") AND (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text"))) WITH CHECK ((("bucket_id" = 'article-images'::"text") AND (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text")));

CREATE POLICY "Allow admin to update event images" ON "storage"."objects" FOR UPDATE USING ((("bucket_id" = 'article-images'::"text") AND (("storage"."foldername"("name"))[1] = 'events'::"text") AND (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text")));

CREATE POLICY "Allow admin to upload article images" ON "storage"."objects" FOR INSERT WITH CHECK ((("bucket_id" = 'article-images'::"text") AND (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text")));

CREATE POLICY "Allow admin to upload event images" ON "storage"."objects" FOR INSERT WITH CHECK ((("bucket_id" = 'article-images'::"text") AND (("storage"."foldername"("name"))[1] = 'events'::"text") AND (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text")));

CREATE POLICY "Authenticated users can delete their own avatar." ON "storage"."objects" FOR DELETE TO "authenticated" USING ((("auth"."uid"() = "owner") AND ("bucket_id" = 'avatars'::"text")));

CREATE POLICY "Authenticated users can update their own avatar." ON "storage"."objects" FOR UPDATE TO "authenticated" USING ((("auth"."uid"() = "owner") AND ("bucket_id" = 'avatars'::"text")));

CREATE POLICY "Authenticated users can upload an avatar." ON "storage"."objects" FOR INSERT TO "authenticated" WITH CHECK ((("bucket_id" = 'avatars'::"text") AND ("auth"."uid"() = "owner") AND ("storage"."extension"("name") = ANY (ARRAY['png'::"text", 'jpg'::"text", 'jpeg'::"text", 'gif'::"text"]))));

CREATE POLICY "Avatar images are publicly accessible." ON "storage"."objects" FOR SELECT USING (("bucket_id" = 'avatars'::"text"));

CREATE POLICY "Event images are publicly accessible." ON "storage"."objects" FOR SELECT USING ((("bucket_id" = 'article-images'::"text") AND (("storage"."foldername"("name"))[1] = 'events'::"text")));

CREATE POLICY "Public can view article images" ON "storage"."objects" FOR SELECT USING (("bucket_id" = 'article-images'::"text"));

CREATE POLICY "Winery images are publicly accessible." ON "storage"."objects" FOR SELECT USING (("bucket_id" = 'winery-images'::"text"));

