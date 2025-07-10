"use strict";

import { Strategy } from "../backend/utils.js";

export class RandomStrategy extends Strategy {
    constructor() {
        super("Random");
    }

    calculateDirection(environment) {
        let direction = this.getRandomDirection()
        while (!this.checkDirection(environment, direction)) {
            direction = this.getRandomDirection()
        }
        return direction
    }

    getRandomDirection() {
        const index = Math.floor(4 * Math.random())
        return ["U", "D", "L", "R"][index]
    }
}
