"use client"

import {
    ChangeEventHandler,
    FC,
    KeyboardEvent,
    ReactNode, useState,
} from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import FormEntry from "@/components/FormEntry";

interface KatsuyouInterfaceProps {
    trials: number
    correct: number
    verbType: string
    value: string
    status: "empty" | "correct" | "incorrect"
    message?: ReactNode
    children: ReactNode
    onSkip: () => void
    onHint: () => void
    onChange: ChangeEventHandler<HTMLInputElement>
    onClick: () => void,
    time: string
    menu: ReactNode
    onSave: () => void
}

interface InterfaceButtonProps {
    src: string
    alt: string
    onClick: () => void
}

interface InterfaceSettingsProps {
    visible: boolean
    onClick: () => void
    title: string
    children: ReactNode
}

interface InterfaceStatsProps {
    time: string
    percent: number
    correct: number
    trials: number
    accuracyTitle: string
}

interface InterfaceOverlayProps {
    children: ReactNode
    visible: boolean
}

interface InterfaceSaveDialogueProps {
    visible: boolean
    time: string
    percent: number
    correct: number
    trials: number
    onCancel: () => void
    onSave: () => void
}

interface InterfaceSaveSectionProps {
    title: string
    content: string | number | ReactNode
}

interface InterfaceSaveButtonProps {
    onClick: () => void
    children: ReactNode
}

const InterfaceButton: FC<InterfaceButtonProps> = ({ src, alt, onClick }) => {
    return (
        <div onClick={onClick}
             className={"flex xl:p-2 sm:h-12 sm:w-12 w-8 flex-shrink-0 box-content items-center justify-center sm:bg-zinc-900 rounded-lg hover:bg-zinc-800 transition"}>
            <Image src={src} alt={alt} width={36} height={36}
                   className={"xl:w-[30px] xl:h-[30px] w-[20px] h-[20px]"}/>
        </div>
    )
}

const InterfaceOverlay: FC<InterfaceOverlayProps> = ({ children, visible }) => {
    return (
        <div
            className={"fixed h-[calc(100vh-80px)] sm:h-[calc(100vh-96px)] w-full sm:top-24 top-20 backdrop-blur-lg transition-all duration-500"}
            style={{ opacity: visible ? 1 : 0, zIndex: visible ? 10 : -1 }}>
            {children}
        </div>
    )
}

const InterfaceSettings: FC<InterfaceSettingsProps> = ({ visible, onClick, title, children }) => {
    return (
        <InterfaceOverlay visible={visible}>
            <div className={"w-full h-full sm:px-20 px-10 py-10 flex flex-col gap-10 overflow-y-auto"}>
                <div className={"flex justify-between flex-row-reverse items-center"}>
                    <div onClick={onClick}
                         className={"size-12 sm:size-14 border-foreground transition hover:border-zinc-300 border rounded-full flex justify-center relative group"}>
                        <div
                            className={"h-[1px] w-8 border-b border-foreground transition group-hover:border-zinc-300 absolute top-1/2 rotate-45"}></div>
                        <div
                            className={"h-[1px] w-8 border-b border-foreground transition group-hover:border-zinc-300 absolute top-1/2 -rotate-45"}></div>
                    </div>
                    <h1 className={"text-3xl sm:text-4xl"}>{title}</h1>
                </div>
                <div className={"flex flex-col gap-16"}>
                    {children}
                </div>
            </div>
        </InterfaceOverlay>
    )
}

const InterfaceSaveSection: FC<InterfaceSaveSectionProps> = ({ title, content }) => {
    return (
        <div className={"flex-1 flex sm:flex-col gap-2 justify-between"}>
            <h2 className={"text-2xl lg:text-3xl emphasis self-start pb-1 before:h-3"}>{title}</h2>
            <span className={"text-3xl lg:text-4xl lg:font-semibold"}>{content}</span>
        </div>
    )
}

