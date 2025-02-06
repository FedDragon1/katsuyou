import { FC, ReactNode } from "react";

interface SideEntryProps {
    name: string
    children: ReactNode
}

const SideEntry: FC<SideEntryProps> = ({ name, children }) => {
    return (
        <div className={"flex flex-col gap-6"}>
            <span className={"text-xl sm:text-2xl"}>{name}</span>
            {children}
        </div>
    )
}

export default SideEntry