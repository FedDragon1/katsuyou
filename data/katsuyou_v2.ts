// noinspection NonAsciiCharacters,JSNonASCIINames

import { kanaToGrade, voiceChange, voiceChangeToDakuon } from "@/data/conjugator";

class KatsuyouConstants {
    static END_TOKEN: KatsuyouToken
    static せる_TOKEN: KatsuyouAuxiliary
    static させる_TOKEN: KatsuyouAuxiliary
    static れる_TOKEN: KatsuyouAuxiliary
    static られる_TOKEN: KatsuyouAuxiliary
    static たい_TOKEN: KatsuyouAuxiliary
    static たがる_TOKEN: KatsuyouAuxiliary
    static ない_TOKEN: KatsuyouAuxiliary
    static ない_SHORT_TOKEN: KatsuyouAuxiliary
    static う_TOKEN: KatsuyouAuxiliary
    static よう_TOKEN: KatsuyouAuxiliary
    static まい_TOKEN: KatsuyouAuxiliary
    static た_TOKEN: KatsuyouAuxiliary
    static た_SHORT_TOKEN: KatsuyouAuxiliary
    static そうだ様態_TOKEN: KatsuyouAuxiliary
    static そうだ伝聞_TOKEN: KatsuyouAuxiliary
    static ようだ_TOKEN: KatsuyouAuxiliary
    static らしい_TOKEN: KatsuyouAuxiliary
    static ます_TOKEN: KatsuyouAuxiliary
    static ます_SHORT_TOKEN: KatsuyouAuxiliary
    static だ_TOKEN: KatsuyouAuxiliary
    static です_TOKEN: KatsuyouAuxiliary
    static です_SHORT_TOKEN: KatsuyouAuxiliary
    static ている_TOKEN: KatsuyouAuxiliary
    static た濁音_TOKEN: KatsuyouAuxiliary
    static ている濁音_TOKEN: KatsuyouAuxiliary
    static ば_TOKEN: KatsuyouAuxiliary
    static ん_TOKEN: KatsuyouAuxiliary
    static 命令_TOKEN: KatsuyouAuxiliary
    static ら_TOKEN: KatsuyouAuxiliary
    static べき_TOKEN: KatsuyouAuxiliary
    static ある_TOKEN: FreeStandingToken
    static する_TOKEN: FreeStandingToken
    static くる_TOKEN: FreeStandingToken
}

class KatsuyouConfig {
    static showModern: boolean = true;
    static showClassic: boolean = false;
    static allowedTokens: KatsuyouToken[] = [];
}

class KatsuyouDispatchInfo {
    readonly from: KatsuyouToken;
    readonly to: KatsuyouToken;
    readonly modern: boolean;
    readonly weight: number;
    readonly conjugation: string | readonly string[]

    constructor(from: KatsuyouToken, next: KatsuyouToken, weight: number, modern: boolean, conjugation: string | readonly string[]) {
        this.from = from
        this.to = next;
        this.weight = weight;
        this.modern = modern;
        this.conjugation = conjugation
    }
}

class KatsuyouResult {
    options: string[]
    ruby: Record<number, string>

    constructor(options: string[] | string, ruby: Record<number, string>) {
        if (!Array.isArray(options)) {
            options = [options]
        }
        this.options = options;
        this.ruby = ruby;
    }

    /**
     * Merges the current option with the new option(s)
     * by calculating the Cartesian product between the two arrays.
     *
     * @param options
     */
    merge(options: readonly string[] | string) {
        if (!Array.isArray(options)) {
            options = [options] as readonly string[]
        }
        const newOptions: string[] = []
        for (const o1 of this.options) {
            for (const o2 of options) {
                newOptions.push(`${o1}${o2}`)
            }
        }
        // ruby only applies to kanji, shouldn't change over here
        return new KatsuyouResult(newOptions, this.ruby)
    }
}

class KatsuyouToken {
    readonly baseForm: string;
    readonly display: string
    readonly modern: boolean;
    dispatchables: KatsuyouDispatchInfo[]

    constructor(baseForm: string, display: string, modern: boolean, dispatchables?: KatsuyouDispatchInfo[]) {
        this.baseForm = baseForm;
        this.display = display;
        this.modern = modern;
        this.dispatchables = dispatchables ?? [];
    }

