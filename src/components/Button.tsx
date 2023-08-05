import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { INPUT_VARIANTS } from "./Inputs/Variants";

export interface ButtonProps
    extends PropsWithChildren,
        Pick<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "className" | "style"> {}

export function Button(props: ButtonProps) {
    return (
        <button
            className={twMerge(
                INPUT_VARIANTS.base,
                "flex justify-center items-center hover:bg-white/20 disabled:hover:bg-white/10 active:bg-white/40 border-4 hover:border-white/40 active:border-white/80 disabled:hover:border-white/20 disabled:opacity-50 rounded-xl mt-2 font-bold",
                props.className
            )}
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