const InterfaceSaveButton: FC<InterfaceSaveButtonProps> = ({ onClick, children }) => {
    return (
        <button onClick={onClick}
                className={"hover:text-zinc-300 transition lg:text-xl"}>
            {children}
        </button>
    )
}

const InterfaceSaveDialogue: FC<InterfaceSaveDialogueProps> = ({
                                                                   visible,
                                                                   time,
                                                                   percent,
                                                                   correct,
                                                                   trials,
                                                                   onCancel,
                                                                   onSave
                                                               }) => {
    const t = useTranslations("Practice")

    return (
        <InterfaceOverlay visible={visible}>
            <div className={"w-full h-full sm:px-20 px-10 flex items-center justify-center"}>
                <div className={"flex flex-col gap-8 lg:gap-12 w-full max-w-[500px] lg:max-w-[800px]"}>
                    <div className={"flex flex-col gap-4"}>
                        <h1 className={"text-3xl lg:text-4xl font-semibold"}>{t("dialogue.title")}</h1>
                        <hr/>
                    </div>

                    <span className={"lg:text-xl"}>{t("dialogue.question")}</span>
                    <div className={"flex justify-between flex-col sm:flex-row gap-4"}>
                        <InterfaceSaveSection title={t("dialogue.duration")} content={time}/>
                        <InterfaceSaveSection title={t("accuracy")} content={<>{percent}%</>}/>
                        <InterfaceSaveSection title={t("dialogue.attempts")}
                                              content={<>{correct}/{trials}</>}/>
                    </div>
                    <div className={"flex justify-end gap-4 lg:gap-8 py-4"}>
                        <InterfaceSaveButton onClick={onSave}>{t("dialogue.confirm")}</InterfaceSaveButton>
                        <InterfaceSaveButton onClick={onCancel}>{t("dialogue.cancel")}</InterfaceSaveButton>
                    </div>
                </div>
            </div>
        </InterfaceOverlay>
    )
}

const InterfaceStats: FC<InterfaceStatsProps> = ({ time, percent, correct, trials, accuracyTitle }) => {
    return (
        <div
            className={"rounded-lg sm:bg-zinc-900 2xl:w-[240px] xl:w-[200px] overflow-hidden flex xl:flex-col"}>
            <div
                className={"xl:h-[100px] sm:bg-zinc-800 flex gap-2 items-center justify-center sm:px-6 py-2"}>
                <Image src={"/sand.png"} alt={"sand"} width={40} height={40}
                       className={"invert w-6 h-6 sm:w-8 sm:h-8"}/>
                <span className={"2xl:text-3xl sm:text-2xl text-xl"}>{time}</span>
            </div>
            <div className={"flex xl:flex-col gap-6 sm:gap-10 xl:p-6 px-6 py-2"}>
                <div>
                    <p className={"hidden xl:block"}>{accuracyTitle}</p>
                    <span className={"text-xl sm:text-2xl 2xl:text-4xl font-semibold"}>{percent}%</span>
                </div>
                <span className={"text-xl sm:text-2xl 2xl:text-4xl font-semibold"}>{correct}/{trials}</span>
            </div>
        </div>
    )
}

