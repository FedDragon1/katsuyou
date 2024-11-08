import { FC, Fragment, ReactNode } from "react";

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
    <ruby className="hover:bg-red-900 pr-1 pl-0.5 py-0.5 rounded-md transition">
        {
            ruby.map((caption, i) =>
                caption === null
                    ?
                    <Fragment key={Math.random()}>
                        <Rb>{text.charAt(i)}</Rb>
                        <rt></rt>
                    </Fragment>
                    :
                    <Fragment key={Math.random()}>
                        <Rb>{text.charAt(i)}</Rb>
                        <rp>(</rp>
                        <rt>{caption}</rt>
                        <rp>)</rp>
                    </Fragment>
            )
        }
    </ruby>
)

export default Ruby
