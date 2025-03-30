"use client"

import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setSession } from "@/lib/account";
import LoadingPage from "@/components/LoadingPage";
import { createClient } from "@/lib/supabaseClient";
import { User } from "@supabase/auth-js";

const Callback: FC = () => {
    const router = useRouter()

    function signUpAndRedirect(user: User, locale: SupportedLocale) {
        const request: UserPostRequest = {
            data: {
                uuid: user.id,
                name: user.user_metadata.name as string,
                email: user.email!,
                platform: (user.app_metadata.provider as "github" | "google") ?? "email",
                locale
            },
            checkExistence: true
        }
        fetch("/api/user", {
            method: "POST",
            body: JSON.stringify(request),
            headers: { "Content-Type": "application/json" }
        }).then((user) => {
            return user.json()
        }).then(() => {
            // use router.push will not trigger i18n request
            // sometimes the nav bar stays in the language of landing page
            // force reload to refresh locale
            window.location.href = "/dashboard"
        })
    }

    useEffect(() => {
        const supabase = createClient();
        const locale = document.documentElement.lang as SupportedLocale

        supabase.auth.getUser().then((userResp) => {
            if (!userResp.error) {
                return signUpAndRedirect(userResp.data.user, locale)
            }

            const hashParams = new URLSearchParams(window.location.hash.substring(1))
            const accessToken = hashParams.get("access_token")
            const refreshToken = hashParams.get("refresh_token")

            setSession(router, accessToken, refreshToken)?.then(({ error }) => {
                if (error) {
                    router.push(`/login?error=auth&message=${error.message}`)
                    return
                }

                return supabase.auth.getUser()
            }).then((userResp) => {
                if (!userResp || !userResp.data.user) {
                    return
                }

                return signUpAndRedirect(userResp.data.user, locale)
            })
        })


    }, [router]);
    
    return (
        <LoadingPage />
    )
}

export default Callback