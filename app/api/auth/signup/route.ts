import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
    const body = await request.json() as SignupRequest;
    const supabase = await createClient()

    if (body.checkExistence) {
        const { data, error } = await supabase
            .from("user")
            .select("uuid")
            .eq("uuid", body.data.uuid)

        if (error) {
            const response: ResponseOf<User> = {
                success: false,
                errorMessage: error.message
            }
            return NextResponse.json(response)
        }

        if (data?.length) {
            const response: ResponseOf<User> = { success: true, data: data[0] as User }
            return NextResponse.json(response)
        }
    }

    const { data, error } = await supabase
        .from("user")
        .insert([body.data])
        .select("*")

    if (error) {
        const response: ResponseOf<User> = {
            success: false,
            errorMessage: error.message
        }
        return NextResponse.json(response)
    }

    const response: ResponseOf<User> = { success: true, data: data[0] as User }
    return NextResponse.json(response)
}