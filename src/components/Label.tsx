import { PropsWithChildren } from "react";

export const INPUT_STYLE = "bg-white/10 p-4 py-3 block mt-2 rounded-xl font-normal border-4 border-white/20";

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