    addDispatch(next: KatsuyouToken, weight: number, modern: boolean, conjugation: string | readonly string[]) {
        this.dispatchables.push(
            new KatsuyouDispatchInfo(this, next, weight, modern, conjugation)
        )
        return this
    }

    dispatch(): KatsuyouDispatchInfo | undefined {
        debugger;
        const candidates = this.dispatchables.filter(
            (candidate) =>
                ((KatsuyouConfig.showModern && candidate.modern) || (KatsuyouConfig.showClassic && !candidate.modern))
                && KatsuyouConfig.allowedTokens.includes(candidate.to)
        )
        const totalWeight = candidates.map((c) => c.weight).reduce((a, b) => a + b, 0)
        if (!totalWeight) {
            return new KatsuyouDispatchInfo(this, KatsuyouConstants.END_TOKEN, 1, true, this.baseForm)
        }
        const target = Math.random() * totalWeight
        let s = 0
        for (const c of candidates) {
            s += c.weight
            if (s > target) {
                return c;
            }
        }
        return new KatsuyouDispatchInfo(this, KatsuyouConstants.END_TOKEN, 1, true, this.baseForm)
    }

}

class KatsuyouEndToken extends KatsuyouToken {
    constructor() {
        super("", "", true);
    }

    addDispatch(): this {
        throw Error("Cannot add dispatch to the end token")
    }

    dispatch(): undefined {
        return undefined
    }

    conjugate(result: KatsuyouResult) {
        return result
    }
}

class KatsuyouAuxiliary extends KatsuyouToken {
    conjugate(prev: KatsuyouResult, lookAhead: KatsuyouDispatchInfo | KatsuyouEndToken): KatsuyouResult {
        const res = (lookAhead instanceof KatsuyouEndToken) ? this.baseForm : lookAhead.conjugation
        return prev.merge(res)
    }
}

/**
 * 自立語
 */
class FreeStandingToken extends KatsuyouToken {
    readonly ruby: Record<number, string>

    constructor(baseForm: string, display: string, modern: boolean, ruby: Record<number, string>, dispatcher?: KatsuyouDispatchInfo[]) {
        super(baseForm, display, modern, dispatcher);
        this.ruby = ruby;
    }

    conjugate(lookAhead: KatsuyouDispatchInfo): KatsuyouResult {
        return new KatsuyouResult(lookAhead.conjugation as string | string[], this.ruby)
    }
}

class PentagradeToken extends FreeStandingToken {
    /**
     * Pentagrade Conjugation logic. 行く belongs in this category,
     * with the parameter iku marked true for specialization.
     *
     * @param baseForm
     * @param display
     * @param modern
     * @param ruby
     * @param iku
     */
    constructor(baseForm: string, display: string, modern: boolean, ruby: Record<number, string>, iku: boolean = false) {
        super(baseForm, display, modern, ruby);

        const stem = baseForm.slice(0, baseForm.length - 1),
            lastKana = baseForm[baseForm.length - 1] as Hiragana,
            aGrade = `${stem}${kanaToGrade(lastKana, "a")}`,
            iGrade = `${stem}${kanaToGrade(lastKana, "i")}`,
            eGrade = `${stem}${kanaToGrade(lastKana, "e")}`,
            oGrade = `${stem}${kanaToGrade(lastKana, "o")}`

        const soundChangeTo = iku ? "っ" : voiceChange(lastKana)
        const soundChanged = `${stem}${soundChangeTo}`
        const dispatch_ta = voiceChangeToDakuon(lastKana) ? KatsuyouConstants.た濁音_TOKEN : KatsuyouConstants.た_TOKEN
        const dispatch_te = voiceChangeToDakuon(lastKana) ? KatsuyouConstants.ている濁音_TOKEN : KatsuyouConstants.ている_TOKEN

        this.addDispatch(KatsuyouConstants.せる_TOKEN, 1, true, aGrade)
            .addDispatch(KatsuyouConstants.れる_TOKEN, 1, true, aGrade)
            .addDispatch(KatsuyouConstants.ない_TOKEN, 2, true, aGrade)
            .addDispatch(KatsuyouConstants.う_TOKEN, 2, true, oGrade)
            .addDispatch(KatsuyouConstants.たい_TOKEN, 1, true, iGrade)
            .addDispatch(KatsuyouConstants.たがる_TOKEN, 1, true, iGrade)
            .addDispatch(KatsuyouConstants.ます_TOKEN, 2, true, iGrade)
            .addDispatch(KatsuyouConstants.そうだ様態_TOKEN, 1, true, iGrade)
            .addDispatch(dispatch_ta, 2, true, soundChanged)
            .addDispatch(dispatch_te, 2, true, soundChanged)
            .addDispatch(KatsuyouConstants.まい_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.そうだ伝聞_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.ようだ_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.らしい_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.べき_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.ば_TOKEN, 1, true, eGrade)
            .addDispatch(KatsuyouConstants.命令_TOKEN, 2, true, eGrade)
    }
}

