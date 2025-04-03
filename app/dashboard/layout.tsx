import { FC, ReactNode } from "react";
import KatsuyouLink from "@/components/Link";
import DashboardNav from "@/components/DashboardNav";

interface DashboardLayoutProps {
    children: ReactNode
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className={"flex flex-col h-screen"}>
            <DashboardNav>
                <div className={"lg:flex flex-row gap-10 hidden"}>
                    <KatsuyouLink className={"fancy-link"} display={"Practice"} redirect={"/practice"}/>
                    <KatsuyouLink className={"fancy-link"} display={"Learning History"} redirect={"/history"}/>
                </div>
            </DashboardNav>
            {children}
        </div>
    )
}

export default DashboardLayout