const KatsuyouInterface: FC<KatsuyouInterfaceProps> = ({
                                                           children,
                                                           status,
                                                           value,
                                                           message,
                                                           onChange,
                                                           onClick,
                                                           verbType,
                                                           correct,
                                                           trials,
                                                           onSkip,
                                                           onHint,
                                                           time,
                                                           menu,
                                                           onSave
                                                       }) => {
    const t = useTranslations("Practice")
    const percent = trials === 0 ? 0 : Math.round(correct / trials * 100)

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
    const formText = status === "incorrect" ? "focus:placeholder:text-emphasis text-emphasis" : ""
    const lgText = "text-md 2xl:text-lg"

    const [isComposing, setIsComposing] = useState(false)
    const [isSettingOpen, setIsSettingOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "Enter" && !isComposing) {
            e.preventDefault()
            onClick()
        }
    }

    return (
        <>
            <InterfaceSettings visible={isSettingOpen}
                               onClick={() => setIsSettingOpen(false)}
                               title={t("settings.title")}>
                {menu}
            </InterfaceSettings>
            <InterfaceSaveDialogue visible={isSaving} correct={correct} trials={trials} percent={percent} time={time}
                                   onSave={onSave} onCancel={() => setIsSaving(false)}/>
            <div
                className={"flex w-full xl:gap-10 gap-4 sm:relative sm:px-20 h-full justify-center sm:h-auto flex-col xl:flex-row pb-10"}>
                <div
                    className={"flex px-10 sm:px-0 flex-row xl:flex-col xl:gap-10 gap-4 sm:items-end items-center justify-between absolute top-[90px] w-full sm:w-auto sm:static sm:justify-start"}>
                    <InterfaceStats accuracyTitle={t("accuracy")} correct={correct} trials={trials} percent={percent}
                                    time={time}/>
                    <div className={"flex sm:gap-4"}>
                        <InterfaceButton src={"/save.png"} alt={"save"} onClick={() => setIsSaving(true)}/>
                        <InterfaceButton src={"/gear.png"} alt={"settings"} onClick={() => setIsSettingOpen(true)}/>
                    </div>
                </div>
                <div className={"flex flex-col sm:bg-zinc-900 rounded-lg"}>
                    <div
                        className={"sm:bg-zinc-800 rounded-lg xl:h-[200px] py-6 box-border flex flex-col items-center justify-center sm:gap-4 gap-2"}>
                        <p className={"bg-primary xl:py-4 xl:px-6 py-3 px-4 rounded-lg text-sm lg:text-lg 2xl:text-xl flex-shrink-0"}>{verbType}</p>
                        <div
                            className={"text-2xl xl:h-16 x-12 xl:text-4xl flex flex-wrap px-10 items-end justify-center"}>{children}</div>
                    </div>
                    <div
                        className={"2xl:px-32 sm:px-20 px-10 xl:py-20 sm:py-12 py-6 xl:w-[800px] 2xl:w-[1000px] xl:gap-20 gap-12 flex flex-col"}>
                        <div className={"flex flex-col gap-4 pt-4"}>
                            <FormEntry placeholder={t("placeholder")} borderClass={formBorder} type={"text"}
                                       onChange={onChange} value={value}
                                       onKeyDown={handleKeyDown}
                                       onCompositionStart={() => setIsComposing(true)}
                                       onCompositionEnd={() => setIsComposing(false)}
                                       className={`${formText} text-center text-xl sm:text-xl md:text-2xl`}/>
                            <div className={"flex justify-between items-center"}>
                                <div className={"flex gap-4 h-6 items-center"}>
                                <span onClick={onHint}
                                      className={`${lgText} select-none text-zinc-500 cursor-pointer hover:text-foreground transition`}>{t("hint")}</span>
                                    <div className={"w-[1px] h-full border-l border-zinc-500"}></div>
                                    <span onClick={onSkip}
                                          className={`${lgText} select-none text-zinc-500 cursor-pointer hover:text-foreground transition`}>{t("skip")}</span>
                                </div>
                                <button
                                    className={`${lgText} md:hidden flex-shrink-0 border-b hover:text-emphasis hover:border-emphasis transition`}
                                    onClick={onClick}>{t("check")}</button>
                            </div>
                        </div>
                        <div className={"flex md:flex-row-reverse justify-between gap-10 items-center"}>
                            <button
                                className={`${lgText} hidden md:block py-4 px-6 rounded-lg flex-shrink-0 border-primary border hover:bg-primary transition`}
                                onClick={() => onClick()}>{t("check")}</button>
                            {status === "empty" ? <></> : <div className={`${lgText} flex items-center gap-4`}>
                                {icon}
                                <span>{message}</span>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default KatsuyouInterface