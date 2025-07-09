"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomStrategy = void 0;
const util_1 = require("../util");
class RandomStrategy extends util_1.Strategy {
    getDirection(environment) {
        const index = Math.floor(4 * Math.random());
        return ["U", "D", "L", "R"][index];
    }
}
exports.RandomStrategy = RandomStrategy;
