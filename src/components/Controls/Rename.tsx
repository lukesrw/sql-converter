import { Dispatch, SetStateAction } from "react";
import { useQueryContext, Variables } from "../../hooks/useQueryContext";
import { Button } from "../Button";
import { TextInput } from "../Inputs/TextInput";
import { BUTTON_VARIANTS, INPUT_VARIANTS } from "../Inputs/Variants";
import { Label } from "../Label";
import { Options } from "../Options";

export namespace Rename {
    export type Props = {
        variant?: keyof typeof INPUT_VARIANTS;
        isShown: boolean;

        databaseName?: string;
        setDatabaseName?: Dispatch<SetStateAction<NonNullable<Props["databaseName"]>>>;

        queryName?: string;
        setQueryName?: Dispatch<SetStateAction<NonNullable<Props["queryName"]>>>;

        variableValues: Variables;
        setVariableValues: Dispatch<SetStateAction<Props["variableValues"]>>;
    };
}

export function Rename(props: Readonly<Rename.Props>) {
    const { variables } = useQueryContext();

    if (!props.isShown) return null;

    let hasDatabaseOrQuery = typeof props.databaseName === "string" || typeof props.queryName === "string";

    return (
        <>
            <h3 className="block text-xl mt-4">Rename</h3>
            {hasDatabaseOrQuery && (
                <Options>
                    {typeof props.databaseName === "string" && typeof props.setDatabaseName === "function" && (
                        <Label label="Database">
                            <TextInput
                                variant={props.variant}
                                value={props.databaseName}
                                setValue={props.setDatabaseName}
                            />
                        </Label>
                    )}
                    {typeof props.queryName === "string" && typeof props.setQueryName === "function" && (
                        <Label label="Query">
                            <TextInput variant={props.variant} value={props.queryName} setValue={props.setQueryName} />
                        </Label>
                    )}
                </Options>
            )}
            <Options>
                {Object.keys(variables).map((variable) => {
                    return (
                        <Label label={variable} key={variable}>
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
                            />
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
