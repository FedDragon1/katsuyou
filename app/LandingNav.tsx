import { FC } from "react";
import { useTranslations } from "next-intl";
import KatsuyouLink from "@/app/Link";

const LandingNav: FC = () => {
    const t = useTranslations("Landing")

    return (
        <nav className={"fixed top h-[120px] sm:h-[180px] z-50 top-0 px-10 sm:px-20 flex justify-between w-full box-border items-center"}>
            <div className={"flex flex-row gap-40 items-center"}>
                <KatsuyouLink className={"text-5xl cursor-pointer select-none text-foreground"} redirect={"#main"} display={"Katsuyō"}></KatsuyouLink>
                <div className={"lg:flex flex-row gap-10 hidden"}>
                    <KatsuyouLink className={"fancy-link"} display={t("links.solution")} redirect={"#solution"} />
                    <KatsuyouLink className={"fancy-link"} display={t("links.login")} redirect={"/login"} />
                    <KatsuyouLink className={"fancy-link"} display={t("links.about")} redirect={"/about"} />
                </div>
            </div>
            <div className={"h-14 w-14 rounded-full border-foreground border relative border-solid hover:border-zinc-300 transition overflow-hidden group flex flex-col box-border items-center justify-center gap-2"}>
                <input type={"checkbox"} className={"w-full h-full m-0 absolute z-50 opacity-0 peer"} />
                <div className={"w-7 h-[1px] border-0 border-b border-solid transition duration-300 group-hover:border-zinc-300 peer-checked:[transform:translate(0,4px)_rotate(135deg)]"} />
                <div className={"w-7 h-[1px] border-0 border-b border-solid transition duration-300 group-hover:border-zinc-300 peer-checked:[transform:translate(0,-4px)_rotate(-135deg)]"} />
            </div>
        </nav>
    )
}

export default LandingNav