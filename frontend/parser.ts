import { BinaryExpr, Expr, Identifier, NumericLiteral, Program, Statement } from "./ast.ts";

import { Token, TokenType, tokenize } from "./lexer.ts";

export default class Parser {

    private tokens: Token[] = [];

    private not_eof(): boolean {
        return this.tokens[0].type !== TokenType.OEF
    }

    private at() {
        return this.tokens[0] as Token
    }
    private eat() {
        const previous = this.tokens.shift() as Token
        return previous
    }

    private expect(type: TokenType, err: string) {

        const prev = this.tokens.shift() as Token;
        if (!prev || prev.type !== type) {
            console.error("parser Error :\n", err, prev, " Expecting :", type)
            Deno.exit(1);
        }
        return prev;
    }

    public productAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode)
        const program: Program = {
            kind: 'Program',
            body: []
        }

        while (this.not_eof()) {
            program.body.push(this.parse_statement())
        }

        return program
    }

    private parse_statement = (): Statement => {
        return this.parse_expression()
    }

    private parse_expression = (): Expr => {
        return this.parse_additive_expr()
    }

    private parse_additive_expr = (): Expr => {

        let left = this.parse_multiplicative_expr();

        while (this.at().value == '+' || this.at().value == '-') {
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();

            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator
            } as BinaryExpr

        }
        return left
    }

    private parse_multiplicative_expr = (): Expr => {

        let left = this.parse_primary_expr();

        while (this.at().value == '*' || this.at().value == '/' || this.at().value == '%') {
            const operator = this.eat().value;
            const right = this.parse_primary_expr();

            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator
            } as BinaryExpr

        }
        return left
    }


    private parse_primary_expr = (): Expr => {
        const tk = this.at().type;
        switch (tk) {
            case TokenType.Identifier:
                return { kind: 'Identifier', symbol: this.eat().value } as Identifier
            case TokenType.Number:
                return { kind: 'NumericLiteral', value: parseFloat(this.eat().value) } as NumericLiteral
            case TokenType.OpenParen: {
                this.eat();
                const value = this.parse_expression();
                this.expect(TokenType.CloseParen,
                    "Expecting token found inside parenthesis expect closing parenthesis ")
                return value;
            }
            default:
                console.error('unexpected token found during parsing', this.at())
                Deno.exit(1)
        }
    }
}
