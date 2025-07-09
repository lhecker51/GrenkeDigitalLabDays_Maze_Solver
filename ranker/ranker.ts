

import { generator } from "../generator/generator.js"
import { Path, Labyrinth, Strategy } from "../util"
import { RandomStrategy } from "../strategies/random"
import { HoldLeftStrategy } from "../strategies/HoldLeftStrategy.js"
import { HoldRightStrategy } from "../strategies/HoldRightStrategy.js"
import { solver } from "../solver/solver"

class ranker {
    static create_ranking() {
        const labyrinths: Labyrinth[] = []
        const strategies: Strategy[] = []

        for (let i: number = 0; i < 10; i++) {
            labyrinths.push(<Labyrinth>generator.generateDfs(11))
        }

        strategies.push(new RandomStrategy())
        strategies.push(new HoldLeftStrategy())
        strategies.push(new HoldRightStrategy())

        for (let labyrinth of labyrinths) {
            for (let strategy of strategies) {
                console.log(solver.solve(strategy, labyrinth))  // TODO change this
            }
        }
    }
}

ranker.create_ranking()
