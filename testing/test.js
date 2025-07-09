"use strict";

import { generator } from "../backend/generator.js"
import { solver } from "../backend/solver.js"
import { RandomStrategy } from "../strategies/random.js"
import {HoldLeftStrategy} from "../strategies/hold_left.js";
import {HoldRightStrategy} from "../strategies/hold_right.js";

function test() {
    const strategy = new HoldRightStrategy()
    const labyrinth = generator.generateDfs(11)
    console.log(solver.solve(labyrinth, strategy))
}

test()
