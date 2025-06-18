import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useState } from "react";

export type Variables = Record<string, string>;

export const QueryContext = createContext<{
    query: string;
    setQuery: Dispatch<SetStateAction<string>>;
    variables: Variables;
    setVariables: Dispatch<SetStateAction<Variables>>;
} | null>(null);

const QUERY_KEY = "SQLConverter_Query";
const VARIABLES_KEY = "SQLConverter_Variables";

export function QueryContextProvider(props: Readonly<PropsWithChildren>) {
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

    useEffect(() => {
        /**
         * Replace betweens, not supported by formatter.
         */
        if (!query.toLowerCase().includes(" between ")) {
            return;
        }

        setQuery(query.replace(/(\s*)([\w.]+) BETWEEN (.+) AND (.+)/gi, "$1($2 >= $3 AND $2 <= $4)"));
    }, [query]);

    /**
     * Update localStorage whenever the query/variables change
     */
    useEffect(() => {
        localStorage.setItem(QUERY_KEY, query);
        localStorage.setItem(VARIABLES_KEY, JSON.stringify(variables));
    }, [query, variables]);

    return (
        <QueryContext.Provider
            value={{
                query,
                setQuery,
                variables,
                setVariables
            }}
        >
            {props.children}
        </QueryContext.Provider>
    );
}

export function useQueryContext() {
    const context = useContext(QueryContext);
    if (!context) {
        throw new Error("useQueryContext must be used within a QueryContextProvider");
    }

    return context;
}
