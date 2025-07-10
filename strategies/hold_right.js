"use strict";

import {HoldWallStrategy} from "./hold_wall.js";

export class HoldRightStrategy extends HoldWallStrategy {
    getNecessaryDirection() {
        switch (super.getPreviousDirection()) {
            case "U": return "R";
            case "R": return "D";
            case "L": return "U";
            case "D": return "L";
        }
    }
}
