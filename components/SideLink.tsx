import { FC, MouseEventHandler } from "react";

interface SideLinkProps {
    display: string
    onClick?: MouseEventHandler
}

const SideLink: FC<SideLinkProps> = ({ display, onClick}) => {
    return (
        <div className={"inline-flex group items-baseline gap-4 cursor-pointer hover:ml-2 transition-all"} onClick={onClick}>
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
                 className={"stroke-zinc-400 group-hover:stroke-foreground transition sm:w-[18px] sm:h-[18px] w-[14px] h-[14px]"}>
                <path d="M0.75 13.25L13.25 0.75M13.25 0.75H0.75M13.25 0.75V13.25" strokeWidth={1}
                      strokeLinecap="round"/>
            </svg>
            <span className={"text-zinc-400 group-hover:text-foreground transition text-xl sm:text-2xl"}>{display}</span>
        </div>
    )
}

export default SideLink