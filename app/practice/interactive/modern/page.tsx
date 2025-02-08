"use client"

import { FC } from "react";
import KatsuyouInterface from "@/app/practice/interactive/KatsuyouInterface";
import { useTranslations } from "next-intl";
import DashboardNav from "@/app/DashboardNav";


const KatsuyouModern: FC = () => {
    const t = useTranslations("Practice")

    const message = t.rich("incorrect.double", {
        option1: "洗うべきではない",
        option2: "洗うべきじゃない",
        break: () => <br />
    })

    return (
        <>
            <div className={"flex flex-col h-screen overflow-y-auto overflow-x-hidden gap-8"}>
                <DashboardNav subtitle={t("activity.allModern")} />
                <main className={"w-screen flex justify-center items-center flex-grow"}>
                    <KatsuyouInterface onClick={console.log} correct={0} trials={0} verbType={"ア行五段活用"}
                                       status={"incorrect"}
                                       message={message}>
                        洗う＋べき＋だ＋ない
                    </KatsuyouInterface>
                </main>
            </div>
        </>
    )
}

export default KatsuyouModern