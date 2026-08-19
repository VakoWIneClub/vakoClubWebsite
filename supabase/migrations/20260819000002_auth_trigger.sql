-- Attaches the existing public.handle_new_user() function (already created by the initial
-- schema migration) to auth.users so new signups get a profiles row automatically. This lives
-- in the `auth` schema (owned by the table it's attached to), which the public-schema-only dump
-- didn't capture — every other object in `auth` is Supabase's own bootstrap and already exists
-- on any new project, so only this one custom trigger needs to be replicated.
CREATE OR REPLACE TRIGGER "on_auth_user_created" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();
