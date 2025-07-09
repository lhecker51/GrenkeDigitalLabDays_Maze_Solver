import { generatorWrapper } from "../generator/wrapper.js"
import { Path, Labyrinth, Strategy } from "../typescript_old/util"
import { RandomStrategy } from "../typescript_old/strategies/random"
import { solver } from "../typescript_old/solver/solver"

class test {
    static test() {
        const labyrinth: Labyrinth = <Labyrinth>generatorWrapper.generateDFSLabyrinth(11)
        const randomStrategy: Strategy = new RandomStrategy()
        const path: Path = solver.solve(randomStrategy, labyrinth)
        console.log(path)
    }
}

test.test()
