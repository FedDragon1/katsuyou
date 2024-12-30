"use client"

import { conjugate, getConjugationList } from "@/data/conjugator";
import Ruby from "@/app/Ruby";
import { useEffect, useState } from "react";

// const practices: Practice[] = [
//     {
//         category: "Verbs",
//         activities: [
//             {
//                 identifier: "pentagrade",
//                 description: "Verbs that conjugate to all five possible vowels",
//                 display: "Pentagrade Conjugation | 五段活用",
//                 examples: ["書く", "立つ", "飲む"],
//                 archaic: false,
//             },
//             {
//                 identifier: "monograde",
//                 description: "Verbs end with 「ぇる」 or 「ぃる」 that drops 「る」 when conjugated to adverbial form",
//                 display: "Monograde Conjugation | 上下一段活用",
//                 examples: ["着る", "伸びる", "食べる", "受ける"],
//                 archaic: false,
//             },
//             {
//                 identifier: "kagyou",
//                 description: "Conjugation of the verb 「来る」",
//                 display: "Ka-row Conjugation | カ行変化活用",
//                 examples: ["来る"],
//                 archaic: false,
//             },
//             {
//                 identifier: "sagyou",
//                 description: "Conjugation of verb 「する」",
//                 display: "Sa-row Conjugation | サ行変化活用",
//                 examples: ["する"],
//                 archaic: false,
//             },
//             {
//                 identifier: "nagyou",
//                 description: "Archaic conjugation of verbs that has a stem ends in n-",
//                 display: "Na-row Conjugation | ナ行変化活用",
//                 examples: ["死ぬ", "往ぬ"],
//                 archaic: true,
//             },
//             {
//                 identifier: "ragyou",
//                 description: "Archaic conjugation of verbs that has a stem ends in 「ら、り、る、れ」",
//                 display: "Ra-row Conjugation | ラ行変化活用",
//                 examples: ["あり", "侍り", "居り"],
//                 archaic: true,
//             }
//         ]
//     },
//     {
//         category: "Adjectives",
//         activities: [
//             // {
//             //     identifier: ""
//             // }
//         ]
//     }
// ]

export default function Practice() {

    const [question, setQuestion] = useState<ConjugationQuestion>({
        verb: {
            text: "",
            ruby: [],
            type: "pentagrade"
        },
        auxiliary: []
    })
    const [ans, setAns] = useState<ConjugationAnswer>({
        conjugated: "",
        ruby: []
    })

    useEffect(() => {
        setQuestion(getConjugationList())
    }, []);

    useEffect(() => {
        if (question.verb.text) {
            setAns(conjugate(question))
        }
    }, [question]);

    function refresh() {
        setQuestion(getConjugationList())
    }

    return (
        <div className="p-20">
            <h1>Practice Page</h1>
            <p>{question.verb.text} + {question.auxiliary.join(" + ")}</p>
            <Ruby text={ans.conjugated} ruby={ans.ruby} />
            <br />
            <br />
            <button type="button" onClick={refresh}>Refresh</button>
        </div>
    )
}