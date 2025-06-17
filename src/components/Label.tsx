import { LabelHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export namespace Label {
    export type Props = PropsWithChildren<
        Pick<LabelHTMLAttributes<HTMLLabelElement>, "className"> & {
            label: ReactNode;
        }
    >;
}

export function Label(props: Readonly<Label.Props>) {
    return (
        <label className={twMerge("text-sm font-semibold my-2 block", props.className)}>
            {props.label}
            {props.children}
        </label>
    );
}
