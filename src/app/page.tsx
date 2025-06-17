"use client";

import { Column } from "@/components/Column";
import { JSEditor } from "@/components/Editor/JSEditor";
import { PHPEditor } from "@/components/Editor/PHPEditor";
import { SQLEditor } from "@/components/Editor/SQLEditor";
import { QueryContextProvider } from "@/hooks/useQueryContext";

export default function Home() {
    return (
        <>
            <main className="p-4 pb-0 gap-4 xl:p-6 xl:pb-0 xl:gap-6 h-full grid grid-cols-1 xl:grid-cols-3">
                <QueryContextProvider>
                    <Column title="SQL">
                        <SQLEditor />
                    </Column>
                    <Column title="JS">
                        <JSEditor />
                    </Column>
                    <Column title="PHP">
                        <PHPEditor />
                    </Column>
                </QueryContextProvider>
            </main>
        </>
    );
}
