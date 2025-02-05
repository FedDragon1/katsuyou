"use client"

import { FC } from "react";
import KatsuyouInterface from "@/app/practice/interactive/KatsuyouInterface";

interface KatsuyouModernProps {
    s: string
}

const KatsuyouModern: FC<KatsuyouModernProps> = () => {
    return (
        <main className={"w-screen h-screen"}>
            <KatsuyouInterface onClick={console.log}>
                aaa
            </KatsuyouInterface>
        </main>
    )
}

export default KatsuyouModern