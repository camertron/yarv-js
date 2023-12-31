import { Class, Float, FloatClass, IntegerClass, NumericClass, Qfalse, Qnil, Qtrue, RValue, Runtime, String } from "../runtime";
import { obj_id_hash } from "../util/object_id";

export class Integer {
    static INT2FIX0: RValue;
    static INT2FIX1: RValue;
    static INT2FIXN1: RValue;

    static new(value: number): RValue {
        return new RValue(IntegerClass, value);
    }

    static get(value: number): RValue {
        if (value === 0) {
            return Integer.INT2FIX0;
        } else if (value === 1) {
            return Integer.INT2FIX1;
        } else if (value === -1) {
            return Integer.INT2FIXN1;
        } else {
            return Integer.new(value);
        }
    }
}

export const defineIntegerBehaviorOn = (klass: Class) => {
    Integer.INT2FIX0 = Integer.new(0);
    Integer.INT2FIX1 = Integer.new(1);
    Integer.INT2FIXN1 = Integer.new(-1);

    klass.define_native_method("inspect", (self: RValue): RValue => {
        return String.new(self.get_data<number>().toString());
    });

    klass.define_native_method("to_s", (self: RValue): RValue => {
        return String.new(self.get_data<number>().toString());
    });

    klass.define_native_method("hash", (self: RValue): RValue => {
        return Integer.get(obj_id_hash(self.get_data<number>()));
    });

    // Normally multiplication of two ints/floats is handled by the opt_mult instruction. This
    // definition is here for the sake of completeness.
    klass.define_native_method("*", (self: RValue, args: RValue[]): RValue => {
        const multiplier = args[0];
        Runtime.assert_type(multiplier, NumericClass);

        const result = self.get_data<number>() * multiplier.get_data<number>();

        if (multiplier.klass === FloatClass) {
            return Float.new(result);
        } else {
            return Integer.get(Math.floor(result));
        }
    });

    klass.define_native_method("/", (self: RValue, args: RValue[]): RValue => {
        const divisor = args[0];
        Runtime.assert_type(divisor, NumericClass);

        const result = self.get_data<number>() / divisor.get_data<number>();

        if (divisor.klass === FloatClass) {
            return Float.new(result);
        } else {
            return Integer.get(Math.floor(result));
        }
    });

    klass.define_native_method("+", (self: RValue, args: RValue[]): RValue => {
        const term = args[0];
        Runtime.assert_type(term, NumericClass);

        const result = self.get_data<number>() + term.get_data<number>();

        if (term.klass === FloatClass) {
            return Float.new(result);
        } else {
            return Integer.get(Math.floor(result));
        }
    });

    klass.define_native_method("-", (self: RValue, args: RValue[]): RValue => {
        const term = args[0];
        Runtime.assert_type(term, NumericClass);

        const result = self.get_data<number>() - term.get_data<number>();

        if (term.klass === FloatClass) {
            return Float.new(result);
        } else {
            return Integer.get(Math.floor(result));
        }
    });

    klass.define_native_method("%", (self: RValue, args: RValue[]): RValue => {
        const divisor = args[0];
        Runtime.assert_type(divisor, NumericClass);

        const result = self.get_data<number>() % divisor.get_data<number>();

        if (divisor.klass === FloatClass) {
            return Float.new(result);
        } else {
            return Integer.get(result);
        }
    });

    klass.define_native_method("<=>", (self: RValue, args: RValue[]): RValue => {
        const other = args[0];

        if (other.klass === IntegerClass || other.klass === FloatClass) {
            const other_num = other.get_data<number>();
            const num = self.get_data<number>();

            if (num < other_num) {
                return Integer.get(-1);
            } else if (num > other_num) {
                return Integer.get(1);
            } else {
                return Integer.get(0);
            }
        }

        return Qnil;
    });

    klass.define_native_method("to_i", (self: RValue): RValue => {
        return self;
    });

    klass.define_native_method("even?", (self: RValue): RValue => {
        return self.get_data<number>() % 2 == 0 ? Qtrue : Qfalse;
    });

    klass.define_native_method("odd?", (self: RValue): RValue => {
        return self.get_data<number>() % 2 == 1 ? Qtrue : Qfalse;
    });

    klass.define_native_method("size", (self: RValue): RValue => {
        // all numbers in js are 64-bit floats
        return Integer.get(8);
    });
};
