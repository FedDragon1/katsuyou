import { FC } from "react";

const LoadingPage: FC = () => {
    return (
        <div className={"h-screen w-screen flex items-center justify-center gap-4"}>
            <div className={"size-14 relative flex justify-center items-center"}>
                <div
                    className={"size-14 bg-[conic-gradient(var(--foreground),var(--background))] absolute rounded-full animate-spin"}></div>
                <div className={"size-12 bg-background absolute rounded-full"}></div>
            </div>
            <h1 className={"text-6xl"}>カツヨウ</h1>
        </div>
    )
}

export default LoadingPage