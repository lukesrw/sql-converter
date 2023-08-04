import { ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import { format } from "sql-formatter";
import { Editor } from "../Editor";
import { Input } from "../Input";
import { QuoteStyle } from "../Inputs/QuoteStyle";
import { Options } from "../Options";
import { QueryContext, Variables } from "../QueryContext";
import { escapeWrap } from "../lib/escapeWrap";

export function SQLEditor() {
    const { query, setQuery, variables, setVariables } = useContext(QueryContext);

    const [sql, setSQL] = useState("");
    const [quote, setQuote] = useState("'");
    const [error, setError] = useState("");

    /**
     * Parse the sql-formatter error for end user
     */
    const $error = useMemo(() => {
        if (!error) return null;

        let $details: ReactNode = null;

        /**
         * Attempt to extract specific line & column error to highlight for user
         */
        let match = error.match(/line (?<line>\d+) column (?<column>\d+)/i);
        if (match && match.groups) {
            let { line, column } = match.groups;
            line = query.split("\n")[Number(line) - 1];

            $details = (
                <>
                    <div className="bg-red-600/20 p-4 border-4 border-red-600/20 mt-4">
                        <pre>
                            <span className="opacity-50">{line.substring(0, Number(column) - 1)}</span>
                            <b>{line.substring(Number(column) - 1)}</b>
                        </pre>
                    </div>
                </>
            );
        }

        return (
            <div className="p-4 bg-red-500/20 border-4 border-red-500/20 rounded-xl mb-4">
                {error}
                {$details}
            </div>
        );
    }, [error]);

    const textarea = useRef<HTMLTextAreaElement>(null);

    /**
     * Update SQL textarea with the updated JS/PHP inputs
     */
    useEffect(() => {
        if (document.activeElement === textarea.current) return;

        let value = query;
        let names = Object.keys(variables);

        if (names.length) {
            value = `${names
                .map((name) => {
                    return `SET @${name} = ${escapeWrap(variables[name], quote)};`;
                })
                .join("\n")}

${value}`;
        }

        setSQL(value);
    }, [query, variables, quote]);

    /**
     * Automatically hide formatting error if query/variables update
     */
    useEffect(() => {
        setError("");
    }, [query, variables]);

    return (
        <>
            <Options>
                <QuoteStyle quote={quote} setQuote={setQuote}></QuoteStyle>
                <Input label="Format">
                    <button
                        className="flex p-4 py-3 justify-center items-center bg-white/10 hover:bg-white/20 disabled:hover:bg-white/10 active:bg-white/40 border-4 border-white/20 hover:border-white/40 active:border-white/80 disabled:hover:border-white/20 disabled:opacity-50 rounded-xl mt-2 font-bold"
                        style={{
                            lineHeight: "normal"
                        }}
                        onClick={() => {
                            setQuery((query) => {
                                try {
                                    return format(query, {
                                        language: "mysql",
                                        tabWidth: 4,
                                        logicalOperatorNewline: "after",
                                        denseOperators: false,
                                        keywordCase: "upper",
                                        linesBetweenQueries: 1,
                                        indentStyle: "standard",
                                        expressionWidth: 500
                                    });
                                } catch (error) {
                                    if (error instanceof Error) {
                                        setError(error.message);
                                    }

                                    return query;
                                }
                            });
                        }}
                    >
                        Auto
                    </button>
                </Input>
            </Options>
            {$error}
            <Editor
                textarea={textarea}
                className="bg-white/10 border-white/20 focus:border-white/40"
                value={sql}
                setValue={setSQL}
                onInput={(value) => {
                    let valueVariables: Variables = {};
                    let match: ReturnType<typeof value.match>;
                    do {
                        match = value.match(/set\s*@(?<name>\w+)\s*=\s*('|"|)(?<value>\w+)\2;/i);

                        if (match && match.groups) {
                            valueVariables[match.groups.name] = match.groups.value;
                            value = value.replace(match[0], "").trimStart();
                        }
                    } while (match);

                    setQuery(value);
                    setVariables(valueVariables);
                }}
            ></Editor>
        </>
    );
}
