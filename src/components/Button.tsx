import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { BUTTON_VARIANTS, INPUT_VARIANTS } from "./Inputs/Variants";

export interface ButtonProps
    extends PropsWithChildren,
        Pick<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "className" | "style"> {
    variant: keyof typeof BUTTON_VARIANTS;
}

export function Button(props: ButtonProps) {
    return (
        <button
            className={twMerge(BUTTON_VARIANTS[props.variant || "base"], props.className)}
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
