import { createClient } from '@supabase/supabase-js';

// Overridable via VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (e.g. e2e/playwright/.env for local
// test runs, or CI secrets) so Playwright's authenticated specs can point at a staging project
// instead of production. Falls back to the production project when unset, so normal dev/build
// behavior is unchanged.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://anqmpchicyejgjqxbhmd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFucW1wY2hpY3llamdqcXhiaG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzYxMTMsImV4cCI6MjA2ODk1MjExM30.OJQAWZ0Qv-8dWdbqsp18AW2dCA6uydcvmtqDkMt0x1I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);