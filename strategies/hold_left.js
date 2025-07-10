"use strict";

import {HoldWallStrategy} from "./hold_wall.js";

export class HoldLeftStrategy extends HoldWallStrategy {
    constructor() {
        super("Hold Left");
    }

    getPreferredNextDirections(direction) {
        switch (direction) {
            case "U": return ["L", "U", "R", "D"]
            case "R": return ["U", "R", "D", "L"]
            case "L": return ["D", "L", "U", "R"]
            case "D": return ["R", "D", "L", "U"]
        }
    }
}
