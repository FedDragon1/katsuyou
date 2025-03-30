import { ChangeEventHandler, FC, useState } from "react";

interface InterfaceCheckboxProps {
    display: string
    value: boolean
    disabled?: boolean
    onChange: ChangeEventHandler<HTMLInputElement>
}

const KatsuyouCheckBox: FC<InterfaceCheckboxProps> = ({ display, value, onChange, disabled }) => {
    const [hover, setHover] = useState(false)

    return (
        <div className={"flex items-center gap-4"}>
            <div className={"w-8 h-8 border border-foreground relative group flex-shrink-0"}>
                <input type={"checkbox"} checked={value} onChange={onChange} disabled={disabled}
                       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
                       className={"w-full h-full relative z-50 opacity-0 peer"}/>
                <div className={"absolute w-full h-full top-0 left-0 p-1.5 bg-foreground bg-clip-content transition group-hover:bg-zinc-300 peer-checked:opacity-100 opacity-0"} />
            </div>
            <div className={"relative"}>
                <h2 className={`text-xl sm:text-2xl px-2 transition ${value ? 'text-foreground' : "text-zinc-300"}`}>{display}</h2>
                <div className={`absolute h-[4px] bg-foreground top-1/2 transition-all ${value || hover ? 'w-0 right-0' : 'w-full'}`}></div>
            </div>
        </div>
    )
}

export default KatsuyouCheckBox