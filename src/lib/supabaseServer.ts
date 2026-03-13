// ─────────────────────────────────────────────────────────────────────────────
// Supabase Server Client
// Server-only Supabase client initialized with the secret SERVICE_ROLE key.
// IMPORTANT: Do not import this file in client components — use the anon key
// client for any browser-side queries.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_API_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
