import { NextRequest, NextResponse } from "next/server";
import { updateSession } from '@/lib/supabaseMiddleware'
import { createClient } from "@/lib/supabaseServer";
import { SupabaseClient } from "@supabase/supabase-js";
import { User } from "@supabase/auth-js";

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

/**
 * Resolve the basic user appearance, with fallbacks
 *
 * @param user
 * @param supabase
 */
async function resolveUser(user: User, supabase: SupabaseClient) {
    // to resolve username and pfp, first see they exist in user_metadata
    // if no, check the database
    // if still no, use the fallback

    const { data, error } = await supabase
        .from("user")
        .select("name, email, avatar")
        .single()

    if (error) {
        console.error(error)
    }

    return {
        name: data?.name ?? "カツヨウ User",
        avatar: data?.avatar ?? user.user_metadata.avatar_url ?? "/default_pfp.jpg",
        email: data?.email ?? user.email ?? "xxxxxx@xxx.xxx"
    }
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

        const userCookie = request.cookies.get("resolved-user")?.value
        if (!userCookie) {
            const userInfo = await resolveUser(user!, supabase)
            newResponse.cookies.set("resolved-user", JSON.stringify(userInfo))
        }
    }

    return newResponse
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)'
    ]
}