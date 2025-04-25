// noinspection NonAsciiCharacters,JSNonASCIINames

"use client"

import { FC } from "react";
import { useTranslations } from "next-intl";
import { getRandomVerb, getVerbKatsuyouType } from "@/lib/dictionary_v2";
import KatsuyouPractice from "@/components/KatsuyouPractice";
import { getModernVerbTokenDesc } from "@/lib/tokens";

const KatsuyouModernVerb: FC = () => {
    const t = useTranslations("Practice")

    const settings: SettingDesc = {
        type: "modern_verb",
        subtitle: t(`activity.modern_verb`),
        predicate: {
            name: t("settings.allowedVerbs"),
            poller: (allowed) => getRandomVerb((v) => v.modern && allowed[v.type]),
            describeType: (term: KatsuyouVerb) => getVerbKatsuyouType(term.row, term.type),
            children: [
                { key: "pentagrade", display: "五段活用「洗う・書く」" },
                { key: "monograde", display: "一段活用「寝る・起きる」" },
                { key: "sagyou", display: "サ行変格活用「する」" },
                { key: "kagyou", display: "カ行変格活用「来る」" },
            ]
        },
        token: getModernVerbTokenDesc(t)
    }

    return (
        <KatsuyouPractice settings={settings}/>
    )
}

export default KatsuyouModernVerb