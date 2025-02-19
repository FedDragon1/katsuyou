import { FC, ReactNode } from "react";
import KatsuyouLink from "@/components/Link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface DashboardNavProps {
    subtitle?: ReactNode
}

interface NavLinkProps {
    display: string
    redirect: string
}

const NavLink: FC<NavLinkProps> = ({ display, redirect }) => {
    const router = useRouter();
    const click = () => router.push(redirect)

    return (
        <div className={"inline-flex group items-baseline gap-4 cursor-pointer hover:ml-2 transition-all"} onClick={click}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
                 className={"stroke-zinc-400 group-hover:stroke-foreground transition w-[14px] h-[14px]"}>
                <path d="M0.75 13.25L13.25 0.75M13.25 0.75H0.75M13.25 0.75V13.25" strokeWidth={1}
                      strokeLinecap="round"/>
            </svg>
            <span className={"text-zinc-400 group-hover:text-foreground transition text-lg"}>{display}</span>
        </div>
    )
}

const DashboardNav: FC<DashboardNavProps> = ({ subtitle }) => {
    const t = useTranslations("Navigation")

    const avatar = "https://picsum.photos/200"
    const username = "Fedele Wu"
    const email = "fedelewu@gmail.com"

    return (
        <nav className={"sticky flex-shrink-0 flex z-50 sm:px-20 px-10 sm:h-24 h-20 items-center top-0 justify-between w-full border-b border-zinc-800 before:backdrop-blur-lg before:w-full before:h-full before:absolute before:-z-10"}>
            <div className={"flex gap-12 items-center"}>
                <KatsuyouLink className={"text-4xl sm:text-5xl cursor-pointer select-none z-[100] text-foreground"}
                              redirect={"/dashboard"}
                              display={"Katsuyō"}></KatsuyouLink>
                <div className={"hidden md:block"}>
                    {subtitle}
                </div>
            </div>
            <div className={"rounded-full relative h-full w-12 group flex items-center"}>
                <Image src={avatar} alt={"avatar"} width={200} height={200}
                       className={"w-full object-cover border-zinc-500 border rounded-full"} />
                <div className={"absolute z-50 p-4 w-[300px] bg-zinc-800 bg-opacity-50 transition origin-top-right duration-300 scale-0 group-hover:scale-100 rounded-lg right-0 top-full backdrop-blur-lg"}>
                    <div className={"flex flex-col items-center py-6"}>
                        <Image src={avatar} alt={"avatar"} width={200} height={200}
                               className={"w-24 h-24 rounded-full border-zinc-500 border"} />
                        <h2 className={"text-xl mt-6"}>{username}</h2>
                        <span className={"text-zinc-400 mt-1"}>{email}</span>
                    </div>
                    <hr className={"border-b border-zinc-700 mb-3"} />
                    <NavLink display={t("settings")} redirect={"/settings"} />
                    <hr className={"border-b border-zinc-700 my-3"} />
                    <NavLink display={t("logout")} redirect={"/logout"} />
                </div>
            </div>
        </nav>
    )
}

export default DashboardNav