import { FC } from "react";
import DashboardNav from "@/components/DashboardNav";
import { getTranslations } from "next-intl/server";
import ActivityTable from "@/components/ActivityTable";
import KatsuyouLink from "@/components/Link";
import Footer from "@/components/Footer";
import TabFrame from "@/components/TabFrame";

const Practice: FC = async () => {
    const t = await getTranslations("Practice")

    const activities = [
        {
            name: t("activity.modern_verb"),
            example: "言う ＋ ない ＋ た ＝ 言わなかった",
            href: "/practice/interactive/modern/verb"
        },
        {
            name: t("activity.modern_adjective"),
            example: "寒い ＋ ない ＋ です ＝ 寒くないです",
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
        },
        {
            name: t("activity.modern_ba"),
            example: "食べる ＋ ば ＝ 食べれば",
            href: "/practice/interactive/modern/ba"
        },
        {
            name: t("activity.modern_nai"),
            example: "買う ＋ ない ＝ 買わない",
            href: "/practice/interactive/modern/nai"
        },
        {
            name: t("activity.modern_u"),
            example: "帰る ＋ う ＝ 帰ろう",
            href: "/practice/interactive/modern/ta"
        },
        {
            name: t("activity.modern_godan"),
            example: "借りる、始まる、書く",
            href: "/practice/interactive/modern/godan"
        },
        {
            name: t("activity.modern_ichidan"),
            example: "起きる、寝る、いる",
            href: "/practice/interactive/modern/ichidan"
        },
        {
            name: t("activity.modern_henkaku"),
            example: "する、来る",
            href: "/practice/interactive/modern/henkaku"
        },
        {
            name: t("activity.modern_i"),
            example: "かわいい、赤い、少ない",
            href: "/practice/interactive/modern/i"
        },
        {
            name: t("activity.modern_na"),
            example: "好き、きれい、上手",
            href: "/practice/interactive/modern/na"
        }
    ]

    return (
        <>
            <DashboardNav>
                <div className={"lg:flex flex-row gap-10 hidden"}>
                    <KatsuyouLink className={"fancy-link"} display={"Activities"} redirect={"/practice"}/>
                    <KatsuyouLink className={"fancy-link"} display={"Learning History"} redirect={"/dashboard/history"}/>
                </div>
            </DashboardNav>
            <TabFrame title={"Activities"}>
                <ActivityTable desc={activities} className={"flex-grow"}/>
            </TabFrame>
            <Footer />
        </>
    )
}

export default Practice