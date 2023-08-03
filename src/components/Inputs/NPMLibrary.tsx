import { Dispatch, SetStateAction } from "react";
import { Input } from "../Input";
import { Select } from "../Select";

export interface NPMLibraryProps {
    library: string;
    setLibrary: Dispatch<SetStateAction<string>>;
}

export function NPMLibrary(props: NPMLibraryProps) {
    return (
        <Input label="NPM Library">
            <Select
                options={{
                    mysql: "mysql2",
                    sqlite: "better-sqlite3"
                }}
                setValue={props.setLibrary}
                value={props.library}
            ></Select>
        </Input>
    );
}
