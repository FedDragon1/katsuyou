import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

interface ActivityTableRowDesc {
    name: string
    example: string
    href: string
}

interface ActivityTableProps {
    desc: ActivityTableRowDesc[]
    className?: string
    children?: ReactNode
    title: string
}

const ActivityTableRow: FC<ActivityTableRowDesc> = ({ name, example, href }) => {
    return (
        <Link href={href}
              className={"flex border-b border-zinc-700 transition hover:border-foreground gap-8 py-10 first:pt-0 group items-center justify-between cursor-pointer"}>
            <div className={"flex"}>
                <span
                    className={"text-xl font-semibold group-hover:text-emphasis transition md:min-w-[400px]"}>{name}</span>
                <span
                    className={"text-xl text-zinc-300 group-hover:text-foreground transition hidden lg:block"}>{example}</span>
            </div>
            <div className={"relative h-7 flex items-center"}>
                <span className={"md:text-[5rem] text-6xl leading-none pb-3 group-hover:rotate-45 transition"}>+</span>
            </div>
        </Link>
    )
}

const ActivityTable: FC<ActivityTableProps> = ({ desc, className, children, title }) => {
    return (
        <div className={"w-full flex flex-col px-10 sm:px-20 py-24 gap-10"}>
            <hr className={"hidden xl:block"}/>
            <div className={"flex w-full gap-10 flex-col xl:flex-row"}>
                <div className={"max-w-[300px] flex-grow self-start xl:sticky top-36"}>
                    <h1 className={"text-4xl emphasis inline before:bottom-0 before:h-4"}>{title}</h1>
                </div>
                <hr className={"xl:hidden"}/>
                <div className={twMerge("flex flex-col", className)}>
                    {desc.map(({ name, example, href }, index) => {
                        return (
                            <ActivityTableRow name={name} example={example} href={href} key={index}/>
                        )
                    })}
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ActivityTable