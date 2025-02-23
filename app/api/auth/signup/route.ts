import { NextResponse } from "next/server";
import supabaseService from "@/lib/supabaseService";

export async function POST(request: Request) {
    const body = await request.json() as SignUpRequest;

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
            platform: "email"
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