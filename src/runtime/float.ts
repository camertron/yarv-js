import { Class, NumericClass, RValue, Runtime, String, Float } from "../runtime";

export const defineFloatBehaviorOn = (klass: Class) => {
    klass.define_native_method("inspect", (self: RValue): RValue => {
        return String.new(self.get_data<number>().toString());
    });

    klass.define_native_method("/", (self: RValue, args: RValue[]): RValue => {
        Runtime.assert_type(args[0], NumericClass);
        return Float.new(self.get_data<number>() / args[0].get_data<number>());
    });

    klass.define_native_method("-", (self: RValue, args: RValue[]): RValue => {
        Runtime.assert_type(args[0], NumericClass);
        return Float.new(self.get_data<number>() - args[0].get_data<number>());
    });
};
