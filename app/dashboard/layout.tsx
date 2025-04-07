import { FC, ReactNode } from "react";
import KatsuyouLink from "@/components/Link";
import DashboardNav from "@/components/DashboardNav";
import Footer from "@/components/Footer";
import { getTranslations } from "next-intl/server";

interface DashboardLayoutProps {
    children: ReactNode
}

const DashboardLayout: FC<DashboardLayoutProps> = async ({ children }) => {
    const t = await getTranslations("Navigation")

    return (
        <div className={"flex flex-col h-screen overflow-y-auto"}>
            <DashboardNav>
                <div className={"lg:flex flex-row gap-10 hidden"}>
                    <KatsuyouLink className={"fancy-link"} display={t("activities")} redirect={"/practice"}/>
                    <KatsuyouLink className={"fancy-link"} display={t("history")} redirect={"/dashboard/history"}/>
                </div>
            </DashboardNav>
            {children}
            <Footer />
        </div>
    )
}

export default DashboardLayout