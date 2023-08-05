import { Dispatch, SetStateAction } from "react";
import { Label } from "../Label";
import { Select } from "../Inputs/Select";

export interface QuoteStyleProps {
    quote: string;
    setQuote: Dispatch<SetStateAction<string>>;
}

export function QuoteStyle(props: QuoteStyleProps) {
    return (
        <Label label="Quote Style">
            <Select
                value={props.quote}
                setValue={props.setQuote}
                options={{
                    "'": "Single Quote (')",
                    '"': 'Double Quote (")'
                }}
            ></Select>
        </Label>
    );
}
