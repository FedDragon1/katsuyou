// noinspection NonAsciiCharacters,JSNonASCIINames

import { getAdjectiveStrict, getRandomVerb, getVerb, getVerbStrict, termEquals } from "@/data/dictionary";

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
    "は": ["h", "a"],
    "ひ": ["h", "i"],
    "ふ": ["h", "u"],
    "へ": ["h", "e"],
    "ほ": ["h", "o"],
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

const aruConjugations: AruConjugations[] = ["polite", "te", "ta", "negation", "ba"]
// const gozaruConjugations: GozaruConjugation[] = ["negation", "intentional", "polite", "te", "ta", "dictionary", "ba", "imperative"]

// HELPER FUNCTIONS

/**
 * Fills n null values in the array
 * This operation modifies original array
 *
 * @param arr
 * @param n
 */
function fillNull<T>(arr: (T | null)[], n: number): (T | null)[] {
    for (let i = 0; i < n; i++) {
        arr.push(null)
    }
    return arr
}

function nullOf<T>(length: number): T[] {
    return Array(length).fill(null)
}

/**
 * Change a kana to another grade (a, i, u, e, o)
 * Returns undefined is it is impossible
 *
 * @param kana
 * @param grade
 * @param wagyou
 */
export function kanaToGrade(kana: Hiragana, grade: Grade, wagyou?: boolean) {
    const code = hiraganaCodes[kana]

    // technically we can change ぎゃ　to ぎょ, but we'll leave it for now
    if (code.length !== 2) {
        return undefined
    }

    if (wagyou) {
        code[0] = "w"
    }

    debugger
    // @ts-expect-error stupid type system
    return hiraganaTable[code[0]][grade]
}

/**
 * Check if a kana represents a "muddy sound"
 * Example: ば -> true, は -> false
 *
 * @param kana
 */
function kanaIsDakuon(kana: Hiragana) {
    return dakuonHiragana.includes(kana as DakuonHiragana);
}

/**
 * Check if the kana requires a voice change to 「で」 or 「だ」
 * when conjugating to テ形　and タ形
 *
 * @param kana
 */
export function voiceChangeToDakuon(kana: Hiragana) {
    return ["ぶ", "む", "ぬ"].includes(kana) || kanaIsDakuon(kana)
}

/**
 * Performs voice change to a given verb suffix
 * Example: 買「う」 -> 買「っ」て
 *
 * @param kana
 */
