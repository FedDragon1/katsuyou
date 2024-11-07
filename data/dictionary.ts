const verbsDictionary: VerbsDict = {
    "書く": {
      ruby: ["か", null],
      type: "pentagrade"
    },
    "立つ": {
        ruby: ["た", null],
        type: "pentagrade"
    },
    "有る": {
      ruby: ["あ", null],
      type: "pentagrade"
    },
    "飲む": {
        ruby: ["の", null],
        type: "pentagrade"
    },
    "着る": {
        ruby: ["き", null],
        type: "monograde"
    },
    "伸びる": {
        ruby: ["の", null, null],
        type: "monograde"
    },
    "食べる": {
        ruby: ["た", null],
        type: "monograde"
    },
    "受ける": {
        ruby: ["う", null],
        type: "monograde"
    },
    "する": {
        ruby: [null, null],
        type: "sagyou"
    },
    "来る": {
        ruby: ["く", null],
        type: "kagyou"
    },
    "行く": {
        ruby: ["い", null],
        type: "pentagrade"
    },
    "取り戻す": {
        ruby: ["と", null, "もど", null],
        type: "pentagrade"
    }
}

const verbsByType: { [type in VerbTypes]: Term[] } = {
    pentagrade: [],
    monograde: [],
    kagyou: [],
    sagyou: [],
    nagyou: [],
    ragyou: []
}
Object.entries(verbsDictionary)
    .map(([text, value]): Term => ({
        text,
        ...value
    }))
    .forEach(term => verbsByType[term.type].push(term))

export function getVerbStrict(term: string): Term {
    const t = verbsDictionary[term];
    if (!t) {
        throw Error(`Unknown term '${term}'`)
    }
    return {
        text: term,
        ...t
    }
}

export function getVerb(term: string): Term | undefined {
    const t = verbsDictionary[term]
    if (!t) {
        return undefined
    }
    return {
        text: term,
        ...t
    }
}

/**
 * Compares two term structures, returning whether they have the identical
 * filed throughout
 *
 * @param term1
 * @param term2
 */
export function termIs(term1: Term, term2: Term): boolean {
    const rubyEquals = term1.ruby.length === term2.ruby.length &&
        term1.ruby.every((value, i) => value === term2.ruby[i])
    return term1.type === term2.type && term1.text === term2.text && rubyEquals
}

/**
 * If `term2` exists in the word bank, compare `term1` with the retrieved term.
 * Otherwise, an error will be thrown due to unknown term.
 *
 * @param term1 actual term
 * @param term2 string to compare with
 */
export function termEquals(term1: Term, term2: string): boolean {
    const termCompare = getVerb(term2)
    if (!termCompare) {
        return false
    }
    return termIs(term1, termCompare)
}

/**
 * Get a list of terms with a desired type
 *
 * @param type
 */
export function getVerbByType(type: VerbTypes): Term[] {
    return verbsByType[type] ?? [];
}