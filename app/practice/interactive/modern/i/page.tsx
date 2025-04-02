// noinspection NonAsciiCharacters,JSNonASCIINames

"use client"

import { FC } from "react";
import { useTranslations } from "next-intl";
import { getAdjectiveType, getRandomAdjective } from "@/lib/dictionary_v2";
import KatsuyouPractice from "@/components/KatsuyouPractice";
import { getModernAdjectiveTokenDesc } from "@/lib/tokens";

const KatsuyouModernVerb: FC = () => {
    const t = useTranslations("Practice")

    const settings: SettingDesc = {
        type: "modern_i",
        predicate: {
            name: t("settings.allowedBaseTokens"),
            poller: (allowed) => getRandomAdjective((v) => allowed[v.type]),
            describeType: (term: KatsuyouAdjective) => getAdjectiveType(term),
            children: [
                { key: "i", display: "イ形容詞「甘い・赤い」" },
            ]
        },
        token: getModernAdjectiveTokenDesc(t)
    }

    return (
        <KatsuyouPractice settings={settings}/>
    )
}

export default KatsuyouModernVerb