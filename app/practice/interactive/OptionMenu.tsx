import { FC, ReactNode } from "react";

interface OptionMenuProps {
    title: string
    children: ReactNode
    titleButton?: ReactNode
}

const OptionMenu: FC<OptionMenuProps> = ({ children, title, titleButton }) => {
    const gridCols = "min-[1600px]:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2"

    return (
        <div className={"w-full flex flex-col gap-12"}>
            <div className={"flex items-center gap-4"}>
                <h2 className={"text-2xl sm:text-3xl self-start emphasis relative before:-bottom-1"}>{title}</h2>
                {titleButton}
            </div>
            <div className={`grid ${gridCols} gap-12 items-center justify-between flex-wrap`}>
                {children}
            </div>
        </div>
    )
}

export default OptionMenu