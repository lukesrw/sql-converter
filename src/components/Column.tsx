import { PropsWithChildren } from "react";

export interface ColumnProps extends PropsWithChildren {
    title: string;
}

export function Column(props: ColumnProps) {
    return (
        <div className="flex-1 flex flex-col mb-4 xl:mb-8">
            <h1 className="text-3xl mb-4 font-extrabold">{props.title}</h1>

            {props.children}
        </div>
    );
}
