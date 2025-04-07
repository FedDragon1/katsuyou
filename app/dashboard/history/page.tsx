import { FC } from "react";
import TabFrame from "@/components/TabFrame";
import { getTranslations } from "next-intl/server";
import LearningHistoryTable from "@/components/LearningHistoryTable";

const HistoryPage: FC = async () => {
    const t = await getTranslations("History")

    return (
        <TabFrame title={t("title")}>
            <div className={"w-full px-20 pb-20 relative"}>
                <LearningHistoryTable min={5}
                                      headingClassName={"bg-background pt-20 sticky top-[50px] sm:top-[66px] z-10"} />
            </div>
        </TabFrame>
    )
}

export default HistoryPage