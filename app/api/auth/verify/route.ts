import { NextResponse } from "next/server";
import supabaseService from "@/lib/supabaseService";

export async function POST(request: Request) {
    const body = await request.json() as VerifyRequest;

    const { data, error } = await supabaseService
        .from("user")
        .update({ validated: true })
        .eq("uuid", body.uuid)
        .select()

    if (error) {
        return NextResponse.json({
            success: false,
            errorMessage: error.message
        })
    }

    return NextResponse.json({ success: true, data: data[0] })
}