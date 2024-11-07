import { FC } from "react";
import { conjugateVerbFull, verbConjugationDisplay } from "@/data/conjugator";
import { getVerb } from "@/data/dictionary";
import Ruby from "@/app/Ruby";

interface ViewerProps {
    term: string
}

function conjugateToRuby(text: string | undefined, type: VerbConjugations) {
    if (!text) {
        return <></>
    }
    const conjugated = conjugateVerbFull(text, type)
    if (!conjugated) {
        return <></>
    }

    return <Ruby text={conjugated.text} ruby={conjugated.ruby} />
}

const ConjugationViewer: FC<ViewerProps> = ({ term }) => {
    const termObject = getVerb(term)
    return (
        <table className="max-w-[400px]">
            <tbody>
                <tr>
                    <th className="text-left">Type</th>
                    <th className="text-left">Conjugation</th>
                </tr>
                {Object.entries(verbConjugationDisplay).map(([type, display]) => (
                    <tr key={type}>
                        <td>{display}</td>
                        <td>{conjugateToRuby(termObject?.text, type as VerbConjugations)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default ConjugationViewer