"use client"

import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setSession } from "@/lib/account";
import LoadingPage from "@/components/LoadingPage";
import { createClient } from "@/lib/supabaseClient";

const Callback: FC = () => {
    const router = useRouter()

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")

        setSession(router, accessToken, refreshToken)?.then(({ error }) => {
            if (error) {
                router.push(`/login?error=auth&message=${error.message}`)
                return
            }

            const supabase = createClient();
            return supabase.auth.getUser()
        }).then((userResp) => {
            if (!userResp) {
                return
            }

            const id = userResp.data.user?.id
            console.log(id)
            // TODO: sign up if doesn't exist

            router.push("/dashboard")
        })
    }, [router]);
    
    return (
        <LoadingPage />
    )
}

export default Callback