type VerbTypes = "pentagrade" | "monograde" | "kagyou" | "sagyou" | "nagyou" | "ragyou"

interface VerbsDict {
    [term: string]: {
        ruby: (string | null)[],
        type: VerbTypes
    };
}

interface Term {
    text: string,
    ruby: (string | null)[],
    type: VerbTypes
}

type AdjectiveTypes = "pentagrade" | "monograde" | "kagyou" | "sagyou"

interface Activity {
    identifier: VerbTypes | AdjectiveTypes,
    display: string,
    description: string,
    examples: string[],
    archaic: boolean
}

interface Practice {
    category: string,
    activities: Activity[],
}

type Hiragana = "あ" | "い" | "う" | "え" | "お" | "か" | "き" | "く" | "け" | "こ" | "さ" | "し" | "す" | "せ" | "そ"
    | "た" | "ち" | "つ" | "て" | "と" | "な" | "に" | "ぬ" | "ね" | "の" | "ま" | "み" | "む" | "め" | "も" | "や"
    | "ゆ" | "よ" | "ら" | "り" | "る" | "れ" | "ろ" | "わ" | "ゐ" | "ゑ" | "を" | "ん" | "が" | "ぎ" | "ぐ"
    | "げ" | "ご" | "ざ" | "じ" | "ず" | "ぜ" | "ぞ" | "だ" | "ぢ" | "づ" | "で" | "ど" | "ぱ" | "ぴ" | "ぷ"
    | "ぺ" | "ぽ" | "ば" | "び" | "ぶ" | "べ" | "ぼ"

type DakuonHiragana = "が" | "ぎ" | "ぐ" | "げ" | "ご" | "ざ" | "じ" | "ず" | "ぜ" | "ぞ" | "だ" | "ぢ" | "づ" | "で" | "ど" | "ば" | "び" | "ぶ" | "べ" | "ぼ"
type HandakuonHiragana = "ぱ" | "ぴ" | "ぷ" | "ぺ" | "ぽ"

type Grade = "a" | "i" | "u" | "e" | "o"

// 未然形、連用形、終止形、連体形、仮定形、命令形、已然形（古い）
type ConjugationClass = "irrealis" | "adverbial" | "conclusive" | "attributive" | "conditional" | "imperative" | "realis"

// 否定形、受身形、使役形、意向形、丁寧形、テ形、タ形、辞書形、バ形、命令形
type VerbConjugations = "negation" | "passivity" | "causative" | "intention" | "polite" | "te" | "ta" | "dictionary" | "ba" | "imperative"

type AruConjugations = "polite" | "te" | "ta" | "negation" | "ba"

interface PentagradeConjugation {
    grade: Grade | "sound change"　| null,
    suffix: "ない" | "れる" | "せる" | "う" | "ます" | "て" | "た" | "で" | "だ" | "とき" | "ば" | "" | null
}

interface ConjugatedVerb {
    text: string,
    ruby: (string | null)[]
    original: string,
    conjugationType: VerbConjugations
}