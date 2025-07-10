"use strict";

import {generator} from "./generator.js";
import {solver} from "./solver.js";
import {LabyrinthCategory} from "./utils.js";
import {RandomStrategy} from "../strategies/random.js";
import {SemiRandomStrategy} from "../strategies/semi_random.js";
import {HoldLeftStrategy} from "../strategies/hold_left.js";
import {HoldRightStrategy} from "../strategies/hold_right.js";
import {DfsStrategy} from "../strategies/directed_dfs.js";

export class ranker {
    static labyrinthCount = 20

    static create_ranking(size) {
        const labyrinthCategories = [
            this.getLabyrinthCategory("DFS", () => generator.generateDfs(size)),
            this.getLabyrinthCategory("Prim", () => generator.generatePrim(size)),
            this.getLabyrinthCategory("Kruskal", () => generator.generateKruskal(size)),
            this.getLabyrinthCategory("Wilson", () => generator.generateWilson(size)),
        ]

        const strategies = [
            new RandomStrategy(),
            new SemiRandomStrategy(),
            new HoldLeftStrategy(),
            new HoldRightStrategy(),
            new DfsStrategy()
        ]

        const firstRow = [""]
        for (let labyrinthCategory of labyrinthCategories) {
            firstRow.push(labyrinthCategory.name)
        }
        const rankingTable = [firstRow]

        for (let strategy of strategies) {
            let row = [strategy.name]
            for (let labyrinthCategory of labyrinthCategories) {
                row.push(this.getAverageSteps(labyrinthCategory, strategy))
            }
            rankingTable.push(row)
        }

        return rankingTable
    }

    static getLabyrinthCategory(name, generatingFunction) {
        const labyrinths = []
        for (let i = 0; i < this.labyrinthCount; i++) {
            labyrinths.push(generatingFunction())
        }

        return new LabyrinthCategory(name, labyrinths)
    }

    static getAverageSteps(labyrinthCategory, strategy) {
        const steps = []
        for (let labyrinth of labyrinthCategory.labyrinths) {
            steps.push(solver.solve(labyrinth, strategy).length)
        }

        let totalCount = 0
        for (let step of steps) {
            totalCount += step
        }

        return totalCount / steps.length
    }
}
