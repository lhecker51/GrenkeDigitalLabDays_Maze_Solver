import { Direction, Environment, Strategy } from "../util"

class RandomStrategy extends Strategy {
    getDirection(environment: Environment): Direction {
        return environment.keys[
            Math.floor(4 * Math.random())
        ]
    }
}