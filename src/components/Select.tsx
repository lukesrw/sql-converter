import { Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";
import { INPUT_STYLE } from "./Label";

export interface SelectProps {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    options: Record<string, string>;
}

export function Select(props: SelectProps) {
    return (
        <select
            className={twMerge(INPUT_STYLE, "focus:border-white/40")}
            value={props.value}
            onChange={(event) => props.setValue(event.currentTarget.value)}
        >
            {Object.keys(props.options).map((value) => {
                return (
                    <option className="text-black" value={value} key={value}>
                        {props.options[value]}
                    </option>
                );
            })}
        </select>
    );
}
