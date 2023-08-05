import { Dispatch, SetStateAction } from "react";
import { Options } from "../Options";
import { Label } from "../Label";
import { TextInput } from "../Inputs/TextInput";
import { Button } from "../Button";

export interface RenameProps {
    isShown: boolean;

    databaseName: string;
    setDatabaseName: Dispatch<SetStateAction<string>>;

    queryName: string;
    setQueryName: Dispatch<SetStateAction<string>>;
}

export function Rename(props: RenameProps) {
    if (!props.isShown) return null;

    return (
        <>
            <Options>
                <Label label="Database Name" className="w-full">
                    <TextInput value={props.databaseName} setValue={props.setDatabaseName}></TextInput>
                </Label>
            </Options>
            <Options>
                <Label label="Query Name" className="w-full">
                    <TextInput value={props.queryName} setValue={props.setQueryName}></TextInput>
                </Label>
            </Options>
        </>
    );
}

export interface RenameButtonProps {
    isShown: boolean;
    setIsShown: Dispatch<SetStateAction<boolean>>;
}

export function RenameButton(props: RenameButtonProps) {
    return (
        <Label label="Rename">
            <Button onClick={() => props.setIsShown((isShown) => !isShown)}>{props.isShown ? "-" : "+"}</Button>
        </Label>
    );
}
