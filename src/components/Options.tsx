import { PropsWithChildren } from "react";

export function Options(props: PropsWithChildren) {
    return <div className="sm:flex gap-4">{props.children}</div>;
}
