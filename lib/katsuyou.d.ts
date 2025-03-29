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

// ない形、テ形、意向形、辞書形、バ形、タ形
type AdjectiveConjugations = "negation" | "te" | "intentional" | "dictionary" | "ba" | "ta"
type AdjectiveTypes = "i" | "na"
type AdjectiveDict = Dict<AdjectiveTypes>
type AdjectiveTerm = Term<AdjectiveTypes>
type ConjugatedAdjective = ConjugatedTerm<AdjectiveConjugations>

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
    | "ぺ" | "ぽ" | "ば" | "び" | "ぶ" | "べ" | "ぼ" | "は" | "ひ" | "ふ" | "へ" | "ほ"

type DakuonHiragana =
    | "が"
    | "ぎ"
    | "ぐ"
    | "げ"
    | "ご"
    | "ざ"
    | "じ"
    | "ず"
    | "ぜ"
    | "ぞ"
    | "だ"
    | "ぢ"
    | "づ"
    | "で"
    | "ど"
    | "ば"
    | "び"
    | "ぶ"
    | "べ"
    | "ぼ"

type Grade = "a" | "i" | "u" | "e" | "o"

type KatsuyouVerbType =
    | "aru"
    | "pentagrade"
    | "honorific"
    | "monograde"
    | "kagyou"
    | "sagyou"
    | "quadrigrade"
    | "upper_bigrade"
    | "lower_bigrade"
    | "nagyou"
    | "ragyou"

interface KatsuyouVerb {
    type: KatsuyouVerbType
    baseForm: string,
    modern: boolean,
    classic: boolean
    display?: string,
    wagyou?: boolean,
    row: Row
    ruby?: Record<number, string>
}

type Row =
    | "ア"
    | "カ"
    | "ガ"
    | "サ"
    | "ザ"
    | "タ"
    | "ダ"
    | "ナ"
    | "ハ"
    | "バ"
    | "マ"
    | "ヤ"
    | "ラ"
    | "ワ"

// 形容詞
interface KatsuyouModernAdjective {
    baseForm: string
    display?: string,
    nounify?: {     // blank -> sa + mi + me + ge
        sa?: boolean,    // all default true
        mi?: boolean,
        me?: boolean,
        ge?: boolean,
        // if this is true, then all other will be false
        stem?: boolean   // default to false 赤い -> 赤
    }
    ruby?: Record<number, string>
}

// 形容動詞
interface KatsuyouModernAdjectivalNoun {
    baseForm: string,
    display?: string,
    nounify?: {     // blank -> sa + me + ge
        sa?: boolean,   // all default true
        me?: boolean,   // 穏やかめ
        ge?: boolean,   // 得意げ
        // if this is true, then all other will be false
        stem?: boolean  // default false 同じ -> 同じ (noun)
    },
    ruby?: Record<number, string>
}

// UI

interface SettingDesc {
    predicate: SettingPredicateSection
    token: SettingTokenSection[]
}

interface SettingTokenSection {
    name: string,
    reverse?: boolean
    children: SettingTokenOption[]
}

interface SettingPredicateSection {
    name: string,
    poller: (predicateData: Record<string, boolean>) => any,
    describeType: (term: any) => string
    children: SettingPredicateOption[]
}

interface SettingPredicateOption {
    key: string,
    display: string,
}

interface SettingTokenOption {
    key: string
    display: string
    trigger: any[]
}

// MODELS

interface User {
    uuid: string
    name: string
    email: string
    locale: string
    platform: "email" | "google" | "github"
    created_at?: string
    avatar?: string
}

// CONTROLLER PARAMS

type PartialWithUuid<T> = Partial<T> & Require<Pick<T, "uuid">>

interface ResponseOf<T> {
    data?: T
    errorMessage?: string
    success: boolean
}

interface UserPostRequest {
    data: User
    checkExistence?: boolean
}

interface UserPutRequest {
    data: PartialWithUuid<User>
    updateLocale?: boolean
}

interface UserDeleteRequest {
    data: PartialWithUuid<User>
}