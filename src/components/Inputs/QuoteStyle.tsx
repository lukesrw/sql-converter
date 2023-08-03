import { Dispatch, SetStateAction } from "react";
import { Input } from "../Input";
import { Select } from "../Select";

export interface QuoteStyleProps {
    quote: string;
    setQuote: Dispatch<SetStateAction<string>>;
}

export function QuoteStyle(props: QuoteStyleProps) {
    return (
        <Input label="Quote Style">
            <Select
                value={props.quote}
                setValue={props.setQuote}
                options={{
                    "'": "Single Quote (')",
                    '"': 'Double Quote (")',
                }}
            ></Select>
        </Input>
    );
}
