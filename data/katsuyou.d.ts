interface Term<T> {
    text: string,
    ruby: (string | null)[],
    type: T
}

interface Dict<T> {
    [term: string]: {
        ruby: (string | null)[],
        type: T
    };
}

interface ConjugatedTermOption {
    text: string,
    ruby: (string | null)[]
}

interface ConjugatedTerm<T> {
    options: ConjugatedTermOption[]
    original: string,
    conjugationType: T
}

// ない形、受身形、使役形、意向形、丁寧形、テ形、タ形、辞書形、バ形、命令形
type VerbConjugations = "negation" | "passivity" | "causative" | "intentional" | "polite" | "te" | "ta" | "dictionary" | "ba" | "imperative"
type VerbTypes = "pentagrade" | "monograde" | "kagyou" | "sagyou" | "nagyou" | "ragyou"
type VerbDict = Dict<VerbTypes>
type VerbTerm = Term<VerbTypes>
type ConjugatedVerb = ConjugatedTerm<VerbConjugations>

// ない形、テ形、意向形、辞書形、バ形、タ形
type AdjectiveConjugations = "negation" | "te" | "intentional" | "dictionary" | "ba" | "ta"
type AdjectiveTypes = "i" | "na"
type AdjectiveDict = Dict<AdjectiveTypes>
type AdjectiveTerm = Term<AdjectiveTypes>
type ConjugatedAdjective = ConjugatedTerm<AdjectiveConjugations>

// 「ある」 -> 丁寧形、テ形、タ形、否定形、バ形
type AruConjugations = "polite" | "te" | "ta" | "negation" | "ba"
// TODO: decide to include or not
// 「ござる」 -> 否定形、意向形、丁寧形、テ形、タ形、辞書形、バ形、命令形
type GozaruConjugation = "negation" | "polite" | "te" | "ta" | "dictionary" | "ba" | "imperative"

// 未然形、連用形、終止形、連体形、仮定形、命令形
type ConjugationClass = "irrealis" | "adverbial" | "conclusive" | "attributive" | "conditional" | "imperative"

type AuxiliaryVerb = "せる"
    | "させる"
    | "れる"
    | "られる"
    | "たい"
    | "たがる"
    | "ない"
    | "う"
    | "よう"
    | "まい"
    | "た"
    | "そうだ（様態）"
    | "そうだ（伝聞）"
    | "ようだ"
    | "らしい"
    | "ます"
    | "だ"
    | "です"
    | "ている"
    | "ば"   // technically not verb, it's an ending
    | "ん"   // ません
    | "（命令）"
    | "（ば）"  // たら（ば）

interface ConjugatedVerbMap {
    ruby: Map<number, string>
    conjugated: string
}

type ConjugatedSegment = ConjugatedVerbMap | string

interface Activity {
    identifier: VerbTypes | AdjectiveTypes,
    display: string,
    description: string,
    examples: string[],
    archaic: boolean
}

interface ConjugationQuestion {
    verb: VerbTerm
    auxiliary: AuxiliaryVerb[]
}

interface ConjugationAnswer {
    conjugated: string,
    ruby: (string | null)[]
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

interface PentagradeConjugation {
    grade: Grade | "sound change"　| null,
    suffix: "ない" | "れる" | "せる" | "う" | "ます" | "て" | "た" | "で" | "だ" | "とき" | "ば" | "" | null
}

