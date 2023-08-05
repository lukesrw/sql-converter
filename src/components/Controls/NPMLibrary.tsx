import { Dispatch, SetStateAction } from "react";
import { Label } from "../Label";
import { Select } from "../Select";

export interface NPMLibraryProps {
    library: string;
    setLibrary: Dispatch<SetStateAction<string>>;
}

export function NPMLibrary(props: NPMLibraryProps) {
    return (
        <Label label="NPM Library">
            <Select
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
