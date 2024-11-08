"use client"

import { useState } from "react";
import ConjugationSelector from "@/app/practice/interactive/ConjugationSelector";
import ConjugationViewer from "@/app/practice/interactive/ConjugationViewer";

const defaultConjugationType: VerbConjugations = "dictionary"

export default function Practice() {
    const [input, setInput] = useState<string>("")
    const [conjugationType, setConjugationType] = useState<VerbConjugations>(defaultConjugationType)

    return (
        <div className="p-20 flex flex-col gap-2">
            <h1>Practice Page</h1>
            <input type="text" onChange={e => setInput(e.target.value)} />
            <ConjugationSelector setConjugationType={setConjugationType} defaultValue={defaultConjugationType} />
            <span>Current type: {conjugationType}</span>

            <ConjugationViewer term={input} />
        </div>
    )
}