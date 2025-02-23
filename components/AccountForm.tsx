import { FC, ReactNode } from "react";

interface AccountFormProps {
    caption: string
    children: ReactNode
    side: ReactNode
}

const AccountForm: FC<AccountFormProps> = ({ caption, children, side }) => {
    return (
        <div className={"bg-background flex flex-col lg:flex-row pt-32 pb-32 lg:pb-[240px] min-h-[30vh] gap-24 lg:gap-10 justify-between z-50 px-10 sm:px-20"}>
            <div className={"flex-grow max-w-[400px] hidden xl:block"}>
                <span className={"text-3xl arrow"}>{caption}</span>
            </div>
            <form className={"flex flex-col gap-24 flex-grow max-w-[700px]"}>
                {children}
            </form>
            <div className={"flex flex-col gap-24 z-20 lg:gap-16 flex-grow max-w-[400px]"}>
                {side}
            </div>
        </div>
    )
}

export default AccountForm