import { NextRequest, NextResponse } from "next/server";
import { updateSession } from '@/lib/supabaseMiddleware'
import { createClient } from "@/lib/supabaseServer";
import { SupabaseClient } from "@supabase/supabase-js";

const SESSION_UPDATE_PATHS = [
    /^\/dashboard(\/.*)?$/,
    /^\/practice(\/.*)?$/
]

/**
 * Test if a path requires sign in
 *
 * @param pathname
 */
function requireSessionUpdate(pathname: string) {
    return SESSION_UPDATE_PATHS.some((re) => re.test(pathname))
}

/**
 * Determine the preferred language of the user,
 * returns the most appropriate language, default to Japanese.
 *
 * If the locale of user can be determined, use it,
 * otherwise use the basic resolve result
 */
async function resolveLocale(request: NextRequest, supabase: SupabaseClient) {
    let userSettingLocale: string | null = null;

    try {
        const { data } = await supabase
            .from("user")
            .select("locale")
            .single()

        userSettingLocale = data?.locale
    } catch (error) {
        console.error("Error fetching user locale: ", error)
    }

    return userSettingLocale ?? basicResolve(request)
}

/**
 * Determine the preferred language based on user's browser environment
 *
 * Priority Sequence:
 * 1. Next-locale cookie
 * 2. Top accept language
 * 3. Japanese fallback
 *
 * @param request
 */
function basicResolve(request: NextRequest) {
    return request.cookies.get("next-locale")?.value ??
        request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ??
        "ja"
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // check protected routes
    const signedInPages = requireSessionUpdate(pathname)
    const supabase = await createClient()
    const { data: { user }, error }
        = await supabase.auth.getUser()

    if (signedInPages && (!user || error)) {
        return NextResponse.redirect(new URL("/login", request.url))
    }
    if (pathname === "/" && user && !error) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    let response = NextResponse.next()
    let locale = request.cookies.get("resolved-locale")?.value

    if (signedInPages) {
        // for signed in pages, refresh supabase session
        response = await updateSession(request)
    } else {
        locale = basicResolve(request)
    }

    // no cached resolved-locale (only if the current page requires sign in the locale might be undefined)
    if (!locale) {
        locale = await resolveLocale(request, supabase)
    }

    // needed for supabase middleware
    const newResponse = NextResponse.next({ request })
    response.cookies.getAll().forEach(({ name, value }) =>
        newResponse.cookies.set(name, value))
    newResponse.headers.set("x-resolved-locale", locale)

    if (signedInPages) {
        newResponse.cookies.set("resolved-locale", locale)
    }

    return newResponse
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)'
    ]
}