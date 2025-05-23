import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const body = await request.json() as UserPostRequest;
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

/**
 * Update a user in the database, removing the locale cookie if specified
 *
 * @param request
 * @constructor
 */
export async function PUT(request: Request) {
    const body = await request.json() as UserPutRequest
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("user")
        .update(body.data)
        .eq("uuid", body.data.uuid)
        .select("*")

    if (body.updateLocale) {
        const cookieState = await cookies()
        cookieState.delete("resolved-locale")
    }

    if (error) {
        const response: ResponseOf<User> = {
            success: false,
            errorMessage: error.message
        }
        return NextResponse.json(response)
    }

    const response: ResponseOf<User> = { success: true, data: data[0] as User }

    if (body.updateLocale && body.data.locale) {
        const cookieState = await cookies()
        cookieState.set("resolved-locale", body.data.locale)
    }

    return NextResponse.json(response)
}