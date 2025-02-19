import { FC } from "react";

interface ValueChooserProps {
    min: number
    max: number
    title: string
    value: number
    onChange: (newValue: number) => void
}

const ValueChooser: FC<ValueChooserProps> = ({ min, max, value, title, onChange }) => {
    const currentIndex = (value > max ? max + 1 : value) - min

    const handleChange = (delta: number) => {
        if (value > max && delta > 0 || value + delta < min) {
        } else if (value > max) {
            onChange(max)
        } else if (value + delta === max + 1) {
            onChange(Infinity)
        } else {
            onChange(value + delta)
        }
    }

    const display = [
        "聞く",
        "聞かせる",
        "聞かせている",
        "聞かせていない",
        "聞かせていないようだ",
        "聞かせていないようだった"
    ]

    return (
        <div className={"w-full flex flex-col gap-12"}>
            <h2 className={"text-2xl sm:text-3xl self-start emphasis relative before:-bottom-1"}>{title}</h2>
            <div className={"flex justify-between items-center"}>
                <div className={"flex gap-4 items-center"}>
                    <div onClick={() => handleChange(-1)}
                         className={"w-6 h-6 transition bg-foreground triangle rotate-180 hover:bg-zinc-300"}></div>
                    <div className={"relative overflow-hidden h-[50px]"}>
                        <div className={"flex flex-col transition-all relative"}
                             style={{ top: `-${(currentIndex) * 100}%` }}>
                            {Array(max - min + 2).fill(0).map((_, i) => i + min).map((i) => {
                                const d = i > max ? "∞" : i.toString().padStart(2, "0")
                                return (
                                    <span key={i}
                                          className={"text-5xl h-[50px] w-[200px] sm:w-[300px] text-center font-bold"}>{d}</span>
                                )
                            })}
                        </div>
                    </div>
                    <div onClick={() => handleChange(1)}
                         className={"w-6 h-6 transition bg-foreground triangle hover:bg-zinc-300"}></div>
                </div>
                <div className={"relative overflow-hidden h-[50px] hidden xl:block"}>
                    <div className={"flex flex-col transition-all relative"}
                         style={{ top: `-${(currentIndex) * 100}%` }}>
                        {display.map((d) => {
                            return (
                                <span key={d} className={"text-5xl h-[50px] text-right font-bold"}>{d}</span>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ValueChooser