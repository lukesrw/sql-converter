import { Dispatch, SetStateAction } from "react";
import { Label } from "../Label";
import { Select } from "../Inputs/Select";
import { INPUT_VARIANTS } from "../Inputs/Variants";

export interface NPMLibraryProps {
    variant: keyof typeof INPUT_VARIANTS;
    library: string;
    setLibrary: Dispatch<SetStateAction<string>>;
}

export function NPMLibrary(props: NPMLibraryProps) {
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
