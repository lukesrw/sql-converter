import { LabelHTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export const INPUT_STYLE =
    "bg-white/10 p-4 py-3 block mt-2 rounded-xl font-normal border-4 border-white/20 w-full outline-none";

export interface LabelProps extends PropsWithChildren, Pick<LabelHTMLAttributes<HTMLLabelElement>, "className"> {
    label: string;
}

export function Label(props: LabelProps) {
    return (
        <label className={twMerge("text-sm font-semibold mb-4 block", props.className)}>
            {props.label}
            {props.children}
        </label>
    );
}
