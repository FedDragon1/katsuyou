// TODO: remove this file when adjective conjugator is implemented
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
