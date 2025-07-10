"use strict";

import {HoldWallStrategy} from "./hold_wall.js";

export class HoldLeftStrategy extends HoldWallStrategy {
    getNecessaryDirection() {
        switch (super.getPreviousDirection()) {
            case "U": return "L";
            case "R": return "U";
            case "L": return "D";
            case "D": return "R";
        }
    }
}
