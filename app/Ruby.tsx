import { ComponentPropsWithoutRef, FC, Fragment, ReactNode } from "react";

interface RubyProps extends ComponentPropsWithoutRef<'ruby'> {
    text: string,
    ruby?: Record<number, string>
}

interface RbProps {
    children: ReactNode
}

// @ts-expect-error rb is a tag but recognized
const Rb: FC<RbProps> = ({ children }) => <rb>{children}</rb>

const Ruby: FC<RubyProps> = ({ text, ruby, ...props }) => {
    return (
        <ruby {...props}>
            {
                Array(text.length).fill(0).map((_, i) => {
                    const cap = (ruby ?? [])[i]
                    return !cap
                        ?
                        <Fragment key={Math.random()}>
                            <Rb>{text.charAt(i)}</Rb>
                            <rt></rt>
                        </Fragment>
                        :
                        <Fragment key={Math.random()}>
                            <Rb>{text.charAt(i)}</Rb>
                            <rp>(</rp>
                            <rt>{cap}</rt>
                            <rp>)</rp>
                        </Fragment>
                })
            }

        </ruby>
    )
}

export default Ruby
