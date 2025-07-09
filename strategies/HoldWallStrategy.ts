import { Direction, Environment, Strategy } from "../util";

export abstract class HoldWallStrategy extends Strategy {
    previousDirection: Direction = "U"

    getDirection(environment: Environment): Direction {
        if (this.checkDirection(environment, this.getNecessaryDirection())) {
            this.previousDirection = this.getNecessaryDirection()
            return this.previousDirection
        } else {
            this.previousDirection = this.getNecessaryDirection()
            return this.getDirection(environment)
        }
    }

    checkDirection(environment: Environment, direction: Direction): boolean {
        return environment.get(direction) != 'X'
    }

    getPreviousDirection(): Direction {
        return this.previousDirection
    }

    abstract getNecessaryDirection(): Direction



}