// noinspection NonAsciiCharacters,JSNonASCIINames

import { KatsuyouConstants } from "@/lib/katsuyou_v2";

export function getModernVerbTokenDesc(t: (s: string) => string) {
    return [
        {
            name: t("settings.allowedAuxiliary"),
            reverse: true,
            children: [
                {
                    key: "させる",
                    display: "使役「させる」",
                    trigger: [KatsuyouConstants.させる_TOKEN, KatsuyouConstants.せる_TOKEN]
                },
                {
                    key: "られる",
                    display: "受身・可能・自発・尊敬「られる」",
                    trigger: [KatsuyouConstants.られる_TOKEN, KatsuyouConstants.れる_TOKEN, KatsuyouConstants.せられる_TOKEN]
                },
                { key: "たい", display: "希望「たい」", trigger: [KatsuyouConstants.たい_TOKEN] },
                { key: "たがる", display: "希望「たがる」", trigger: [KatsuyouConstants.たがる_TOKEN] },
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
                { key: "まい", display: "打消しの推量・意志「まい」", trigger: [KatsuyouConstants.まい_TOKEN] },
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
                {
                    key: "ます",
                    display: "丁寧「ます」",
                    trigger: [KatsuyouConstants.ます_TOKEN, KatsuyouConstants.ます_SHORT_TOKEN]
                },
                { key: "だ", display: "断定「だ」", trigger: [KatsuyouConstants.だ_TOKEN] },
                {
                    key: "です",
                    display: "丁寧な断定「です」",
                    trigger: [KatsuyouConstants.です_TOKEN, KatsuyouConstants.です_SHORT_TOKEN]
                },
                { key: "べき", display: "義務「べき」", trigger: [KatsuyouConstants.べき_TOKEN] },
            ]
        },
        {
            name: t("settings.allowedSubsidiary"),
            reverse:
                true,
            children:
                [
                    { key: "ている", display: "ている", trigger: [KatsuyouConstants.ている_TOKEN] },
                    { key: "ておく", display: "ておく", trigger: [KatsuyouConstants.ておく_TOKEN] },
                    { key: "てしまう", display: "てしまう", trigger: [KatsuyouConstants.てしまう_TOKEN] },
                ]
        },
        {
            name: t("settings.allowedParticle"),
            reverse: true,
            children:
                [
                    { key: "ば", display: "ば", trigger: [KatsuyouConstants.ば_TOKEN] },
                    { key: "命令", display: "命令", trigger: [KatsuyouConstants.命令_TOKEN] },
                    { key: "て", display: "て", trigger: [KatsuyouConstants.て_TOKEN] },
                ]
        },
        {
            name: t("settings.useNoun"),
            reverse: true,
            children:
                [{ key: "とき", display: "とき", trigger: [KatsuyouConstants.NOUN_TOKEN] }]
        }]
}