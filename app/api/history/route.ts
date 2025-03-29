import { createClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json() as HistoryPostRequest;
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("history")
        .insert([body.data])
        .select("*")

    if (error) {
        const response: ResponseOf<User> = {
            success: false,
            errorMessage: error.message
        }
        return NextResponse.json(response)
    }

    const response: ResponseOf<PracticeHistory> = {
        success: true,
        data: data[0] as PracticeHistory
    }

    return NextResponse.json(response)
}