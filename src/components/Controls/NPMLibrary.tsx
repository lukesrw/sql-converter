import { Dispatch, SetStateAction } from "react";
import { Select } from "../Inputs/Select";
import { INPUT_VARIANTS } from "../Inputs/Variants";
import { Label } from "../Label";

export namespace NPMLibrary {
    export type Props = {
        variant: keyof typeof INPUT_VARIANTS;
        library: string;
        setLibrary: Dispatch<SetStateAction<string>>;
    };
}

export function NPMLibrary(props: Readonly<NPMLibrary.Props>) {
    return (
        <Label label="NPM Library">
            <Select
                variant={props.variant}
                options={{
                    mysql: "mysql2",
                    sqlite: "better-sqlite3"
                }}
                setValue={props.setLibrary}
                value={props.library}
            ></Select>
        </Label>
    );
}
