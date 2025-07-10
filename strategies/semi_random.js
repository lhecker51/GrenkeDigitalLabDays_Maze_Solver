"use strict";

import {Strategy} from "../backend/utils.js";

export class SemiRandomStrategy extends Strategy {
    constructor() {
        super("Semi-Random");
        this.previousDirection = "does not exist"
    }

    calculateDirection(environment) {
        const possibleDirections = new Map()
        for (let direction of ["U", "D", "L", "R"]) {
            possibleDirections.set(direction, this.checkDirection(environment, direction))
        }

        let trueDirections = this.getTrueDirections(possibleDirections)

        if (trueDirections.length === 1) {
            const chosenDirection = trueDirections[0]
            this.previousDirection = chosenDirection
            return chosenDirection
        }

        possibleDirections.set(this.getInverseDirection(this.previousDirection), false)

        trueDirections = this.getTrueDirections(possibleDirections)

        const index = Math.floor(trueDirections.length * Math.random())
        const chosenDirection = trueDirections[index]
        this.previousDirection = chosenDirection
        return chosenDirection
    }

    getTrueDirections(possibleDirections) {
        let trueDirections = []
        for (let direction of ["U", "D", "L", "R"]) {
            if (possibleDirections.get(direction) === true) {
                trueDirections.push(direction)
            }
        }
        return trueDirections
    }

    getInverseDirection(direction) {
        switch (direction) {
            case "U": return "D"
            case "D": return "U"
            case "L": return "R"
            case "R": return "L"
        }
    }
}
