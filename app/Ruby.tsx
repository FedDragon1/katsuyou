import { FC, ReactNode } from "react";

interface RubyProps {
    text: string,
    ruby: (string | null)[]
}

interface RbProps {
    children: ReactNode
}

// @ts-expect-error rb is a tag but recognized
const Rb: FC<RbProps> = ({ children }) => <rb>{children}</rb>

const Ruby: FC<RubyProps> = ({ text, ruby }) => (
    <ruby>
        {
            ruby.map((caption, i) =>
                caption === null
                    ?
                    <>
                        <Rb>{text.charAt(i)}</Rb>
                        <rt></rt>
                    </>
                    :
                    <>
                        <Rb>{text.charAt(i)}</Rb>
                        <rp>(</rp>
                        <rt>{caption}</rt>
                        <rp>)</rp>
                    </>
            )
        }
    </ruby>
)

export default Ruby
