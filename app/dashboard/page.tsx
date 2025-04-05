import { FC } from "react";
import Link from "next/link";
import LearningHistoryTable from "@/components/LearningHistoryTable";
import Button from "@/components/Button";
import { getTranslations } from "next-intl/server";
import ActivityTable from "@/components/ActivityTable";
import DonezoGradient from "@/components/DonezoGradient";

const DashboardCover: FC = () => {
    return (
        <div className={"sm:h-[calc(100%-96px)] h-[calc(100%-80px)] w-full flex-shrink-0 relative"}>
            <DonezoGradient className={"w-full h-full overflow-hidden absolute"}
                            colorA={0xF32635} colorB={0xF3A470}
                            colorC={0x93a181} colorD={0x5C3F45} />
            <div className={"w-full h-full flex gap-10 z-40 relative"}>
                <div></div>
                <div className={"flex-grow bg-background"}>

                </div>
                <div></div>
            </div>
        </div>
    )
}

const LearningHistory: FC = async () => {
    const t = await getTranslations("Landing")

    return (
        <div className={"w-full min-h-screen flex flex-col lg:flex-row px-10 sm:px-20 py-24 gap-10"}>
            <div>
                <span className={"text-emphasis leading-[3.75rem] text-nowrap"}>{t("solution.aside")}</span>
            </div>
            <div className={"flex-grow flex flex-col gap-16"}>
                <div className={"flex justify-between items-center gap-8"}>
                    <h1 className={"text-4xl sm:text-6xl"}>{t("solution.title")}</h1>
                    <hr className={"border-b hidden lg:block border-foreground flex-grow max-w-[50%]"}/>
                </div>
                <div className={"flex flex-col gap-2"}>
                    <div className={"max-h-[150px]"}>
                        <p className={"text-xl sm:text-3xl max-w-[520px]"}>{t("solution.subtitle")}</p>
                    </div>
                    <LearningHistoryTable min={3} max={3}/>
                </div>
                <Button className={"self-start"}>
                    <Link href={"/dashboard/history"}
                          className={"block text-2xl md:text-3xl py-4 px-8 md:py-6 md:px-20"}>
                        {t("join.button")}
                    </Link>
                </Button>
            </div>
        </div>
    )
}

const ActivitySuggestion: FC = async () => {
    const t = await getTranslations("Practice")

    const activities = [
        {
            name: t("activity.modern_verb"),
            example: "言う ＋ ない ＋ た ＝ 言わなかった",
            href: "/practice/interactive/modern/verb"
        },
        {
            name: t("activity.modern_adjective"),
            example: "寒い ＋ ない ＋ だ ＋ う ＝ 寒くないだろう",
            href: "/practice/interactive/modern/adjective"
        },
        {
            name: t("activity.modern_te"),
            example: "立つ ＋ て ＝ 立って",
            href: "/practice/interactive/modern/te"
        },
        {
            name: t("activity.modern_ta"),
            example: "動く ＋ た ＝ 動いた",
            href: "/practice/interactive/modern/ta"
        }
    ]

    return (
        <ActivityTable desc={activities} className={"flex-grow"}>
            <Button className={"self-start mt-16"}>
                <Link href={"/practice"}
                      className={"block text-2xl md:text-3xl py-4 px-8 md:py-6 md:px-20 xl:px-40"}>
                    {"See All"}
                </Link>
            </Button>
        </ActivityTable>
    )
}

const Dashboard: FC = () => {
    return (
        <>
            <DashboardCover/>
            <div>
                <LearningHistory />
                <ActivitySuggestion />
            </div>
        </>
    )
}

export default Dashboard