"use client";

import { Column } from "@/components/Column";
import { JSEditor } from "@/components/Editor/JSEditor";
import { PHPEditor } from "@/components/Editor/PHPEditor";
import { SQLEditor } from "@/components/Editor/SQLEditor";
import { QueryContext, Variables } from "@/components/QueryContext";
import { useEffect, useState } from "react";

const QUERY_KEY = "SQLConverter_Query";
const VARIABLES_KEY = "SQLConverter_Variables";

export default function Home() {
    const [query, setQuery] = useState("");
    const [variables, setVariables] = useState<Variables>({});

    /**
     * When the page first mounts, check localStorage for query/variable history
     * If we find but aren't able to parse the variables we reset the history
     */
    useEffect(() => {
        let storedQuery = localStorage.getItem(QUERY_KEY);
        let storedVariables: any = localStorage.getItem(VARIABLES_KEY);
        if (storedVariables) {
            try {
                storedVariables = JSON.parse(storedVariables);
            } catch (_1) {
                storedQuery = null;
                storedVariables = null;
            }
        }

        setQuery(
            storedQuery ||
                `SELECT
    *
FROM
    People
WHERE
    People.Forename = 'Frank' AND
    People.Surname = @Surname AND
    People.Age = @Age`
        );

        setVariables(
            storedVariables || {
                Surname: "Skinner",
                Age: "66"
            }
        );
    }, []);

    /**
     * Update localStorage whenever the query/variables change
     */
    useEffect(() => {
        localStorage.setItem(QUERY_KEY, query);
        localStorage.setItem(VARIABLES_KEY, JSON.stringify(variables));
    }, [query, variables]);

    return (
        <>
            <main className="p-4 pb-0 gap-4 xl:p-6 xl:pb-0 xl:gap-6 h-full grid grid-cols-1 xl:grid-cols-3">
                <QueryContext.Provider
                    value={{
                        query,
                        setQuery,
                        variables,
                        setVariables
                    }}
                >
                    <Column title="SQL">
                        <SQLEditor></SQLEditor>
                    </Column>
                    <Column title="JS">
                        <JSEditor></JSEditor>
                    </Column>
                    <Column title="PHP">
                        <PHPEditor></PHPEditor>
                    </Column>
                </QueryContext.Provider>
            </main>
        </>
    );
}
