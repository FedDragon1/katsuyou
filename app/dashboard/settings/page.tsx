import { FC } from "react";
import { getTranslations } from "next-intl/server";
import TabFrame from "@/components/TabFrame";

const SettingsPage: FC = async () => {
    const t = await getTranslations("Settings")

    return (
        <TabFrame title={t("title")}>
            <div className={"w-full px-20 py-20 relative"}>
                <span className={"text-2xl"}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur iure tempore tenetur? Animi assumenda corporis doloribus esse eveniet id laborum, maiores natus provident quae sapiente temporibus ut. Aperiam, harum, quia.
                </span>
            </div>
        </TabFrame>
    )
}

export default SettingsPage