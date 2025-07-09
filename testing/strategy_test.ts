import { generatorWrapper } from "../generator/wrapper.js"
import { Path, Labyrinth, Strategy } from "../util"
import { RandomStrategy } from "../strategies/random"
import { solver } from "../solver/solver"

class test {
    static test() {
        const labyrinth: Labyrinth = <Labyrinth>generatorWrapper.generateDFSLabyrinth(11)
        const randomStrategy: Strategy = new RandomStrategy()
        const path: Path = solver.solve(randomStrategy, labyrinth)
        console.log(path)
    }
}

test.test()
