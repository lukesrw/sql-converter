import { columnCombine } from "./columnCombine";

export interface SingleQuoteString {
    type: "single_quote_string";
    value: string;
}

export interface ColumnRef {
    type: "column_ref";
    table: string;
    column: string;
}

type Branch = Branches | ColumnRef | SingleQuoteString;

export interface Branches {
    type: "binary_expr";
    left: Branch;
    operator: string;
    right: Branch;
}

export function branchConstruct(branch: Branch, depth: number) {
    switch (branch.type) {
        case "binary_expr":
            return branchJoin(branch, depth);

        case "column_ref":
            return columnCombine(branch.table, branch.column);

        case "single_quote_string":
            return `'${branch.value}'`;
    }
}

export function branchJoin(object: Branches, depth: number = 0): string {
    switch (object.operator) {
        case "AND":
            return `${branchConstruct(object.left, depth + 1)} ${object.operator}
    ${"\t".repeat(depth) + branchConstruct(object.right, depth + 1)}`;

        default:
            return `${branchConstruct(object.left, depth + 1)} ${object.operator} ${branchConstruct(
                object.right,
                depth + 1
            )}`;
    }
}
