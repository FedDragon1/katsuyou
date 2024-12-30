"use client"

import { useMemo, useState } from "react";
// import ConjugationSelector from "@/app/practice/interactive/ConjugationSelector";
import ConjugationViewer from "@/app/practice/interactive/ConjugationViewer";
import { getAdjective, getVerb } from "@/data/dictionary";
import {
    adjectiveConjugationDisplay,
    conjugateAdjective,
    conjugateVerb,
    verbConjugationDisplay
} from "@/data/conjugator";

// const defaultConjugationType: VerbConjugations = "dictionary"

export default function Practice() {
    const [verbInput, setVerbInput] = useState<string>("")
    const [adjInput, setAdjInput] = useState<string>("")
    // const [conjugationType, setConjugationType] = useState<VerbConjugations>(defaultConjugationType)
    const verbTerm = useMemo(() => getVerb(verbInput), [verbInput])
    const adjTern = useMemo(() => getAdjective(adjInput), [adjInput])

    return (
        <div className="p-20 flex flex-col gap-2">
            <h1>Practice Page</h1>
            <input type="text"
                   placeholder="Enter a verb"
                   onChange={e => setVerbInput(e.target.value)}/>
            {/*<ConjugationSelector setConjugationType={setConjugationType} defaultValue={defaultConjugationType} />*/}
            {/*<span>Current type: {conjugationType}</span>*/}
            <ConjugationViewer term={verbTerm} conjugator={conjugateVerb} displayData={verbConjugationDisplay}/>
            <hr className="border-t-1 w-full"/>

            <input type="text"
                   placeholder="Enter an adjective"
                   onChange={e => setAdjInput(e.target.value)}/>
            <ConjugationViewer term={adjTern} conjugator={conjugateAdjective} displayData={adjectiveConjugationDisplay}/>
        </div>
    )
}