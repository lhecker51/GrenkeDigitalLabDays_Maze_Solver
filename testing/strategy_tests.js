"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_js_1 = require("../generator/generator.js");
const solver_1 = require("../solver/solver");
const HoldRightStrategy_js_1 = require("../strategies/HoldRightStrategy.js");
class test {
    static test() {
        const labyrinth = generator_js_1.generator.generateDfs(11);
        const randomStrategy = new HoldRightStrategy_js_1.HoldRightStrategy();
        const path = solver_1.solver.solve(randomStrategy, labyrinth);
        console.log(path);
    }
}
test.test();
