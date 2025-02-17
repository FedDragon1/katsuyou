// noinspection NonAsciiCharacters,JSNonASCIINames

"use client"

import { Dispatch, FC, JSX, ReactNode, SetStateAction, useEffect, useMemo, useState } from "react";
import KatsuyouInterface from "@/app/practice/interactive/KatsuyouInterface";
import { useTranslations } from "next-intl";
import DashboardNav from "@/app/DashboardNav";
import { Katsuyou, KatsuyouConstants } from "@/data/katsuyou_v2";
import { getRandomVerb, getVerbKatsuyouType } from "@/data/dictionary_v2";
import Ruby from "@/app/Ruby";
import KatsuyouCheckBox from "@/app/CheckBox";

interface OptionMenuProps {
    title: string
    children: ReactNode
    titleButton?: ReactNode
}

const OptionMenu: FC<OptionMenuProps> = ({ children, title, titleButton }) => {
    const gridCols = "min-[1600px]:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2"

    return (
        <div className={"w-full flex flex-col gap-12"}>
            <div className={"flex items-center gap-4"}>
                <h2 className={"text-2xl sm:text-3xl self-start emphasis relative before:-bottom-1"}>{title}</h2>
                {titleButton}
            </div>
            <div className={`grid ${gridCols} gap-12 items-center justify-between flex-wrap`}>
                {children}
            </div>
        </div>
    )
}

interface ValueChooserProps {
    min: number
    max: number
    title: string
    value: number
    onChange: (newValue: number) => void
}

