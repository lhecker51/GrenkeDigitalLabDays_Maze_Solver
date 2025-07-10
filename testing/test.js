"use strict";

import { generator } from "../backend/generator.js"
import { solver } from "../backend/solver.js"
import {ranker} from "../backend/ranker.js";
import { RandomStrategy } from "../strategies/random.js"
import {HoldLeftStrategy} from "../strategies/hold_left.js";
import {HoldRightStrategy} from "../strategies/hold_right.js";

function test() {
    const strategy = new HoldLeftStrategy()
    const labyrinth = generator.generateKruskal(9)
    console.log(solver.solve(labyrinth, strategy))
    ranker.create_ranking()
}

test()
