// Create our lexer 
// Lexer is a function that takes a string and returns an array of tokens
// tokens are objects that have a type and a value
export enum TokenType {
    Null,
    Number,
    Identifier,
    Equals,
    OpenParen,
    CloseParen,
    BinaryOperator,
    Let,
    OEF,
}
const KEYWORDS: Record<string, TokenType> = {
    'let': TokenType.Let,
    null: TokenType.Null
}

export interface Token {
    value: string;
    type: TokenType;
}
function isSkippable(char: string): boolean {
    return char === ' ' || char === '\n' || char === '\t';
}

// Create function that creates tokens

function token(value = '', type: TokenType,): Token {
    return {
        type,
        value
    };
}

function isNumber(char: string): boolean {
    return !isNaN(parseInt(char));
}

function isLetter(char: string): boolean {
    return char.toLowerCase() != char.toUpperCase();
}

export function tokenize(input: string): Token[] {
    const tokens = new Array<Token>;
    const src = input.split('');

    while (src.length > 0) {
        if (src[0] === '(') {
            tokens.push(token(src.shift(), TokenType.OpenParen));
        }
        else if (src[0] === ')') {
            tokens.push(token(src.shift(), TokenType.CloseParen));
        }
        else if (src[0] === '+' || src[0] === '-' || src[0] === '*' || src[0] === '/' || src[0] === '%') {
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
        }
        else if (src[0] === '=') {
            tokens.push(token(src.shift(), TokenType.Equals));
        } else {

            if (isNumber(src[0])) {
                let num = '';
                while (src.length > 0 && isNumber(src[0])) {
                    num += src.shift();
                }
                tokens.push(token(num, TokenType.Number));
            }
            else if (isLetter(src[0])) {
                let id = '';
                while (src.length > 0 && isLetter(src[0])) {
                    id += src.shift();
                }
                // check if id is a keyword
                const reserved = KEYWORDS[id];

                if (typeof reserved == 'number') {
                    tokens.push(token(id, reserved));
                } else {
                    tokens.push(token(id, TokenType.Identifier));
                }
            } else if (isSkippable(src[0])) {
                src.shift(); // skip the current character
            } else {
                console.log(`Unexpected character ${src[0]}`);
                Deno.exit(1);
            }
        }
    }
    tokens.push({ type: TokenType.OEF, value: "EndOfFile" });
    return tokens;

}

// const input = await Deno.readTextFile('./test.txt');

// for (const token of tokenize(input)) {
//     console.log(token);
// }