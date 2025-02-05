"use client"

import { FC } from "react";
import KatsuyouInterface from "@/app/practice/interactive/KatsuyouInterface";


const KatsuyouModern: FC = () => {
    return (
        <main className={"w-screen h-screen"}>
            <KatsuyouInterface onClick={console.log}>
                aaa
            </KatsuyouInterface>
        </main>
    )
}

export default KatsuyouModern