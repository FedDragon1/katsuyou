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
    type: ActivityType
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

type SupportedLocale = "ja" | "zh" | "en"
type ActivityType =
    // GRAND COLLECTION
    "modern_verb"           // all modern verbs
    | "classic_verb"        // all classic verbs
    | "modern_adjective"    // all modern adjectives
    | "classic_adjective"   // all classic adjectives
    // BY FIRST TOKEN TYPE
    | "modern_godan"        // 五段活用
    | "modern_ichidan"      // 上下一段活用
    | "modern_henkaku"      // サ行カ行変格活用
    | "classic_yodan"       // 四段活用
    | "classic_nidan"       // 上下二段活用
    | "classic_ichidan"     // 上下一段活用
    | "classic_henkaku"     // カサナラ行変格活用
    | "modern_i"            // 形容詞
    | "modern_na"           // 形容動詞
    | "classic_ku"          // ク活用
    | "classic_shiku"       // シク活用
    | "classic_nari"        // ナリ活用
    | "classic_tari"        // タリ活用
    // TODO: 本活用と補助活用 https://www.try-it.jp/chapters-14468/lessons-14592/point-3/
    // BY SPECIFIC CONJUGATION
    | "modern_te"           // テ形
    | "modern_ta"           // タ形
    | "modern_ba"           // バ形
    | "modern_u"            // う・よう形
    | "modern_nai"          // ない形
    // TODO: maybe more

interface User {
    uuid: string
    name: string
    email: string
    locale: SupportedLocale
    platform: "email" | "google" | "github"
    created_at?: string
    avatar?: string
}

interface PracticeHistory {
    uuid: string
    user_id: string
    type: ActivityType
    time: string
    duration: number
    n_correct: number
    n_attempted: number
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

interface HistoryPostRequest {
    data: PracticeHistory
}

interface HistoryPutRequest {
    data: PartialWithUuid<PracticeHistory>
}

interface HistoryDeleteRequest {
    data: PartialWithUuid<PracticeHistory>
}