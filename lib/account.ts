import supabase from "@/lib/supabaseClient";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function loginWithEmail(router: AppRouterInstance, email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        router.push(`/login?error=auth&message=${error.message}`)
    }

    setSession(router, data.session?.access_token, data.session?.refresh_token)
}

export function setSession(router: AppRouterInstance, accessToken?: string | null, refreshToken?: string | null) {
    if (!accessToken || !refreshToken) {
        router.push("/login?error=no_token")
        return
    }

    supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
    }).then(async ({ error }) => {
        const user = await supabase.auth.getUser();
        console.log(user)

        if (error) {
            router.push(`/login?error=auth&message=${error.message}`)
        } else {
            router.push("/dashboard")
        }
    })
}

export async function verify(router: AppRouterInstance, accessToken?: string | null, refreshToken?: string | null) {
    if (!accessToken || !refreshToken) {
        router.push("/login?error=no_token")
        return
    }

    await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
    })
    const user = await supabase.auth.getUser()

    return await fetch("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify({ uuid: user.data.user?.id }),
        headers: { "Content-Type": "application/json" }
    })
}

export async function test() {
    const user = await supabase.auth.getUser()
    console.log(user)

    return await fetch("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify({ uuid: user.data.user?.id }),
        headers: { "Content-Type": "application/json" }
    })
}

export function loginWithGoogle() {
    supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `https://katsuyou.xyz/login/callback`
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
        return fetch("/api/auth/signup", {
            method: "POST",
            body: JSON.stringify({ username, email, uuid: res.data.user?.id }),
            headers: { "Content-Type": "application/json" }
        });
    }).then(() => router.push("/signup/callback"))
}