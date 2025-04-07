import { FC, MouseEventHandler } from "react";

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

export default LanguageButton