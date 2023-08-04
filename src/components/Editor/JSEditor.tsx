import { useContext, useEffect, useRef, useState } from "react";
import { Editor } from "../Editor";
import { NPMLibrary } from "../Inputs/NPMLibrary";
import { QuoteStyle } from "../Inputs/QuoteStyle";
import { Options } from "../Options";
import { QueryContext, Variables } from "../QueryContext";
import { escapeWrap } from "../lib/escapeWrap";

export function JSEditor() {
    const { query, setQuery, variables, setVariables } = useContext(QueryContext);

    const [js, setJS] = useState("");
    const [quote, setQuote] = useState('"');
    const [library, setLibrary] = useState("mysql");

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

                setJS(`await database.query(
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
                setJS(`const query = database.prepare(
    ${escapeWrap(value, valueQuote)}
);${
                    names.length
                        ? `

query.run({
    ${jsVariables}
});`
                        : ""
                }`);
                break;
        }
    }, [query, variables, quote, library]);

    return (
        <>
            <Options>
                <QuoteStyle quote={quote} setQuote={setQuote}></QuoteStyle>
                <NPMLibrary library={library} setLibrary={setLibrary}></NPMLibrary>
            </Options>
            <Editor
                className="bg-yellow-500/20 border-yellow-500/20 focus:border-yellow-500/40"
                value={js}
                setValue={setJS}
                onInput={(value) => {
                    let query =
                        value.match(/(?:query|prepare)\(\s*("|'|`)(?<query>.+?)(?<!\\)\1/is)?.groups?.query || "";

                    let variables: Variables = {};
                    let match: ReturnType<typeof value.match>;
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

                    setQuery(
                        query
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