class MonogradeToken extends FreeStandingToken {
    /**
     * Monograde verb logic
     *
     * @param baseForm
     * @param display
     * @param modern
     * @param ruby
     */
    constructor(baseForm: string, display: string, modern: boolean, ruby: Record<number, string>) {
        super(baseForm, display, modern, ruby);

        const stem = baseForm.slice(0, baseForm.length - 1)

        this.addDispatch(KatsuyouConstants.させる_TOKEN, 1, true, stem)
            .addDispatch(KatsuyouConstants.られる_TOKEN, 1, true, stem)
            .addDispatch(KatsuyouConstants.ない_TOKEN, 1, true, stem)
            .addDispatch(KatsuyouConstants.たい_TOKEN, 1, true, stem)
            .addDispatch(KatsuyouConstants.たがる_TOKEN, 1, true, stem)
            .addDispatch(KatsuyouConstants.よう_TOKEN, 2, true, stem)
            .addDispatch(KatsuyouConstants.た_TOKEN, 2, true, stem)
            .addDispatch(KatsuyouConstants.ます_TOKEN, 2, true, stem)
            .addDispatch(KatsuyouConstants.そうだ様態_TOKEN, 1, true, stem)
            .addDispatch(KatsuyouConstants.ている_TOKEN, 2, true, stem)
            .addDispatch(KatsuyouConstants.まい_TOKEN, 1, true, stem)
            .addDispatch(KatsuyouConstants.そうだ伝聞_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.ようだ_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.らしい_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.べき_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.ば_TOKEN, 2, true, `${stem}れ`)
            .addDispatch(KatsuyouConstants.命令_TOKEN, 2, true, [`${stem}ろ`, `${stem}よ`])
    }
}

class HonorificToken extends FreeStandingToken {

    constructor(baseForm: string, display: string, modern: boolean, ruby: Record<number, string>) {
        super(baseForm, display, modern, ruby);

        const stem = baseForm.slice(0, baseForm.length - 1)

        this.addDispatch(KatsuyouConstants.ない_TOKEN, 1, true, `${stem}ら`)
            .addDispatch(KatsuyouConstants.ます_TOKEN, 1, true, `${stem}い`)
            .addDispatch(KatsuyouConstants.命令_TOKEN, 1, true, `${stem}い`)
    }
}

class KagyouToken extends FreeStandingToken {

    constructor() {
        super("来る", "来る", true, { 0: "く" });

        this.addDispatch(KatsuyouConstants.させる_TOKEN, 1, true, "こ")
            .addDispatch(KatsuyouConstants.られる_TOKEN, 1, true, "こ")
            .addDispatch(KatsuyouConstants.ない_TOKEN, 1, true, "こ")
            .addDispatch(KatsuyouConstants.よう_TOKEN, 1, true, "こ")
            .addDispatch(KatsuyouConstants.たい_TOKEN, 1, true, "き")
            .addDispatch(KatsuyouConstants.たがる_TOKEN, 1, true, "き")
            .addDispatch(KatsuyouConstants.た_TOKEN, 1, true, "き")
            .addDispatch(KatsuyouConstants.ている_TOKEN, 1, true, "き")
            .addDispatch(KatsuyouConstants.そうだ様態_TOKEN, 1, true, "き")
            .addDispatch(KatsuyouConstants.ます_TOKEN, 1, true, "き")
            .addDispatch(KatsuyouConstants.まい_TOKEN, 1, true, "くる")
            .addDispatch(KatsuyouConstants.そうだ伝聞_TOKEN, 1, true, "くる")
            .addDispatch(KatsuyouConstants.ようだ_TOKEN, 1, true, "くる")
            .addDispatch(KatsuyouConstants.らしい_TOKEN, 1, true, "くる")
            .addDispatch(KatsuyouConstants.べき_TOKEN, 1, true, "くる")
            .addDispatch(KatsuyouConstants.ば_TOKEN, 1, true, "くれ")
            .addDispatch(KatsuyouConstants.命令_TOKEN, 1, true, "こい")
    }

