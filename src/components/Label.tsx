import { PropsWithChildren } from "react";

export interface LabelProps extends PropsWithChildren {
    label: string;
}

export function Label(props: LabelProps) {
    return (
        <label className="text-sm font-semibold mb-4 block">
            {props.label}
            {props.children}
        </label>
    );
}
