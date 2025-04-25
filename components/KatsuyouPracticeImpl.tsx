import { Dispatch, FC, JSX, ReactNode, SetStateAction, useEffect, useState } from "react";
import KatsuyouInterface from "@/components/KatsuyouInterface";
import { useRouter } from "next/navigation";
import { Katsuyou, KatsuyouConstants } from "@/lib/katsuyou_v2";
import { v4 as uuidv4 } from "uuid";
import ValueChooser from "@/components/ValueChooser";
import OptionMenu from "@/components/OptionMenu";
import KatsuyouCheckBox from "@/components/CheckBox";
import Flipper from "@/components/Flipper";
import Ruby from "@/components/Ruby";
import { createClient } from "@/lib/supabaseClient";
import { useTranslations } from "next-intl";

interface KatsuyouPracticeProps {
    settings: SettingDesc
}

const KatsuyouPracticeImpl: FC<KatsuyouPracticeProps> = ({ settings }) => {
    const t = useTranslations("Practice")
    const router = useRouter();

    // interface
    const [userAnswer, setUserAnswer] = useState("")
    const [correct, setCorrect] = useState(0)
    const [trials, setTrials] = useState(0)
    const [termType, setTermType] = useState("〇行〇〇活用")
    const [status, setStatus] = useState<"empty" | "correct" | "incorrect">("empty")
    const [message, setMessage] = useState<ReactNode>()
    const [children, setChildren] = useState(<>〇〇〇</>)
    const [timeDisplay, setTimeDisplay] = useState("00:00")

    // katsuyou data
    const [katsuyou,] = useState(new Katsuyou())
    const [uuid] = useState(uuidv4())
    const [startTime,] = useState(Date.now())
    const [hintIndex, setHintIndex] = useState(0)
    const [maxLength, setMaxLength] = useState(Infinity)
    const [allowedTerms, setAllowedTerms] = useState(
        Object.fromEntries(settings.predicate.children.map((op) => [op.key, true]))
    )
    const [allowedTokens, setAllowedTokens] = useState(
        Object.fromEntries(settings.token
            .flatMap((section) => section.children)
            .map((op) => [op.key, true]))
    )

    const menu = <>
        <ValueChooser min={1} max={5} title={t("settings.maxLength")} value={maxLength} onChange={setMaxLength}/>
        <OptionMenu title={settings.predicate.name} key={settings.predicate.name}>
            {settings.predicate.children.map(op =>
                <KatsuyouCheckBox display={op.display} value={allowedTerms[op.key]} key={op.key}
                                  onChange={(e) => updateEntry(allowedTerms, setAllowedTerms, op.key, e.target.checked, true)}/>)}
        </OptionMenu>
        {settings.token.map(section => (
            <OptionMenu title={section.name} key={section.name}
                        titleButton={section.reverse && <Flipper
                            onClick={() => reverse(allowedTokens, setAllowedTokens, section.children.map(op => op.key))}/>}>
                {section.children.map(op => (
                    <KatsuyouCheckBox display={op.display} value={allowedTokens[op.key]} key={op.key} disabled={op.disabled}
                                      onChange={(e) => updateEntry(allowedTokens, setAllowedTokens, op.key, e.target.checked)}/>
                ))}
            </OptionMenu>
        ))}
    </>

    const pollTerm = () => {
        const term = settings.predicate.poller(allowedTerms)
        const type = settings.predicate.describeType(term)
        setTermType(type)
        katsuyou.feed(term)

        let v;
        if (!term.display && term.ruby) {
            v = <Ruby text={term.baseForm} ruby={term.ruby}/>
        } else {
            v = <Ruby text={term.display ?? term.baseForm}/>
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
        pollTerm()
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
        pollTerm()
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
    const reverse = <T extends Record<string, boolean>>(obj: T, setter: Dispatch<SetStateAction<T>>, keys?: (keyof T)[]) => {
        const reversed = Object.entries(obj).map(([k, v]) => {
            if (keys && !keys.includes(k)) {
                return [k, v]
            }
            return [k, !v]
        })
        const nobj = Object.fromEntries(reversed) as T
        setter(nobj)
    }
    const updateEntry = <T extends {
        [p: string]: unknown
    }>(obj: T, action: Dispatch<SetStateAction<T>>, key: keyof T, to: boolean, guard?: boolean) => {
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

    useEffect(() => {
        const handle = setInterval(tick, 1000)
        return () => clearInterval(handle)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        const tok = [KatsuyouConstants.END_TOKEN]
        const data = settings.token
            .flatMap((sec) => sec.children)
            .map((op) => [op.trigger, allowedTokens[op.key]] as const)

        for (const [triggers, v] of data) {
            if (!v) {
                continue
            }
            tok.push(...triggers)
        }
        katsuyou.allowedTokens = tok

        pollTerm()
    }, [allowedTokens, katsuyou, settings]);
    useEffect(() => {
        katsuyou.maxLength = maxLength
    }, [maxLength, katsuyou]);

    const saveProgress = () => {
        const supabase = createClient()
        supabase.auth.getUser().then(({ data, error }) => {
            if (error) {
                console.error(error)
                return
            }

            return data.user?.id
        }).then((id) => {
            const request: HistoryPostRequest = {
                data: {
                    uuid,
                    user_id: id!,
                    type: settings.type,
                    time: new Date(startTime).toISOString(),
                    duration: Math.round((Date.now() - startTime) / 1000),
                    n_correct: correct,
                    n_attempted: trials
                }
            }
            return fetch("/api/history", {
                body: JSON.stringify(request),
                method: "POST"
            })
        }).then((resp) => {
            return resp.json()
        }).then((resp: ResponseOf<PracticeHistory>) => {
            if (resp.success) {
                router.push("/dashboard")
                return
            }

            console.error(resp.errorMessage)
        })
    }

    return (
        <KatsuyouInterface onClick={() => checkAnswer()} onChange={(e) => setUserAnswer(e.target.value)}
                           correct={correct} trials={trials} verbType={termType} value={userAnswer}
                           menu={menu} onSave={saveProgress}
                           status={status} message={message} onHint={hint} onSkip={skip} time={timeDisplay}>
            {children}
        </KatsuyouInterface>
    )
}

export default KatsuyouPracticeImpl