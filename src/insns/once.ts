import { BlockCallData } from "../call_data";
import { ExecutionContext, ExecutionResult } from "../execution_context";
import Instruction from "../instruction";
import { InstructionSequence } from "../instruction_sequence";

export default class Once extends Instruction {
    public iseq: InstructionSequence;
    public cache: number;
    private executed: boolean = false;

    constructor(iseq: InstructionSequence, cache: number) {
        super();

        this.iseq = iseq;
        this.cache = cache;
    }

    call(context: ExecutionContext): ExecutionResult {
        if (this.executed) return null;

        context.push(context.run_block_frame(BlockCallData.create(0), this.iseq, context.get_binding(), []));
        this.executed = true;

        return null;
    }

    length(): number {
        return 3;
    }

    pushes(): number {
        return 1;
    }
}
