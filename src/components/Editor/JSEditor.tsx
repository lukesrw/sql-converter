import { useContext, useEffect, useRef, useState } from "react";
import { NPMLibrary } from "../Controls/NPMLibrary";
import { QuoteStyle } from "../Controls/QuoteStyle";
import { Rename, RenameButton } from "../Controls/Rename";
import { Editor } from "../Inputs/Editor";
import { Options } from "../Options";
import { QueryContext, Variables } from "../QueryContext";
import { escapeWrap, unescape } from "../lib/escape";

export function JSEditor() {
    const { query, setQuery, variables, setVariables } = useContext(QueryContext);

    const [js, setJS] = useState("");
    const [quote, setQuote] = useState('"');
    const [library, setLibrary] = useState("mysql");

    const [rename, setRename] = useState(false);
    const [queryName, setQueryName] = useState("query");
    const [databaseName, setDatabaseName] = useState("database");
    const [variableValues, setVariableValues] = useState<Variables>({});

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

                let variable = variables[name];
                if (name in variableValues) {
                    variable = variableValues[name];
                } else {
                    variable = escapeWrap(variable, quote);
                }

                return `${objectName}: ${variable}`;
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
    }, [query, variables, quote, library, databaseName, queryName, variableValues]);

    return (
        <>
            <Options>
                <QuoteStyle variant="js" quote={quote} setQuote={setQuote}></QuoteStyle>
                <NPMLibrary variant="js" library={library} setLibrary={setLibrary}></NPMLibrary>
                <RenameButton variant="js" isShown={rename} setIsShown={setRename}></RenameButton>
            </Options>
            <Rename
                variant="js"
                isShown={rename}
                databaseName={databaseName}
                setDatabaseName={setDatabaseName}
                queryName={library === "sqlite" ? queryName : undefined}
                setQueryName={setQueryName}
                variableValues={variableValues}
                setVariableValues={setVariableValues}
            ></Rename>
            <Editor
                aria-label="JS Editor"
                variant="js"
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
                            match = value.match(/(?<name>\w+):\s*(?<quote>"|'|)(?<value>.+?)(?:,|\s*})/);

                            if (!(match && match.groups)) break;

                            if (match.groups.quote.length && match.groups.value.endsWith(match.groups.quote)) {
                                variables[match.groups.name] = match.groups.value.substring(
                                    0,
                                    match.groups.value.length - 1
                                );
                            } else {
                                variables[match.groups.name] = match.groups.value;
                            }
                            variables[match.groups.name] = unescape(variables[match.groups.name], quote);

                            value = value.replace(match[0], "");
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
