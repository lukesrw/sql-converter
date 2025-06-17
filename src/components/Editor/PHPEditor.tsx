import { useEffect, useRef, useState } from "react";
import { useQueryContext, Variables } from "../../hooks/useQueryContext";
import { escapeWrap, unescape } from "../../lib/escape";
import { QuoteStyle } from "../Controls/QuoteStyle";
import { Rename, RenameButton } from "../Controls/Rename";
import { Editor } from "../Inputs/Editor";
import { Options } from "../Options";

export function PHPEditor() {
    const { query, setQuery, variables, setVariables } = useQueryContext();

    const [php, setPHP] = useState("");
    const [quote, setQuote] = useState("'");

    const [rename, setRename] = useState(false);
    const [queryName, setQueryName] = useState("$query");
    const [databaseName, setDatabaseName] = useState("$Database");
    const [variableValues, setVariableValues] = useState<Variables>({});

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
            value = value.replace(new RegExp(`@${name}`, "g"), `:${name}`);
        });

        value = `${queryName} = ${databaseName}->${names.length ? "prepare" : "query"}(
    ${escapeWrap(value, quote)}
);`;

        if (names.length) {
            value += `

${queryName}->execute(array(
    ${names
        .map((name) => {
            let variable = variableValues[name] || variables[name];
            if (!variable.startsWith("$")) {
                variable = escapeWrap(variable, quote);
            }

            return `${escapeWrap(":" + name, quote)} => ${variable}`;
        })
        .join(",\n\t")}
));`;
        }

        setPHP(value);
    }, [query, variables, quote, databaseName, queryName, variableValues]);

    return (
        <>
            <Options>
                <QuoteStyle variant="php" quote={quote} setQuote={setQuote} />
                <RenameButton variant="php" isShown={rename} setIsShown={setRename} />
            </Options>
            <Rename
                variant="php"
                isShown={rename}
                databaseName={databaseName}
                setDatabaseName={setDatabaseName}
                queryName={queryName}
                setQueryName={setQueryName}
                variableValues={variableValues}
                setVariableValues={setVariableValues}
            />
            <Editor
                variant="php"
                aria-label="PHP Editor"
                onInput={(value) => {
                    let match = value.match(
                        /(?:prepare|query|single|select|group|exec)\(\s*('|")(?<query>.+?)(?<!\\)\1/is
                    );
                    let query = "";
                    let quote = "'";
                    const variables: Variables = {};
                    if (match) {
                        query = match?.groups?.query || "";
                        quote = match[1];

                        do {
                            match = value.match(
                                /['"]:(?<name>\w+)['"]\s*=>\s*(?:'(?<value_sq>[^']*)'|"(?<value_dq>[^"]*)"|(?<value_plain>[^,\n)]+))/
                            );

                            if (!(match && match.groups)) {
                                break;
                            }

                            variables[match.groups.name] = unescape(
                                match.groups.value_sq ?? match.groups.value_dq ?? match.groups.value_plain,
                                quote
                            );

                            value = value.replace(match[0], "");
                        } while (match);

                        Object.keys(variables).forEach((name) => {
                            query = query.replace(new RegExp(`:${name}`, "g"), `@${name}`);
                        });
                    }

                    setQuery(
                        query
                            .replace(new RegExp(`\\\\${quote}`, "g"), quote)
                            .split("\n")
                            .map((line) => line.replace(/^(\t|\s{0,4})/, ""))
                            .join("\n")
                    );
                    setVariables(variables);
                }}
                setValue={setPHP}
                textarea={textarea}
                value={php}
            />
        </>
    );
}
