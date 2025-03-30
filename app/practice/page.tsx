"use client"

import { FC } from "react";
import DashboardNav from "@/components/DashboardNav";
import Link from "next/link";

const Practice: FC = () => {
    return (
        <>
            <DashboardNav />
            <div className={"flex flex-col"}>
                <Link href={"/practice/interactive/modern/verb"}>all</Link>
                <Link href={"/practice/interactive/modern/ba"}>ba form</Link>
                <Link href={"/practice/interactive/modern/te"}>te form</Link>
                <Link href={"/practice/interactive/modern/ta"}>ta form</Link>
                <Link href={"/practice/interactive/modern/nai"}>nai form</Link>
                <Link href={"/practice/interactive/modern/u"}>volition form</Link>
                <Link href={"/practice/interactive/modern/godan"}>godan verb</Link>
                <Link href={"/practice/interactive/modern/ichidan"}>inchidan verb</Link>
                <Link href={"/practice/interactive/modern/henkaku"}>henkaku verb</Link>
            </div>
        </>
    )
}

export default Practice