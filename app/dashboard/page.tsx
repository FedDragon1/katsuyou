import { FC } from "react";
import Link from "next/link";

const DashboardCover: FC = () => {
    return (
        <div className={"sm:h-[calc(100%-96px)] h-[calc(100%-80px)] w-full border flex-shrink-0"}>
            hero
        </div>
    )
}

const Dashboard: FC = () => {
    return (
        <>
            <DashboardCover />
            <div>
                <h1>Dashboard</h1>
                <Link href={"/practice"} className={"underline"}>Practices</Link>

            </div>
        </>
    )
}

export default Dashboard