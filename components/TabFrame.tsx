import { FC, ReactNode } from "react";
import AccountBanner from "@/components/AccountBanner";

interface TabFrameProps {
    children?: ReactNode
    title: string
}

const TabFrame: FC<TabFrameProps> = ({ children, title }) => {
    return (
        <>
            <AccountBanner title={title}/>
            <div className={"bg-background mt-[calc(40vh-80px)] sm:mt-[calc(60vh-96px)]"}>
                {children}
            </div>
        </>
    )
}

export default TabFrame