const ValueChooser: FC<ValueChooserProps> = ({ min, max, value, title, onChange }) => {
    const currentIndex = (value > max ? max + 1 : value) - min

    const handleChange = (delta: number) => {
        if (value > max && delta > 0 || value + delta < min) {
        } else if (value > max) {
            onChange(max)
        } else if (value + delta === max + 1) {
            onChange(Infinity)
        } else {
            onChange(value + delta)
        }
    }

    const display = [
        "聞く",
        "聞かせる",
        "聞かせている",
        "聞かせていない",
        "聞かせていないようだ",
        "聞かせていないようだった"
    ]

    return (
        <div className={"w-full flex flex-col gap-12"}>
            <h2 className={"text-2xl sm:text-3xl self-start emphasis relative before:-bottom-1"}>{title}</h2>
            <div className={"flex justify-between items-center"}>
                <div className={"flex gap-4 items-center"}>
                    <div onClick={() => handleChange(-1)}
                         className={"w-6 h-6 transition bg-foreground triangle rotate-180 hover:bg-zinc-300"}></div>
                    <div className={"relative overflow-hidden h-[50px]"}>
                        <div className={"flex flex-col transition-all relative"}
                             style={{ top: `-${(currentIndex) * 100}%` }}>
                            {Array(max - min + 2).fill(0).map((_, i) => i + min).map((i) => {
                                const d = i > max ? "∞" : i.toString().padStart(2, "0")
                                return (
                                    <span key={i}
                                          className={"text-5xl h-[50px] w-[200px] sm:w-[300px] text-center font-bold"}>{d}</span>
                                )
                            })}
                        </div>
                    </div>
                    <div onClick={() => handleChange(1)}
                         className={"w-6 h-6 transition bg-foreground triangle hover:bg-zinc-300"}></div>
                </div>
                <div className={"relative overflow-hidden h-[50px] hidden xl:block"}>
                    <div className={"flex flex-col transition-all relative"}
                         style={{ top: `-${(currentIndex) * 100}%` }}>
                        {display.map((d) => {
                            return (
                                <span key={d} className={"text-5xl h-[50px] text-right font-bold"}>{d}</span>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

interface FlipperProps {
    onClick: () => void
}

const Flipper: FC<FlipperProps> = ({ onClick }) => {
    return (
        <div onClick={onClick} className={"h-full flex items-center group px-2"}>
            <div
                className={"w-6 h-6 flex rounded-full border-foreground border overflow-hidden group-hover:rotate-180 transition duration-300"}>
                <div className={"flex-1 bg-foreground"}/>
                <div className={"flex-1"}/>
            </div>
        </div>
    )
}

const KatsuyouModern: FC = () => {
    const t = useTranslations("Practice")
    const updateEntry = <T extends {
        [p: string]: unknown
    }, >(obj: T, action: Dispatch<SetStateAction<T>>, key: keyof T, to: boolean, guard?: boolean) => {
        let i = 0
        for (const t of Object.values(obj)) {
            if (t) {
                i++;
            }
        }
        if (!to && i <= 1 && guard) {
            return
        }

        action({
            ...obj,
            [key]: to
        })
    }

    const [userAnswer, setUserAnswer] = useState("")
    const [correct, setCorrect] = useState(0)
    const [trials, setTrials] = useState(0)
    const [verbType, setVerbType] = useState("〇行〇〇活用")
    const [status, setStatus] = useState<"empty" | "correct" | "incorrect">("empty")
    const [message, setMessage] = useState<ReactNode>()
    const [children, setChildren] = useState(<>〇〇〇</>)
    const [katsuyou,] = useState(new Katsuyou())
    const [startTime,] = useState(Date.now())
    const [timeDisplay, setTimeDisplay] = useState("00:00")
    const [hintIndex, setHintIndex] = useState(0)
    const [allowedVerbs, setAllowedVerbs] = useState({
        pentagrade: true,
        monograde: true,
        kagyou: true,
        sagyou: true
    })
    const [allowedAuxiliary, setAllowedAuxiliary] = useState({
        "させる": true,
        "られる": true,
        "たい": true,
        "たがる": true,
        "ない": true,
        "よう": true,
        "まい": true,
        "た": true,
        "そうだ様態": true,
        "そうだ伝聞": true,
        "ようだ": true,
        "らしい": true,
        "ます": true,
        "だ": true,
        "です": true,
        "べき": true,
    })
    const [allowedParticles, setAllowedParticles] = useState({
        "て": true,
        "ば": true,
        "命令": true,
    })
    const [allowedSubsidiary, setAllowedSubsidiary] = useState({
        "ている": true,
        "ておく": true,
        "てしまう": true,
    })
    const [allowedNoun, setAllowedNoun] = useState({
        "NOUN": true
    })
    const [tokenTriggers,] = useState<Record<keyof typeof allowedTokens, typeof KatsuyouConstants.END_TOKEN[]>>({
        "NOUN": [KatsuyouConstants.NOUN_TOKEN],
        "させる": [KatsuyouConstants.させる_TOKEN, KatsuyouConstants.せる_TOKEN],
        "られる": [KatsuyouConstants.られる_TOKEN, KatsuyouConstants.れる_TOKEN, KatsuyouConstants.せられる_TOKEN],
        "たい": [KatsuyouConstants.たい_TOKEN],
        "たがる": [KatsuyouConstants.たがる_TOKEN],
        "ない": [KatsuyouConstants.ない_TOKEN, KatsuyouConstants.ない_SHORT_TOKEN, KatsuyouConstants.ん_TOKEN],
        "よう": [KatsuyouConstants.う_TOKEN, KatsuyouConstants.よう_TOKEN],
        "まい": [KatsuyouConstants.まい_TOKEN],
        "た": [KatsuyouConstants.た_TOKEN, KatsuyouConstants.た_SHORT_TOKEN],
        "そうだ様態": [KatsuyouConstants.そうだ様態_TOKEN],
        "そうだ伝聞": [KatsuyouConstants.そうだ伝聞_TOKEN],
        "ようだ": [KatsuyouConstants.ようだ_TOKEN],
        "らしい": [KatsuyouConstants.らしい_TOKEN],
        "ます": [KatsuyouConstants.ます_TOKEN, KatsuyouConstants.ます_SHORT_TOKEN],
        "だ": [KatsuyouConstants.だ_TOKEN],
        "です": [KatsuyouConstants.です_TOKEN, KatsuyouConstants.です_SHORT_TOKEN],
        "べき": [KatsuyouConstants.べき_TOKEN],
        "て": [KatsuyouConstants.て_TOKEN],
        "ている": [KatsuyouConstants.ている_TOKEN],
        "ておく": [KatsuyouConstants.ておく_TOKEN],
        "てしまう": [KatsuyouConstants.てしまう_TOKEN],
        "ば": [KatsuyouConstants.ば_TOKEN],
        "命令": [KatsuyouConstants.命令_TOKEN],
    })
    const [maxLength, setMaxLength] = useState(Infinity)
    const allowedTokens = useMemo(() => {
        return {
            ...allowedAuxiliary,
            ...allowedParticles,
            ...allowedSubsidiary,
            ...allowedNoun
        }
    }, [allowedAuxiliary, allowedParticles, allowedSubsidiary, allowedNoun]);

    const verbsMap = [
        { key: "pentagrade", display: "五段活用「洗う・書く」" },
        { key: "monograde", display: "一段活用「寝る・起きる」" },
        { key: "sagyou", display: "サ行変格活用「する」" },
        { key: "kagyou", display: "カ行変格活用「来る」" },
    ] as const
    const auxiliaryMap = [
        {
            name: "させる",
            display: "使役「させる」",
            trigger: [KatsuyouConstants.させる_TOKEN, KatsuyouConstants.せる_TOKEN]
        },
        {
            name: "られる",
            display: "受身・可能・自発・尊敬「られる」",
            trigger: [KatsuyouConstants.られる_TOKEN, KatsuyouConstants.れる_TOKEN, KatsuyouConstants.せられる_TOKEN]
        },
        { name: "たい", display: "希望「たい」", trigger: [KatsuyouConstants.たい_TOKEN] },
        { name: "たがる", display: "希望「たがる」", trigger: [KatsuyouConstants.たがる_TOKEN] },
        {
            name: "ない",
            display: "打消し「ない」",
            trigger: [KatsuyouConstants.ない_TOKEN, KatsuyouConstants.ない_SHORT_TOKEN, KatsuyouConstants.ん_TOKEN]
        },
        {
            name: "よう",
            display: "推量・意志「う・よう」",
            trigger: [KatsuyouConstants.う_TOKEN, KatsuyouConstants.よう_TOKEN]
        },
        { name: "まい", display: "打消しの推量・意志「まい」", trigger: [KatsuyouConstants.まい_TOKEN] },
        {
            name: "た",
            display: "過去・完了・存続「た」",
            trigger: [KatsuyouConstants.た_TOKEN, KatsuyouConstants.た_SHORT_TOKEN]
        },
        { name: "そうだ様態", display: "様態「そうだ」", trigger: [KatsuyouConstants.そうだ様態_TOKEN] },
        { name: "そうだ伝聞", display: "伝聞「そうだ」", trigger: [KatsuyouConstants.そうだ伝聞_TOKEN] },
        { name: "ようだ", display: "推定・比況・例示「ようだ」", trigger: [KatsuyouConstants.ようだ_TOKEN] },
        { name: "らしい", display: "推定「らしい」", trigger: [KatsuyouConstants.らしい_TOKEN] },
        {
            name: "ます",
            display: "丁寧「ます」",
            trigger: [KatsuyouConstants.ます_TOKEN, KatsuyouConstants.ます_SHORT_TOKEN]
        },
        { name: "だ", display: "断定「だ」", trigger: [KatsuyouConstants.だ_TOKEN] },
        {
            name: "です",
            display: "丁寧な断定「です」",
            trigger: [KatsuyouConstants.です_TOKEN, KatsuyouConstants.です_SHORT_TOKEN]
        },
        { name: "べき", display: "義務「べき」", trigger: [KatsuyouConstants.べき_TOKEN] },
    ] as const
    const subsidiaryMap = [
        { name: "ている", display: "ている", },
        { name: "ておく", display: "ておく" },
        { name: "てしまう", display: "てしまう" },
    ] as const
    const particleMap = [
        { name: "ば", display: "ば" },
        { name: "命令", display: "命令" },
        { name: "て", display: "て" },
    ] as const

    const reverse = <T extends Record<string, boolean>>(obj: T, setter: Dispatch<SetStateAction<T>>) => {
        const reversed = Object.entries(obj).map(([k, v]) => [k, !v])
        const nobj = Object.fromEntries(reversed) as T
        setter(nobj)
    }

    const menu = <>
        <ValueChooser min={1} max={5} title={t("settings.maxLength")} value={maxLength} onChange={setMaxLength}/>
        <OptionMenu title={t("settings.allowedVerbs")}>
            {verbsMap.map(({ key, display }) => (
                <KatsuyouCheckBox value={allowedVerbs[key]} display={display} key={key}
                                  onChange={(e) => updateEntry(allowedVerbs, setAllowedVerbs, key, e.target.checked, true)}/>
            ))}
        </OptionMenu>
        <OptionMenu title={t("settings.allowedAuxiliary")} titleButton={<Flipper onClick={() => reverse(allowedAuxiliary, setAllowedAuxiliary)}/>}>
            {auxiliaryMap.map(({ name, display }) => (
                <KatsuyouCheckBox value={allowedTokens[name]} display={display} key={name}
                                  onChange={(e) => updateEntry(allowedAuxiliary, setAllowedAuxiliary, name, e.target.checked)}/>
            ))}
        </OptionMenu>
        <OptionMenu title={t("settings.allowedSubsidiary")} titleButton={<Flipper onClick={() => reverse(allowedSubsidiary, setAllowedSubsidiary)}/>}>
            {subsidiaryMap.map(({ name, display }) => (
                <KatsuyouCheckBox value={allowedTokens[name]} display={display} key={name}
                                  onChange={(e) => updateEntry(allowedSubsidiary, setAllowedSubsidiary, name, e.target.checked)}/>
            ))}
        </OptionMenu>
        <OptionMenu title={t("settings.allowedParticle")} titleButton={<Flipper onClick={() => reverse(allowedParticles, setAllowedParticles)}/>}>
            {particleMap.map(({ name, display }) => (
                <KatsuyouCheckBox value={allowedTokens[name]} display={display} key={name}
                                  onChange={(e) => updateEntry(allowedParticles, setAllowedParticles, name, e.target.checked)}/>
            ))}
        </OptionMenu>
        <OptionMenu title={t("settings.useNoun")} titleButton={<Flipper onClick={() => reverse(allowedNoun, setAllowedNoun)}/>}>
            <KatsuyouCheckBox value={allowedTokens.NOUN} display={"とき"}
                              onChange={(e) => updateEntry(allowedNoun, setAllowedNoun, "NOUN", e.target.checked)}/>
        </OptionMenu>
    </>

    const pollVerb = () => {
        const allowed: { [s in KatsuyouVerbType]: boolean } = {
            ...allowedVerbs,
            aru: allowedVerbs.pentagrade,
            honorific: allowedVerbs.pentagrade,
            quadrigrade: false,
            upper_bigrade: false,
            lower_bigrade: false,
            nagyou: false,
            ragyou: false
        }
        const verb = getRandomVerb((v) => v.modern && allowed[v.type])
        const type = getVerbKatsuyouType(verb.row, verb.type)
        setVerbType(type)
        katsuyou.feed(verb)

        let v;
        if (!verb.display && verb.ruby) {
            v = <Ruby text={verb.baseForm} ruby={verb.ruby}/>
        } else {
            v = <Ruby text={verb.display ?? verb.baseForm}/>
        }

        for (const dispatch of katsuyou.sequence.slice(1)) {
            v = <>{v}
                <span className={"px-2"}>+</span>
                {dispatch.from.display}</>
        }

        setChildren(v)
    }
    const handleIncorrect = (options: string[]) => {
        if (!katsuyou.solution) {
            return
        }

        setTrials(trials + 1)
        setStatus("incorrect")
        if (options.length === 1) {
            setMessage(t.rich("incorrect.single", {
                answer: options[0],
                break: () => <br/>
            }))
        } else if (options.length === 2) {
            setMessage(t.rich("incorrect.double", {
                option1: options[0],
                option2: options[1],
                break: () => <br/>
            }))
        } else {
            setMessage(t.rich("incorrect.multiple", {
                option1: options[0],
                break: () => <br/>
            }))
        }
    }
    const handleCorrect = () => {
        setStatus("correct")
        setMessage(t("correct"))
        setCorrect(correct + 1)
        setTrials(trials + 1)
        setUserAnswer("")
        setHintIndex(0)
        pollVerb()
    }
    const checkAnswer = (fail?: boolean) => {
        fail = fail ?? false
        if (!katsuyou.solution) {
            return
        }

        let answer = userAnswer.trim()
        if (answer.endsWith("時")) {
            answer = answer.slice(0, -1) + "とき"
        }

        const hiraganaOptions = []
        for (const ans of katsuyou.solution.options) {
            const words = ans.split('')
            for (const [i, kana] of Object.entries(katsuyou.solution.ruby)) {
                words[Number(i)] = kana
            }
            const alt = words.join('')

            console.log(alt, answer, ans)

            if ((ans === answer || answer === alt) && !fail) {
                handleCorrect()
                return
            }

            hiraganaOptions.push(alt)
        }

        // don't count multiple errors
        if (status === "incorrect") {
            return
        }

        handleIncorrect(katsuyou.solution.kanji ? katsuyou.solution.options : hiraganaOptions)
    }
    const skip = () => {
        setTrials(trials + 1)
        setStatus("empty")
        setUserAnswer("")
        setHintIndex(0)
        pollVerb()
    }
    const hint = () => {
        if (hintIndex >= katsuyou.sequence.length) {
            return
        }
        setHintIndex(hintIndex + 1)
        const [hinted, ...rest] = katsuyou.conjugateFirstN(hintIndex)

        let v: JSX.Element
        const target = hinted.options[0];
        if (hinted.kanji) {
            v = <Ruby text={target} ruby={hinted.ruby} className={"text-emphasis"}/>
        } else {
            const hiragana = []
            for (let i = 0; i < target.length; i++) {
                hiragana.push(hinted.ruby[i] ?? target[i])
            }
            v = <Ruby text={hiragana.join("")} className={"text-emphasis"}/>
        }

        for (const dispatch of rest) {
            v = <>{v}
                <span className={"px-2"}>+</span>
                {dispatch.from.display}</>
        }

        if (!rest.length) {
            // force incorrect
            checkAnswer(true)
        }

        setChildren(v)
    }
    const tick = () => {
        const now = Date.now()
        const duration = Math.round((now - startTime) / 1000)
        const min = Math.floor(duration / 60).toString().padStart(2, '0')
        const sec = (duration % 60).toString().padStart(2, '0')
        setTimeDisplay(`${min}:${sec}`)
    }

    useEffect(() => {
        pollVerb()
        const handle = setInterval(tick, 1000)
        return () => clearInterval(handle)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const tok = [KatsuyouConstants.END_TOKEN]
        for (const [key, v] of Object.entries(allowedTokens)) {
            if (!v) {
                continue
            }
            tok.push(...tokenTriggers[key as keyof typeof tokenTriggers])
        }
        katsuyou.allowedTokens = tok
    }, [allowedTokens, katsuyou, tokenTriggers]);

    useEffect(() => {
        katsuyou.maxLength = maxLength
    }, [maxLength, katsuyou]);

    // max length, verb type, allowed auxiliary verb, allowed particle, noun

    return (
        <>
            <div className={"flex flex-col h-screen overflow-y-auto overflow-x-hidden gap-8"}>
                <DashboardNav subtitle={t("activity.allModern")}/>
                <main className={"w-screen flex justify-center items-center flex-grow"}>
                    <KatsuyouInterface onClick={checkAnswer} onChange={(e) => setUserAnswer(e.target.value)}
                                       correct={correct} trials={trials} verbType={verbType} value={userAnswer}
                                       menu={menu}
                                       status={status} message={message} onHint={hint} onSkip={skip} time={timeDisplay}>
                        {children}
                    </KatsuyouInterface>
                </main>
            </div>
        </>
    )
}

export default KatsuyouModern