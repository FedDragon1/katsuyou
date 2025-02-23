import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL) {
    throw Error("Supabase URL is missing");
}

if (!SUPABASE_SERVICE_KEY) {
    throw Error("Supabase Service Key is missing");
}

const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

export default supabaseService