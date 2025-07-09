import { Direction, Environment, Strategy } from "../util"

export class RandomStrategy extends Strategy {
    getDirection(environment: Environment): Direction {
        const index: number = Math.floor(4 * Math.random())
        return environment.keys[index]
    }
}