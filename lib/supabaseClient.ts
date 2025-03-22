import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL) {
        throw Error("Supabase URL is missing");
    }

    if (!SUPABASE_ANON_KEY) {
        throw Error("Supabase ANON_KEY is missing");
    }

    return createBrowserClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    )
}