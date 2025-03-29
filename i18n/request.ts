import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

const SUPPORTED_LOCALES: SupportedLocale[] = ["en", "ja", "zh"]


export default getRequestConfig(async () => {
    const headerStore = await headers()
    const browserLocale = sanitizeLocale(headerStore.get("x-resolved-locale"))

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

function sanitizeLocale(rawLocale?: string | null): SupportedLocale | null {
    if (!rawLocale) {
        return null
    }

    const baseLocale = rawLocale.toLowerCase().split(/[-_/]/)[0].trim()

    if (baseLocale && SUPPORTED_LOCALES.includes(baseLocale as SupportedLocale)) {
        return baseLocale as SupportedLocale
    }

    return null
}

