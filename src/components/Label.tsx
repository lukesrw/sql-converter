import { LabelHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface LabelProps extends PropsWithChildren, Pick<LabelHTMLAttributes<HTMLLabelElement>, "className"> {
    label: ReactNode;
}

export function Label(props: LabelProps) {
    return (
        <label className={twMerge("text-sm font-semibold my-2 block", props.className)}>
            {props.label}
            {props.children}
        </label>
    );
}
