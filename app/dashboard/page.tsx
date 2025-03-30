import { FC } from "react";
import DashboardNav from "@/components/DashboardNav";
import Link from "next/link";

const Dashboard: FC = () => {
    return (
        <>
            <DashboardNav />
            <div>
                <h1>Dashboard</h1>
                <Link href={"/practice"} className={"underline"}>Practices</Link>
            </div>
        </>

    )
}

export default Dashboard