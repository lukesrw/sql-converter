import { Dispatch, SetStateAction, createContext, useContext } from "react";

export type Variables = Record<string, string>;

export const QueryContext = createContext<{
    query: string;
    setQuery: Dispatch<SetStateAction<string>>;
    variables: Variables;
    setVariables: Dispatch<SetStateAction<Variables>>;
} | null>(null);

export function useQueryContext() {
    const context = useContext(QueryContext);
    if (!context) {
        throw new Error("useQueryContext must be used within a QueryContextProvider");
    }

    return context;
}
