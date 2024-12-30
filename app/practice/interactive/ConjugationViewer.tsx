import { FC } from "react";
import Ruby from "@/app/Ruby";

type Conjugator = (term: string, type: any) => ConjugatedVerb | ConjugatedAdjective | undefined

interface ViewerProps {
    term?: VerbTerm | AdjectiveTerm
    conjugator: Conjugator
    displayData: { [key: string]: string }
}

function conjugateToRuby(conjugator: Conjugator, text: string | undefined, type: VerbConjugations) {
    if (!text) {
        return <></>
    }
    const conjugated = conjugator(text, type)
    if (!conjugated) {
        return <></>
    }

    return <div className="inline-flex gap-2 conjugation-list flex-wrap">
        {conjugated.options.map(
            (op) => <Ruby key={op.text} text={op.text} ruby={op.ruby}/>)}
    </div>
}

const ConjugationViewer: FC<ViewerProps> = ({ term, displayData, conjugator }) => {
    return (
        <table className="max-w-[500px]">
            <tbody>
                <tr>
                    <th className="text-left">Type</th>
                    <th className="text-left">Conjugation</th>
                </tr>
                {Object.entries(displayData).map(([type, display]) => (
                    <tr key={type}>
                        <td className="text-nowrap pr-1 w-[100px]">{display}</td>
                        <td>{conjugateToRuby(conjugator, term?.text, type as VerbConjugations)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default ConjugationViewer