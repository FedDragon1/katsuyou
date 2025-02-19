"use client"

import { FC, MouseEvent, MouseEventHandler } from "react";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

interface KatsuyouLinkProps {
    display: string
    redirect: string
    className?: string
    onClick?: MouseEventHandler
}

const KatsuyouLink: FC<KatsuyouLinkProps> = ({ display, redirect, className, onClick }) => {
    const router = useRouter()

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()

        if (!redirect.startsWith("#")) {
            router.push(redirect)
            if (onClick) {
                onClick(e)
            }
            return;
        }

        const targetId = redirect.toString().split('#')[1];
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });

            window.history.pushState({}, '', `#${targetId}`);
        }

        if (onClick) {
            onClick(e)
        }
    };

    return (
        <a href={redirect} onClick={handleClick}
              className={twMerge("text-foreground text-lg no-underline relative transition hover:text-zinc-300", className)}>
            {display}
        </a>
    )
}

export default KatsuyouLink