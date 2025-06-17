import { Dispatch, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";
import { INPUT_VARIANTS } from "./Variants";

export namespace Select {
    export type Props = {
        variant?: keyof typeof INPUT_VARIANTS;
        value: string;
        setValue: Dispatch<SetStateAction<string>>;
        options: Record<string, string>;
    };
}

export function Select(props: Readonly<Select.Props>) {
    return (
        <select
            className={twMerge(INPUT_VARIANTS[props.variant || "base"])}
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
