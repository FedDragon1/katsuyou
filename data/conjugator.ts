import { getVerb, getVerbStrict, termEquals } from "@/data/dictionary";

const hiraganaTable = {
    none: {
        a: "あ",
        i: "い",
        u: "う",
        e: "え",
        o: "お",
    },
    k: {
        a: "か",
        i: "き",
        u: "く",
        e: "け",
        o: "こ",
    },
    s: {
        a: "さ",
        i: "し",
        u: "す",
        e: "せ",
        o: "そ",
    },
    t: {
        a: "た",
        i: "ち",
        u: "つ",
        e: "て",
        o: "と",
    },
    n: {
        a: "な",
        i: "に",
        u: "ぬ",
        e: "ね",
        o: "の",
    },
    h: {
        a: "は",
        i: "ひ",
        u: "ふ",
        e: "へ",
        o: "ほ",
    },
    m: {
        a: "ま",
        i: "み",
        u: "む",
        e: "め",
        o: "も",
    },
    y: {
        a: "や",
        i: "い",
        u: "ゆ",
        e: "え",
        o: "よ",
    },
    r: {
        a: "ら",
        i: "り",
        u: "る",
        e: "れ",
        o: "ろ",
    },
    w: {
        a: "わ",
        i: "ゐ",
        u: "う",
        e: "ゑ",
        o: "を",
    },
    g: {
        a: "が",
        i: "ぎ",
        u: "ぐ",
        e: "げ",
        o: "ご",
    },
    z: {
        a: "ざ",
        i: "じ",
        u: "ず",
        e: "ぜ",
        o: "ぞ",
    },
    d: {
        a: "だ",
        i: "ぢ",
        u: "づ",
        e: "で",
        o: "ど",
    },
    p: {
        a: "ぱ",
        i: "ぴ",
        u: "ぷ",
        e: "ぺ",
        o: "ぽ",
    },
    b: {
        a: "ば",
        i: "び",
        u: "ぶ",
        e: "べ",
        o: "ぼ",
    },
    N: "ん"
}

const hiraganaCodes: { [key in Hiragana]: string[] } = {
    "あ": ["none", "a"],
    "い": ["none", "i"],
    "う": ["none", "u"],
    "え": ["none", "e"],
    "お": ["none", "o"],
    "か": ["k", "a"],
    "き": ["k", "i"],
    "く": ["k", "u"],
    "け": ["k", "e"],
    "こ": ["k", "o"],
    "さ": ["s", "a"],
    "し": ["s", "i"],
    "す": ["s", "u"],
    "せ": ["s", "e"],
    "そ": ["s", "o"],
    "た": ["t", "a"],
    "ち": ["t", "i"],
    "つ": ["t", "u"],
    "て": ["t", "e"],
    "と": ["t", "o"],
    "な": ["n", "a"],
    "に": ["n", "i"],
    "ぬ": ["n", "u"],
    "ね": ["n", "e"],
    "の": ["n", "o"],
    "ま": ["m", "a"],
    "み": ["m", "i"],
    "む": ["m", "u"],
    "め": ["m", "e"],
    "も": ["m", "o"],
    "ら": ["r", "a"],
    "り": ["r", "i"],
    "る": ["r", "u"],
    "れ": ["r", "e"],
    "ろ": ["r", "o"],
    "が": ["g", "a"],
    "ぎ": ["g", "i"],
    "ぐ": ["g", "u"],
    "げ": ["g", "e"],
    "ご": ["g", "o"],
    "ざ": ["z", "a"],
    "じ": ["z", "i"],
    "ず": ["z", "u"],
    "ぜ": ["z", "e"],
    "ぞ": ["z", "o"],
    "だ": ["d", "a"],
    "ぢ": ["d", "i"],
    "づ": ["d", "u"],
    "で": ["d", "e"],
    "ど": ["d", "o"],
    "ぱ": ["p", "a"],
    "ぴ": ["p", "i"],
    "ぷ": ["p", "u"],
    "ぺ": ["p", "e"],
    "ぽ": ["p", "o"],
    "ば": ["b", "a"],
    "び": ["b", "i"],
    "ぶ": ["b", "u"],
    "べ": ["b", "e"],
    "ぼ": ["b", "o"],
    "や": ["y", "a"],
    "ゆ": ["y", "u"],
    "よ": ["y", "o"],
    "わ": ["w", "a"],
    "ゐ": ["w", "i"],
    "ゑ": ["w", "e"],
    "を": ["w", "o"],
    "ん": ["N"],
    
}

const dakuonHiragana: DakuonHiragana[] = ["が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ"]

function kanaToGrade(kana: Hiragana, grade: Grade) {
    const code = hiraganaCodes[kana]
    
    // technically we can change ぎゃ　to ぎょ, but we'll leave it for now
    if (code.length !== 2) {
        return undefined
    }
    
    // @ts-expect-error stupid type system
    return (hiraganaTable[code[0]] as { [key in Grade]: Hiragana} )[grade]
}

