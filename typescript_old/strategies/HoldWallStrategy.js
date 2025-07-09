"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoldWallStrategy = void 0;
const util_1 = require("../util.js");
class HoldWallStrategy extends util_1.Strategy {
    constructor() {
        super(...arguments);
        this.previousDirection = "U";
    }
    getDirection(environment) {
        if (this.checkDirection(environment, this.getNecessaryDirection())) {
            this.previousDirection = this.getNecessaryDirection();
            return this.previousDirection;
        }
        else {
            this.previousDirection = this.getNecessaryDirection();
            return this.getDirection(environment);
        }
    }
    checkDirection(environment, direction) {
        return environment.get(direction) != 'X';
    }
    getPreviousDirection() {
        return this.previousDirection;
    }
}
exports.HoldWallStrategy = HoldWallStrategy;
