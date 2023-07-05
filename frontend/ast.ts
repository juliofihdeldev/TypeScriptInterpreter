// deno-lint-ignore-file

export type NodeType = 'Program'
    | 'NumericLiteral'
    | 'BinaryExpr'
    | 'Identifier'


// rules statement is not expression
export interface Statement {
    kind: NodeType;
}

export interface Program extends Statement {
    kind: 'Program';
    body: Statement[];
}

export interface Expr extends Statement { }

export interface BinaryExpr extends Expr {
    kind: 'BinaryExpr';
    operator: string;
    left: Expr;
    right: Expr;
}

export interface Identifier extends Expr {
    kind: 'Identifier';
    symbol: string;
}

export interface NumericLiteral extends Expr {
    kind: 'NumericLiteral';
    value: number;
}

