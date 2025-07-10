"use strict";

import {HoldWallStrategy} from "./hold_wall.js";

export class HoldRightStrategy extends HoldWallStrategy {
    constructor() {
        super("Hold Right");
    }

    getPreferredNextDirections(direction) {
        switch (direction) {
            case "U": return ["R", "U", "L", "D"]
            case "R": return ["D", "R", "U", "L"]
            case "L": return ["U", "L", "D", "R"]
            case "D": return ["L", "D", "R", "U"]
        }
    }
}
