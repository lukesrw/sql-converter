import { Dispatch, SetStateAction } from "react";

export interface SelectProps {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    options: Record<string, string>;
}

export function Select(props: SelectProps) {
    return (
        <select
            className="bg-white/10 p-4 py-3 block mt-2 rounded-xl font-normal border-4 border-white/20 focus:border-white/40"
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
