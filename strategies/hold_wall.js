"use strict";

import {Strategy} from "../backend/utils.js";

export class HoldWallStrategy extends Strategy {
    constructor() {
        super();
        this.previousDirection = "U";
    }

    calculateDirection(environment) {  // TODO fix, doesn't work
        if (this.checkDirection(environment, this.getNecessaryDirection())) {
            this.previousDirection = this.getNecessaryDirection();
            return this.previousDirection;
        } else {
            this.previousDirection = this.getNecessaryDirection();
            return this.calculateDirection(environment);
        }
    }

    getPreviousDirection() {
        return this.previousDirection;
    }
}
