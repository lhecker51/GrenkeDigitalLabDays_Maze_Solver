"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrapper_js_1 = require("../../generator/wrapper.js");
const random_1 = require("../strategies/random.js");
const HoldLeftStrategy_js_1 = require("../strategies/HoldLeftStrategy.js");
const HoldRightStrategy_js_1 = require("../strategies/HoldRightStrategy.js");
const solver_1 = require("../solver/solver.js");
class ranker {
    static create_ranking() {
        const labyrinths = [];
        const strategies = [];
        for (let i = 0; i < 10; i++) {
            labyrinths.push(wrapper_js_1.generatorWrapper.generateDFSLabyrinth(11));
        }
        strategies.push(new random_1.RandomStrategy());
        strategies.push(new HoldLeftStrategy_js_1.HoldLeftStrategy());
        strategies.push(new HoldRightStrategy_js_1.HoldRightStrategy());
        for (let labyrinth of labyrinths) {
            for (let strategy of strategies) {
                console.log(solver_1.solver.solve(strategy, labyrinth)); // TODO change this
            }
        }
    }
}
ranker.create_ranking();
