import { ExecutionContext, ExecutionResult } from "../execution_context";
import Instruction from "../instruction";
import { InstructionSequence } from "../instruction_sequence";
import { Module } from "../runtime";

export default class DefineSMethod extends Instruction {
    public name: string;
    public iseq: InstructionSequence;

    constructor(name: string, iseq: InstructionSequence) {
        super();
        this.name = name;
        this.iseq = iseq;
    }

    call(context: ExecutionContext): ExecutionResult {
        context.define_method(
            context.frame!.self.get_data<Module>().get_singleton_class(),
            this.name,
            this.iseq
        );
        return null;
    }

    length(): number {
        return 3;
    }
}
