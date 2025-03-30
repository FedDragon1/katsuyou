import { FC, ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import KatsuyouLink from "@/components/Link";
import NavLink from "@/components/NavLink";
import Image from "next/image";

interface DashboardNavProps {
    subtitle?: ReactNode
}

const DashboardNav: FC<DashboardNavProps> = async ({ subtitle }) => {
    const t = await getTranslations("Navigation")
    const cookieState = await cookies()

    const user = JSON.parse(cookieState.get("resolved-user")!.value)

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
                <Image src={user.avatar} alt={"avatar"} width={200} height={200}
                       className={"w-full object-cover border-zinc-500 border rounded-full"} />
                <div className={"absolute z-50 p-4 w-[300px] bg-zinc-800 bg-opacity-50 transition origin-top-right duration-300 scale-0 group-hover:scale-100 rounded-lg right-0 top-full backdrop-blur-lg"}>
                    <div className={"flex flex-col items-center py-6"}>
                        <Image src={user.avatar} alt={"avatar"} width={200} height={200}
                               className={"w-24 h-24 rounded-full border-zinc-500 border"} />
                        <h2 className={"text-xl mt-6"}>{user.name}</h2>
                        <span className={"text-zinc-400 mt-1"}>{user.email}</span>
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