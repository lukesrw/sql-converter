import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../Button";
import { QuoteStyle } from "../Controls/QuoteStyle";
import { Editor } from "../Inputs/Editor";
import { TextInput } from "../Inputs/TextInput";
import { Label } from "../Label";
import { Options } from "../Options";
import { QueryContext, Variables } from "../QueryContext";
import { escapeWrap } from "../lib/escapeWrap";
import { Rename, RenameButton } from "../Controls/Rename";

export function PHPEditor() {
    const { query, setQuery, variables, setVariables } = useContext(QueryContext);

    const [php, setPHP] = useState("");
    const [quote, setQuote] = useState("'");

    const [rename, setRename] = useState(false);
    const [queryName, setQueryName] = useState("$query");
    const [databaseName, setDatabaseName] = useState("$Database");

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

        value = `${queryName} = ${databaseName}->${names.length ? "prepare" : "query"}(
    ${escapeWrap(value, quote)}
);`;

        if (names.length) {
            value += `

${queryName}->execute(array(
    ${names
        .map((name) => {
            let variable = variables[name];
            if (!variable.startsWith("$")) {
                variable = escapeWrap(variable, quote);
            }

            return `${escapeWrap(":" + name, quote)} => ${variable}`;
        })
        .join(",\n\t")}
));`;
        }

        setPHP(value);
    }, [query, variables, quote, databaseName, queryName]);

    return (
        <>
            <Options>
                <QuoteStyle variant="php" quote={quote} setQuote={setQuote}></QuoteStyle>
                <RenameButton variant="php" isShown={rename} setIsShown={setRename}></RenameButton>
            </Options>
            <Rename
                variant="php"
                isShown={rename}
                databaseName={databaseName}
                setDatabaseName={setDatabaseName}
                queryName={queryName}
                setQueryName={setQueryName}
            ></Rename>
            <Editor
                variant="php"
                aria-label="PHP Editor"
                onInput={(value) => {
                    let match = value.match(/(?:prepare|query)\(\s*('|")(?<query>.+?)(?<!\\)\1/is);
                    let query = "";
                    let quote = "'";
                    let variables: Variables = {};
                    if (match) {
                        query = match?.groups?.query || "";
                        quote = match[1];

                        do {
                            match = value.match(/('|"):(?<name>.+?)\1 => ('|"|)(?<value>.+?)[\3\W]/);

                            if (match && match.groups) {
                                variables[match.groups.name] = match.groups.value;
                                value = value.replace(match[0], "");
                            }
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
            ></Editor>
        </>
    );
}
