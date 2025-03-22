"use client"

import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verify } from "@/lib/account";
import LoadingPage from "@/components/LoadingPage";

const Callback: FC = () => {
    const router = useRouter()

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")

        verify(router, accessToken, refreshToken).then(() => {
            router.push("/")
        })
    }, [router]);

    return (
        <LoadingPage />
    )
}

export default Callback