import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { INPUT_VARIANTS } from "./Variants";

export namespace TextInput {
    export type Props = Pick<
        DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
        "placeholder"
    > & {
        variant?: keyof typeof INPUT_VARIANTS;
        value: string;
        setValue: (value: string) => void;
    };
}

export function TextInput(props: Readonly<TextInput.Props>) {
    return (
        <input
            className={INPUT_VARIANTS[props.variant || "base"]}
            onChange={(event) => props.setValue(event.currentTarget.value)}
            value={props.value}
            placeholder={props.placeholder}
        ></input>
    );
}
