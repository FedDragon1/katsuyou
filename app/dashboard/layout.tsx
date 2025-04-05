import { FC, ReactNode } from "react";
import KatsuyouLink from "@/components/Link";
import DashboardNav from "@/components/DashboardNav";
import Footer from "@/components/Footer";

interface DashboardLayoutProps {
    children: ReactNode
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className={"flex flex-col h-screen overflow-y-auto"}>
            <DashboardNav>
                <div className={"lg:flex flex-row gap-10 hidden"}>
                    <KatsuyouLink className={"fancy-link"} display={"Activities"} redirect={"/practice"}/>
                    <KatsuyouLink className={"fancy-link"} display={"Learning History"} redirect={"/dashboard/history"}/>
                </div>
            </DashboardNav>
            {children}
            <Footer />
        </div>
    )
}

export default DashboardLayout