function kanaIsDakuon(kana: Hiragana) {
    return dakuonHiragana.includes(kana as DakuonHiragana);
}

function voiceChangeToDakuon(kana: Hiragana) {
    return ["ぶ", "む", "ぬ"].includes(kana)
}

function voiceChange(kana: Hiragana) {
    switch (kana) {
        case "う":
        case "る":
        case "つ":
            return "っ"
        case "ぶ":
        case "ぬ":
        case "む":
            return "ん"
        case "ぐ":
        case "く":
            return "い"
        case "す":
            return "し"
        default:
            throw new Error(`Cannot perform voice change on kana ${kana}`)
    }
}

function aruConjugator(conjugationClass: VerbConjugations): ConjugatedVerb {
    if (!aruConjugations.includes(conjugationClass as AruConjugations)) {
        throw Error(`「有る」 has no conjugation of '${conjugationClass}' form`)
    }
    const data: { text: string | null, ruby: (Hiragana | null)[] | null} = {
        text: null,
        ruby: null
    }
    switch (conjugationClass as AruConjugations) {
        case "negation":
            data.text = "ない"
            data.ruby = [null, null]
            break
        case "polite":
            data.text = "有ります"
            data.ruby = ["あ", null, null, null]
            break
        case "te":
            data.text = "有って"
            data.ruby = ["あ", null, null]
            break
        case "ta":
            data.text = "有った"
            data.ruby = ["あ", null, null]
            break
        case "ba":
            data.text = "有れば"
            data.ruby = ["あ", null, null]
            break
        default:
            throw Error(`「有る」 has no conjugation of '${conjugationClass}' form`)
    }
    return {
        options: [data],
        original: "有る",
        conjugationType: conjugationClass
    } as ConjugatedVerb
}

function pentagradeConjugator(term: Term, conjugationClass: VerbConjugations): ConjugatedVerb {
    if (termEquals(term, "有る")) {
        return aruConjugator(conjugationClass)
    }

    const conjugation: PentagradeConjugation = {
        grade: null,
        suffix: null
    }
    const lastKana = term.text[term.text.length - 1] as Hiragana
    switch (conjugationClass) {
        case "negation":
            conjugation.grade = "a"
            conjugation.suffix = "ない"
            break
        case "passivity":
            conjugation.grade = "a"
            conjugation.suffix = "れる"
            break
        case "causative":
            conjugation.grade = "a"
            conjugation.suffix = "せる"
            break
        case "intention":
            conjugation.grade = "o"
            conjugation.suffix = "う"
            break
        case "polite":
            conjugation.grade = "i"
            conjugation.suffix = "ます"
            break
        case "te":
            conjugation.grade = "sound change"
            conjugation.suffix = kanaIsDakuon(lastKana) || voiceChangeToDakuon(lastKana) ? "で" : "て"
            break
        case "ta":
            conjugation.grade = "sound change"
            conjugation.suffix = kanaIsDakuon(lastKana) || voiceChangeToDakuon(lastKana) ? "だ" : "た"
            break
        case "dictionary":
            return {
                options: [
                    {
                        text: term.text,
                        ruby: term.ruby,
                    }
                ],
                original: term.text,
                conjugationType: conjugationClass
            }
        case "ba":
            conjugation.grade = "e"
            conjugation.suffix = "ば"
            break
        case "imperative":
            conjugation.grade = "e"
            conjugation.suffix = ""
            break
        default:
            throw new Error(`Unknown conjugation type '${conjugationClass}'`)
    }

    // conjugated verb without suffix are same length as original
    // 探す -> 探さ
    // thus reuse the ruby and add null (suffix will never be kanji)

    const ruby = term.ruby;
    for (let i = 0; i < conjugation.suffix.length; i++) {
        ruby.push(null)
    }

    if (conjugation.grade === "sound change") {
        // exception: 行く -> 行って
        if (JSON.stringify(term) === JSON.stringify(getVerb("行く"))) {
            const conjugated = "行っ" + conjugation.suffix
            return {
                options: [
                    {
                        text: conjugated,
                        ruby: ["い", null, null],
                    }
                ],
                original: term.text,
                conjugationType: conjugationClass
            }
        }

        const changedEnd = voiceChange(lastKana)
        const conjugated = term.text.slice(0, term.text.length - 1) + changedEnd + conjugation.suffix

        return {
            options: [
                {
                    text: conjugated,
                    ruby,
                }
            ],
            original: term.text,
            conjugationType: conjugationClass
        }
    }

    const newEnding = kanaToGrade(lastKana, conjugation.grade)
    const conjugated = term.text.slice(0, term.text.length - 1) + newEnding + conjugation.suffix

    return {
        options: [
            {
                text: conjugated,
                ruby,
            }
        ],
        original: term.text,
        conjugationType: conjugationClass
    }
}

