import { Dispatch, SetStateAction, createContext } from "react";

export type Variables = Record<string, string>;

export const QueryContext = createContext<{
    query: string;
    setQuery: Dispatch<SetStateAction<string>>;
    variables: Variables;
    setVariables: Dispatch<SetStateAction<Variables>>;
}>({} as any);
