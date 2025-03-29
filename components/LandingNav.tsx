"use client"

import { FC, MouseEventHandler, useRef } from "react";
import { useTranslations } from "next-intl";
import KatsuyouLink from "@/components/Link";
import { usePathname, useRouter } from "next/navigation";
import { setLocaleCookie } from "@/app/actions";
interface LanguageButtonProps {
    display: string
    onClick: MouseEventHandler
}

const LanguageButton: FC<LanguageButtonProps> = ({ display, onClick }) => {
    return (
        <div onClick={onClick}
             className={"w-20 h-20 cursor-pointer rounded-full border border-zinc-300 transition hover:border-foreground group flex justify-center items-center"}>
            <span className="text-zinc-300 group-hover:text-foreground">{display}</span>
        </div>
    )
}

interface LandingNavProps {
    hideOptions?: boolean
    sticky?: boolean
}

const LandingNav: FC<LandingNavProps> = ({ hideOptions, sticky }) => {
    const t = useTranslations("Landing")

    const linkSizes = "arrow-link text-[2rem] md:text-[3rem] 2xl:text-[4rem] m-0 mx-10"
    const router = useRouter();
    const checkbox = useRef<HTMLInputElement>(null)

    const closeNav = () => {
        if (checkbox.current) {
            checkbox.current.checked = false
        }
    }

    const changeLanguage = async (locale: string) => {
        await setLocaleCookie(locale)
        closeNav()
        router.refresh()
    }

    const pathname = usePathname()
    const homeRedirect = pathname === "/" ? "#main" : "/"
    const solutionRedirect = pathname === "/" ? "#solution" : "/#solution"

    return (
        <nav
            className={`${sticky ? 'sticky': 'fixed'} h-[120px] sm:h-[180px] z-40 top-0 px-10 sm:px-20 flex justify-between w-full box-border items-center`}>
            <div className={"flex flex-row gap-40 items-center"}>
                <KatsuyouLink className={"text-4xl sm:text-5xl cursor-pointer select-none z-[100] text-foreground"}
                              redirect={homeRedirect}
                              display={"Katsuyō"}></KatsuyouLink>
                {hideOptions ? <></> : <div className={"lg:flex flex-row gap-10 hidden"}>
                    <KatsuyouLink className={"fancy-link"} display={t("links.solution")} redirect={solutionRedirect}/>
                    <KatsuyouLink className={"fancy-link"} display={t("links.login")} redirect={"/login"}/>
                    <KatsuyouLink className={"fancy-link"} display={t("links.about")} redirect={"/about"}/>
                </div>}
            </div>
            <div
                className={"h-14 w-14 z-50 relative group flex flex-col box-border items-center justify-center gap-2"}>
                <div
                    className={"h-full absolute w-full border-foreground border group-hover:border-zinc-300 transition rounded-full"}></div>
                <input type={"checkbox"} className={"w-full h-full m-0 absolute z-10 opacity-0 peer"} ref={checkbox}/>
                <div
                    className={"w-7 h-[1px] border-0 border-b border-solid transition duration-300 group-hover:border-zinc-300 peer-checked:[transform:translate(0,4px)_rotate(135deg)]"}/>
                <div
                    className={"w-7 h-[1px] border-0 border-b border-solid transition duration-300 group-hover:border-zinc-300 peer-checked:[transform:translate(0,-4px)_rotate(-135deg)]"}/>
                <div
                    className={`w-screen h-screen backdrop-brightness-50 backdrop-blur-lg fixed -z-10 transition-all duration-500 -top-[120%] left-0 peer-checked:top-0`}>
                    <div className={"px-10 sm:px-20 pt-[120px] sm:pt-[160px] h-full flex flex-col overflow-auto"}>
                        <hr className={"border-b border-[#ffffff22] mb-10"}/>
                        <div
                            className={"flex flex-col lg:flex-row flex-wrap w-full flex-grow justify-between gap-10 lg:gap-14 xl:gap-20"}>
                            <div className={"hidden min-[1900px]:flex flex-1 flex-col gap-10 lg:gap-14 xl:gap-20"}>
                                <div className={"flex gap-2 items-baseline flex-wrap"}>
                                    <h1 className={"text-[4rem] leading-[5rem] m-0 inline"}>カツヨウ</h1>
                                    <span className={"italic"}>By Skyline High School</span>
                                </div>
                                <div className={"flex gap-2 items-baseline"}>
                                    <h1 className={"text-[4rem] leading-[5rem] m-0 inline"}>Fedele W</h1>
                                    <span className={"italic"}>2026</span>
                                </div>
                                <div className={"flex gap-2 items-baseline"}>
                                    <h1 className={"text-[4rem] leading-[5rem] m-0 inline"}>Jacky W</h1>
                                    <span className={"italic"}>2025</span>
                                </div>
                                <div className={"flex gap-2 items-baseline"}>
                                    <h1 className={"text-[4rem] leading-[5rem] m-0 inline"}>Jason H</h1>
                                    <span className={"italic"}>2025</span>
                                </div>
                            </div>
                            <div className={"lg:flex flex-col gap-14 xl:gap-20 hidden flex-1"}>
                                <KatsuyouLink className={linkSizes} onClick={() => changeLanguage("en")}
                                              display={"English"} redirect={"#"}/>
                                <KatsuyouLink className={linkSizes} onClick={() => changeLanguage("ja")}
                                              display={"日本語"} redirect={"#"}/>
                                <KatsuyouLink className={linkSizes} onClick={() => changeLanguage("zh")}
                                              display={"简体中文"} redirect={"#"}/>
                            </div>
                            <div className={"flex flex-col gap-10 lg:gap-14 xl:gap-20 flex-1"}>
                                <KatsuyouLink className={linkSizes} onClick={closeNav} display={"Home"}
                                              redirect={homeRedirect}/>
                                <KatsuyouLink className={linkSizes} onClick={closeNav} display={t("links.solution")}
                                              redirect={solutionRedirect}/>
                                <KatsuyouLink className={linkSizes} onClick={closeNav} display={t("links.login")}
                                              redirect={"/login"}/>
                                <KatsuyouLink className={linkSizes} onClick={closeNav} display={t("links.about")}
                                              redirect={"/about"}/>
                            </div>
                            <div className={"flex gap-4 flex-row-reverse lg:hidden pb-10"}>
                                <LanguageButton onClick={() => changeLanguage("en")}
                                                display={"English"}/>
                                <LanguageButton onClick={() => changeLanguage("ja")}
                                                display={"日本語"}/>
                                <LanguageButton onClick={() => changeLanguage("zh")}
                                                display={"简体中文"}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default LandingNav