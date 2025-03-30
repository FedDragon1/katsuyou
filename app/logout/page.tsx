"use client"

import { FC, useEffect } from "react";
import LoadingPage from "@/components/LoadingPage";
import { createClient } from "@/lib/supabaseClient";
import { clearUserCookie } from "@/app/actions";

const LogoutPage: FC = () => {
    useEffect(() => {
        const supabase = createClient()
        supabase.auth.signOut()
            .then(clearUserCookie)
            .then(() => window.location.href = '/')     // refresh locale, see login/callback
    }, []);

    return <LoadingPage />
}

export default LogoutPage