import { ExecutionContext, ExecutionResult } from "../execution_context";
import Instruction from "../instruction";
import { Class, StringClass, String } from "../runtime";
import { Object } from "../runtime/object";

export default class AnyToString extends Instruction {
    call(context: ExecutionContext): ExecutionResult {
        const value = context.pop()!;
        const original = context.pop()!;

        if (value.klass == StringClass) {
            context.push(value);
        } else {
            const class_name = original.klass.get_data<Class>().name;
            const name = class_name ? class_name : "Class";
            context.push(String.new(`#<${name}:${Object.object_id_to_str(original.object_id)}>`));
        }

        return null;
    }

    pops(): number {
        return 2;
    }

    pushes(): number {
        return 1;
    }
}
