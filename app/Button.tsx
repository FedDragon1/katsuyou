import { FC, MouseEventHandler, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
    children: ReactNode
    className?: string
    onClick?: MouseEventHandler
}

const Button: FC<ButtonProps> = ({ children, className, onClick }) => {
    return (
        <div onClick={onClick}
             className={twMerge("f-button rounded-full cursor-pointer transition-all hover:text-background", className)}>
            {children}
        </div>
    )
}

export default Button