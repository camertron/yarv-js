import { ExecutionContext, ExecutionResult } from "../execution_context";
import Instruction from "../instruction";

export default class SetInstanceVariable extends Instruction {
    public name: string;
    public cache: number;

    constructor(name: string, cache: number) {
        super();

        this.name = name;
        this.cache = cache;
    }

    call(context: ExecutionContext): ExecutionResult {
        const value = context.pop()!;
        context.frame!.self.iv_set(this.name, value);
        return null;
    }

    reads(): number {
        return 1;
    }

    writes(): number {
        return 0;
    }
}
