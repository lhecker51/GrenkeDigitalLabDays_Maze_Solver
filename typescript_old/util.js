"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = exports.Position = void 0;
class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
exports.Position = Position;
class Strategy {
    getNextMove(environment) {
        for (let [direction, square] of environment) {
            if (square === 'E') {
                return direction;
            }
        }
        return this.getDirection(environment);
    }
}
exports.Strategy = Strategy;
