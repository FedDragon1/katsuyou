// noinspection NonAsciiCharacters,JSNonASCIINames

import { kanaToGrade, voiceChange, voiceChangeToDakuon } from "@/lib/kana";

export class KatsuyouConstants {
    static END_TOKEN: KatsuyouToken
    static NOUN_TOKEN: KatsuyouToken
    // 現代助動詞 / 助詞
    static せる_TOKEN: KatsuyouAuxiliary
    static させる_TOKEN: KatsuyouAuxiliary
    static れる_TOKEN: KatsuyouAuxiliary
    static られる_TOKEN: KatsuyouAuxiliary
    static せられる_TOKEN: KatsuyouAuxiliary
    static たい_TOKEN: KatsuyouAuxiliary
    static たがる_TOKEN: KatsuyouAuxiliary
    static がる_TOKEN: KatsuyouAuxiliary
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
    static て_TOKEN: KatsuyouAuxiliary
    static ている_TOKEN: KatsuyouAuxiliary
    static ておく_TOKEN: KatsuyouAuxiliary
    static てしまう_TOKEN: KatsuyouAuxiliary
    static ば_TOKEN: KatsuyouAuxiliary
    static ん_TOKEN: KatsuyouAuxiliary
    static 命令_TOKEN: KatsuyouAuxiliary
    static ら_TOKEN: KatsuyouAuxiliary
    static べき_TOKEN: KatsuyouAuxiliary
    // 特殊な動詞
    static ある_TOKEN: FreeStandingToken
    static する_TOKEN: KatsuyouAuxiliary
    // 古文
    static る_TOKEN: KatsuyouAuxiliary
    static らる_TOKEN: KatsuyouAuxiliary
    static す_TOKEN: KatsuyouAuxiliary
    static さす_TOKEN: KatsuyouAuxiliary
    static しむ_TOKEN: KatsuyouAuxiliary
    static き_TOKEN: KatsuyouAuxiliary
    static けり_TOKEN: KatsuyouAuxiliary
    static ず_TOKEN: KatsuyouAuxiliary
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
    kanji: boolean
    ruby: Record<number, string>

    constructor(options: string[] | string, ruby: Record<number, string>, kanji: boolean) {
        if (!Array.isArray(options)) {
            options = [options]
        }
        this.options = options;
        this.ruby = ruby;
        this.kanji = kanji
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
        return new KatsuyouResult(newOptions, this.ruby, this.kanji)
    }
}

class KatsuyouToken {
    readonly baseForm: string;
    readonly display: string
    readonly modern: boolean;
    readonly classic: boolean;
    dispatchables: KatsuyouDispatchInfo[]

    constructor(baseForm: string, display: string, modern: boolean, classic: boolean, dispatchables?: KatsuyouDispatchInfo[]) {
        this.baseForm = baseForm;
        this.display = display;
        this.modern = modern;
        this.classic = classic
        this.dispatchables = dispatchables ?? [];
    }

    addDispatch(next: KatsuyouToken, weight: number, modern: boolean, conjugation: string | readonly string[]) {
        this.dispatchables.push(
            new KatsuyouDispatchInfo(this, next, weight, modern, conjugation)
        )
        return this
    }

