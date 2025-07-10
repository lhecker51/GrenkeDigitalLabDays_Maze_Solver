"use strict";

import {Strategy} from "../backend/utils.js";

export class HoldWallStrategy extends Strategy {
    constructor(name) {
        super(name);
        this.previousDirection = "U";
    }

    calculateDirection(environment) {
        for (let direction of this.getPreferredNextDirections(this.previousDirection)) {
            if (this.checkDirection(environment, direction)) {
                this.previousDirection = direction;
                return direction;
            }
        }
    }

    getPreferredNextDirections(direction) {}  // override in subclasses
}
