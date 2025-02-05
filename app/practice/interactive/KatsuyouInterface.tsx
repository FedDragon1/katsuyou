"use client"

import { FC, MouseEventHandler, ReactNode } from "react";

interface KatsuyouInterfaceProps {
    children: ReactNode
    onClick: MouseEventHandler<HTMLButtonElement>
}

const KatsuyouInterface: FC<KatsuyouInterfaceProps> = ({ children, onClick }) => {
    return (
        <div className={"w-[700px] outline-red-400 outline h-[400px] border-red-500 flex flex-col items-center rounded-[50px] overflow-hidden"}>
            <div className={"h-[100px] w-full flex-shrink-0 bg-red-950"}>
                {children}
            </div>
            <div className={"flex-grow px-20 w-full flex flex-col gap-10 justify-center box-border"}>
                <input type={"text"} className={"min-w-0 w-full box-border text-center leading-10 text-3xl outline-none border-0 border-b bg-transparent"}/>
                <div className={"flex-col justify-items-end"}>
                    <div className={"flex-row-reverse justify-between"}>
                        <button type={"button"} onClick={onClick}>Check Answer</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KatsuyouInterface