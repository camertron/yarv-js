import { MethodCallData } from "../call_data";
import { ExecutionContext, ExecutionResult } from "../execution_context";
import Instruction from "../instruction";
import { IntegerClass, Qfalse, Qtrue, StringClass, SymbolClass } from "../runtime";
import { Object } from "../runtime/object"

export default class OptEq extends Instruction {
    public call_data: MethodCallData;

    constructor(call_data: MethodCallData) {
        super();
        this.call_data = call_data;
    }

    call(context: ExecutionContext): ExecutionResult {
        const argc = this.call_data.argc + 1;
        const [receiver, ...args] = context.popn(argc);

        // This is supposed to be equivalent to MRI's "fast path" for comparing ints/floats.
        // @TODO: do the same thing for floats
        const receiver_class = receiver.klass;
        const arg0_class = args[0].klass;

        if ((receiver_class == IntegerClass && arg0_class == IntegerClass) ||
            (receiver_class == StringClass && arg0_class == StringClass) ||
            (receiver_class == SymbolClass && arg0_class == SymbolClass)) {
            if (receiver.get_data<number | string>() == args[0].get_data<number | string>()) {
                context.push(Qtrue);
            } else {
                context.push(Qfalse);
            }
        } else {
            const result = Object.send(receiver, this.call_data, args);
            context.push(result);
        }

        return null;
    }

    pops(): number {
        return this.call_data.argc + 1;
    }

    pushes(): number {
        return 1;
    }

    length(): number {
        return this.call_data.argc + 1;
    }
}
