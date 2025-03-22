import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
    const body = await request.json() as SignUpRequest;
    const supabaseService = await createClient()

    if (!supabaseService) {
        return NextResponse.json({
            success: false,
            errorMessage: "No Service"
        })
    }

    const { data, error } = await supabaseService
        .from("user")
        .insert([{
            uuid: body.uuid,
            name: body.username,
            email: body.email,
            platform: "email",
            locale: body.locale
        }])
        .select()

    if (error) {
        return NextResponse.json({
            success: false,
            errorMessage: error.message
        })
    }

    return NextResponse.json({ success: true, data: data[0] })
}