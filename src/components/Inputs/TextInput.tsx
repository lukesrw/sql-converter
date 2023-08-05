import { Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";
import { INPUT_STYLE } from "../Label";

export interface TextInputProps {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
}

export function TextInput(props: TextInputProps) {
    return (
        <input
            value={props.value}
            className={twMerge(INPUT_STYLE)}
            onChange={(event) => props.setValue(event.currentTarget.value)}
        ></input>
    );
}
