import { BlockCallData } from "../call_data";
import { ExecutionContext } from "../execution_context";
import { BlockFrame } from "../frame";
import { InstructionSequence } from "../instruction_sequence";
import { RValue, Class, ProcClass, NativeMethod, Callable } from "../runtime";
import { Binding } from "./binding";

export abstract class Proc {
    public binding: Binding;

    static from_native_fn(context: ExecutionContext, method: NativeMethod): RValue {
        const binding = context.get_binding();
        return new RValue(ProcClass, new NativeProc(method, binding));
    }

    static from_iseq(context: ExecutionContext, iseq: InstructionSequence): RValue {
        const binding = context.get_binding();
        return new RValue(ProcClass, new InterpretedProc(iseq, binding));
    }

    abstract call(context: ExecutionContext, args: RValue[], call_data?: BlockCallData): RValue;
    abstract with_binding(new_binding: Binding): Proc;
}

export class NativeProc extends Proc {
    public callable: NativeMethod;
    public binding: Binding;

    constructor(callable: NativeMethod, binding: Binding) {
        super();

        this.callable = callable;
        this.binding = binding;
    }

    call(_context: ExecutionContext, args: RValue[], _call_data?: BlockCallData): RValue {
        return this.callable(this.binding.self, args);
    }

    with_binding(new_binding: Binding): NativeProc {
        return new NativeProc(this.callable, new_binding);
    }
}

export class InterpretedProc extends Proc {
    public iseq: InstructionSequence;
    public binding: Binding;

    constructor(iseq: InstructionSequence, binding: Binding) {
        super();

        this.iseq = iseq;
        this.binding = binding;
    }

    call(context: ExecutionContext, args: RValue[], call_data?: BlockCallData): RValue {
        call_data ||= BlockCallData.create(args.length);
        return context.run_block_frame(call_data, this.iseq, this.binding, args);
    }

    with_binding(new_binding: Binding): InterpretedProc {
        return new InterpretedProc(this.iseq, new_binding);
    }
}

export const defineProcBehaviorOn = (klass: Class) => {
    klass.define_native_method("call", (self: RValue, args: RValue[]): RValue => {
        const ec = ExecutionContext.current
        return self.get_data<Proc>().call(ec, args, (ec.frame as BlockFrame).call_data);
    });

    klass.alias_method("[]", "call");
};
