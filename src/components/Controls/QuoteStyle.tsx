import { Dispatch, SetStateAction } from "react";
import { Select } from "../Inputs/Select";
import { INPUT_VARIANTS } from "../Inputs/Variants";
import { Label } from "../Label";

export namespace QuoteStyle {
    export type Props = {
        variant?: keyof typeof INPUT_VARIANTS;
        quote: string;
        setQuote: Dispatch<SetStateAction<string>>;
    };
}

export function QuoteStyle(props: Readonly<QuoteStyle.Props>) {
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