    conjugate(lookAhead: KatsuyouDispatchInfo): KatsuyouResult {
        const katsuyouResultHiragana = super.conjugate(lookAhead);
        if (katsuyouResultHiragana.options.length !== 1) {
            throw new Error(`来る conjugation should only contains one result, found ${katsuyouResultHiragana}`)
        }
        const hiragana = katsuyouResultHiragana.options[0]
        const ruby = { 0: hiragana[0] === "来" ? "く" : hiragana[0] }
        const updated = `来${hiragana.slice(1)}`
        return new KatsuyouResult(updated, ruby)
    }
}

export class Katsuyou {
    sequence: KatsuyouDispatchInfo[]
    initialToken: FreeStandingToken | null
    solution: KatsuyouResult | null

    constructor() {
        this.sequence = []
        this.initialToken = null
        this.solution = null
    }

    reset() {
        this.sequence = []
        this.initialToken = null
    }

    feed(term: KatsuyouVerb) {
        this.reset()
        let token: FreeStandingToken
        switch (term.type) {
            case "pentagrade":
                token = new PentagradeToken(term.baseForm, term.display ?? term.baseForm, term.modern ?? true, term.ruby ?? {}, term.baseForm === "行く")
                break;
            case "monograde":
                token = new MonogradeToken(term.baseForm, term.display ?? term.baseForm, term.modern ?? true, term.ruby ?? {})
                break;
            case "sagyou":
                token = KatsuyouConstants.する_TOKEN
                break;
            case "kagyou":
                token = KatsuyouConstants.くる_TOKEN
                break;
            case "aru":
                token = KatsuyouConstants.ある_TOKEN
                break;
            case "honorific":
                token = new HonorificToken(term.baseForm, term.display ?? term.baseForm, term.modern ?? true, term.ruby ?? {})
                break;
            default:
                throw Error(`Unknown verb type ${JSON.stringify(term)}`)
        }
        this.initialToken = token

        let dispatched: KatsuyouDispatchInfo | undefined
        let currentToken: KatsuyouToken = token
        while (true) {
            debugger;
            dispatched = currentToken.dispatch()
            if (!dispatched) {
                break
            }
            this.sequence.push(dispatched)
            currentToken = dispatched.to
        }

        let result = token.conjugate(this.sequence[0])
        for (const dispatch of this.sequence.slice(1)) {
            result = (dispatch.from as KatsuyouAuxiliary).conjugate(result, dispatch)
        }
        // result = (this.sequence[this.sequence.length - 1].to as KatsuyouAuxiliary).conjugate(result)
        this.solution = result
    }

    get question() {
        if (!this.initialToken) {
            throw Error("Feed in a term before calling question")
        }
        const comps = this.sequence.map((v) => v.from.display)
        return comps.reduce((s1, s2) => `${s1} + ${s2}`)
    }
}

