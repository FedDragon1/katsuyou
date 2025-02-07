"use client"

import { FC, MouseEventHandler, ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import FormEntry from "@/app/(account)/FormEntry";

interface KatsuyouInterfaceProps {
    trials: number
    correct: number
    verbType: string
    status: "empty" | "correct" | "incorrect"
    message?: ReactNode
    children: ReactNode
    onClick: MouseEventHandler<HTMLButtonElement>
}

const KatsuyouInterface: FC<KatsuyouInterfaceProps> = ({ children, status, message, onClick, verbType, correct, trials }) => {
    const t = useTranslations("Practice")
    const percent = trials === 0 ? 0 : Math.round(trials / correct * 100)

    const wrong = <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 1.5L1 11.5M1 1.5L11 11.5" stroke="white" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round"/>
    </svg>

    const right = <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.6666 1.5L5.49992 10.6667L1.33325 6.5" stroke="white" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round"/>
    </svg>

    const icon = status === "incorrect" ? wrong : right
    const formBorder = status === "incorrect" ? "before:border-emphasis" : ""
    const formText = status === "incorrect" ? "focus:placeholder:text-emphasis text-emphasis text-center" : "text-center"

    return (
        <div className={"flex gap-10"}>
            <div className={"flex flex-col gap-10 items-end"}>
                <div className={"rounded-lg bg-zinc-900 w-[240px] overflow-hidden"}>
                    <div className={"h-[100px] bg-zinc-800 flex gap-2 items-center justify-center"}>
                        <Image src={"/sand.png"} alt={"sand"} width={40} height={40} className={"invert w-8 h-8"}/>
                        <span className={"text-3xl"}>25:30</span>
                    </div>
                    <div className={"flex flex-col gap-10 p-6"}>
                        <div>
                            <p>{t("accuracy")}</p>
                            <span className={"text-4xl font-semibold"}>{percent}%</span>
                        </div>
                        <span className={"text-4xl font-semibold"}>{trials}/{correct}</span>
                    </div>
                </div>
                <div
                    className={"flex p-4 items-center justify-cente bg-zinc-900 rounded-lg hover:bg-zinc-800 transition"}>
                    <Image src={"/gear.png"} alt={"settings"} width={30} height={30}/>
                </div>
            </div>
            <div className={"flex flex-col bg-zinc-900 rounded-lg overflow-hidden"}>
                <div className={"bg-zinc-800 h-[200px] flex flex-col items-center justify-center gap-8"}>
                    <p className={"bg-primary py-4 px-6 rounded-lg text-xl flex-shrink-0"}>{verbType}</p>
                    <div className={"text-4xl"}>{children}</div>
                </div>
                <div className={"px-32 py-20 w-[1000px] gap-20 flex flex-col"}>
                    <div className={"flex flex-col gap-4 pt-4"}>
                        <FormEntry placeholder={t("placeholder")} borderClass={formBorder} type={"text"} className={formText}/>
                        <div className={"flex gap-4 h-6 items-center"}>
                            <span
                                className={"text-zinc-500 text-lg cursor-pointer hover:text-foreground transition"}>{t("hint")}</span>
                            <div className={"w-[1px] h-full border-l border-zinc-500"}></div>
                            <span
                                className={"text-zinc-500 text-lg cursor-pointer hover:text-foreground transition"}>{t("skip")}</span>
                        </div>
                    </div>
                    <div className={"flex flex-row-reverse justify-between"}>
                        <button className={"py-4 px-6 rounded-lg border-primary border text-lg hover:bg-primary transition"}
                                onClick={onClick}>{t("check")}</button>
                        {status === "empty" ? <></> : <div className={"flex items-center gap-4 text-lg"}>
                            {icon}
                            <span>{message}</span>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KatsuyouInterface