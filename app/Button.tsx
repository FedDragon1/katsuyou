import { FC, ReactNode } from "react";

interface ButtonProps {
    children: ReactNode
    className?: string
}

const Button: FC<ButtonProps> = ({ children, className }) => {
    return (
        <div className={`f-button rounded-full cursor-pointer transition-all hover:text-background ${className ?? ''}`}>
            {children}
        </div>
    )
}

export default Button