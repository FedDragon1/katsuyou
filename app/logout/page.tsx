"use client"

import { FC, useEffect } from "react";
import LoadingPage from "@/components/LoadingPage";
import { createClient } from "@/lib/supabaseClient";

const LogoutPage: FC = () => {
    useEffect(() => {
        const supabase = createClient()
        supabase.auth.signOut()
            .then(() => window.location.href = '/')     // refresh locale, see login/callback

    }, []);

    return <LoadingPage />
}

export default LogoutPage