import { ChangeEventHandler, FC, HTMLInputTypeAttribute } from "react";

interface FormEntryProps {
    caption: string
    placeholder: string
    type: HTMLInputTypeAttribute
    onChange?: ChangeEventHandler
}

const FormEntry: FC<FormEntryProps> = ({ caption, placeholder, type, onChange }) => {
    return (
        <div className={"flex flex-col gap-4"}>
            <span className={"text-xl sm:text-2xl"}>{caption}</span>
            <div className={"form-input border-b border-zinc-700"}>
                <input type={type} placeholder={placeholder} name={caption} onChange={onChange}
                       className={"outline-none text-xl sm:text-2xl bg-transparent leading-[3rem] placeholder:text-zinc-500"}/>
            </div>
        </div>
    )
}

export default FormEntry