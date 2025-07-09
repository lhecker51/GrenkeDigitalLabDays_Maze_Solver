"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoldLeftStrategy = void 0;
const HoldWallStrategy_1 = require("./HoldWallStrategy.js");
class HoldLeftStrategy extends HoldWallStrategy_1.HoldWallStrategy {
    getNecessaryDirection() {
        switch (super.getPreviousDirection()) {
            case "U": return "L";
            case "R": return "U";
            case "L": return "D";
            case "D": return "R";
        }
    }
}
exports.HoldLeftStrategy = HoldLeftStrategy;
