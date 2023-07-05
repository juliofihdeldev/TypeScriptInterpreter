import { RuntimeVal, NumberVal, MK_NULL } from "./value.ts";


import { Statement, NumericLiteral, BinaryExpr, Program, Identifier } from "../frontend/ast.ts";
import Environment from "./enviroment.ts";

function eval_program(program: Program, env: Environment): RuntimeVal {
    let lastEvaluated: RuntimeVal = MK_NULL()

    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }

    return lastEvaluated
}
function eval_numeric_expr(lhs: NumberVal, rhs: NumberVal, operator: string): NumberVal {
    let result: number;
    if (operator == "+") {
        result = lhs.value + rhs.value;
    }
    else if (operator == "-") {
        result = lhs.value - rhs.value;
    }
    else if (operator == "*") {
        result = lhs.value * rhs.value;
    }
    else if (operator == "/") {
        result = lhs.value / rhs.value;
    }
    else {
        result = lhs.value % rhs.value;
    }

    return { value: result, type: "number" };
}

function eval_binary_expression(binop: BinaryExpr, env: Environment): RuntimeVal {

    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);
    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_expr(lhs as NumberVal, rhs as NumberVal, binop.operator as string)
    }
    return MK_NULL()
}


function eval_identifier(identifier: Identifier, env: Environment): RuntimeVal {
    return env.lookupVar(identifier.symbol);
}

export function evaluate(astNode: Statement, env: Environment): RuntimeVal {
    switch (astNode.kind) {
        case "NumericLiteral":
            return {
                value: ((astNode as NumericLiteral).value),
                type: "number"
            } as NumberVal

        case "BinaryExpr":
            return eval_binary_expression(astNode as BinaryExpr, env);

        case "Program":
            return eval_program(astNode as Program, env)

        case "Identifier":
            return eval_identifier(astNode as Identifier, env)

        default:
            console.error("Error: this AstNode is not supported yet!")
            Deno.exit(0)
    }
}