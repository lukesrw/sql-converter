import { LabelHTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

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
