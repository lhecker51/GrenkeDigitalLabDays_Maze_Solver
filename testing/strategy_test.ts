import {generator} from "../generator/generator"
import { Path, Labyrinth, Strategy } from "../util"
import {RandomStrategy} from "../strategies/random"
import {solver} from "../solver/solver"

class test {
    static test() {
        const labyrinth: Labyrinth = <Labyrinth> generator.generateDfs()
        const randomStrategy: Strategy = new RandomStrategy()
        const path: Path = solver.solve(randomStrategy, labyrinth)
        console.log(path)
    }
}

test.test()