const tokens = [
    { name: "せる_TOKEN", baseForm: "せる", display: "せる", modern: true },
    { name: "させる_TOKEN", baseForm: "させる", display: "させる", modern: true },
    { name: "れる_TOKEN", baseForm: "れる", display: "れる", modern: true },
    { name: "られる_TOKEN", baseForm: "られる", display: "られる", modern: true },
    { name: "たい_TOKEN", baseForm: "たい", display: "たい", modern: true },
    { name: "たがる_TOKEN", baseForm: "たがる", display: "たがる", modern: true },
    { name: "ない_TOKEN", baseForm: "ない", display: "ない", modern: true },
    { name: "ない_SHORT_TOKEN", baseForm: "ない", display: "ない", modern: true },
    { name: "う_TOKEN", baseForm: "う", display: "う", modern: true },
    { name: "よう_TOKEN", baseForm: "よう", display: "よう", modern: true },
    { name: "まい_TOKEN", baseForm: "まい", display: "まい", modern: true },
    { name: "た_TOKEN", baseForm: "た", display: "た", modern: true },
    { name: "た_SHORT_TOKEN", baseForm: "た", display: "た", modern: true },
    { name: "た濁音_TOKEN", baseForm: "た", display: "た", modern: true },
    { name: "そうだ様態_TOKEN", baseForm: "そうだ様態", display: "そうだ（様態）", modern: true },
    { name: "そうだ伝聞_TOKEN", baseForm: "そうだ伝聞", display: "そうだ（伝聞）", modern: true },
    { name: "ようだ_TOKEN", baseForm: "ようだ", display: "ようだ", modern: true },
    { name: "らしい_TOKEN", baseForm: "らしい", display: "らしい", modern: true },
    { name: "ます_TOKEN", baseForm: "ます", display: "ます", modern: true },
    { name: "ます_SHORT_TOKEN", baseForm: "ます", display: "ます", modern: true },
    { name: "だ_TOKEN", baseForm: "だ", display: "だ", modern: true },
    { name: "です_TOKEN", baseForm: "です", display: "です", modern: true },
    { name: "です_SHORT_TOKEN", baseForm: "です", display: "です", modern: true },
    { name: "ている_TOKEN", baseForm: "ている", display: "ている", modern: true },
    { name: "ている濁音_TOKEN", baseForm: "ている", display: "ている", modern: true },
    { name: "ば_TOKEN", baseForm: "ば", display: "ば", modern: true },
    { name: "ん_TOKEN", baseForm: "ん", display: "ない", modern: true },
    { name: "命令_TOKEN", baseForm: "", display: "（命令）", modern: true },
    { name: "ら_TOKEN", baseForm: "ら", display: "（ば）", modern: true },
    { name: "べき_TOKEN", baseForm: "べき", display: "べき", modern: true },

    // more to support
    // { name: "ず_TOKEN", baseForm: "ず", display: "ず", modern: false },
    // { name: "べし_TOKEN", baseForm: "べし", display: "べし", modern: false },
    // { name: "つ_TOKEN", baseForm: "つ", display: "つ", modern: false },  // https://www.try-it.jp/chapters-14469/lessons-14638/
    // { name: "ぬ_TOKEN", baseForm: "ぬ", display: "ぬ", modern: false },
    // { name: "る_TOKEN", baseForm: "る", display: "る", modern: false },  // https://www.try-it.jp/chapters-14469/lessons-14621/
    // { name: "らる_TOKEN", baseForm: "らる", display: "らる", modern: false },
    // { name: "す_TOKEN", baseForm: "す", display: "す", modern: false },  // https://www.try-it.jp/chapters-14469/lessons-14626/
    // { name: "さす_TOKEN", baseForm: "さす", display: "さす", modern: false },
    // { name: "しむ_TOKEN", baseForm: "しむ", display: "しむ", modern: false },
    // { name: "き_TOKEN", baseForm: "き", display: "き", modern: false },
    // { name: "けり_TOKEN", baseForm: "けり", display: "けり", modern: false },
    // { name: "しむ_TOKEN", baseForm: "しむ", display: "しむ", modern: false },
    // { name: "しむ_TOKEN", baseForm: "しむ", display: "しむ", modern: false },
] as const

for (const token of tokens) {
    KatsuyouConstants[token.name] = new KatsuyouAuxiliary(token.baseForm, token.display, token.modern)
}

const verbTokens = [
    { name: "ある_TOKEN", baseForm: "有る", display: "ある", modern: true, ruby: {} },
    { name: "する_TOKEN", baseForm: "する", display: "する", modern: true, ruby: {} },
] as const

for (const verbToken of verbTokens) {
    KatsuyouConstants[verbToken.name] = new FreeStandingToken(verbToken.baseForm, verbToken.display, verbToken.modern, verbToken.ruby)
}
KatsuyouConstants.くる_TOKEN = new KagyouToken()
KatsuyouConstants.END_TOKEN = new KatsuyouEndToken()

const せる_dispatch = [
    { next: KatsuyouConstants.られる_TOKEN, weight: 2, modern: true, conjugation: "せ" },
    { next: KatsuyouConstants.たい_TOKEN, weight: 2, modern: true, conjugation: "せ" },
    { next: KatsuyouConstants.たがる_TOKEN, weight: 1, modern: true, conjugation: "せ" },
    { next: KatsuyouConstants.ない_TOKEN, weight: 2, modern: true, conjugation: "せ" },
    { next: KatsuyouConstants.まい_TOKEN, weight: 1, modern: true, conjugation: "せ" },
    { next: KatsuyouConstants.た_TOKEN, weight: 2, modern: true, conjugation: "せ" },
    { next: KatsuyouConstants.そうだ伝聞_TOKEN, weight: 1, modern: true, conjugation: "せる" },
    { next: KatsuyouConstants.ようだ_TOKEN, weight: 2, modern: true, conjugation: "せる" },
    { next: KatsuyouConstants.らしい_TOKEN, weight: 1, modern: true, conjugation: "せる" },
    { next: KatsuyouConstants.ます_TOKEN, weight: 2, modern: true, conjugation: "せ" },
    { next: KatsuyouConstants.ている_TOKEN, weight: 1, modern: true, conjugation: "せ" },
    { next: KatsuyouConstants.ば_TOKEN, weight: 2, modern: true, conjugation: "せれ" },
    { next: KatsuyouConstants.命令_TOKEN, weight: 1, modern: true, conjugation: ["せろ", "せよ"] },
    { next: KatsuyouConstants.END_TOKEN, weight: 2, modern: true, conjugation: "せる" },
] as const

