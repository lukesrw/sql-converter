import { PropsWithChildren, ReactNode } from "react";

export interface InputProps extends PropsWithChildren {
    label: string;
}

export function Input(props: InputProps) {
    return (
        <label className="text-sm font-semibold mb-4 block">
            {props.label}
            {props.children}
        </label>
    );
}
