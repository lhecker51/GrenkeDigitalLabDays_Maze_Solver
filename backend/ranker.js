"use strict";

import {generator} from "./generator.js";
import {solver} from "./solver.js";
import {RandomStrategy} from "../strategies/random.js";
import {HoldLeftStrategy} from "../strategies/hold_left.js";
import {HoldRightStrategy} from "../strategies/hold_right.js";
import {LabyrinthCategory} from "./utils.js";

export class ranker {
    static create_ranking() {
        const labyrinthCategories = [
            this.getLabyrinthCategory("DFS_7", () => generator.generateDfs(7), 10),
            this.getLabyrinthCategory("Kruskal_7", () => generator.generateKruskal(7), 10),
            this.getLabyrinthCategory("Wilson_7", () => generator.generateWilson(7), 10),
            this.getLabyrinthCategory("DFS_15", () => generator.generateDfs(15), 10),
            this.getLabyrinthCategory("Kruskal_15", () => generator.generateKruskal(15), 10),
            this.getLabyrinthCategory("Wilson_15", () => generator.generateWilson(15), 10),
        ]

        const strategies = [
            new RandomStrategy(),
            new HoldLeftStrategy(),
            new HoldRightStrategy()
        ]

        // TODO implement ranking
    }

    static getLabyrinthCategory(name, generatingFunction, labyrinthCount) {
        const labyrinths = []
        for (let i = 0; i < labyrinthCount; i++) {
            labyrinths.push(generatingFunction())
        }
        return new LabyrinthCategory(name, labyrinths)
    }
}
