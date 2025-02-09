"use client"

import { FC, JSX, ReactNode, useEffect, useState } from "react";
import KatsuyouInterface from "@/app/practice/interactive/KatsuyouInterface";
import { useTranslations } from "next-intl";
import DashboardNav from "@/app/DashboardNav";
import { Katsuyou } from "@/data/katsuyou_v2";
import { getRandomVerb, getVerbKatsuyouType } from "@/data/dictionary_v2";
import Ruby from "@/app/Ruby";


const KatsuyouModern: FC = () => {
    const t = useTranslations("Practice")

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

    const pollVerb = () => {
        const verb = getRandomVerb((v) => v.modern)
        const type = getVerbKatsuyouType(verb.row, verb.type)
        setVerbType(type)
        katsuyou.feed(verb)

        let v;
        if (!verb.display && verb.ruby) {
            v = <Ruby text={verb.baseForm} ruby={verb.ruby} />
        } else {
            v = <Ruby text={verb.display ?? verb.baseForm} />
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
                break: () => <br />
            }))
        } else if (options.length === 2) {
            setMessage(t.rich("incorrect.double", {
                option1: options[0],
                option2: options[1],
                break: () => <br />
            }))
        } else {
            setMessage(t.rich("incorrect.multiple", {
                option1: options[0],
                break: () => <br />
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
            v = <Ruby text={target} ruby={hinted.ruby} className={"text-emphasis"} />
        } else {
            const hiragana = []
            for (let i = 0; i < target.length; i++) {
                hiragana.push(hinted.ruby[i] ?? target[i])
            }
            v = <Ruby text={hiragana.join("")} className={"text-emphasis"} />
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

    return (
        <>
            <div className={"flex flex-col h-screen overflow-y-auto overflow-x-hidden gap-8"}>
                <DashboardNav subtitle={t("activity.allModern")}/>
                <main className={"w-screen flex justify-center items-center flex-grow"}>
                    <KatsuyouInterface onClick={checkAnswer} onChange={(e) => setUserAnswer(e.target.value)}
                                       correct={correct} trials={trials} verbType={verbType} value={userAnswer}
                                       status={status} message={message} onHint={hint} onSkip={skip} time={timeDisplay}>
                        {children}
                    </KatsuyouInterface>
                </main>
            </div>
        </>
    )
}

export default KatsuyouModern