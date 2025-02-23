"use client"

import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verify } from "@/lib/account";

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
        <div className={"h-screen w-screen flex items-center justify-center gap-4"}>
            <div className={"size-14 relative flex justify-center items-center"}>
                <div className={"size-14 bg-[conic-gradient(var(--foreground),var(--background))] absolute rounded-full animate-spin"}></div>
                <div className={"size-12 bg-background absolute rounded-full"}></div>
            </div>
            <h1 className={"text-6xl"}>カツヨウ</h1>
        </div>
    )
}

export default Callback