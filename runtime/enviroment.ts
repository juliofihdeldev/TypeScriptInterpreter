import { RuntimeVal } from "./value.ts";

export default class Environment {

    private parent?: Environment;
    private variables: Map<string, RuntimeVal>;

    constructor(parentENV?: Environment) {
        this.parent = parentENV;
        this.variables = new Map();
    }

    public declareVariable(varname: string, value: RuntimeVal) {

        if (this.variables.has(varname)) {
            throw new Error(`Variable ${varname} already declared`)
        }
        this.variables.set(varname, value);
    }

    public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
        const env = this.resolve(varname);
        env.variables.set(varname, value);
        return value;
    }


    public lookupVar(varname: string): RuntimeVal {
        const env = this.resolve(varname);
        return env.variables.get(varname) as RuntimeVal;
    }

    public resolve(varname: string): Environment {
        if (this.variables.has(varname)) {
            return this;
        }
        if (this.parent) {
            return this.parent.resolve(varname);
        }
        throw new Error(`Variable ${varname} not declared`);
    }
}