"use client"

import { FC, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const Dashboard: FC = () => {
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getUser().then((u) => {
            if (!u.data.user?.id) {
                router.push("/login")
            }
        }).catch(() => router.push("/login"))
    })

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}

export default Dashboard