import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { BUTTON_VARIANTS } from "./Inputs/Variants";

export namespace Button {
    export type Props = PropsWithChildren<
        Pick<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "style"> & {
            variant?: keyof typeof BUTTON_VARIANTS;
        }
    >;
}

export function Button(props: Readonly<Button.Props>) {
    return (
        <button
            className={BUTTON_VARIANTS[props.variant || "base"]}
            style={{
                lineHeight: "normal",
                ...props.style
            }}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}
