import { createClient } from "@/lib/supabaseClient";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const supabase = createClient()

export async function loginWithEmail(router: AppRouterInstance, email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        router.push(`/login?error=auth&message=${error.message}`)
    }

    setSession(router, data.session?.access_token, data.session?.refresh_token)?.then(({ error }) => {
        if (error) {
            router.push(`/login?error=auth&message=${error.message}`)
        } else {
            router.push("/dashboard")
        }
    })
}

export function setSession(router: AppRouterInstance, accessToken?: string | null, refreshToken?: string | null) {
    if (!accessToken || !refreshToken) {
        router.push("/login?error=no_token")
        return
    }

    return supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
    })
}

export async function verify(router: AppRouterInstance, accessToken?: string | null, refreshToken?: string | null) {
    if (!accessToken || !refreshToken) {
        router.push("/login?error=no_token")
        return
    }

    return await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
    })
}

export function loginWithGoogle() {
    supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            // redirectTo: `https://katsuyou.xyz/login/callback`
            redirectTo: `http://localhost:3000/login/callback`
        }
    }).then()
}

export function loginWithGithub() {
    supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
            redirectTo: `https://katsuyou.xyz/login/callback`
        }
    }).then()
}

export function signUp(username: string, email: string, password: string, router: AppRouterInstance) {
    supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            emailRedirectTo: `https://katsuyou.xyz/signup/callback/verify`
        }
    }).then(async (res) => {
        const req: UserPostRequest = {
            data: {
                name: username,
                email,
                uuid: res.data.user!.id,
                platform: "email",
                locale: "ja",
            },
            checkExistence: false
        }
        return fetch("/api/user", {
            method: "POST",
            body: JSON.stringify(req),
            headers: { "Content-Type": "application/json" }
        });
    }).then(() => router.push("/signup/callback"))
}