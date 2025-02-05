import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
    const locale = "ja"
    const messages = (await import(`./locales/${locale}.json`)).default

    return {
        locale,
        messages
    }
})