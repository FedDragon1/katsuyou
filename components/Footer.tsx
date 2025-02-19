import { FC } from "react";
import KatsuyouLink from "@/components/Link";

const Footer: FC = () => {
    const titleSize = "2xl:text-[9rem] xl:text-[8rem] lg:text-[6rem] md:text-[4rem] text-[3rem] text-nowrap"

    return (
        <footer className={"px-10 sm:px-20 bg-background"}>
            <hr className={"w-full border-b border-zinc-800"}/>
            <div className={"flex justify-between"}>
                <span className={`${titleSize}`}>KATSUYŌ</span>
                <span className={`${titleSize} hidden sm:block`}>カツヨウ</span>
            </div>
            <hr className={"w-full border-b border-zinc-800"}/>
            <div className={"flex justify-between pt-10 pb-14 flex-wrap gap-4"}>
                <span className={"text-zinc-600"}>© KATSUYŌ 2025 ALL RIGHTS RESERVED</span>
                <div className={"flex gap-4"}>
                    <KatsuyouLink className={"fancy-link"} display={"Privacy Policy"} redirect={"#"} />
                    <div className={"w-[1px] border-l border-foreground"} />
                    <KatsuyouLink className={"fancy-link"} display={"Cookie Policy"} redirect={"#"} />
                </div>
            </div>
        </footer>
    )
}

export default Footer