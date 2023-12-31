import { argv } from "process";
import * as YARV from "../src/yarv";
import { ExecutionContext, Runtime, vmfs, Array, String } from "../src/yarv";
import path from "path";
import fs from "fs";
import { Dir } from "../src/runtime/dir";

await YARV.init();

let code: string | null = null;
let code_path: string = "<code>";
let script_argv: string[] = [];

ExecutionContext.current.push_onto_load_path(process.env.PWD!);
Dir.setwd(process.env.PWD!);

for (let i = 0; i < argv.length; i ++) {
    if (argv[i] == "-I") {
        const p = path.resolve(argv[i + 1])
        ExecutionContext.current.push_onto_load_path(p);
        i ++;
    } else if (argv[i].startsWith("-I")) {
        const p = path.resolve(argv[i].substring(2));
        ExecutionContext.current.push_onto_load_path(p);
    } else if (argv[i] == '-e') {
        code = argv[i + 1];
        i ++;
    } else if (argv[i] == "-r") {
        Runtime.require(argv[i + 1]);
        i ++;
    } else if (argv[i] == "-C") {
        let dir = argv[i + 1];

        if (vmfs.is_relative(dir)) {
            dir = vmfs.join_paths(Dir.getwd(), dir);
        }

        Dir.setwd(dir);
        ExecutionContext.current.push_onto_load_path(dir);

        i ++;
    } else if (argv[i] === "--") {
        script_argv = argv.splice(i + 1);
        argv.pop(); // remove "--"
        break;
    }
}

Runtime.constants["ARGV"] = Array.new(
    script_argv.map((arg) => {
        return String.new(arg);
    })
);

if (!code) {
    code_path = argv[argv.length - 1];
    ExecutionContext.current.globals["$0"] = String.new(code_path);

    if (fs.existsSync(code_path)) {
        code = fs.readFileSync(code_path).toString('utf8');
    }
}

if (!code) {
    process.exit(0);
}

await YARV.evaluate(code, code_path);
await YARV.deinit();
