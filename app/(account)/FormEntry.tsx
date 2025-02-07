import { ChangeEventHandler, FC, HTMLInputTypeAttribute } from "react";
import { twMerge } from "tailwind-merge";

interface FormEntryProps {
    caption?: string
    placeholder: string
    type: HTMLInputTypeAttribute
    onChange?: ChangeEventHandler
    className?: string
    borderClass?: string
}

const FormEntry: FC<FormEntryProps> = ({ className, borderClass, caption, placeholder, type, onChange }) => {
    return (
        <div className={"flex flex-col gap-4"}>
            {
                caption ? <span className={"text-xl sm:text-2xl"}>{caption}</span> : <></>
            }
            <div className={twMerge("form-input border-b border-zinc-700", borderClass)}>
                <input type={type} placeholder={placeholder} name={caption} onChange={onChange}
                       className={twMerge("outline-none text-xl sm:text-2xl bg-transparent leading-[3rem] w-full placeholder:text-zinc-500", className)}/>
            </div>
        </div>
    )
}

export default FormEntry