// Équivalent de kebabCase de lodash 4.17 (« Modèle OSI » → « modele-osi »), sans dépendance :
// accents et ligatures retirés, apostrophes supprimées, découpage en mots selon les mêmes règles
// (minuscules / majuscules, chiffres, séparateurs), mots en minuscules reliés par « - ».
// Les adresses des pages de mot-clé (/tags/<mot-clé>/) en dépendent : ne pas modifier sans vérifier
// que les adresses publiées restent identiques (les expressions ci-dessous reprennent celles de lodash).

// Lettres que la décomposition Unicode ne ramène pas à une lettre latine simple (deburr de lodash).
const LETTERS = {
    Æ: 'Ae', æ: 'ae', Ð: 'D', ð: 'd', Ø: 'O', ø: 'o', Þ: 'Th', þ: 'th', ß: 'ss',
    Đ: 'D', đ: 'd', Ħ: 'H', ħ: 'h', ı: 'i', Ĳ: 'IJ', ĳ: 'ij', ĸ: 'k', Ŀ: 'L', ŀ: 'l',
    Ł: 'L', ł: 'l', ŉ: "'n", Ŋ: 'N', ŋ: 'n', Œ: 'Oe', œ: 'oe', Ŧ: 'T', ŧ: 't', ſ: 's',
    '×': ' ', '÷': ' ',
}
const COMBO = '\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff'
const deburr = (text) =>
    text
        .replace(/[À-ÖØ-öø-ſ×÷]/g, (c) => LETTERS[c] ?? c.normalize('NFD'))
        .replace(new RegExp(`[${COMBO}]`, 'g'), '')

// Classes de caractères de lodash (words / unicodeWords).
const LOWER_R = 'a-z\\xdf-\\xf6\\xf8-\\xff'
const UPPER_R = 'A-Z\\xc0-\\xd6\\xd8-\\xde'
const SPACE_R =
    ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000'
const BREAK_R = '\\xac\\xb1\\xd7\\xf7' + '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf' + '\\u2000-\\u206f' + SPACE_R
const ASTRAL_R = '\\ud800-\\udfff'
const DINGBAT_R = '\\u2700-\\u27bf'
const BREAK = `[${BREAK_R}]`
const LOWER = `[${LOWER_R}]`
const UPPER = `[${UPPER_R}]`
const MISC = `[^${ASTRAL_R}${BREAK_R}\\d+${DINGBAT_R}${LOWER_R}${UPPER_R}]`
const MISC_LOWER = `(?:${LOWER}|${MISC})`
const MISC_UPPER = `(?:${UPPER}|${MISC})`
const CONTR_LOWER = "(?:['’](?:d|ll|m|re|s|t|ve))?"
const CONTR_UPPER = "(?:['’](?:D|LL|M|RE|S|T|VE))?"
const EMOJI = `(?:[${DINGBAT_R}]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])[\\ufe0e\\ufe0f]?(?:[${COMBO}]|\\ud83c[\\udffb-\\udfff])?`
const UNICODE_WORDS = new RegExp(
    [
        `${UPPER}?${LOWER}+${CONTR_LOWER}(?=${BREAK}|${UPPER}|$)`,
        `${MISC_UPPER}+${CONTR_UPPER}(?=${BREAK}|${UPPER}${MISC_LOWER}|$)`,
        `${UPPER}?${MISC_LOWER}+${CONTR_LOWER}`,
        `${UPPER}+${CONTR_UPPER}`,
        '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
        '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
        '\\d+',
        EMOJI,
    ].join('|'),
    'g'
)
const HAS_UNICODE_WORD = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/
const ASCII_WORDS = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g

export default function kebabCase(value) {
    const text = deburr(String(value ?? '')).replace(/['’]/g, '')
    const words = (HAS_UNICODE_WORD.test(text) ? text.match(UNICODE_WORDS) : text.match(ASCII_WORDS)) ?? []
    return words.map((word) => word.toLowerCase()).join('-')
}
