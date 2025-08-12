import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://anqmpchicyejgjqxbhmd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFucW1wY2hpY3llamdqcXhiaG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzYxMTMsImV4cCI6MjA2ODk1MjExM30.OJQAWZ0Qv-8dWdbqsp18AW2dCA6uydcvmtqDkMt0x1I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);