function sagyouConjugator(conjugationClass: VerbConjugations): ConjugatedVerb {
    let conjugated = null
    switch (conjugationClass) {
        case "negation":
            conjugated = "しない"
            break
        case "passivity":
            conjugated = "される"
            break
        case "causative":
            conjugated = "させる"
            break
        case "dictionary":
            conjugated = "する"
            break
        case "polite":
            conjugated = "します"
            break
        case "te":
            conjugated = "して"
            break
        case "ta":
            conjugated = "した"
            break
        case "ba":
            conjugated = "すれば"
            break
        case "intention":
            conjugated = "しよう"
            break
        case "imperative":
            return {
                options: [
                    {
                        text: "しろ",
                        ruby: [null, null]
                    },
                    {
                        text: "せよ",
                        ruby: [null, null]
                    }
                ],
                original: "する",
                conjugationType: conjugationClass
            }
        default:
            throw new Error(`Unknown conjugation type '${conjugationClass}'`)
    }
    const ruby = [...conjugated].map(() => null)
    return {
        options: [
            {
                text: conjugated,
                ruby,
            }
        ],
        original: "する",
        conjugationType: conjugationClass
    }
}

function kagyouConjugator(conjugationClass: VerbConjugations): ConjugatedVerb {
    const conjugated: { text: null | string, ruby: (string | null)[] | null} = {
        text: null,
        ruby: null
    }

    switch (conjugationClass) {
        case "negation":
            conjugated.text = "来ない"
            conjugated.ruby = ["こ", null, null]
            break
        case "passivity":
            conjugated.text = "来られる"
            conjugated.ruby = ["こ", null, null, null]
            break
        case "causative":
            conjugated.text = "来させる"
            conjugated.ruby = ["こ", null, null, null]
            break
        case "dictionary":
            conjugated.text = "来る"
            conjugated.ruby = ["く", null]
            break
        case "polite":
            conjugated.text = "来ます"
            conjugated.ruby = ["き", null, null]
            break
        case "te":
            conjugated.text = "来て"
            conjugated.ruby = ["き", null]
            break
        case "ta":
            conjugated.text = "来た"
            conjugated.ruby = ["き", null]
            break
        case "ba":
            conjugated.text = "来れば"
            conjugated.ruby = ["く", null, null]
            break
        case "intention":
            conjugated.text = "来よう"
            conjugated.ruby = ["こ", null, null]
            break
        case "imperative":
            conjugated.text = "来い"
            conjugated.ruby = ["こ", null]
            break
        default:
            throw new Error(`Unknown conjugation type '${conjugationClass}'`)
    }

    return {
        options: [conjugated],
        original: "来る",
        conjugationType: conjugationClass,
    } as ConjugatedVerb
}

// class MonogradeConjugator extends Conjugator {
//
// }
//
// class KagyouConjugator extends Conjugator {
//
// }
//
// class SagyouConjugator extends Conjugator {
//
// }
//
// class NagyouConjugator extends Conjugator {
//
// }
//
// class RagyouConjugator extends Conjugator {
//
// }

/**
 * Conjugates the verb, and throws an error if the verb is unknown
 *
 * @param verb
 * @param type
 */
export function conjugateVerbStrict(verb: string, type: VerbConjugations): ConjugatedVerb | undefined {
    const term = getVerbStrict(verb);

    switch (term.type) {
        case "pentagrade":
            return pentagradeConjugator(term, type)
        case "sagyou":
            return sagyouConjugator(type)
        case "kagyou":
            return kagyouConjugator(type)
    }
}

/**
 * Conjugates the verb, but suppresses any error (returns undefined instead)
 *
 * @param verb
 * @param type
 */
export function conjugateVerb(verb: string, type: VerbConjugations) {
    try {
        return conjugateVerbStrict(verb, type)?.options
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return
    }
}

/**
 * Conjugates the verb, but suppresses any error (returns undefined instead)
 * Returns the full conjugated verb
 *
 * @param verb
 * @param type
 */
export function conjugateVerbFull(verb: string, type: VerbConjugations) {
    try {
        return conjugateVerbStrict(verb, type)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return
    }
}

const aruConjugations: AruConjugations[] = ["polite", "te", "ta", "negation", "ba"]

export const verbConjugations: VerbConjugations[] = ["negation", "passivity", "causative", "intention", "polite", "te", "ta", "dictionary", "ba", "imperative"]

export const verbConjugationDisplay: { [type in VerbConjugations]: string } = {
    negation: "ない形",
    passivity: "受身形",
    causative: "使役形",
    intention: "意向形",
    polite: "丁寧形",
    te: "て形",
    ta: "た形",
    dictionary: "辞書形",
    ba: "ば形",
    imperative: "命令形"
}

