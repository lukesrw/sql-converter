import { ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import { format } from "sql-formatter";
import { twMerge } from "tailwind-merge";
import { Button } from "../Button";
import { QuoteStyle } from "../Controls/QuoteStyle";
import { Rename, RenameButton } from "../Controls/Rename";
import { Editor } from "../Inputs/Editor";
import { Label } from "../Label";
import { Options } from "../Options";
import { QueryContext, Variables } from "../QueryContext";
import { escapeWrap, unescape } from "../lib/escape";

export function SQLEditor() {
    const { query, setQuery, variables, setVariables } = useContext(QueryContext);

    const [sql, setSQL] = useState("");
    const [quote, setQuote] = useState("'");
    const [error, setError] = useState("");
    const [rename, setRename] = useState(false);
    const [variableValues, setVariableValues] = useState<Variables>({});

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
                    <div
                        className="bg-red-500/20 py-4 mt-4 rounded-t-xl box-content overflow-auto"
                        style={{
                            scrollbarWidth: "thin"
                        }}
                    >
                        <pre>
                            <span className="opacity-50">{line.substring(0, Number(column) - 1)}</span>
                            <b>{line.substring(Number(column) - 1)}</b>
                        </pre>
                    </div>
                </>
            );
        }

        return (
            <div className="p-4 pb-0 bg-red-500/20 border-4 border-red-500/20 rounded-t-xl">
                <b className="mr-2">{error.substring(0, error.indexOf(":") + 1)}</b>
                {error.substring(error.indexOf(":") + 1).trim()}
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
                    return `SET @${name} = ${escapeWrap(variableValues[name] || variables[name], quote)};`;
                })
                .join("\n")}

${value}`;
        }

        setSQL(value);
    }, [query, variables, quote, variableValues]);

    /**
     * Automatically hide formatting error if query/variables update
     */
    useEffect(() => {
        setError("");
    }, [query, variables]);

    return (
        <>
            <Options>
                <QuoteStyle quote={quote} setQuote={setQuote} />
                <Label label="Format">
                    <Button
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
                    </Button>
                </Label>
                {Object.keys(variables).length > 0 && <RenameButton isShown={rename} setIsShown={setRename} />}
            </Options>
            <Rename isShown={rename} variableValues={variableValues} setVariableValues={setVariableValues} />
            {$error}
            <Editor
                aria-label="SQL Editor"
                textarea={textarea}
                className={twMerge("bg-white/10 border-white/20 focus:border-white/40", $error ? "rounded-t-none" : "")}
                value={sql}
                setValue={setSQL}
                onInput={(value) => {
                    let valueVariables: Variables = {};
                    let match: ReturnType<typeof value.match>;
                    do {
                        match = value.match(/set\s*@(?<name>\w+)\s*=\s*('|"|)(?<value>.+?)(?<!\\)\2;/i);

                        if (match && match.groups) {
                            valueVariables[match.groups.name] = unescape(match.groups.value, quote);
                            value = value.replace(match[0], "").trimStart();
                        }
                    } while (match);

                    setQuery(value);
                    setVariables(valueVariables);
                }}
            />
        </>
    );
}
