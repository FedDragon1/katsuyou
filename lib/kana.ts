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

// HELPER FUNCTIONS

/**
 * Change a kana to another grade (a, i, u, e, o)
 * Returns undefined is it is impossible
 *
 * @param kana
 * @param grade
 * @param wagyou
 */
export function kanaToGrade(kana: Hiragana, grade: Grade, wagyou?: boolean) {
    const code = [...hiraganaCodes[kana]]

    // technically we can change ぎゃ　to ぎょ, but we'll leave it for now
    if (code.length !== 2) {
        return undefined
    }

    if (wagyou && code[0] === "none") {
        code[0] = "w"
    }

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