import { escapeWrap } from "./escapeWrap";

export function columnCombine(...parts: string[]) {
    return parts
        .filter(Boolean)
        .map((part) => escapeWrap(part, "`"))
        .join(".");
}