const れる_dispatch = [
    { next: KatsuyouConstants.ない_TOKEN, weight: 2, modern: true, conjugation: "れ" },
    { next: KatsuyouConstants.まい_TOKEN, weight: 1, modern: true, conjugation: "れ" },
    { next: KatsuyouConstants.た_TOKEN, weight: 2, modern: true, conjugation: "れ" },
    { next: KatsuyouConstants.そうだ伝聞_TOKEN, weight: 1, modern: true, conjugation: "れる" },
    { next: KatsuyouConstants.ようだ_TOKEN, weight: 2, modern: true, conjugation: "れる" },
    { next: KatsuyouConstants.らしい_TOKEN, weight: 1, modern: true, conjugation: "れる" },
    { next: KatsuyouConstants.ます_TOKEN, weight: 2, modern: true, conjugation: "れ" },
    { next: KatsuyouConstants.ている_TOKEN, weight: 1, modern: true, conjugation: "れ" },
    { next: KatsuyouConstants.ば_TOKEN, weight: 2, modern: true, conjugation: "れれ" },
    { next: KatsuyouConstants.命令_TOKEN, weight: 1, modern: false, conjugation: ["れろ", "れよ"] },
    { next: KatsuyouConstants.END_TOKEN, weight: 2, modern: true, conjugation: "れる" },
] as const

const そうだ_dispatch = [
    { next: KatsuyouConstants.です_SHORT_TOKEN, weight: 1, modern: true, conjugation: "そう" },
    { next: KatsuyouConstants.END_TOKEN, weight: 1, modern: true, conjugation: "そうだ" },
]

const いる_dispatch = [
    { next: KatsuyouConstants.ます_TOKEN, weight: 2, modern: true, conjugation: "い" },
    { next: KatsuyouConstants.ない_TOKEN, weight: 1, modern: true, conjugation: "い" },
    { next: KatsuyouConstants.た_TOKEN, weight: 1, modern: true, conjugation: "い" },
    { next: KatsuyouConstants.ば_TOKEN, weight: 1, modern: true, conjugation: "いれ" },
    { next: KatsuyouConstants.END_TOKEN, weight: 2, modern: true, conjugation: "いる" },
]

for (const d of せる_dispatch) {
    KatsuyouConstants.せる_TOKEN.addDispatch(d.next, d.weight, d.modern, d.conjugation)
    if (Array.isArray(d.conjugation)) {
        const c = d.conjugation.map(e => `さ${e}`)
        KatsuyouConstants.させる_TOKEN.addDispatch(d.next, d.weight, d.modern, c)
    } else {
        KatsuyouConstants.させる_TOKEN.addDispatch(d.next, d.weight, d.modern, `さ${d.conjugation}`)
    }
}

for (const d of れる_dispatch) {
    KatsuyouConstants.れる_TOKEN.addDispatch(d.next, d.weight, d.modern, d.conjugation)
    if (Array.isArray(d.conjugation)) {
        const c = d.conjugation.map(e => `ら${e}`)
        KatsuyouConstants.させる_TOKEN.addDispatch(d.next, d.weight, d.modern, c)
    } else {
        KatsuyouConstants.させる_TOKEN.addDispatch(d.next, d.weight, d.modern, `ら${d.conjugation}`)
    }
}

for (const d of そうだ_dispatch) {
    KatsuyouConstants.そうだ様態_TOKEN.addDispatch(d.next, d.weight, d.modern, d.conjugation)
    KatsuyouConstants.そうだ伝聞_TOKEN.addDispatch(d.next, d.weight, d.modern, d.conjugation)
}

