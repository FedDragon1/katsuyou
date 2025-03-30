"use client"

import { FC } from "react";
import { useRouter } from "next/navigation";

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

export default NavLink