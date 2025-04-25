import { FC } from "react";
import DashboardNav from "@/components/DashboardNav";
import KatsuyouPracticeImpl from "@/components/KatsuyouPracticeImpl";

interface KatsuyouPracticeProps {
    settings: SettingDesc
}

const KatsuyouPractice: FC<KatsuyouPracticeProps> = ({ settings }) => {
    return (
        <div className={"flex flex-col h-screen overflow-y-auto overflow-x-hidden gap-8"}>
            <DashboardNav>{settings.subtitle}</DashboardNav>
            <main className={"w-screen flex justify-center items-center flex-grow"}>
                <KatsuyouPracticeImpl settings={settings} />
            </main>
        </div>
    )
}

export default KatsuyouPractice