for (const d of いる_dispatch) {
    KatsuyouConstants.ている濁音_TOKEN.addDispatch(d.next, d.weight, d.modern, `で${d.conjugation}`)
    KatsuyouConstants.ている_TOKEN.addDispatch(d.next, d.weight, d.modern, `て${d.conjugation}`)
}

KatsuyouConstants.たい_TOKEN
    .addDispatch(KatsuyouConstants.た_TOKEN, 1, true, "たかっ")
    .addDispatch(KatsuyouConstants.です_TOKEN, 2, true, "たい")
    .addDispatch(KatsuyouConstants.END_TOKEN, 1, true, "たい")

KatsuyouConstants.たがる_TOKEN
    .addDispatch(KatsuyouConstants.ている_TOKEN, 1, true, "たがっ")
    .addDispatch(KatsuyouConstants.ない_TOKEN, 1, true, "たがら")
    .addDispatch(KatsuyouConstants.ます_SHORT_TOKEN, 1, true, "たがり")
    .addDispatch(KatsuyouConstants.END_TOKEN, 2, true, "たがる")

KatsuyouConstants.ない_TOKEN
    .addDispatch(KatsuyouConstants.う_TOKEN, 1, false, "なろ")
    .addDispatch(KatsuyouConstants.そうだ様態_TOKEN, 1, true, "なさ")
    .addDispatch(KatsuyouConstants.そうだ伝聞_TOKEN, 1, true, "ない")
    .addDispatch(KatsuyouConstants.ようだ_TOKEN, 1, true, "ない")
    .addDispatch(KatsuyouConstants.らしい_TOKEN, 1, true, "ない")
    .addDispatch(KatsuyouConstants.です_TOKEN, 2, true, "ない")
    .addDispatch(KatsuyouConstants.ば_TOKEN, 1, true, "なけれ")
    .addDispatch(KatsuyouConstants.END_TOKEN, 2, true, "ない")

KatsuyouConstants.ない_SHORT_TOKEN
    .addDispatch(KatsuyouConstants.です_TOKEN, 2, true, "ない")
    .addDispatch(KatsuyouConstants.ば_TOKEN, 1, true, "なけれ")
    .addDispatch(KatsuyouConstants.END_TOKEN, 2, true, "ない")

KatsuyouConstants.た_TOKEN
    .addDispatch(KatsuyouConstants.ら_TOKEN, 1, true, "た")
    .addDispatch(KatsuyouConstants.END_TOKEN, 2, true, "た")

KatsuyouConstants.た濁音_TOKEN
    .addDispatch(KatsuyouConstants.ら_TOKEN, 1, true, "だ")
    .addDispatch(KatsuyouConstants.END_TOKEN, 2, true, "だ")

KatsuyouConstants.ようだ_TOKEN
    .addDispatch(KatsuyouConstants.です_SHORT_TOKEN, 2, true, "よう")
    .addDispatch(KatsuyouConstants.た_TOKEN, 1, true, "ようだっ")
    .addDispatch(KatsuyouConstants.ら_TOKEN, 1, true, "ような")
    .addDispatch(KatsuyouConstants.END_TOKEN, 2, true, "ようだ")

KatsuyouConstants.らしい_TOKEN
    .addDispatch(KatsuyouConstants.です_SHORT_TOKEN, 1, true, "らしい")
    .addDispatch(KatsuyouConstants.END_TOKEN, 1, true, "らしい")

KatsuyouConstants.ます_TOKEN
    .addDispatch(KatsuyouConstants.ん_TOKEN, 2, true, "ませ")
    .addDispatch(KatsuyouConstants.う_TOKEN, 2, true, "ましょ")
    .addDispatch(KatsuyouConstants.た_TOKEN, 2, true, "まし")
    .addDispatch(KatsuyouConstants.命令_TOKEN, 1, true, "ませ")
    .addDispatch(KatsuyouConstants.END_TOKEN, 2, true, "ます")

KatsuyouConstants.だ_TOKEN
    .addDispatch(KatsuyouConstants.う_TOKEN, 1, true, "だろ")
    .addDispatch(KatsuyouConstants.た_TOKEN, 1, true, "だっ")
    .addDispatch(KatsuyouConstants.ら_TOKEN, 1, true, "な")
    .addDispatch(KatsuyouConstants.ない_SHORT_TOKEN, 1, true, ["では", "じゃ"])
    .addDispatch(KatsuyouConstants.END_TOKEN, 1, true, "だ")

