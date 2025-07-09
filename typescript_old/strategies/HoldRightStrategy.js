"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoldRightStrategy = void 0;
const HoldWallStrategy_1 = require("./HoldWallStrategy.js");
class HoldRightStrategy extends HoldWallStrategy_1.HoldWallStrategy {
    getNecessaryDirection() {
        //This is a test, I don't know what's going on exactly lol
        switch (super.getPreviousDirection()) {
            case "U": return "R";
            case "R": return "D";
            case "L": return "U";
            case "D": return "L";
        }
    }
}
exports.HoldRightStrategy = HoldRightStrategy;
