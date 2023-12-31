/**
 * Escape and wrap a string
 *
 * @param text to escape and wrap with a quote
 * @param quote to use for the escaping and wrapping
 * @returns {string} nicely escaped and wrapped string
 */
export function escapeWrap(text: string, quote: string) {
    if (!text.length) {
        return quote + quote;
    }

    if (!isNaN(Number(text))) {
        return text;
    }

    return quote + text.replace(new RegExp(`(?<!\\\\)${quote}`, "g"), `\\${quote}`) + quote;
}

/**
 * Unescape a string
 *
 * @param text to unescape
 * @param quote to use for the unescaping
 * @returns {string} original string before escaping
 */
export function unescape(text: string, quote: string) {
    return text.replace(new RegExp(`\\\\${quote}`, "g"), quote);
}