KatsuyouConstants.です_TOKEN
    .addDispatch(KatsuyouConstants.う_TOKEN, 1, true, "でしょ")
    .addDispatch(KatsuyouConstants.た_SHORT_TOKEN, 1, true, "でし")
    .addDispatch(KatsuyouConstants.END_TOKEN, 1, true, "です")

KatsuyouConstants.べき_TOKEN
    .addDispatch(KatsuyouConstants.だ_TOKEN, 1, true, "べき")
    .addDispatch(KatsuyouConstants.です_TOKEN, 1, true, "べき")
    .addDispatch(KatsuyouConstants.END_TOKEN, 1, true, "べき")

KatsuyouConstants.ある_TOKEN
    .addDispatch(KatsuyouConstants.ない_TOKEN, 1, true, "")
    .addDispatch(KatsuyouConstants.た_TOKEN, 1, true, "あっ")
    .addDispatch(KatsuyouConstants.ば_TOKEN, 1, true, "あれ")
    .addDispatch(KatsuyouConstants.ます_TOKEN, 1, true, "あり")
    .addDispatch(KatsuyouConstants.べき_TOKEN, 1, true, "ある")

KatsuyouConstants.する_TOKEN
    .addDispatch(KatsuyouConstants.させる_TOKEN, 1, true, "")
    .addDispatch(KatsuyouConstants.られる_TOKEN, 1, true, "")
    .addDispatch(KatsuyouConstants.ない_TOKEN, 1, true, "し")
    .addDispatch(KatsuyouConstants.よう_TOKEN, 1, true, "し")
    .addDispatch(KatsuyouConstants.たい_TOKEN, 1, true, "し")
    .addDispatch(KatsuyouConstants.たがる_TOKEN, 1, true, "し")
    .addDispatch(KatsuyouConstants.た_TOKEN, 1, true, "し")
    .addDispatch(KatsuyouConstants.ている_TOKEN, 1, true, "し")
    .addDispatch(KatsuyouConstants.ます_TOKEN, 1, true, "し")
    .addDispatch(KatsuyouConstants.そうだ様態_TOKEN, 1, true, "し")
    .addDispatch(KatsuyouConstants.まい_TOKEN, 1, true, "する")
    .addDispatch(KatsuyouConstants.そうだ伝聞_TOKEN, 1, true, "する")
    .addDispatch(KatsuyouConstants.ようだ_TOKEN, 1, true, "する")
    .addDispatch(KatsuyouConstants.らしい_TOKEN, 1, true, "する")
    .addDispatch(KatsuyouConstants.ば_TOKEN, 1, true, "すれ")
    .addDispatch(KatsuyouConstants.命令_TOKEN, 1, true, ["しろ", "せよ"])

KatsuyouConfig.allowedTokens = [
    KatsuyouConstants.END_TOKEN,
    KatsuyouConstants.せる_TOKEN,
    KatsuyouConstants.させる_TOKEN,
    KatsuyouConstants.れる_TOKEN,
    KatsuyouConstants.られる_TOKEN,
    KatsuyouConstants.たい_TOKEN,
    KatsuyouConstants.たがる_TOKEN,
    KatsuyouConstants.ない_TOKEN,
    KatsuyouConstants.ない_SHORT_TOKEN,
    KatsuyouConstants.う_TOKEN,
    KatsuyouConstants.よう_TOKEN,
    KatsuyouConstants.まい_TOKEN,
    KatsuyouConstants.た_TOKEN,
    KatsuyouConstants.そうだ様態_TOKEN,
    KatsuyouConstants.そうだ伝聞_TOKEN,
    KatsuyouConstants.ようだ_TOKEN,
    KatsuyouConstants.らしい_TOKEN,
    KatsuyouConstants.ます_TOKEN,
    KatsuyouConstants.だ_TOKEN,
    KatsuyouConstants.です_TOKEN,
    KatsuyouConstants.です_SHORT_TOKEN,
    KatsuyouConstants.ている_TOKEN,
    KatsuyouConstants.た濁音_TOKEN,
    KatsuyouConstants.ている濁音_TOKEN,
    KatsuyouConstants.ば_TOKEN,
    KatsuyouConstants.ん_TOKEN,
    KatsuyouConstants.命令_TOKEN,
    KatsuyouConstants.ら_TOKEN,
    KatsuyouConstants.べき_TOKEN
]