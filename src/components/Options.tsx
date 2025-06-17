import { PropsWithChildren } from "react";

export function Options(props: Readonly<PropsWithChildren>) {
    return <div className="sm:flex gap-2">{props.children}</div>;
}
