import { Dispatch, SetStateAction, useContext } from "react";
import { Button } from "../Button";
import { TextInput } from "../Inputs/TextInput";
import { BUTTON_VARIANTS, INPUT_VARIANTS } from "../Inputs/Variants";
import { Label } from "../Label";
import { Options } from "../Options";
import { QueryContext, Variables } from "../QueryContext";

export interface RenameProps {
    variant?: keyof typeof INPUT_VARIANTS;
    isShown: boolean;

    databaseName?: string;
    setDatabaseName?: Dispatch<SetStateAction<string>>;

    queryName?: string;
    setQueryName?: Dispatch<SetStateAction<string>>;

    variableValues: Variables;
    setVariableValues: Dispatch<SetStateAction<Variables>>;
}

export function Rename(props: RenameProps) {
    const { variables } = useContext(QueryContext);

    if (!props.isShown) return null;

    let hasDatabaseOrQuery = typeof props.databaseName === "string" || typeof props.queryName === "string";

    return (
        <>
            <h3 className="block text-xl mb-2">Rename</h3>
            {hasDatabaseOrQuery && (
                <Options>
                    {typeof props.databaseName === "string" && typeof props.setDatabaseName === "function" && (
                        <Label label="Database">
                            <TextInput
                                variant={props.variant}
                                value={props.databaseName}
                                setValue={props.setDatabaseName}
                            ></TextInput>
                        </Label>
                    )}
                    {typeof props.queryName === "string" && typeof props.setQueryName === "function" && (
                        <Label label="Query">
                            <TextInput
                                variant={props.variant}
                                value={props.queryName}
                                setValue={props.setQueryName}
                            ></TextInput>
                        </Label>
                    )}
                </Options>
            )}
            <Options>
                {Object.keys(variables).map((variable) => {
                    return (
                        <Label label={variable}>
                            <TextInput
                                variant={props.variant}
                                placeholder={variables[variable]}
                                value={props.variableValues[variable] || ""}
                                setValue={(value) => {
                                    props.setVariableValues((variableNames) => {
                                        variableNames = {
                                            ...variableNames,
                                            [variable]: value
                                        };

                                        if (value.length === 0) {
                                            delete variableNames[variable];
                                        }

                                        return variableNames;
                                    });
                                }}
                            ></TextInput>
                        </Label>
                    );
                })}
            </Options>
        </>
    );
}

export interface RenameButtonProps {
    variant?: keyof typeof BUTTON_VARIANTS;
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