export function voiceChange(kana: Hiragana) {
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

// VERB CONJUGATORS

/**
 * Conjugates the word 「ある」 to different forms.
 * Notice this verb has limited conjugated forms,
 * if extraneous types are passed in, an error will be thrown.
 *
 * @param conjugationClass
 */
function aruConjugator(conjugationClass: VerbConjugations): ConjugatedVerb {
    if (!aruConjugations.includes(conjugationClass as AruConjugations)) {
        throw Error(`「有る」 has no conjugation of '${conjugationClass}' form`)
    }
    const data: { text: string | null, ruby: (Hiragana | null)[] | null } = {
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

/**
 * Conjugates the word 「いる」 to different forms.
 *
 * @param conjugationClass
 */
function iruConjugator(conjugationClass: VerbConjugations): ConjugatedVerb {
    let suffix: string;
    switch (conjugationClass) {
        case "negation":
            suffix = "ない"
            break
        case "passivity":
            suffix = "られる"
            break
        case "causative":
            suffix = "させる"
            break
        case "intentional":
            suffix = "よう"
            break
        case "polite":
            suffix = "ます"
            break
        case "te":
            suffix = "て"
            break
        case "ta":
            suffix = "た"
            break
        case "ba":
            suffix = "れば"
            break
        case "dictionary":
            suffix = "る"
            break
        case "imperative":
            suffix = "ろ"
            break
        default:
            throw Error(`「居る」 has no conjugation of '${conjugationClass}' form`)
    }
    const ruby = fillNull(["い"], suffix.length)
    return {
        options: [
            {
                text: `居${suffix}`,
                ruby
            }
        ],
        original: "居る",
        conjugationType: conjugationClass
    } as ConjugatedVerb
}

/**
 * Conjugates words classified as 「五段活用」 to different forms.
 * Examples: 泳ぐ、買う
 *
 * @param term
 * @param conjugationType
 */
function pentagradeConjugator(term: VerbTerm, conjugationType: VerbConjugations): ConjugatedVerb {
    if (termEquals(term, "有る")) {
        return aruConjugator(conjugationType)
    }

    const conjugation: PentagradeConjugation = {
        grade: null,
        suffix: null
    }
    const lastKana = term.text[term.text.length - 1] as Hiragana
    switch (conjugationType) {
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
        case "intentional":
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
                conjugationType: conjugationType
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
            throw new Error(`Unknown conjugation type '${conjugationType}'`)
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
                conjugationType: conjugationType
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
            conjugationType: conjugationType
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
        conjugationType: conjugationType
    }
}

/**
 * Conjugates words classified as 「上下一段活用」 to different forms.
 * Examples: 食べる、伸びる
 *
 * @param term
 * @param conjugationType
 */
function monogradeConjugator(term: VerbTerm, conjugationType: VerbConjugations): ConjugatedVerb {
    if (termEquals(term, "居る")) {
        return iruConjugator(conjugationType)
    }

    const options: ConjugatedTermOption[] = []

    // 信じる -> 信じ
    const verbStem = term.text.slice(0, term.text.length - 1)
    switch (conjugationType) {
        case "negation":
            options.push({
                text: `${verbStem}ない`,
                ruby: [...term.ruby, null]  // length + 1
            })
            break
        case "passivity":
            options.push({
                text: `${verbStem}られる`,
                ruby: [...term.ruby, null, null]  // length + 2
            })
            break
        case "causative":
            options.push({
                text: `${verbStem}させる`,
                ruby: [...term.ruby, null, null]  // length + 2
            })
            break
        case "intentional":
            options.push({
                text: `${verbStem}よう`,
                ruby: [...term.ruby, null]  // length + 1
            })
            break
        case "polite":
            options.push({
                text: `${verbStem}ます`,
                ruby: [...term.ruby, null]  // length + 1
            })
            break
        case "te":
            options.push({
                text: `${verbStem}て`,
                ruby: term.ruby // no change
            })
            break
        case "ta":
            options.push({
                text: `${verbStem}た`,
                ruby: term.ruby // no change
            })
            break
        case "dictionary":
            options.push({
                text: term.text,
                ruby: term.ruby
            })
            break
        case "ba":
            options.push({
                text: `${verbStem}れば`,
                ruby: [...term.ruby, null]  // length + 1
            })
            break
        case "imperative":
            options.push(({
                text: `${verbStem}ろ`,
                ruby: term.ruby
            }))
            options.push(({
                text: `${verbStem}よ`,
                ruby: term.ruby
            }))
            break
        default:
            throw new Error(`Unknown conjugation type '${conjugationType}'`)
    }

    return {
        options,
        original: term.text,
        conjugationType: conjugationType
    }
}

/**
 * Conjugates the word 「する」 to different forms
 *
 * @param conjugationType
 */
function sagyouConjugator(conjugationType: VerbConjugations): ConjugatedVerb {
    let conjugated = null
    switch (conjugationType) {
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
        case "intentional":
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
                conjugationType: conjugationType
            }
        default:
            throw new Error(`Unknown conjugation type '${conjugationType}'`)
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
        conjugationType: conjugationType
    }
}

/**
 * Conjugates the word 「来る」 to different forms
 *
 * @param conjugationType
 */
function kagyouConjugator(conjugationType: VerbConjugations): ConjugatedVerb {
    const conjugated: Partial<ConjugatedTermOption> = {
        text: undefined,
        ruby: undefined
    }

    switch (conjugationType) {
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
        case "intentional":
            conjugated.text = "来よう"
            conjugated.ruby = ["こ", null, null]
            break
        case "imperative":
            conjugated.text = "来い"
            conjugated.ruby = ["こ", null]
            break
        default:
            throw new Error(`Unknown conjugation type '${conjugationType}'`)
    }

    return {
        options: [conjugated],
        original: "来る",
        conjugationType: conjugationType,
    } as ConjugatedVerb
}

/**
 * Conjugates the verb, and throws an error if the verb is unknown
 *
 * @param verb
 * @param type
 */
export function conjugateVerbStrict(verb: string, type: VerbConjugations): ConjugatedVerb {
    const term = getVerbStrict(verb);

    switch (term.type) {
        case "pentagrade":
            return pentagradeConjugator(term, type)
        case "monograde":
            return monogradeConjugator(term, type)
        case "sagyou":
            return sagyouConjugator(type)
        case "kagyou":
            return kagyouConjugator(type)
        default:
            throw Error(`Unknown conjugation type "${type}"`)
    }
}

/**
 * Conjugates the verb, but suppresses any error (returns undefined instead)
 * Returns the full conjugated verb
 *
 * @param verb
 * @param type
 */
export function conjugateVerb(verb: string, type: VerbConjugations): ConjugatedVerb | undefined {
    try {
        return conjugateVerbStrict(verb, type)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return
    }
}

// ADJECTIVE CONJUGATORS

/**
 * Conjugates adjectives classified as 「い形容詞」 to different forms
 * Examples: 赤い、美しい
 *
 * @param term
 * @param conjugationType
 */
export function conjugateIAdjective(term: AdjectiveTerm, conjugationType: AdjectiveConjugations): ConjugatedAdjective {
    const wordStem = term.text.slice(0, term.text.length - 1)
    let suffix: string | undefined;
    switch (conjugationType) {
        case "negation":
            suffix = "くない"
            break
        case "te":
            suffix = "くて"
            break
        case "ta":
            suffix = "かった"
            break
        case "dictionary":
            suffix = "い"
            break
        case "intentional":
            suffix = "かろう"
            break
        case "ba":
            suffix = "ければ"
            break
        default:
            throw Error(`Unknown conjugation type "${conjugationType}"`)
    }
    const conjugated = `${wordStem}${suffix}`
    const ruby = [...term.ruby]
    for (let i = 0; i < suffix.length - 1; i++) {
        ruby.push(null)
    }

    return {
        options: [
            {
                text: conjugated,
                ruby
            }
        ],
        original: term.text,
        conjugationType
    }
}

/**
 * Conjugates adjectives classified as 「な形容詞」 to different forms
 * Examples: 綺麗だ、真剣だ
 *
 * All the conjugations follow the same rule as the 「だ」 auxiliary verb
 *
 * @param term
 * @param conjugationType
 */
export function conjugateNaAdjective(term: AdjectiveTerm, conjugationType: AdjectiveConjugations): ConjugatedAdjective {
    const options: ConjugatedTermOption[] = []
    const wordStem = term.text.slice(0, term.text.length - 1)
    switch (conjugationType) {
        case "negation":
            options.push({
                text: `${wordStem}ではない`,    // +3
                ruby: [...term.ruby, null, null, null]
            }, {
                text: `${wordStem}じゃない`,    // +3
                ruby: [...term.ruby, null, null, null]
            }, {
                text: `${wordStem}ではありません`,    // +6 (no kanji)
                ruby: [...term.ruby, null, null, null, null, null, null]
            }, {
                text: `${wordStem}じゃありません`,    // +6 (no kanji)
                ruby: [...term.ruby, null, null, null, null, null, null]
            })
            break
        case "te":
            options.push({
                text: `${wordStem}で`,
                ruby: [...term.ruby]
            })
            break
        case "dictionary":
            options.push({
                text: term.text,
                ruby: [...term.ruby]
            })
            break
        case "ta":
            options.push({
                text: `${wordStem}だった`,  // +2
                ruby: [...term.ruby, null, null]
            })
            break
        case "ba":
            options.push({
                text: `${wordStem}ならば`, // +2
                ruby: [...term.ruby, null, null]
            })
            break
        case "intentional":
            options.push({
                text: `${wordStem}だろう`, // +2
                ruby: [...term.ruby, null, null]
            })
            break
        default:
            throw Error(`Unknown conjugation type "${conjugationType}"`)
    }

    return {
        options,
        original: term.text,
        conjugationType
    }
}

/**
 * Conjugates the adjective, and throws an error if the adjective is unknown
 *
 * @param adjective
 * @param type
 */
export function conjugateAdjectiveStrict(adjective: string, type: AdjectiveConjugations): ConjugatedAdjective {
    const term = getAdjectiveStrict(adjective)

    switch (term.type) {
        case "i":
            return conjugateIAdjective(term, type)
        case "na":
            return conjugateNaAdjective(term, type)
        default:
            throw Error(`Unknown conjugation type "${type}"`)
    }
}

/**
 * Conjugates the adjective, and returns undefined if the adjective is unknown
 *
 * @param adjective
 * @param type
 */
export function conjugateAdjective(adjective: string, type: AdjectiveConjugations): ConjugatedAdjective | undefined {
    try {
        return conjugateAdjectiveStrict(adjective, type)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return
    }
}

// AUXILIARY VERB CONJUGATORS

export const verbConjugationDisplay: { [type in VerbConjugations]: string } = {
    negation: "ない形",
    passivity: "受身形",
    causative: "使役形",
    intentional: "意向形",
    polite: "丁寧形",
    te: "て形",
    ta: "た形",
    dictionary: "辞書形",
    ba: "ば形",
    imperative: "命令形"
}

export const adjectiveConjugationDisplay: { [type in AdjectiveConjugations]: string } = {
    negation: "ない形",
    te: "て形",
    intentional: "意向形",
    dictionary: "辞書形",
    ba: "ば形",
    ta: "た形"
}

// QUESTION GENERATION

export function getAttachableAuxiliaryVerbs(verb: VerbTerm): AuxiliaryVerb[] {
    switch (verb.type) {
        case "sagyou":
        case "kagyou":
        case "monograde":
            return [
                "させる",
                "られる",
                "たい",
                "たがる",
                "ない",
                "よう",
                "まい",
                "た",
                "そうだ（伝聞）",
                "そうだ（様態）",
                "ようだ",
                "らしい",
                "ます",
                "ている",
                "ば",
                "（命令）"
            ]
        case "pentagrade":
            if (termEquals(verb, "有る")) {
                return [
                    "ない",
                    "た",
                    "ば",
                    "ます"
                ]
            }
            return [
                "せる",
                "れる",
                "たい",
                "たがる",
                "ない",
                "う",
                "まい",
                "た",
                "そうだ（伝聞）",
                "そうだ（様態）",
                "ようだ",
                "らしい",
                "ます",
                "ている",
                "ば",
                "（命令）"
            ]
        case "nagyou":
        case "ragyou":
            throw Error("Ancient text nor supported yet")
    }
}

function auxiliaryVerbDispatcher(auxVerb: AuxiliaryVerb) {
    switch (auxVerb) {
        case "せる":
        case "させる":
            return dispatchさせる()
        case "れる":
        case "られる":
            return dispatchられる()
        case "たい":
            return dispatchたい()
        case "たがる":
            return dispatchたがる()
        case "ない":
            return dispatchない()
        case "た":
            return dispatchた()
        case "そうだ（様態）":
            return dispatchそうだ様態()
        case "そうだ（伝聞）":
            return dispatchそうだ伝聞()
        case "ようだ":
            return dispatchようだ()
        case "らしい":
            return dispatchらしい()
        case "ます":
            return dispatchます()
        case "だ":
            return dispatchだ()
        case "です":
            return dispatchです()
        case "ている":
            return dispatchている()
        case "う":
        case "よう":
        case "まい":
        case "ば":
        case "（ば）":
        case "ん":
        case "（命令）":
            return []
        default:
            throw Error(`Unknown Auxiliary Verb ${auxVerb}`)
    }
}

function dispatchさせる(): AuxiliaryVerb[] {
    return [
        "られる",
        "たい",
        "たがる",
        "ない",
        "まい",
        "た",
        "そうだ（様態）",
        "そうだ（伝聞）",
        "ようだ",
        "らしい",
        "ます",
        "ている",
        "ば",
        "（命令）"
    ]
}

function dispatchられる(): AuxiliaryVerb[] {
    return [
        "ない",
        "まい",
        "た",
        "そうだ（様態）",
        "そうだ（伝聞）",
        "ようだ",
        "らしい",
        "ます",
        "ている",
        "ば",
        "（命令）"
    ]
}

function dispatchたい(): AuxiliaryVerb[] {
    return [
        "た",
        "です",
    ]
}

function dispatchたがる(): AuxiliaryVerb[] {
    return [
        "ている",
    ]
}

function dispatchない(): AuxiliaryVerb[] {
    return [
        "う",
        "そうだ（様態）",
        "そうだ（伝聞）",
        "ようだ",
        "らしい",
        "です",
        "ば"
    ]
}

function dispatchた(): AuxiliaryVerb[] {
    return [
        "う",
        "（ば）"
    ]
}

function dispatchそうだ様態(): AuxiliaryVerb[] {
    return [
        "です",
        "う",
        "た",
        "（ば）"
    ]
}

function dispatchそうだ伝聞(): AuxiliaryVerb[] {
    return [
        "です",
        "う",
        "た",
        "（ば）"
    ]
}

function dispatchようだ(): AuxiliaryVerb[] {
    return [
        "です",
        "た",
        "（ば）"
    ]
}

function dispatchらしい(): AuxiliaryVerb[] {
    return [
        "た",
        "です"
    ]
}

function dispatchます(): AuxiliaryVerb[] {
    return [
        "ん",
        "う",
        "た",
        "（命令）"
    ]
}

function dispatchだ(): AuxiliaryVerb[] {
    return [
        "う",
        "た",
        "（ば）"
    ]
}

function dispatchです(): AuxiliaryVerb[] {
    return [
        "う",
        "た"
    ]
}

function dispatchている(): AuxiliaryVerb[] {
    return [
        "ます",
        "ない",
        "た",
        "ば"
    ]
}

/**
 * Select a random word from the dictionary,
 * then iteratively select attachable auxiliary verbs.
 *
 * It is guaranteed to have at least 1 auxiliary verb.
 */
export function getConjugationList(): ConjugationQuestion {
    const verb = getRandomVerb()
    const question: AuxiliaryVerb[] = []

    let choices: AuxiliaryVerb[] = getAttachableAuxiliaryVerbs(verb)
    let nextStep = choices[Math.floor(Math.random() * choices.length)]
    question.push(nextStep)

    let term = nextStep
    while (true) {
        choices = auxiliaryVerbDispatcher(term)
        if (Math.random() < 0.2 || !choices.length) {
            // 20% chance of escaping the loop
            break
        }
        nextStep = choices[Math.floor(Math.random() * choices.length)]
        question.push(nextStep)
        term = nextStep
    }

    return {
        verb,
        auxiliary: question
    }
}

// SOLVER

function conjugateVerbByAuxiliary(verb: VerbTerm, auxiliary: AuxiliaryVerb) {
    switch (verb.type) {
        case "monograde":
            return conjugateMonograde(verb, auxiliary)
        case "pentagrade":
            return conjugatePentagrade(verb, auxiliary)
        case "sagyou":
            return conjugateSagyou(auxiliary)
        case "kagyou":
            return conjugateKagyou(auxiliary)
        case "ragyou":
        case "nagyou":
        default:
            throw Error("Ancient types are not supported")
    }
}

function conjugateMonograde(verb: VerbTerm, auxiliary: AuxiliaryVerb): ConjugatedVerbMap {
    let conjugated: string
    const rubyMap = new Map<number, string>()

    for (let i = 0; i < verb.ruby.length; i++) {
        if (verb.ruby[i]) {
            rubyMap.set(i, verb.ruby[i]!)
        }
    }

    switch (auxiliary) {
        case "させる":
        case "られる":
        case "ない":
        case "たい":
        case "たがる":
        case "よう":
        case "た":
        case "ます":
        case "そうだ（様態）":
        case "ている":
        case "まい":
            conjugated = verb.text.slice(0, -1)
            break
        case "そうだ（伝聞）":
        case "ようだ":
        case "らしい":
            conjugated = verb.text
            break
        case "ば":
            conjugated = `${verb.text.slice(0, -1)}れ`
            break
        case "（命令）":
            conjugated = `${verb.text.slice(0, -1)}ろ`   // TODO: second option for よ
            break
        default:
            throw Error(`Cannot conjugate ${verb.text} with ${auxiliary}`)
    }

    return {
        ruby: rubyMap,
        conjugated
    }
}

function conjugatePentagrade(verb: VerbTerm, auxiliary: AuxiliaryVerb): ConjugatedVerbMap {
    if (termEquals(verb, "有る")) {
        return conjugateAru(auxiliary)
    }

    const ruby = new Map<number, string>()
    for (let i = 0; i < verb.ruby.length; i++) {
        if (verb.ruby[i]) {
            ruby.set(i, verb.ruby[i]!)
        }
    }

    const lastKana = verb.text[verb.text.length - 1] as Hiragana
    let grade: Grade | "sound change" | "no change"

    switch (auxiliary) {
        case "せる":
        case "れる":
        case "ない":
            grade = "a"
            break
        case "う":
            grade = "o"
            break
        case "たい":
        case "たがる":
        case "ます":
        case "そうだ（様態）":
            grade = "i"
            break
        case "た":
        case "ている":
            grade = "sound change"
            break
        case "まい":
        case "そうだ（伝聞）":
        case "ようだ":
        case "らしい":
            grade = "no change"
            break
        case "ば":
        case "（命令）":
            grade = "e"
            break
        default:
            throw Error(`Cannot conjugate ${verb.text} with ${auxiliary}`)
    }

    if (grade === "no change") {
        return {
            conjugated: verb.text,
            ruby
        }
    }

    if (grade === "sound change") {
        if (termEquals(verb, "行く")) {
            return {
                conjugated: "行っ",
                ruby
            }
        }
        const changedEnd = voiceChange(lastKana)
        const conjugated = verb.text.slice(0, verb.text.length - 1) + changedEnd
        return {
            conjugated,
            ruby
        }
    }

    const changedEnd = kanaToGrade(lastKana, grade as Grade)!
    const conjugated = verb.text.slice(0, verb.text.length - 1) + changedEnd
    return {
        conjugated,
        ruby
    }
}

/**
 * ある
 *
 * @param auxiliary
 */
function conjugateAru(auxiliary: AuxiliaryVerb): ConjugatedVerbMap {
    let conjugated: string
    let ruby: string = "あ"

    switch (auxiliary) {
        case "ない":
            ruby = ""
            conjugated = ""
            break
        case "た":
            conjugated = "有っ"
            break
        case "ば":
            conjugated = "有れ"
            break
        case "ます":
            conjugated = "有り"
            break
        default:
            throw Error(`Cannot conjugate 有る with ${auxiliary}`)
    }

    const rubyMap = new Map<number, string>()
    if (ruby) {
        rubyMap.set(0, ruby)
    }

    return {
        conjugated,
        ruby: rubyMap
    }
}

/**
 * する
 *
 * @param auxiliary
 */
function conjugateSagyou(auxiliary: AuxiliaryVerb): ConjugatedVerbMap {
    let conjugated: string

    switch (auxiliary) {
        case "させる":
        case "られる":
            conjugated = ""
            break
        case "ない":
        case "よう":
        case "たい":
        case "たがる":
        case "た":
        case "ている":
        case "ます":
        case "そうだ（様態）":
            conjugated = "し"
            break
        case "まい":
        case "そうだ（伝聞）":
        case "ようだ":
        case "らしい":
            conjugated = "する"
            break
        case "ば":
            conjugated = "すれ"
            break
        case "（命令）":
            conjugated = "しろ"   // todo options for せよ
            break
        default:
            throw Error(`Cannot conjugate 来る with ${auxiliary}`)
    }

    return {
        ruby: new Map<number, string>(),
        conjugated
    }
}

/**
 * 来る
 *
 * @param auxiliary
 */
function conjugateKagyou(auxiliary: AuxiliaryVerb): ConjugatedVerbMap {
    let conjugated: string
    let ruby: string

    switch (auxiliary) {
        case "させる":
        case "られる":
        case "ない":
        case "よう":
            ruby = "こ"
            conjugated = "来"
            break
        case "たい":
        case "たがる":
        case "た":
        case "ている":
        case "そうだ（様態）":
        case "ます":
            ruby = "き"
            conjugated = "来"
            break
        case "まい":
        case "そうだ（伝聞）":
        case "ようだ":
        case "らしい":
            ruby = "く"
            conjugated = "来る"
            break
        case "ば":
            ruby = "く"
            conjugated = "来れ"
            break
        case "（命令）":
            ruby = "こ"
            conjugated = "来い"
            break
        default:
            throw Error(`Cannot conjugate 来る with ${auxiliary}`)
    }

    const rubyMap = new Map<number, string>([
        [0, ruby]
    ])

    return {
        ruby: rubyMap,
        conjugated
    }
}

function conjugateAuxiliary(current: AuxiliaryVerb, lookahead: AuxiliaryVerb) {
    switch (current) {
        case "せる":
            return conjugateせる(lookahead)
        case "させる":
            return conjugateさせる(lookahead)
        case "れる":
            return conjugateれる(lookahead)
        case "られる":
            return conjugateられる(lookahead)
        case "たい":
            return conjugateたい(lookahead)
        case "たがる":
            return conjugateたがる(lookahead)
        case "ない":
            return conjugateない(lookahead)
        case "う":
            return "う"
        case "よう":
            return "よう"
        case "まい":
            return "まい"
        case "た":
            return conjugateた(lookahead)
        case "そうだ（様態）":
        case "そうだ（伝聞）":
            return conjugateそうだ(lookahead)
        case "ようだ":
            return conjugateようだ(lookahead)
        case "らしい":
            return conjugateらしい(lookahead)
        case "ます":
            return conjugateます(lookahead)
        case "だ":
            return conjugateだ(lookahead)
        case "です":
            return conjugateです(lookahead)
        case "ている":
            return conjugateている(lookahead)
        case "ば" :
            return "ば"
        case "ん"  :
            return "ん"
        case "（命令）":
        case "（ば）":
            return ""
        default:
            throw Error(`Cannot conjugate ${current} to ${lookahead}`)
    }
}

function conjugateせる(auxiliary?: AuxiliaryVerb): string {
    switch (auxiliary) {
        case undefined:
        case "そうだ（伝聞）":
        case "ようだ":
        case "らしい":
            return "せる"
        case "ない":
        case "られる":
        case "たい":
        case "たがる":
        case "まい":
        case "そうだ（様態）":
        case "ます":
        case "ている":
            return "せ"
        case "ば":
            return "せれ"
        case "（命令）":
            return "せろ"
        default:
            throw Error(`Cannot conjugate せる to ${auxiliary}`)
    }
}

function conjugateさせる(auxiliary?: AuxiliaryVerb): string {
    return `さ${conjugateせる(auxiliary)}`
}

function conjugateれる(auxiliary?: AuxiliaryVerb): string {
    switch (auxiliary) {
        case undefined:
        case "そうだ（伝聞）":
        case "ようだ":
        case "らしい":
            return "れる"
        case "ない":
        case "そうだ（様態）":
        case "ます":
        case "た":
        case "ている":
        case "まい":
            return "れ"
        case "ば":
            return "れれ"
        case "（命令）":
            return "れろ"
        default:
            throw Error(`Cannot conjugate れる to ${auxiliary}`)
    }
}

function conjugateられる(auxiliary?: AuxiliaryVerb): string {
    return `ら${conjugateれる(auxiliary)}`
}

function conjugateたい(auxiliary?: AuxiliaryVerb): string {
    switch (auxiliary) {
        case undefined:
        case "です":
            return "たい"
        case "た":
            return "たかっ"
        default:
            throw Error(`Cannot conjugate たい to ${auxiliary}`)
    }
}

function conjugateたがる(auxiliary?: AuxiliaryVerb): string {
    switch (auxiliary) {
        case undefined:
            return "たがる"
        case "ている":
            return "たがっ"
        default:
            throw Error(`Cannot conjugate たがる to ${auxiliary}`)
    }
}

function conjugateない(auxiliary?: AuxiliaryVerb): string {
    switch (auxiliary) {
        case undefined:
        case "そうだ（伝聞）":
        case "ようだ":
        case "らしい":
        case "です":
            return "ない"
        case "う":
            return "なかろ"
        case "そうだ（様態）":
            return "なさ"
        case "ば":
            return "なけれ"
        default:
            throw Error(`Cannot conjugate ない to ${auxiliary}`)
    }
}

function conjugateそうだ(auxiliary?: AuxiliaryVerb): string {
    if (auxiliary === "です") {
        return "そう"
    }
    return `そう${conjugateだ(auxiliary)}`
}

function conjugateようだ(auxiliary?: AuxiliaryVerb): string {
    if (auxiliary === "です") {
        return "よう"
    }
    return `よう${conjugateだ(auxiliary)}`
}

function conjugateらしい(auxiliary?: AuxiliaryVerb): string {
    switch (auxiliary) {
        case undefined:
        case "です":
            return "らしい"
        case "た":
            return "らしかっ"
        default:
            throw Error(`Cannot conjugate らしい to ${auxiliary}`)
    }
}

function conjugateます(auxiliary?: AuxiliaryVerb): string {
    switch (auxiliary) {
        case undefined:
            return "ます"
        case "ん":
        case "（命令）":
            return "ませ"
        case "う":
            return "ましょ"
        case "た":
            return "まし"
        default:
            throw Error(`Cannot conjugate ます to ${auxiliary}`)
    }
}

function conjugateだ(auxiliary?: AuxiliaryVerb): string {
    switch (auxiliary) {
        case undefined:
            return "だ"
        case "う":
            return "だろ"
        case "た":
            return "だっ"
        case "（ば）":
            return "なら"
        default:
            throw Error(`Cannot conjugate だ to ${auxiliary}`)
    }
}

function conjugateです(auxiliary?: AuxiliaryVerb): string {
    switch (auxiliary) {
        case undefined:
            return "です"
        case "う":
            return "でしょ"
        case "た":
            return "でし"
        default:
            throw Error(`Cannot conjugate です to ${auxiliary}`)
    }
}

function conjugateた(auxiliary?: AuxiliaryVerb, dakuon: boolean = false): string {
    const first = dakuon ? "だ" : "た"

    switch (auxiliary) {
        case undefined:
            return first
        case "う":
            return `${first}ろ`
        case "（ば）":
            return `${first}ら`
        default:
            throw Error(`Cannot conjugate た to ${auxiliary}`)
    }
}

function conjugateている(auxiliary?: AuxiliaryVerb, dakuon: boolean = false): string {
    const first = dakuon ? "で" : "て"

    switch (auxiliary) {
        case undefined:
            return `${first}いる`
        case "ます":
        case "ない":
        case "た":
            return `${first}い`
        case "ば":
            return `${first}いれ`
        default:
            throw Error(`Cannot conjugate ている to ${auxiliary}`)
    }
}

export function conjugate(question: ConjugationQuestion): ConjugationAnswer {
    const { verb, auxiliary } = question

    // for each token, conjugate itself with respect to the lookahead token,
    // so the next token can be directly attached onto the current one
    const conjugated: ConjugatedSegment[] = []
    let lookaheadIndex = 0
    let lookahead = auxiliary[lookaheadIndex]

    const conjugatedVerb = conjugateVerbByAuxiliary(verb, lookahead)
    conjugated.push(conjugatedVerb.conjugated)

    // if the conjugation requires the next auxiliary verb to change as well,
    // then do it here.
    const lastKana = verb.text.slice(-1) as Hiragana
    if ((lookahead === "た" || lookahead === "ている") && (kanaIsDakuon(lastKana) || voiceChangeToDakuon(lastKana))) {
        lookaheadIndex++;
        const current = lookahead
        lookahead = auxiliary[lookaheadIndex]

        if (current === "た") {
            conjugated.push(conjugateた(lookahead))
        } else {
            conjugated.push(conjugateている(lookahead))
        }
    }

    for (; lookaheadIndex < auxiliary.length; lookaheadIndex++) {
        conjugated.push(conjugateAuxiliary(
            auxiliary[lookaheadIndex],
            auxiliary[lookaheadIndex + 1]
        ))
    }

    const conjugatedString = conjugated.join("")
    const rubyArray: (string | null)[] = nullOf(conjugatedString.length)

    for (const [key, value] of conjugatedVerb.ruby.entries()) {
        rubyArray[key] = value
    }

    return {
        conjugated: conjugatedString,
        ruby: rubyArray
    }
}