    dispatch(showModern: boolean, showClassic: boolean, allowedTokens: KatsuyouToken[]): KatsuyouDispatchInfo | undefined {
        const candidates = this.dispatchables.filter(
            (candidate) =>
                ((showModern && showClassic) || candidate.modern === showModern)
                && allowedTokens.includes(candidate.to)
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

/**
 * 実は助動詞と助詞、二つもあり
 */
class KatsuyouAuxiliary extends KatsuyouToken {
    conjugate(prev: KatsuyouResult, lookAhead: KatsuyouDispatchInfo | KatsuyouEndToken): KatsuyouResult {
        const res = (lookAhead instanceof KatsuyouEndToken) ? this.baseForm : lookAhead.conjugation
        return prev.merge(res)
    }
}

class KatsuyouEndToken extends KatsuyouAuxiliary {
    constructor() {
        super("", "", true, true);
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

/**
 * 実は用言だけです
 */
class FreeStandingToken extends KatsuyouToken {
    readonly ruby: Record<number, string>

    constructor(baseForm: string, display: string, modern: boolean, classic: boolean, ruby: Record<number, string>, dispatcher?: KatsuyouDispatchInfo[]) {
        super(baseForm, display, modern, classic, dispatcher);
        this.ruby = ruby;
    }

    conjugate(lookAhead: KatsuyouDispatchInfo): KatsuyouResult {
        return new KatsuyouResult(lookAhead.conjugation as string | string[], this.ruby, this.display === this.baseForm)
    }
}

class PentagradeToken extends FreeStandingToken {
    /**
     * Pentagrade Conjugation logic. 行く belongs in this category,
     * with the parameter iku marked true for specialization.
     *
     * @param baseForm
     * @param display
     * @param ruby
     * @param iku
     */
    constructor(baseForm: string, display: string, ruby: Record<number, string>, iku: boolean = false) {
        super(baseForm, display, true, false, ruby);

        const stem = baseForm.slice(0, baseForm.length - 1),
            lastKana = baseForm[baseForm.length - 1] as Hiragana,
            aGrade = `${stem}${kanaToGrade(lastKana, "a", true)}`,
            iGrade = `${stem}${kanaToGrade(lastKana, "i")}`,
            eGrade = `${stem}${kanaToGrade(lastKana, "e")}`,
            oGrade = `${stem}${kanaToGrade(lastKana, "o")}`

        const soundChangeTo = iku ? "っ" : voiceChange(lastKana)
        const soundChanged = `${stem}${soundChangeTo}`
        const [dispatchTe, dispatchTo, dispatchCha, dispatchTa] = voiceChangeToDakuon(lastKana)
            ? ["で", "ど", "じゃ", "だ"] : ["て", "と", "ちゃ", "た"]

        this.addDispatch(KatsuyouConstants.せる_TOKEN, 1, true, aGrade)
            .addDispatch(KatsuyouConstants.れる_TOKEN, 1, true, aGrade)
            // .addDispatch(KatsuyouConstants.せられる_TOKEN, 1, true, [`${aGrade}せら`, `${aGrade}さ`])
            .addDispatch(KatsuyouConstants.ない_TOKEN, 2, true, aGrade)
            .addDispatch(KatsuyouConstants.う_TOKEN, 2, true, oGrade)
            .addDispatch(KatsuyouConstants.たい_TOKEN, 1, true, iGrade)
            .addDispatch(KatsuyouConstants.たがる_TOKEN, 1, true, iGrade)
            .addDispatch(KatsuyouConstants.ます_TOKEN, 2, true, iGrade)
            .addDispatch(KatsuyouConstants.そうだ様態_TOKEN, 1, true, iGrade)
            .addDispatch(KatsuyouConstants.た_TOKEN, 2, true, `${soundChanged}${dispatchTa}`)
            .addDispatch(KatsuyouConstants.て_TOKEN, 1, true, `${soundChanged}${dispatchTe}`)
            .addDispatch(KatsuyouConstants.ている_TOKEN, 1, true, `${soundChanged}${dispatchTe}`)
            .addDispatch(KatsuyouConstants.ておく_TOKEN, 1, true, [`${soundChanged}${dispatchTe}お`, `${soundChanged}${dispatchTo}`])
            .addDispatch(KatsuyouConstants.てしまう_TOKEN, 1, true, [`${soundChanged}${dispatchTe}しま`, `${soundChanged}${dispatchCha}`])
            .addDispatch(KatsuyouConstants.まい_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.そうだ伝聞_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.ようだ_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.らしい_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.べき_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.ば_TOKEN, 1, true, `${eGrade}ば`)
            .addDispatch(KatsuyouConstants.命令_TOKEN, 2, true, eGrade)
            .addDispatch(KatsuyouConstants.NOUN_TOKEN, 1, true, baseForm)
    }
}

class MonogradeToken extends FreeStandingToken {
    /**
     * Monograde verb logic
     *
     * @param baseForm
     * @param display
     * @param modern
     * @param classic
     * @param ruby
     */
    constructor(baseForm: string, display: string, modern: boolean, classic: boolean, ruby: Record<number, string>) {
        super(baseForm, display, modern, classic, ruby);

        const stem = baseForm.slice(0, baseForm.length - 1)

        this.addDispatch(KatsuyouConstants.させる_TOKEN, 1, true, stem)
            .addDispatch(KatsuyouConstants.られる_TOKEN, 1, true, stem)
            .addDispatch(KatsuyouConstants.ない_TOKEN, 1, true, stem)
            .addDispatch(KatsuyouConstants.たい_TOKEN, 1, true, stem)
            .addDispatch(KatsuyouConstants.たがる_TOKEN, 1, true, stem)
            .addDispatch(KatsuyouConstants.よう_TOKEN, 2, true, stem)
            .addDispatch(KatsuyouConstants.た_TOKEN, 2, true, `${stem}た`)
            .addDispatch(KatsuyouConstants.ます_TOKEN, 2, true, stem)
            .addDispatch(KatsuyouConstants.そうだ様態_TOKEN, 1, true, stem)
            .addDispatch(KatsuyouConstants.て_TOKEN, 1, true, `${stem}て`)
            .addDispatch(KatsuyouConstants.ている_TOKEN, 1, true, `${stem}て`)
            .addDispatch(KatsuyouConstants.ておく_TOKEN, 1, true, [`${stem}てお`, `${stem}と`])
            .addDispatch(KatsuyouConstants.てしまう_TOKEN, 1, true, [`${stem}てしま`, `${stem}ちゃ`])
            .addDispatch(KatsuyouConstants.まい_TOKEN, 1, true, stem)
            .addDispatch(KatsuyouConstants.そうだ伝聞_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.ようだ_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.らしい_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.べき_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.ば_TOKEN, 2, true, `${stem}れば`)
            .addDispatch(KatsuyouConstants.命令_TOKEN, 2, true, [`${stem}ろ`, `${stem}よ`])
            .addDispatch(KatsuyouConstants.NOUN_TOKEN, 1, true, baseForm)
            // 古文
            .addDispatch(KatsuyouConstants.ず_TOKEN, 1, false, stem)
            .addDispatch(KatsuyouConstants.らる_TOKEN, 1, false, stem)
            .addDispatch(KatsuyouConstants.さす_TOKEN, 1, false, stem)
            .addDispatch(KatsuyouConstants.しむ_TOKEN, 1, false, stem)
            .addDispatch(KatsuyouConstants.けり_TOKEN, 1, false, stem)
            .addDispatch(KatsuyouConstants.ば_TOKEN, 1, false, `${stem}れば`)
            .addDispatch(KatsuyouConstants.NOUN_TOKEN, 1, false, baseForm)
            .addDispatch(KatsuyouConstants.命令_TOKEN, 1, false, `${stem}よ`)
    }
}

class HonorificToken extends FreeStandingToken {
    constructor(baseForm: string, display: string, ruby: Record<number, string>) {
        super(baseForm, display, true, false, ruby);

        const stem = baseForm.slice(0, baseForm.length - 1)

        this.addDispatch(KatsuyouConstants.ない_TOKEN, 1, true, `${stem}ら`)
            .addDispatch(KatsuyouConstants.ます_TOKEN, 1, true, `${stem}い`)
            .addDispatch(KatsuyouConstants.NOUN_TOKEN, 1, true, baseForm)

        if (this.baseForm !== "御座る" && this.baseForm !== "戴く") {
            this.addDispatch(KatsuyouConstants.命令_TOKEN, 1, true, `${stem}い`)
        }
    }
}

class KagyouToken extends FreeStandingToken {

    constructor(baseForm: string, display: string, modern: boolean, ruby: Record<number, string>) {
        super(baseForm, display, modern, !modern, ruby);

        if (modern) {
            this.addDispatch(KatsuyouConstants.させる_TOKEN, 1, true, "こ")
                .addDispatch(KatsuyouConstants.られる_TOKEN, 1, true, "こ")
                .addDispatch(KatsuyouConstants.ない_TOKEN, 1, true, "こ")
                .addDispatch(KatsuyouConstants.よう_TOKEN, 1, true, "こ")
                .addDispatch(KatsuyouConstants.たい_TOKEN, 1, true, "き")
                .addDispatch(KatsuyouConstants.たがる_TOKEN, 1, true, "き")
                .addDispatch(KatsuyouConstants.た_TOKEN, 1, true, "きた")
                .addDispatch(KatsuyouConstants.て_TOKEN, 1, true, "きて")
                .addDispatch(KatsuyouConstants.ている_TOKEN, 1, true, "きて")
                .addDispatch(KatsuyouConstants.ておく_TOKEN, 1, true, ["きてお", "きと"])
                .addDispatch(KatsuyouConstants.てしまう_TOKEN, 1, true, ["きてしま", "きちゃ"])
                .addDispatch(KatsuyouConstants.そうだ様態_TOKEN, 1, true, "き")
                .addDispatch(KatsuyouConstants.ます_TOKEN, 1, true, "き")
                .addDispatch(KatsuyouConstants.まい_TOKEN, 1, true, "くる")
                .addDispatch(KatsuyouConstants.そうだ伝聞_TOKEN, 1, true, "くる")
                .addDispatch(KatsuyouConstants.ようだ_TOKEN, 1, true, "くる")
                .addDispatch(KatsuyouConstants.らしい_TOKEN, 1, true, "くる")
                .addDispatch(KatsuyouConstants.べき_TOKEN, 1, true, "くる")
                .addDispatch(KatsuyouConstants.ば_TOKEN, 1, true, "くれば")
                .addDispatch(KatsuyouConstants.命令_TOKEN, 1, true, "こい")
                .addDispatch(KatsuyouConstants.NOUN_TOKEN, 1, true, "くる")
        } else {
            this.addDispatch(KatsuyouConstants.ず_TOKEN, 1, false, "こ")
                .addDispatch(KatsuyouConstants.けり_TOKEN, 1, false, "き")
                .addDispatch(KatsuyouConstants.ば_TOKEN, 1, false, "くれば")
                .addDispatch(KatsuyouConstants.NOUN_TOKEN, 1, false, "くる")
                .addDispatch(KatsuyouConstants.命令_TOKEN, 1, false, "こよ")
        }

    }

    conjugate(lookAhead: KatsuyouDispatchInfo): KatsuyouResult {
        const katsuyouResultHiragana = super.conjugate(lookAhead);
        const hiragana = katsuyouResultHiragana.options[0]
        const ruby = { 0: hiragana[0] === "来" ? "く" : hiragana[0] }
        const updated = katsuyouResultHiragana.options.map((o) => `来${o.slice(1)}`)
        return new KatsuyouResult(updated, ruby, true)
    }
}

class SagyouToken extends FreeStandingToken {

    constructor(baseForm: string, display: string, modern: boolean, ruby: Record<number, string>) {
        super(baseForm, display, modern, !modern, ruby);

        if (modern) {
            this.addDispatch(KatsuyouConstants.させる_TOKEN, 1, true, "")
                .addDispatch(KatsuyouConstants.られる_TOKEN, 1, true, "")
                .addDispatch(KatsuyouConstants.ない_TOKEN, 1, true, "し")
                .addDispatch(KatsuyouConstants.よう_TOKEN, 1, true, "し")
                .addDispatch(KatsuyouConstants.たい_TOKEN, 1, true, "し")
                .addDispatch(KatsuyouConstants.たがる_TOKEN, 1, true, "し")
                .addDispatch(KatsuyouConstants.た_TOKEN, 1, true, "した")
                .addDispatch(KatsuyouConstants.て_TOKEN, 1, true, "して")
                .addDispatch(KatsuyouConstants.ている_TOKEN, 1, true, "して")
                .addDispatch(KatsuyouConstants.ておく_TOKEN, 1, true, ["してお", "しと"])
                .addDispatch(KatsuyouConstants.てしまう_TOKEN, 1, true, ["してしま", "しちゃ"])
                .addDispatch(KatsuyouConstants.ます_TOKEN, 1, true, "し")
                .addDispatch(KatsuyouConstants.そうだ様態_TOKEN, 1, true, "し")
                .addDispatch(KatsuyouConstants.まい_TOKEN, 1, true, "する")
                .addDispatch(KatsuyouConstants.そうだ伝聞_TOKEN, 1, true, "する")
                .addDispatch(KatsuyouConstants.ようだ_TOKEN, 1, true, "する")
                .addDispatch(KatsuyouConstants.らしい_TOKEN, 1, true, "する")
                .addDispatch(KatsuyouConstants.ば_TOKEN, 1, true, "すれば")
                .addDispatch(KatsuyouConstants.命令_TOKEN, 1, true, ["しろ", "せよ"])
        } else {
            const stem = baseForm.slice(0, -1),
                mizen = `${stem}せ`,
                renyou = `${stem}し`,
                rentai = `${stem}する`,
                izen = `${stem}すれ`,
                meirei = `${stem}せよ`
            this.addDispatch(KatsuyouConstants.ず_TOKEN, 1, false, mizen)
                .addDispatch(KatsuyouConstants.らる_TOKEN, 1, false, mizen)
                .addDispatch(KatsuyouConstants.さす_TOKEN, 1, false, mizen)
                .addDispatch(KatsuyouConstants.しむ_TOKEN, 1, false, mizen)
                // .addDispatch(KatsuyouConstants.き_TOKEN)
                .addDispatch(KatsuyouConstants.けり_TOKEN, 1, false, renyou)
                .addDispatch(KatsuyouConstants.ば_TOKEN, 1, false, `${izen}ば`)
                .addDispatch(KatsuyouConstants.NOUN_TOKEN, 1, false, rentai)
                .addDispatch(KatsuyouConstants.命令_TOKEN, 1, false, meirei)
        }
    }
}

class IToken extends FreeStandingToken {
    constructor(baseForm: string, display: string, ruby: Record<number, string>, dispatcher?: KatsuyouDispatchInfo[]) {
        super(baseForm, display, true, false, ruby, dispatcher);

        const stem = baseForm.slice(0, baseForm.length - 1)

        this.addDispatch(KatsuyouConstants.ない_TOKEN, 2, true, `${stem}く`)
            .addDispatch(KatsuyouConstants.て_TOKEN, 2, true, `${stem}くて`)
            .addDispatch(KatsuyouConstants.う_TOKEN, 1, true, `${stem}かろ`)
            .addDispatch(KatsuyouConstants.ば_TOKEN, 2, true, `${stem}ければ`)
            .addDispatch(KatsuyouConstants.だ_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.です_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.がる_TOKEN, 1, true, stem)
            .addDispatch(KatsuyouConstants.た_TOKEN, 2, true, `${stem}かった`)
            .addDispatch(KatsuyouConstants.そうだ様態_TOKEN, 1, true, baseForm === "良い" ? "よさ" : stem)
            .addDispatch(KatsuyouConstants.そうだ伝聞_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.NOUN_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.する_TOKEN, 1, true, `${stem}く`)
    }
}

class NaToken extends FreeStandingToken {
    constructor(baseForm: string, display: string, ruby: Record<number, string>, dispatcher?: KatsuyouDispatchInfo[]) {
        super(baseForm, display, true, false, ruby, dispatcher);

        this.addDispatch(KatsuyouConstants.ない_TOKEN, 2, true, [`${baseForm}では`, `${baseForm}じゃ`])
            .addDispatch(KatsuyouConstants.て_TOKEN, 2, true, `${baseForm}で`)
            .addDispatch(KatsuyouConstants.う_TOKEN, 1, true, `${baseForm}だろ`)
            .addDispatch(KatsuyouConstants.ば_TOKEN, 2, true, `${baseForm}ならば`)
            .addDispatch(KatsuyouConstants.だ_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.です_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.た_TOKEN, 2, true, `${baseForm}だった`)
            .addDispatch(KatsuyouConstants.そうだ様態_TOKEN, 1, true, baseForm)
            .addDispatch(KatsuyouConstants.そうだ伝聞_TOKEN, 1, true, `${baseForm}だ`)
            .addDispatch(KatsuyouConstants.NOUN_TOKEN, 1, true, `${baseForm}な`)
            .addDispatch(KatsuyouConstants.する_TOKEN, 1, true, `${baseForm}に`)
    }
}

// 古文の動詞の種類

class QuadrigradeToken extends FreeStandingToken {

    constructor(baseForm: string, display: string, ruby: Record<number, string>) {
        super(baseForm, display, false, true, ruby);

        const stem = baseForm.slice(0, -1),
            lastKana = baseForm[baseForm.length - 1] as Hiragana,
            aGrade = `${stem}${kanaToGrade(lastKana, "a")}`,
            iGrade = `${stem}${kanaToGrade(lastKana, "i")}`,
            eGrade = `${stem}${kanaToGrade(lastKana, "e")}`

        this.addDispatch(KatsuyouConstants.ず_TOKEN, 1, false, aGrade)
            .addDispatch(KatsuyouConstants.る_TOKEN, 1, false, aGrade)
            .addDispatch(KatsuyouConstants.す_TOKEN, 1, false, aGrade)
            .addDispatch(KatsuyouConstants.しむ_TOKEN, 1, false, aGrade)
            .addDispatch(KatsuyouConstants.き_TOKEN, 1, false, iGrade)
            .addDispatch(KatsuyouConstants.けり_TOKEN, 1, false, iGrade)
            .addDispatch(KatsuyouConstants.NOUN_TOKEN, 1, false, baseForm)
            .addDispatch(KatsuyouConstants.命令_TOKEN, 1, false, eGrade)
    }
}

class BigradeToken extends FreeStandingToken {
    readonly grade: Grade;
    readonly singleKanji: boolean;

    constructor(baseForm: string, display: string, grade: Grade, wagyou: boolean, ruby: Record<number, string>) {
        super(baseForm, display, false, true, ruby);

        this.grade = grade
        this.singleKanji = baseForm.length === 1

        console.log(wagyou, baseForm)

        const stem = baseForm.slice(0, -1),
            lastKana = (this.singleKanji ? ruby[0] : baseForm[baseForm.length - 1]) as Hiragana,
            changed = `${stem}${kanaToGrade(lastKana, grade, wagyou)}`,
            base = this.singleKanji ? lastKana : baseForm

        this.addDispatch(KatsuyouConstants.ず_TOKEN, 1, false, changed)
            .addDispatch(KatsuyouConstants.らる_TOKEN, 1, false, changed)
            .addDispatch(KatsuyouConstants.さす_TOKEN, 1, false, changed)
            .addDispatch(KatsuyouConstants.しむ_TOKEN, 1, false, changed)
            .addDispatch(KatsuyouConstants.き_TOKEN, 1, false, changed)
            .addDispatch(KatsuyouConstants.けり_TOKEN, 1, false, changed)
            .addDispatch(KatsuyouConstants.ば_TOKEN, 1, false, `${base}れば`)
            .addDispatch(KatsuyouConstants.NOUN_TOKEN, 1, false, `${base}る`)
            .addDispatch(KatsuyouConstants.命令_TOKEN, 1, false, `${changed}よ`)
    }

    conjugate(lookAhead: KatsuyouDispatchInfo): KatsuyouResult {
        const katsuyouResultHiragana = super.conjugate(lookAhead);

        if (this.baseForm.length !== 1) {
            return katsuyouResultHiragana
        }

        const res = katsuyouResultHiragana.options[0]
        if (res === this.baseForm) {
            return katsuyouResultHiragana
        }
        const ruby = { 0: res[0] }
        const updated = katsuyouResultHiragana.options.map((o) => `${this.baseForm}${o.slice(1)}`)
        return new KatsuyouResult(updated, ruby, this.display === this.baseForm)
    }
}

class NagyouToken extends FreeStandingToken {

    constructor(baseForm: string, display: string, ruby: Record<number, string>) {
        super(baseForm, display, false, true, ruby);

        const stem = baseForm.slice(0, -1),
            mizen = `${stem}な`,
            renyou = `${stem}に`,
            rentai = `${baseForm}る`,
            izen = `${baseForm}れ`,
            meirei = `${stem}ね`

        this.addDispatch(KatsuyouConstants.ず_TOKEN, 1, false, mizen)
            .addDispatch(KatsuyouConstants.る_TOKEN, 1, false, mizen)
            .addDispatch(KatsuyouConstants.す_TOKEN, 1, false, mizen)
            .addDispatch(KatsuyouConstants.しむ_TOKEN, 1, false, mizen)
            .addDispatch(KatsuyouConstants.き_TOKEN, 1, false, renyou)
            .addDispatch(KatsuyouConstants.けり_TOKEN, 1, false, renyou)
            .addDispatch(KatsuyouConstants.ば_TOKEN, 1, false, `${izen}ば`)
            .addDispatch(KatsuyouConstants.NOUN_TOKEN, 1, false, rentai)
            .addDispatch(KatsuyouConstants.命令_TOKEN, 1, false, meirei)
    }
}

class RagyouToken extends FreeStandingToken {

    constructor(baseForm: string, display: string, ruby: Record<number, string>) {
        super(baseForm, display, false, true, ruby);

        const stem = baseForm.slice(0, -1),
            mizen = `${stem}ら`,
            reitai = `${stem}る`,
            izen = `${stem}れ`,
            meirei = `${stem}れ`

        this.addDispatch(KatsuyouConstants.ず_TOKEN, 1, false, mizen)
            .addDispatch(KatsuyouConstants.る_TOKEN, 1, false, mizen)
            .addDispatch(KatsuyouConstants.す_TOKEN, 1, false, mizen)
            .addDispatch(KatsuyouConstants.しむ_TOKEN, 1, false, mizen)
            .addDispatch(KatsuyouConstants.き_TOKEN, 1, false, baseForm)
            .addDispatch(KatsuyouConstants.けり_TOKEN, 1, false, baseForm)
            .addDispatch(KatsuyouConstants.ば_TOKEN, 1, false, `${izen}ば`)
            .addDispatch(KatsuyouConstants.NOUN_TOKEN, 1, false, reitai)
            .addDispatch(KatsuyouConstants.命令_TOKEN, 1, false, meirei)
    }
}

// TODO: https://www.try-it.jp/chapters-14468/lessons-14592/

class KuToken extends FreeStandingToken {
    constructor(baseForm: string, display: string, ruby: Record<number, string>, dispatcher?: KatsuyouDispatchInfo[]) {
        super(baseForm, display, false, true, ruby, dispatcher);
    }
}

class ShikuToken extends FreeStandingToken {
    constructor(baseForm: string, display: string, ruby: Record<number, string>, dispatcher?: KatsuyouDispatchInfo[]) {
        super(baseForm, display, false, true, ruby, dispatcher);
    }
}

class NariToken extends FreeStandingToken {
    constructor(baseForm: string, display: string, ruby: Record<number, string>, dispatcher?: KatsuyouDispatchInfo[]) {
        super(baseForm, display, false, true, ruby, dispatcher);
    }
}

class TariToken extends FreeStandingToken {
    constructor(baseForm: string, display: string, ruby: Record<number, string>, dispatcher?: KatsuyouDispatchInfo[]) {
        super(baseForm, display, false, true, ruby, dispatcher);
    }
}

// ALGO

export class Katsuyou {
    sequence: KatsuyouDispatchInfo[]
    initialToken: FreeStandingToken | null
    solution: KatsuyouResult | null
    showModern: boolean;
    showClassic: boolean;
    maxLength: number
    allowedTokens: KatsuyouToken[] = [];

    constructor(showModern?: boolean, showClassic?: boolean, maxLength?: number) {
        this.sequence = []
        this.initialToken = null
        this.solution = null
        this.showModern = showModern ?? true
        this.showClassic = showClassic ?? false
        this.allowedTokens = [
            KatsuyouConstants.END_TOKEN,
            KatsuyouConstants.NOUN_TOKEN,
            KatsuyouConstants.せる_TOKEN,
            KatsuyouConstants.させる_TOKEN,
            KatsuyouConstants.れる_TOKEN,
            KatsuyouConstants.られる_TOKEN,
            KatsuyouConstants.せられる_TOKEN,
            KatsuyouConstants.たい_TOKEN,
            KatsuyouConstants.たがる_TOKEN,
            KatsuyouConstants.ない_TOKEN,
            KatsuyouConstants.ない_SHORT_TOKEN,
            KatsuyouConstants.う_TOKEN,
            KatsuyouConstants.よう_TOKEN,
            KatsuyouConstants.まい_TOKEN,
            KatsuyouConstants.た_TOKEN,
            KatsuyouConstants.た_SHORT_TOKEN,
            KatsuyouConstants.そうだ様態_TOKEN,
            KatsuyouConstants.そうだ伝聞_TOKEN,
            KatsuyouConstants.ようだ_TOKEN,
            KatsuyouConstants.らしい_TOKEN,
            KatsuyouConstants.ます_TOKEN,
            KatsuyouConstants.ます_SHORT_TOKEN,
            KatsuyouConstants.だ_TOKEN,
            KatsuyouConstants.です_TOKEN,
            KatsuyouConstants.です_SHORT_TOKEN,
            KatsuyouConstants.て_TOKEN,
            KatsuyouConstants.ている_TOKEN,
            KatsuyouConstants.ておく_TOKEN,
            KatsuyouConstants.てしまう_TOKEN,
            KatsuyouConstants.ば_TOKEN,
            KatsuyouConstants.ん_TOKEN,
            KatsuyouConstants.命令_TOKEN,
            KatsuyouConstants.ら_TOKEN,
            KatsuyouConstants.べき_TOKEN,
            KatsuyouConstants.る_TOKEN,
            KatsuyouConstants.らる_TOKEN,
            KatsuyouConstants.す_TOKEN,
            KatsuyouConstants.さす_TOKEN,
            KatsuyouConstants.しむ_TOKEN,
            KatsuyouConstants.き_TOKEN,
            KatsuyouConstants.けり_TOKEN,
            KatsuyouConstants.ず_TOKEN,
        ]
        this.maxLength = maxLength ?? Infinity
    }

    reset() {
        this.sequence = []
        this.initialToken = null
    }

    feed(term: KatsuyouVerb | KatsuyouAdjective) {
        this.reset()
        let token: FreeStandingToken
        let grade: Grade = "i"

        switch (term.type) {
            // VERB TYPES
            case "pentagrade":
                token = new PentagradeToken(term.baseForm, term.display ?? term.baseForm, term.ruby ?? {}, term.baseForm === "行く")
                break;
            case "monograde":
                token = new MonogradeToken(term.baseForm, term.display ?? term.baseForm, term.modern, term.classic, term.ruby ?? {})
                break;
            case "sagyou":
                token = new SagyouToken(term.baseForm, term.display ?? term.baseForm, term.modern, term.ruby ?? {})
                break;
            case "kagyou":
                token = new KagyouToken(term.baseForm, term.display ?? term.baseForm, term.modern, term.ruby ?? {})
                break;
            case "nagyou":
                token = new NagyouToken(term.baseForm, term.display ?? term.baseForm, term.ruby ?? {})
                break
            case "ragyou":
                token = new RagyouToken(term.baseForm, term.display ?? term.baseForm, term.ruby ?? {})
                break
            case "aru":
                token = KatsuyouConstants.ある_TOKEN
                break;
            case "honorific":
                token = new HonorificToken(term.baseForm, term.display ?? term.baseForm, term.ruby ?? {})
                break;
            case "quadrigrade":
                token = new QuadrigradeToken(term.baseForm, term.display ?? term.baseForm, term.ruby ?? {})
                break;
            case "lower_bigrade":
                grade = "e"
            // fall through
            case "upper_bigrade":
                token = new BigradeToken(term.baseForm, term.display ?? term.baseForm, grade, term.wagyou ?? false, term.ruby ?? {})
                break
            case "i":
                token = new IToken(term.baseForm, term.display ?? term.baseForm, term.ruby ?? {})
                break
            case "na":
                token = new NaToken(term.baseForm, term.display ?? term.baseForm, term.ruby ?? {})
                break
            case "ku" :
                token = new KuToken(term.baseForm, term.display ?? term.baseForm, term.ruby ?? {})
                break
            case "shiku":
                token = new ShikuToken(term.baseForm, term.display ?? term.baseForm, term.ruby ?? {})
                break
            case "nari":
                token = new NariToken(term.baseForm, term.display ?? term.baseForm, term.ruby ?? {})
                break
            case "tari":
                token = new TariToken(term.baseForm, term.display ?? term.baseForm, term.ruby ?? {})
                break
            default:
                throw Error(`Unknown verb type ${JSON.stringify(term)}`)
        }
        this.initialToken = token

        let dispatched: KatsuyouDispatchInfo | undefined
        let currentToken: KatsuyouToken = token
        for (let i = 1; ; i++) {
            if (i >= this.maxLength && currentToken !== KatsuyouConstants.END_TOKEN) {
                this.sequence.push(new KatsuyouDispatchInfo(currentToken, KatsuyouConstants.END_TOKEN, 1, true, currentToken.baseForm))
                break
            }

            dispatched = currentToken.dispatch(this.showModern, this.showClassic, this.allowedTokens)
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
        this.solution = result
    }

    conjugateFirstN(n: number) {
        if (!this.initialToken) {
            throw Error("Feed in a term before calling question")
        }
        let result = this.initialToken.conjugate(this.sequence[0])

        let dispatchTo = this.sequence[0].to as KatsuyouAuxiliary
        for (let i = 1; i < n + 1 && i < this.sequence.length; i++) {
            const dispatch = this.sequence[i];
            result = (dispatch.from as KatsuyouAuxiliary).conjugate(result, dispatch)
            dispatchTo = dispatch.to as KatsuyouAuxiliary
        }

        if ([KatsuyouConstants.ば_TOKEN,
            KatsuyouConstants.て_TOKEN,
            KatsuyouConstants.ている_TOKEN,
            KatsuyouConstants.た_TOKEN].includes(dispatchTo)) {
            result.options = result.options.map((op) => op.slice(0, -1))
        } else if (KatsuyouConstants.ておく_TOKEN === dispatchTo) {
            result.options = result.options.map((op) => op.slice(0, -2))
        } else if (KatsuyouConstants.てしまう_TOKEN === dispatchTo) {
            result.options = result.options.map((op) => op.slice(0, -3))
        }

        return [result, ...this.sequence.slice(n + 1)] as const
    }

    get question() {
        if (!this.initialToken) {
            throw Error("Feed in a term before calling question")
        }
        const comps = this.sequence.map((v) => v.from.display)
        return comps.reduce((s1, s2) => `${s1} + ${s2}`)
    }

    toggleClassic(to?: boolean): boolean {
        this.showClassic = to ?? !this.showClassic
        return this.showClassic
    }

    toggleModern(to?: boolean): boolean {
        this.showModern = to ?? !this.showModern
        return this.showModern
    }
}

const tokens = [
    { name: "せる_TOKEN", baseForm: "せる", display: "せる", modern: true, classic: false },
    { name: "させる_TOKEN", baseForm: "させる", display: "させる", modern: true, classic: false },
    { name: "れる_TOKEN", baseForm: "れる", display: "れる", modern: true, classic: false },
    { name: "られる_TOKEN", baseForm: "られる", display: "られる", modern: true, classic: false },
    { name: "せられる_TOKEN", baseForm: "れる", display: "られる", modern: true, classic: false },
    { name: "たい_TOKEN", baseForm: "たい", display: "たい", modern: true, classic: false },
    { name: "たがる_TOKEN", baseForm: "たがる", display: "たがる", modern: true, classic: false },
    { name: "がる_TOKEN", baseForm: "がる", display: "がる", modern: true, classic: false },
    { name: "ない_TOKEN", baseForm: "ない", display: "ない", modern: true, classic: false },
    { name: "ない_SHORT_TOKEN", baseForm: "ない", display: "ない", modern: true, classic: false },
    { name: "う_TOKEN", baseForm: "う", display: "う", modern: true, classic: false },
    { name: "よう_TOKEN", baseForm: "よう", display: "よう", modern: true, classic: false },
    { name: "まい_TOKEN", baseForm: "まい", display: "まい", modern: true, classic: true },
    { name: "た_TOKEN", baseForm: "", display: "た", modern: true, classic: false },
    { name: "た_SHORT_TOKEN", baseForm: "た", display: "た", modern: true, classic: false },
    { name: "そうだ様態_TOKEN", baseForm: "そうだ様態", display: "そうだ（様態）", modern: true, classic: false },
    { name: "そうだ伝聞_TOKEN", baseForm: "そうだ伝聞", display: "そうだ（伝聞）", modern: true, classic: false },
    { name: "ようだ_TOKEN", baseForm: "ようだ", display: "ようだ", modern: true, classic: false },
    { name: "らしい_TOKEN", baseForm: "らしい", display: "らしい", modern: true, classic: false },
    { name: "ます_TOKEN", baseForm: "ます", display: "ます", modern: true, classic: false },
    { name: "ます_SHORT_TOKEN", baseForm: "ます", display: "ます", modern: true, classic: false },
    { name: "だ_TOKEN", baseForm: "だ", display: "だ", modern: true, classic: false },
    { name: "です_TOKEN", baseForm: "です", display: "です", modern: true, classic: false },
    { name: "です_SHORT_TOKEN", baseForm: "です", display: "です", modern: true, classic: false },
    { name: "ている_TOKEN", baseForm: "いる", display: "ている", modern: true, classic: false },
    { name: "ば_TOKEN", baseForm: "", display: "ば", modern: true, classic: true },
    { name: "ん_TOKEN", baseForm: "ん", display: "ない", modern: true, classic: false },
    { name: "命令_TOKEN", baseForm: "", display: "（命令）", modern: true, classic: true },
    { name: "ら_TOKEN", baseForm: "ら", display: "（ば）", modern: true, classic: false },
    { name: "べき_TOKEN", baseForm: "べき", display: "べき", modern: true, classic: false },
    { name: "ておく_TOKEN", baseForm: "く", display: "ておく", modern: true, classic: false },
    { name: "て_TOKEN", baseForm: "", display: "て", modern: true, classic: false },   //maybe yes
    { name: "てしまう_TOKEN", baseForm: "", display: "てしまう", modern: true, classic: false },
    { name: "する_TOKEN", baseForm: "する", display: "する", modern: true, classic: true },

    // more to support
    { name: "る_TOKEN", baseForm: "る", display: "る", modern: false, classic: true },
    { name: "らる_TOKEN", baseForm: "らる", display: "らる", modern: false, classic: true },
    { name: "す_TOKEN", baseForm: "す", display: "す", modern: false, classic: true },
    { name: "さす_TOKEN", baseForm: "さす", display: "さす", modern: false, classic: true },
    { name: "しむ_TOKEN", baseForm: "しむ", display: "しむ", modern: false, classic: true },
    { name: "き_TOKEN", baseForm: "き", display: "き", modern: false, classic: true },
    { name: "けり_TOKEN", baseForm: "けり", display: "けり", modern: false, classic: true },

    { name: "ず_TOKEN", baseForm: "ず", display: "ず", modern: false, classic: true },
    // { name: "べし_TOKEN", baseForm: "べし", display: "べし", modern: false },
    // { name: "つ_TOKEN", baseForm: "つ", display: "つ", modern: false },  // https://www.try-it.jp/chapters-14469/lessons-14638/
    // { name: "ぬ_TOKEN", baseForm: "ぬ", display: "ぬ", modern: false },


    // { name: "しむ_TOKEN", baseForm: "しむ", display: "しむ", modern: false },
    // { name: "しむ_TOKEN", baseForm: "しむ", display: "しむ", modern: false },
] as const

for (const token of tokens) {
    KatsuyouConstants[token.name] = new KatsuyouAuxiliary(token.baseForm, token.display, token.modern, token.classic)
}

const verbTokens = [
    { name: "ある_TOKEN", baseForm: "有る", display: "ある", modern: true, classic: false, ruby: { 0: "あ" } },
] as const

for (const verbToken of verbTokens) {
    KatsuyouConstants[verbToken.name] = new FreeStandingToken(verbToken.baseForm, verbToken.display, verbToken.modern, verbToken.classic, verbToken.ruby)
}
KatsuyouConstants.NOUN_TOKEN = new KatsuyouAuxiliary("とき", "とき", true, true)
KatsuyouConstants.END_TOKEN = new KatsuyouEndToken()

const せる_dispatch = [
    { next: KatsuyouConstants.たい_TOKEN, weight: 2, modern: true, conjugation: "せ" },
    { next: KatsuyouConstants.たがる_TOKEN, weight: 1, modern: true, conjugation: "せ" },
    { next: KatsuyouConstants.ない_TOKEN, weight: 2, modern: true, conjugation: "せ" },
    { next: KatsuyouConstants.まい_TOKEN, weight: 1, modern: true, conjugation: "せ" },
    { next: KatsuyouConstants.た_TOKEN, weight: 2, modern: true, conjugation: "せた" },
    { next: KatsuyouConstants.そうだ伝聞_TOKEN, weight: 1, modern: true, conjugation: "せる" },
    { next: KatsuyouConstants.ようだ_TOKEN, weight: 2, modern: true, conjugation: "せる" },
    { next: KatsuyouConstants.らしい_TOKEN, weight: 1, modern: true, conjugation: "せる" },
    { next: KatsuyouConstants.ます_TOKEN, weight: 2, modern: true, conjugation: "せ" },
    { next: KatsuyouConstants.て_TOKEN, weight: 1, modern: true, conjugation: "せて" },
    { next: KatsuyouConstants.ている_TOKEN, weight: 1, modern: true, conjugation: "せて" },
    { next: KatsuyouConstants.ておく_TOKEN, weight: 1, modern: true, conjugation: ["せてお", "せと"] },
    { next: KatsuyouConstants.てしまう_TOKEN, weight: 1, modern: true, conjugation: ["せてしま", "せちゃ"] },
    { next: KatsuyouConstants.ば_TOKEN, weight: 2, modern: true, conjugation: "せれば" },
    { next: KatsuyouConstants.命令_TOKEN, weight: 1, modern: true, conjugation: ["せろ", "せよ"] },
    { next: KatsuyouConstants.END_TOKEN, weight: 2, modern: true, conjugation: "せる" },
] as const

const れる_dispatch = [
    { next: KatsuyouConstants.ない_TOKEN, weight: 2, modern: true, conjugation: "れ" },
    { next: KatsuyouConstants.まい_TOKEN, weight: 1, modern: true, conjugation: "れ" },
    { next: KatsuyouConstants.た_TOKEN, weight: 2, modern: true, conjugation: "れた" },
    { next: KatsuyouConstants.そうだ伝聞_TOKEN, weight: 1, modern: true, conjugation: "れる" },
    { next: KatsuyouConstants.ようだ_TOKEN, weight: 2, modern: true, conjugation: "れる" },
    { next: KatsuyouConstants.らしい_TOKEN, weight: 1, modern: true, conjugation: "れる" },
    { next: KatsuyouConstants.ます_TOKEN, weight: 2, modern: true, conjugation: "れ" },
    { next: KatsuyouConstants.て_TOKEN, weight: 1, modern: true, conjugation: "れて" },
    { next: KatsuyouConstants.ている_TOKEN, weight: 1, modern: true, conjugation: "れて" },
    { next: KatsuyouConstants.ておく_TOKEN, weight: 1, modern: true, conjugation: ["れてお", "れと"] },
    { next: KatsuyouConstants.てしまう_TOKEN, weight: 1, modern: true, conjugation: ["れてしま", "れちゃ"] },
    { next: KatsuyouConstants.ば_TOKEN, weight: 2, modern: true, conjugation: "れれば" },
    { next: KatsuyouConstants.命令_TOKEN, weight: 1, modern: false, conjugation: ["れろ", "れよ"] },
    { next: KatsuyouConstants.END_TOKEN, weight: 2, modern: true, conjugation: "れる" },
] as const

const そうだ_dispatch = [
    { next: KatsuyouConstants.です_SHORT_TOKEN, weight: 1, modern: true, conjugation: "そう" },
    { next: KatsuyouConstants.END_TOKEN, weight: 1, modern: true, conjugation: "そうだ" },
]

const がる_dispatch = [
    { next: KatsuyouConstants.ている_TOKEN, weight: 1, modern: true, conjugation: "がって" },
    { next: KatsuyouConstants.ない_TOKEN, weight: 1, modern: true, conjugation: "がら" },
    { next: KatsuyouConstants.ます_SHORT_TOKEN, weight: 1, modern: true, conjugation: "がり" },
    { next: KatsuyouConstants.END_TOKEN, weight: 2, modern: true, conjugation: "がる" }
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

KatsuyouConstants.せる_TOKEN.addDispatch(KatsuyouConstants.せられる_TOKEN, 2, true, ["せら", "さ"])
KatsuyouConstants.させる_TOKEN.addDispatch(KatsuyouConstants.られる_TOKEN, 2, true, "せ")

for (const d of れる_dispatch) {
    KatsuyouConstants.れる_TOKEN.addDispatch(d.next, d.weight, d.modern, d.conjugation)
    KatsuyouConstants.せられる_TOKEN.addDispatch(d.next, d.weight, d.modern, d.conjugation)
    if (Array.isArray(d.conjugation)) {
        const c = d.conjugation.map(e => `ら${e}`)
        KatsuyouConstants.られる_TOKEN.addDispatch(d.next, d.weight, d.modern, c)
    } else {
        KatsuyouConstants.られる_TOKEN.addDispatch(d.next, d.weight, d.modern, `ら${d.conjugation}`)
    }
}

for (const d of そうだ_dispatch) {
    KatsuyouConstants.そうだ様態_TOKEN.addDispatch(d.next, d.weight, d.modern, d.conjugation)
    KatsuyouConstants.そうだ伝聞_TOKEN.addDispatch(d.next, d.weight, d.modern, d.conjugation)
}

for (const d of がる_dispatch) {
    KatsuyouConstants.がる_TOKEN.addDispatch(d.next, d.weight, d.modern, d.conjugation)
    KatsuyouConstants.たがる_TOKEN.addDispatch(d.next, d.weight, d.modern, `た${d.conjugation}`)
}


KatsuyouConstants.ている_TOKEN
    .addDispatch(KatsuyouConstants.ます_TOKEN, 2, true, ["い", ""])
    .addDispatch(KatsuyouConstants.ない_TOKEN, 1, true, ["い", ""])
    .addDispatch(KatsuyouConstants.た_TOKEN, 1, true, ["いた", "た"])
    .addDispatch(KatsuyouConstants.ば_TOKEN, 1, true, ["いれば", "れば"])
    .addDispatch(KatsuyouConstants.て_TOKEN, 1, true, ["いて", "て"])
    .addDispatch(KatsuyouConstants.END_TOKEN, 2, true, ["いる", "る"])

KatsuyouConstants.ておく_TOKEN
    .addDispatch(KatsuyouConstants.ます_TOKEN, 2, true, `き`)
    .addDispatch(KatsuyouConstants.ない_TOKEN, 1, true, "か")
    .addDispatch(KatsuyouConstants.た_TOKEN, 1, true, "いた")
    .addDispatch(KatsuyouConstants.ば_TOKEN, 1, true, "けば")
    .addDispatch(KatsuyouConstants.て_TOKEN, 1, true, "いて")
    .addDispatch(KatsuyouConstants.END_TOKEN, 2, true, "く")

KatsuyouConstants.てしまう_TOKEN
    .addDispatch(KatsuyouConstants.ます_TOKEN, 2, true, `い`)
    .addDispatch(KatsuyouConstants.た_TOKEN, 1, true, "った")
    .addDispatch(KatsuyouConstants.ば_TOKEN, 1, true, "えば")
    .addDispatch(KatsuyouConstants.て_TOKEN, 1, true, "って")
    .addDispatch(KatsuyouConstants.END_TOKEN, 2, true, "う")

KatsuyouConstants.たい_TOKEN
    .addDispatch(KatsuyouConstants.た_TOKEN, 1, true, "たかった")
    .addDispatch(KatsuyouConstants.です_TOKEN, 2, true, "たい")
    .addDispatch(KatsuyouConstants.END_TOKEN, 1, true, "たい")

KatsuyouConstants.ない_TOKEN
    .addDispatch(KatsuyouConstants.う_TOKEN, 1, true, "なかろ")
    .addDispatch(KatsuyouConstants.そうだ様態_TOKEN, 1, true, "なさ")
    .addDispatch(KatsuyouConstants.そうだ伝聞_TOKEN, 1, true, "ない")
    .addDispatch(KatsuyouConstants.ようだ_TOKEN, 1, true, "ない")
    .addDispatch(KatsuyouConstants.らしい_TOKEN, 1, true, "ない")
    .addDispatch(KatsuyouConstants.です_TOKEN, 2, true, "ない")
    .addDispatch(KatsuyouConstants.ば_TOKEN, 1, true, ["なければ", "なきゃ"])
    .addDispatch(KatsuyouConstants.END_TOKEN, 2, true, "ない")

KatsuyouConstants.ない_SHORT_TOKEN
    .addDispatch(KatsuyouConstants.ば_TOKEN, 1, true, ["なければ", "なきゃ"])
    .addDispatch(KatsuyouConstants.END_TOKEN, 2, true, "ない")

KatsuyouConstants.た_TOKEN
    .addDispatch(KatsuyouConstants.ら_TOKEN, 1, true, "")
    .addDispatch(KatsuyouConstants.END_TOKEN, 2, true, "")

KatsuyouConstants.ようだ_TOKEN
    .addDispatch(KatsuyouConstants.です_SHORT_TOKEN, 2, true, "よう")
    .addDispatch(KatsuyouConstants.た_TOKEN, 1, true, "ようだった")
    .addDispatch(KatsuyouConstants.ら_TOKEN, 1, true, "ような")
    .addDispatch(KatsuyouConstants.END_TOKEN, 2, true, "ようだ")

KatsuyouConstants.らしい_TOKEN
    .addDispatch(KatsuyouConstants.です_SHORT_TOKEN, 1, true, "らしい")
    .addDispatch(KatsuyouConstants.END_TOKEN, 1, true, "らしい")

KatsuyouConstants.ます_TOKEN
    .addDispatch(KatsuyouConstants.ん_TOKEN, 2, true, "ませ")
    .addDispatch(KatsuyouConstants.う_TOKEN, 2, true, "ましょ")
    .addDispatch(KatsuyouConstants.た_TOKEN, 2, true, "ました")
    .addDispatch(KatsuyouConstants.命令_TOKEN, 1, true, "ませ")
    .addDispatch(KatsuyouConstants.END_TOKEN, 2, true, "ます")

KatsuyouConstants.だ_TOKEN
    .addDispatch(KatsuyouConstants.う_TOKEN, 1, true, "だろ")
    .addDispatch(KatsuyouConstants.た_TOKEN, 1, true, "だった")
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
    .addDispatch(KatsuyouConstants.た_TOKEN, 1, true, "あった")
    .addDispatch(KatsuyouConstants.ば_TOKEN, 1, true, "あれば")
    .addDispatch(KatsuyouConstants.ます_TOKEN, 1, true, "あり")
    .addDispatch(KatsuyouConstants.べき_TOKEN, 1, true, "ある")
