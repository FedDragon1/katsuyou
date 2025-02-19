import { FC } from "react";

interface FlipperProps {
    onClick: () => void
}

const Flipper: FC<FlipperProps> = ({ onClick }) => {
    return (
        <div onClick={onClick} className={"h-full flex items-center group px-2"}>
            <div
                className={"w-6 h-6 flex rounded-full border-foreground border overflow-hidden group-hover:rotate-180 transition duration-300"}>
                <div className={"flex-1 bg-foreground"}/>
                <div className={"flex-1"}/>
            </div>
        </div>
    )
}

export default Flipper