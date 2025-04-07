import { FC, ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { cookies } from "next/headers";
import { twMerge } from "tailwind-merge";

interface TableRowProps {
    index: number | string
    date: string,
    duration: string | number,
    name: string,
    accuracy: string | number,
    heading?: boolean
    children: ReactNode
    className?: string
    sticky?: boolean
}

interface TableProps {
    min?: number
    max?: number
    headingClassName?: string
}

interface TableLinkProps {
    href: string
}

const TableLink: FC<TableLinkProps> = ({ href }) => {
    return (
        <Link href={href} className={"group relative left-0 hover:left-1 transition-all flex justify-end"}>
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
                 className={"stroke-foreground group-hover:stroke-zinc-300 transition"}>
                <path d="M10 24H38M38 24L24 10M38 24L24 38" strokeWidth="4" strokeLinecap="round"
                      strokeLinejoin="round"/>
            </svg>
        </Link>
    )
}

const TableRow: FC<TableRowProps> = ({ index, date, duration, name, accuracy, children, heading, className }) => {
    const bold = heading ? 'font-semibold' : ''

    return (
        <div className={twMerge('w-full flex min-[1700px]:gap-20 sm:gap-10 gap-4 text-lg md:text-xl border-b border-zinc-700 py-10 items-center', className)}>
            <span className={`basis-0 ${bold} md:block hidden min-w-[80px] pl-8`}>{index}</span>
            <span className={`basis-0 ${bold} lg:block hidden min-w-[150px]`}>{date}</span>
            <span className={`basis-0 ${bold} flex-grow`}>{name}</span>
            <span className={`basis-0 ${bold} text-right hidden min-[1400px]:block min-w-[100px] min-[1700px]:min-w-[150px]`}>{duration}</span>
            <span className={`basis-0 ${bold} text-right hidden min-[1400px]:block min-w-[100px] min-[1700px]:min-w-[150px]`}>{accuracy}</span>
            <span className={`basis-0 ${bold} text-right md:text-left md:min-w-[150px] xl:pl-8 min-w-[80px] md:pr-8`}>{children}</span>
        </div>
    )
}

const LearningHistoryTable: FC<TableProps> = async ({ min, max, headingClassName }) => {
    const t = await getTranslations("Practice")
    const p = await getTranslations("Dashboard")
    const data: PracticeHistory[] = [
        {
            uuid: "asdlfkjasl;kdfj",
            user_id: "a;sldkfjaklsjdfh",
            type: "modern_verb",
            time: "2025-03-29 23:02:51.552+00",
            duration: 47,
            n_correct: 1,
            n_attempted: 2,
        },
        {
            uuid: "asdfasdfasdf",
            user_id: "a;sldkfjaklsjdfh",
            type: "modern_ba",
            time: "2025-03-30 03:15:46.154+00",
            duration: 47,
            n_correct: 10,
            n_attempted: 20,
        }
    ]

    const minItems = Math.max(min ?? 0, 0)
    const maxItems = Math.min(max ?? data.length, data.length)

    const cookieStore = await cookies()
    const locale = cookieStore.get("resolved-locale")!.value!

    return (
        <div className={"flex flex-col"}>
            <TableRow index={"#"} date={p("history.table.date")} duration={p("history.table.duration")}
                      name={p("history.table.name")} accuracy={p("history.table.accuracy")}
                      heading={true} className={headingClassName}>
                <p className={"text-right"}>{p("history.table.link")}</p>
            </TableRow>
            {data.slice(0, maxItems).map((history, i) => {
                const date = new Date(history.time).toLocaleDateString(locale)

                const name = t(`activity.${history.type}`)
                const accuracy = `${Math.round(history.n_correct / history.n_attempted * 100)}%`

                const min = Math.round(history.duration / 60).toString().padStart(2, "0")
                const sec = (history.duration % 60).toString().padStart(2, "0")
                const duration = `${min}:${sec}`

                const href = `practice/interactive/${history.type.split("_").join("/")}`

                return (
                    <TableRow key={history.uuid} index={i + 1} date={date} duration={duration} name={name}
                              accuracy={accuracy}>
                        <TableLink href={href}/>
                    </TableRow>
                )
            })}
            {Array(Math.max(minItems - data.length, 0)).fill(0).map((_, i) => {
                return (
                    <TableRow index={"--"} date={"--"} duration={"--:--"} name={"--"} accuracy={"--%"} key={i}
                              className={"text-zinc-300"}>
                        <p className={"text-nowrap whitespace-nowrap text-right"}>--</p>
                    </TableRow>
                )
            })}
        </div>
    )
}

export default LearningHistoryTable