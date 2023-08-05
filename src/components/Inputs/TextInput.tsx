import { Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";
import { INPUT_VARIANTS } from "./Variants";

export interface TextInputProps {
    variant: keyof typeof INPUT_VARIANTS;
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
}

export function TextInput(props: TextInputProps) {
    return (
        <input
            value={props.value}
            className={INPUT_VARIANTS[props.variant || "base"]}
            onChange={(event) => props.setValue(event.currentTarget.value)}
        ></input>
    );
}
