import { solver } from "../solver/solver"
import { RandomStrategy } from "../strategies/random"
import { generator } from "../generator/generator"

function test() {
    strategy = new RandomStrategy()
    labyrinth = generator.generateDfs()
    console.log(solver.solve(strategy, labyrinth))

}

test()