import Parser from "./frontend/parser.ts";
import Environment from "./runtime/enviroment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_BOOL, MK_NULL, MK_NUMBER } from "./runtime/value.ts";
repl()

function repl() {
    const env = new Environment()

    env.declareVariable('x', MK_NUMBER(200))
    env.declareVariable('true', MK_BOOL(true))
    env.declareVariable('false', MK_BOOL(false))
    env.declareVariable('null', MK_NULL())
    const parser = new Parser()
    console.log('\nRepl v0.1 >>')
    while (true) {
        const input = prompt('>> ');

        if (!input || input.includes('exit')) {
            Deno.exit(1)
        }
        const program = parser.productAST(input);

        const result = evaluate(program, env);
        console.log(result)
    }
}