
const verbsDictionary: VerbDict = {
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
        ruby: ["た", null, null],
        type: "monograde"
    },
    "受ける": {
        ruby: ["う", null, null],
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
    },
    "免れる": {
        ruby: ["まぬか", null, null],
        type: "pentagrade"
    },
    "引っかかる": {
        ruby: ["ひ", null, null, null, null],
        type: "pentagrade"
    },
    "暴れる": {
        ruby: ["あば", null, null],
        type: "monograde"
    },
    "買い替える": {
        ruby: ["か", null, "か", null, null],
        type: "monograde"
    },
    "居る": {
        ruby: ["い", null],
        type: "monograde"
    }
}

const adjectiveDictionary: AdjectiveDict = {
    "美しい": {
        type: "i",
        ruby: ["うつく", null, null]
    },
    "赤い": {
        type: "i",
        ruby: ["あか", null]
    },
    "浅い": {
        type: "i",
        ruby: ["あさ", null]
    },
    "少ない": {
        type: "i",
        ruby: ["すく", null, null]
    },
    "綺麗だ": {
        type: "na",
        ruby: ["き", "れい", null]
    },
    "不思議だ": {
        type: "na",
        ruby: ["ふ", "し", "ぎ", null]
    }
}

const verbsByType: { [type in VerbTypes]: VerbTerm[] } = {
    pentagrade: [],
    monograde: [],
    kagyou: [],
    sagyou: [],
    nagyou: [],
    ragyou: []
}
Object.entries(verbsDictionary)
    .map(([text, value]): VerbTerm => ({
        text,
        ...value
    }))
    .forEach(term => verbsByType[term.type].push(term))

const adjectivesByType: { [type in AdjectiveTypes]: AdjectiveTerm[] } = {
    i: [],
    na: []
}
Object.entries(adjectiveDictionary)
    .map(([text, value]): AdjectiveTerm => ({
        text,
        ...value
    }))
    .forEach(term => adjectivesByType[term.type].push(term))

/**
 * Compares two term structures, returning whether they have the identical
 * filed throughout
 *
 * @param term1
 * @param term2
 */
export function termIs(term1: VerbTerm, term2: VerbTerm): boolean {
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
export function termEquals(term1: VerbTerm, term2: string): boolean {
    const termCompare = getVerb(term2)
    if (!termCompare) {
        return false
    }
    return termIs(term1, termCompare)
}

/**
 * Get a verb from the dictionary, throws an error if the term does not exist
 *
 * @param term
 */
export function getVerbStrict(term: string): VerbTerm {
    const t = verbsDictionary[term];
    if (!t) {
        throw Error(`Unknown term '${term}'`)
    }
    return {
        text: term,
        ...t
    }
}

/**
 * Get a verb from the dictionary, returns undefined if the term does not exist
 *
 * @param term
 */
export function getVerb(term: string): VerbTerm | undefined {
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
 * Get a list of verbs with a desired type
 *
 * @param type
 */
export function getVerbsByType(type: VerbTypes): VerbTerm[] {
    return verbsByType[type] ?? [];
}

/**
 * Randomly selects a verb
 */
export function getRandomVerb(): VerbTerm {
    const keys = Object.keys(verbsDictionary);
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    return {
        text: randomKey,
        ...verbsDictionary[randomKey]
    }
}

/**
 * Get an adjective from the dictionary, throws an error if the term does not exist
 *
 * @param term
 */
export function getAdjectiveStrict(term: string): AdjectiveTerm {
    const t = adjectiveDictionary[term];
    if (!t) {
        throw Error(`Unknown term '${term}'`)
    }
    return {
        text: term,
        ...t
    }
}

/**
 * Get an adjective from the dictionary, returns undefined if the term does not exist
 *
 * @param term
 */
export function getAdjective(term: string): AdjectiveTerm | undefined {
    const t = adjectiveDictionary[term]
    if (!t) {
        return undefined
    }
    return {
        text: term,
        ...t
    }
}

/**
 * Get a list of adjectives with a desired type
 *
 * @param type
 */
export function getAdjectivesByType(type: AdjectiveTypes): AdjectiveTerm[] {
    return adjectivesByType[type] ?? [];
}

