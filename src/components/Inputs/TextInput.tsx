import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { INPUT_VARIANTS } from "./Variants";

export interface TextInputProps
    extends Pick<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "placeholder"> {
    variant?: keyof typeof INPUT_VARIANTS;
    value: string;
    setValue: (value: string) => void;
}

export function TextInput({ variant, setValue, ...props }: TextInputProps) {
    return (
        <input
            {...props}
            className={INPUT_VARIANTS[variant || "base"]}
            onChange={(event) => setValue(event.currentTarget.value)}
        ></input>
    );
}
