// noinspection NonAsciiCharacters,JSNonASCIINames

"use client"

import { FC } from "react";
import { useTranslations } from "next-intl";
import { getAdjectiveType, getRandomAdjective } from "@/lib/dictionary_v2";
import KatsuyouPractice from "@/components/KatsuyouPractice";
import { KatsuyouConstants } from "@/lib/katsuyou_v2";

const KatsuyouModernVerb: FC = () => {
    const t = useTranslations("Practice")

    const settings: SettingDesc = {
        type: "modern_na",
        predicate: {
            name: t("settings.allowedBaseTokens"),
            poller: (allowed) => getRandomAdjective((v) => allowed[v.type]),
            describeType: (term: KatsuyouAdjective) => getAdjectiveType(term),
            children: [
                { key: "na", display: "ナ形容動詞「きれい・好き」" },
            ]
        },
        token: [
            {
                name: t("settings.allowedAuxiliary"),
                reverse: true,
                children: [
                    {
                        key: "ない",
                        display: "打消し「ない」",
                        trigger: [KatsuyouConstants.ない_TOKEN, KatsuyouConstants.ない_SHORT_TOKEN, KatsuyouConstants.ん_TOKEN]
                    },
                    {
                        key: "よう",
                        display: "推量・意志「う・よう」",
                        trigger: [KatsuyouConstants.う_TOKEN, KatsuyouConstants.よう_TOKEN]
                    },
                    {
                        key: "た",
                        display: "過去・完了・存続「た」",
                        trigger: [KatsuyouConstants.た_TOKEN, KatsuyouConstants.た_SHORT_TOKEN]
                    },
                    { key: "そうだ様態", display: "様態「そうだ」", trigger: [KatsuyouConstants.そうだ様態_TOKEN] },
                    { key: "そうだ伝聞", display: "伝聞「そうだ」", trigger: [KatsuyouConstants.そうだ伝聞_TOKEN] },
                    {
                        key: "ようだ",
                        display: "推定・比況・例示「ようだ」",
                        trigger: [KatsuyouConstants.ようだ_TOKEN]
                    },
                    { key: "らしい", display: "推定「らしい」", trigger: [KatsuyouConstants.らしい_TOKEN] },
                    { key: "だ", display: "断定「だ」", trigger: [KatsuyouConstants.だ_TOKEN] },
                    {
                        key: "です",
                        display: "丁寧な断定「です」",
                        trigger: [KatsuyouConstants.です_TOKEN, KatsuyouConstants.です_SHORT_TOKEN]
                    },
                ]
            },
            {
                name: t("settings.allowedParticle"),
                reverse: true,
                children:
                    [
                        { key: "ば", display: "ば", trigger: [KatsuyouConstants.ば_TOKEN] },
                        { key: "て", display: "て", trigger: [KatsuyouConstants.て_TOKEN] },
                    ]
            },
            {
                name: t("settings.useAdditional"),
                reverse: true,
                children:
                    [
                        { key: "とき", display: "とき", trigger: [KatsuyouConstants.NOUN_TOKEN] },
                        { key: "する", display: "する", trigger: [KatsuyouConstants.する_TOKEN] }
                    ]
            }]
    }

    return (
        <KatsuyouPractice settings={settings}/>
    )
}

export default KatsuyouModernVerb