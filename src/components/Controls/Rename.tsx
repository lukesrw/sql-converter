import { Dispatch, SetStateAction } from "react";
import { Options } from "../Options";
import { Label } from "../Label";
import { TextInput } from "../Inputs/TextInput";
import { Button } from "../Button";
import { BUTTON_VARIANTS, INPUT_VARIANTS } from "../Inputs/Variants";

export interface RenameProps {
    variant: keyof typeof INPUT_VARIANTS;
    isShown: boolean;

    databaseName: string;
    setDatabaseName: Dispatch<SetStateAction<string>>;

    queryName?: string;
    setQueryName: Dispatch<SetStateAction<string>>;
}

export function Rename(props: RenameProps) {
    if (!props.isShown) return null;

    return (
        <>
            <h3 className="block text-xl mb-2">Rename</h3>
            <Options>
                <Label label="Database" className="w-full">
                    <TextInput
                        variant={props.variant}
                        value={props.databaseName}
                        setValue={props.setDatabaseName}
                    ></TextInput>
                </Label>
                {typeof props.queryName === "string" && (
                    <Label label="Query" className="w-full">
                        <TextInput
                            variant={props.variant}
                            value={props.queryName}
                            setValue={props.setQueryName}
                        ></TextInput>
                    </Label>
                )}
            </Options>
        </>
    );
}

export interface RenameButtonProps {
    variant: keyof typeof BUTTON_VARIANTS;
    isShown: boolean;
    setIsShown: Dispatch<SetStateAction<boolean>>;
}

export function RenameButton(props: RenameButtonProps) {
    return (
        <Label label="Rename">
            <Button variant={props.variant} onClick={() => props.setIsShown((isShown) => !isShown)}>
                {props.isShown ? "-" : "+"}
            </Button>
        </Label>
    );
}
