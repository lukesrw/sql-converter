import { useContext, useEffect, useRef, useState } from "react";
import { Editor } from "../Editor";
import { NPMLibrary } from "../Controls/NPMLibrary";
import { QuoteStyle } from "../Controls/QuoteStyle";
import { Options } from "../Options";
import { QueryContext, Variables } from "../QueryContext";
import { escapeWrap } from "../lib/escapeWrap";
import { Label } from "../Label";
import { Button } from "../Button";
import { Rename, RenameButton } from "../Controls/Rename";

export function JSEditor() {
    const { query, setQuery, variables, setVariables } = useContext(QueryContext);

    const [js, setJS] = useState("");
    const [quote, setQuote] = useState('"');
    const [library, setLibrary] = useState("mysql");

    const [rename, setRename] = useState(false);
    const [queryName, setQueryName] = useState("query");
    const [databaseName, setDatabaseName] = useState("database");

    const textarea = useRef<HTMLTextAreaElement>(null);

    /**
     * Update JS textarea with the updated SQL/PHP inputs
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

        let valueQuote = quote;
        if (value.includes("\n")) {
            valueQuote = "`";
        }

        let jsVariables = names
            .map((name) => {
                let objectName = name;
                if (!objectName.match(/^[a-zA-Z_$]\w*$/)) {
                    objectName = escapeWrap(objectName, quote);
                }

                return `${objectName}: ${escapeWrap(variables[name], quote)}`;
            })
            .join(",\n\t" + (library === "mysql" ? "\t" : ""));

        switch (library) {
            case "mysql":
                names.forEach((name) => {
                    value = value.replace(`@${name}`, `:${name}`);
                });

                setJS(`await ${databaseName}.query(
    ${escapeWrap(value, valueQuote)}${
                    names.length
                        ? `,
    {
        ${jsVariables}
    }`
                        : ""
                }
);`);
                break;

            case "sqlite":
                setJS(`const ${queryName} = ${databaseName}.prepare(
    ${escapeWrap(value, valueQuote)}
);${
                    names.length
                        ? `

${queryName}.run({
    ${jsVariables}
});`
                        : ""
                }`);
                break;
        }
    }, [query, variables, quote, library, databaseName, queryName]);

    return (
        <>
            <Options>
                <QuoteStyle quote={quote} setQuote={setQuote}></QuoteStyle>
                <NPMLibrary library={library} setLibrary={setLibrary}></NPMLibrary>
                <RenameButton isShown={rename} setIsShown={setRename}></RenameButton>
            </Options>
            <Rename
                isShown={rename}
                databaseName={databaseName}
                setDatabaseName={setDatabaseName}
                queryName={library === "sqlite" ? queryName : undefined}
                setQueryName={setQueryName}
            ></Rename>
            <Editor
                aria-label="JS Editor"
                className="bg-yellow-500/20 border-yellow-500/20 focus:border-yellow-500/40"
                value={js}
                setValue={setJS}
                onInput={(value) => {
                    let match = value.match(/(?:query|prepare)\(\s*("|'|`)(?<query>.+?)(?<!\\)\1/is);
                    let query = "";
                    let quote = "";
                    let variables: Variables = {};
                    if (match) {
                        query = match?.groups?.query || "";
                        quote = match[1];

                        do {
                            match = value.match(/(?<name>\w+):\s*("|'|)(?<value>.+?)[\2\W]/);

                            if (match && match.groups) {
                                variables[match.groups.name] = match.groups.value;
                                value = value.replace(match[0], "");
                            }
                        } while (match);

                        Object.keys(variables).forEach((name) => {
                            query = query.replace(`:${name}`, `@${name}`);
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
                textarea={textarea}
            ></Editor>
        </>
    );
}
