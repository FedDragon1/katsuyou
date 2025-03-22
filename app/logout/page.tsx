"use client"

import { FC, useEffect } from "react";
import LoadingPage from "@/components/LoadingPage";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const LogoutPage: FC = () => {
    const router = useRouter()
    useEffect(() => {
        const supabase = createClient()
        supabase.auth.signOut()
            .then(() => router.push("/"))

    }, []);

    return <LoadingPage />
}

export default LogoutPage