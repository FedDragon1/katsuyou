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
        const response: ResponseOf<PracticeHistory> = {
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

export async function GET(request: Request) {
    const body = await request.json() as HistoryGetRequest
    const supabase = await createClient()

    let query = supabase.from("history")
        .select("*")

    if (body.uuids) {
        query = query.in("uuid", body.uuids)
    }

    const { data, error } = await query

    if (error) {
        const response: ResponseOf<PracticeHistory[]> = {
            success: false,
            errorMessage: error.message
        }
        return NextResponse.json(response)
    }

    const response: ResponseOf<PracticeHistory[]> = {
        success: true,
        data: data as PracticeHistory[]
    }

    return NextResponse.json(response)
}