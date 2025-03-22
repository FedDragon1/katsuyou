import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

type SupportedLocales = "en" | "zh" | "ja"

const SUPPORTED_LOCALES: SupportedLocales[] = ["en", "ja", "zh"]

/**
 * Determine the preferred language of the user,
 * returns the most appropriate language, default to Japanese.
 *
 * Priority sequence:
 * 1. Cookie: next-locale
 * 2. Header: middleware sets "x-user-locale" for online users
 * 3. Header: first of "accept-language" header
 * 4. Fallback: ja
 */
export default getRequestConfig(async () => {
    // Cookie: next-locale
    const cookieStore = await cookies()
    const forcedLocale = sanitizeLocale(cookieStore.get("next-locale")?.value)
    if (forcedLocale) {
        return await getTranslation(forcedLocale)
    }

    // Header: x-user-locale
    const headerStore = await headers()
    const userLocale = sanitizeLocale(headerStore.get("x-user-locale"))
    if (userLocale) {
        return await getTranslation(userLocale)
    }

    // Header: accepted-language
    const browserLocale = sanitizeLocale(headerStore.get("accept-language")?.split(",")[0])

    // Fallback: ja
    return getTranslation(browserLocale || "ja")
})

async function getTranslation(locale: string) {
    const messages = (await import(`./locales/${locale}.json`)).default
    return {
        locale,
        messages
    }
}

function sanitizeLocale(rawLocale?: string | null): SupportedLocales | null {
    if (!rawLocale) {
        return null
    }

    const baseLocale = rawLocale.toLowerCase().split(/[-_/]/)[0].trim()

    if (baseLocale && SUPPORTED_LOCALES.includes(baseLocale as SupportedLocales)) {
        return baseLocale as SupportedLocales
    }

    return null
}

