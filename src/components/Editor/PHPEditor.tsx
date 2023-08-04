import { useContext, useEffect, useRef, useState } from "react";
import { Editor } from "../Editor";
import { QuoteStyle } from "../Inputs/QuoteStyle";
import { Options } from "../Options";
import { QueryContext, Variables } from "../QueryContext";
import { escapeWrap } from "../lib/escapeWrap";

export function PHPEditor() {
    const { query, setQuery, variables, setVariables } = useContext(QueryContext);

    const [php, setPHP] = useState("");
    const [quote, setQuote] = useState("'");

    const textarea = useRef<HTMLTextAreaElement>(null);

    /**
     * Update PHP textarea with the updated SQL/JS inputs
     */
    useEffect(() => {
        if (document.activeElement === textarea.current) return;

        let names = Object.keys(variables);

        let value = query
            .trim()
            .split("\n")
            .map((line, index) => {
                return (index ? "\t" : "") + line;
            })
            .join("\n");
        names.forEach((name) => {
            value = value.replace(`@${name}`, `:${name}`);
        });

        value = `$query = $Database->${names.length ? "prepare" : "query"}(
    ${escapeWrap(value, quote)}
);`;

        if (names.length) {
            value += `

$query->execute(array(
    ${names
        .map((name) => {
            return `${escapeWrap(":" + name, quote)} => ${escapeWrap(variables[name], quote)}`;
        })
        .join(",\n\t")}
));`;
        }

        setPHP(value);
    }, [query, variables, quote]);

    return (
        <>
            <Options>
                <QuoteStyle quote={quote} setQuote={setQuote}></QuoteStyle>
            </Options>
            <Editor
                className="bg-indigo-500/20 border-indigo-500/20 focus:border-indigo-500/40"
                onInput={(value) => {
                    let query = value.match(/(?:prepare|query)\(\s*('|")(?<query>.+?)\1/is)?.groups?.query || "";

                    let variables: Variables = {};
                    let match: ReturnType<typeof value.match>;
                    do {
                        match = value.match(/('|"):(?<name>.+?)\1 => ('|"|)(?<value>.+?)[\3\W]/);

                        if (match && match.groups) {
                            variables[match.groups.name] = match.groups.value;
                            value = value.replace(match[0], "");
                        }
                    } while (match);

                    Object.keys(variables).forEach((name) => {
                        query = query.replace(`:${name}`, `@${name}`);
                    });

                    setQuery(
                        query
                            .split("\n")
                            .map((line) => line.replace(/^(\t|\s{0,4})/, ""))
                            .join("\n")
                    );
                    setVariables(variables);
                }}
                setValue={setPHP}
                textarea={textarea}
                value={php}
            ></Editor>
        </>
    );
}