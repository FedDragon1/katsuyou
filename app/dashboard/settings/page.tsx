"use client"

import { FC } from "react";
import TabFrame from "@/components/TabFrame";
import LanguageButton from "@/components/LanguageButton";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabaseClient";

const SettingsPage: FC = () => {
    const t = useTranslations("Settings")

    const changeLanguage = (locale: SupportedLocale) => {
        const supabase = createClient()
        supabase.auth.getUser().then((ret) => {
            if (ret.error) {
                throw ret.error
            }

            const request: UserPutRequest = {
                data: {
                    uuid: ret.data.user.id,
                    locale
                },
                updateLocale: true
            }
            return fetch("/api/user", {
                method: "PUT",
                body: JSON.stringify(request)
            })
        }).then((res) => {
            return res.json()
        }).then((res: ResponseOf<User>) => {
            if (!res.success) {
                throw new Error(res.errorMessage)
            }

            window.location.reload()
        })
    }

    return (
        <TabFrame title={t("title")}>
            <div className={"w-full px-10 sm:px-20 py-20 relative flex gap-12"}>
                <aside className={"w-[300px] hidden lg:block"}>
                    <span className={"emphasis text-2xl font-semibold before:-bottom-1"}>{t("language.aside")}</span>
                </aside>
                <main className={"flex-grow flex flex-col lg:border-l lg:pl-12 gap-4 min-h-[20vh]"}>
                    <h2 className={"text-2xl font-semibold"}>{t("language.title")}</h2>
                    <div className={"flex gap-8"}>
                        <LanguageButton onClick={() => changeLanguage("en")}
                                        display={"English"}/>
                        <LanguageButton onClick={() => changeLanguage("ja")}
                                        display={"日本語"}/>
                        <LanguageButton onClick={() => changeLanguage("zh")}
                                        display={"简体中文"}/>
                    </div>
                </main>
            </div>
        </TabFrame>
    )
}

export default SettingsPage