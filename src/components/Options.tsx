import { PropsWithChildren } from "react";

export function Options(props: Readonly<PropsWithChildren>) {
    return <div className="sm:flex gap-4">{props.children}</div>;
}
