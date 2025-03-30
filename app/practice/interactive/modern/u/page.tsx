// noinspection NonAsciiCharacters,JSNonASCIINames

"use client"

import { FC } from "react";
import { getRandomVerb, getVerbKatsuyouType } from "@/lib/dictionary_v2";
import KatsuyouPractice from "@/components/KatsuyouPractice";
import { KatsuyouConstants } from "@/lib/katsuyou_v2";
import { useTranslations } from "next-intl";

const KatsuyouModernVerb: FC = () => {
    const t = useTranslations("Practice")

    const settings: SettingDesc = {
        type: "modern_u",
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
        token: [
            {
                name: t("settings.allowedAuxiliary"),
                reverse: true,
                children: [
                    {
                        key: "よう",
                        display: "推量・意志「う・よう」",
                        trigger: [KatsuyouConstants.う_TOKEN, KatsuyouConstants.よう_TOKEN],
                        disabled: true
                    },
                ]
            }]
    }

    return (
        <KatsuyouPractice settings={settings}/>
    )
}

export default KatsuyouModernVerb