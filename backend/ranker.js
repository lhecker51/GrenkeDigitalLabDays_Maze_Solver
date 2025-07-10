"use strict";

import {generator} from "./generator.js";
import {solver} from "./solver.js";
import {LabyrinthCategory} from "./utils.js";
import {RandomStrategy} from "../strategies/random.js";
import {HoldLeftStrategy} from "../strategies/hold_left.js";
import {HoldRightStrategy} from "../strategies/hold_right.js";
import {DfsStrategy} from "../strategies/directed_dfs.js";

export class ranker {
    static labyrinthCount = 20

    static create_ranking() {
        const labyrinthCategories = [
            this.getLabyrinthCategory("DFS_7", () => generator.generateDfs(7)),
            this.getLabyrinthCategory("Kruskal_7", () => generator.generateKruskal(7)),
            this.getLabyrinthCategory("Wilson_7", () => generator.generateWilson(7)),
            this.getLabyrinthCategory("DFS_15", () => generator.generateDfs(15)),
            this.getLabyrinthCategory("Kruskal_15", () => generator.generateKruskal(15)),
            this.getLabyrinthCategory("Wilson_15", () => generator.generateWilson(15)),
        ]

        const strategies = [
            new RandomStrategy(),
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
