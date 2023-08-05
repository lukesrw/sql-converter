import { Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";
import { INPUT_VARIANTS } from "./Variants";

export interface SelectProps {
    variant: keyof typeof INPUT_VARIANTS;
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    options: Record<string, string>;
}

export function Select(props: SelectProps) {
    return (
        <select
            className={twMerge(INPUT_VARIANTS.base, "focus:border-white/40")}
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
