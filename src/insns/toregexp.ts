import { ExecutionContext, ExecutionResult } from "../execution_context";
import Instruction from "../instruction";
import { Regexp } from "../runtime/regexp";

export default class ToRegexp extends Instruction {
    public options: string;
    public size: number;

    constructor(options: string, size: number) {
        super();

        this.options = options;
        this.size = size;
    }

    call(context: ExecutionContext): ExecutionResult {
        context.push(Regexp.new(context.popn(this.size).join(""), this.options));
        return null;
    }

    length(): number {
        return 3;
    }

    pushes(): number {
        return 1;
    }

    pops(): number {
        return this.size;
    }
}
