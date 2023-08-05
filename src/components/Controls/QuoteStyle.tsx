import { Dispatch, SetStateAction } from "react";
import { Label } from "../Label";
import { Select } from "../Inputs/Select";
import { INPUT_VARIANTS } from "../Inputs/Variants";

export interface QuoteStyleProps {
    variant?: keyof typeof INPUT_VARIANTS;
    quote: string;
    setQuote: Dispatch<SetStateAction<string>>;
}

export function QuoteStyle(props: QuoteStyleProps) {
    return (
        <Label label="Quote Style">
            <Select
                variant={props.variant}
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
