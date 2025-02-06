import { FC, ReactNode } from "react";

interface AccountFormProps {
    caption: string
    children: ReactNode
    side: ReactNode
}

const AccountForm: FC<AccountFormProps> = ({ caption, children, side }) => {
    return (
        <div className={"flex flex-col lg:flex-row mt-32 mb-32 lg:mb-[240px] min-h-[30vh] gap-24 lg:gap-10 justify-between px-10 sm:px-20"}>
            <div className={"flex-grow max-w-[400px] hidden xl:block"}>
                <span className={"text-3xl arrow"}>{caption}</span>
            </div>
            <div className={"flex flex-col gap-24 flex-grow max-w-[700px]"}>
                {children}
            </div>
            <div className={"flex flex-col gap-24 lg:gap-16 flex-grow max-w-[400px]"}>
                {side}
            </div>
        </div>
    )
}

export default AccountForm