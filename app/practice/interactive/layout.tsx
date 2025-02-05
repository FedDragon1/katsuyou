import { FC, ReactNode } from "react";

interface LayoutProps {
    children: ReactNode
}

const InteractiveLayout: FC<LayoutProps> = ({ children }) => {
    return (
        <div className={"h-screen w-screen overflow-hidden"}>
            {children}
        </div>
    )
}

export default InteractiveLayout