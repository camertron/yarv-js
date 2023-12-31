import { ArgumentError } from "../errors";
import { BreakError, ExecutionContext } from "../execution_context";
import { Module, Qnil, RValue, Runtime, Array, Qfalse, Qtrue } from "../runtime"
import { Object } from "./object";
import { Proc } from "./proc";

export const init = () => {
    Runtime.define_module("Enumerable", (mod: Module) => {
        mod.define_native_method("map", (self: RValue, _args: RValue[], block?: RValue): RValue => {
            if (block) {
                const results: RValue[] = [];
                const proc = block.get_data<Proc>();

                Object.send(self, "each", [], Proc.from_native_fn(ExecutionContext.current, (_self: RValue, args: RValue[]): RValue => {
                    results.push(proc.call(ExecutionContext.current, args));
                    return Qnil;
                }));

                return Array.new(results);
            } else {
                // @TODO: return an Enumerator
                return Qnil;
            }
        });

        mod.define_native_method("find", (self: RValue, _args: RValue[], block?: RValue): RValue => {
            if (block) {
                try {
                    const proc = block.get_data<Proc>();

                    Object.send(self, "each", [], Proc.from_native_fn(ExecutionContext.current, (_self: RValue, args: RValue[]): RValue => {
                        if (proc.call(ExecutionContext.current, args).is_truthy()) {
                            throw new BreakError(args[0]);
                        }

                        return Qnil;
                    }));

                    // no match found
                    return Qnil;
                } catch (e) {
                    if (e instanceof BreakError) {
                        // match found, return value
                        return e.value;
                    } else {
                        // an error occurred
                        throw e;
                    }
                }
            } else {
                // @TODO: return an Enumerator
                return Qnil;
            }
        });

        mod.define_native_method("any?", (self: RValue, _args: RValue[], block?: RValue): RValue => {
            try {
                const proc = block ? block.get_data<Proc>() : null;

                Object.send(self, "each", [], Proc.from_native_fn(ExecutionContext.current, (_self: RValue, args: RValue[]): RValue => {
                    const item = proc ? proc.call(ExecutionContext.current, args) : args[0];

                    if (item.is_truthy()) {
                        throw new BreakError(Qtrue);
                    }

                    return Qnil;
                }));

                // no match found
                return Qfalse;
            } catch (e) {
                if (e instanceof BreakError) {
                    // match found, return value
                    return e.value;
                } else {
                    // an error occurred
                    throw e;
                }
            }
        });

        mod.define_native_method("partition", (self: RValue, _args: RValue[], block?: RValue): RValue => {
            if (block) {
                const proc = block.get_data<Proc>();
                const truthy_array: RValue[] = [];
                const falsey_array: RValue[] = [];

                Object.send(self, "each", [], Proc.from_native_fn(ExecutionContext.current, (_self: RValue, args: RValue[]): RValue => {
                    const key = proc.call(ExecutionContext.current, args);

                    if (key.is_truthy()) {
                        truthy_array.push(args[0]);
                    } else {
                        falsey_array.push(args[0]);
                    }

                    return Qnil;
                }));

                return Array.new([Array.new(truthy_array), Array.new(falsey_array)]);
            } else {
                // @TODO: return an Enumerator
                return Qnil;
            }
        });

        mod.define_native_method("inject", (self: RValue, args: RValue[], block?: RValue): RValue => {
            let initial_operand: RValue | null = null;
            let symbol: RValue | null = null;
            let proc: Proc | null = null;

            if (block) {
                proc = block.get_data<Proc>();

                if (args.length > 0) {
                    initial_operand = args[0];
                }
            } else {
                if (args.length === 1) {
                    symbol = args[0]
                } else if (args.length > 1) {
                    initial_operand = args[0];
                    symbol = args[1];
                } else {
                    return Qnil;
                }
            }

            let memo: RValue | null = initial_operand;

            Object.send(self, "each", [], Proc.from_native_fn(ExecutionContext.current, (_self: RValue, args: RValue[]): RValue => {
                if (memo) {
                    if (proc) {
                        memo = proc.call(ExecutionContext.current, [memo, args[0]]);
                    } else {
                        memo = Object.send(memo, symbol!.get_data<string>(), [args[0]]);
                    }
                } else {
                    memo = args[0];
                }

                return Qnil;
            }));

            return memo || Qnil;
        });
    });
};
