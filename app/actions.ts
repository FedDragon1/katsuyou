"use server"

import { cookies } from "next/headers";

/**
 * The cookie next-locale is responsible for determining the language
 * to render in general, non-user specific pages (i.e. landing page)
 *
 * This function should be called within components that change
 * the language on general pages only
 *
 * @param locale
 */
export async function setLocaleCookie(locale: string) {
    const cookieStore = await cookies()
    cookieStore.set("next-locale", locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365
    })
}