"use strict";

import { generator } from "./generator.js"
import { solver } from "./solver.js"
import {ranker} from "./ranker.js";
import { RandomStrategy } from "../strategies/random.js"
import {HoldLeftStrategy} from "../strategies/hold_left.js";
import {HoldRightStrategy} from "../strategies/hold_right.js";
import {SemiRandomStrategy} from "../strategies/semi_random.js";

function test() {
    const strategy = new SemiRandomStrategy()
    const labyrinth = generator.generateKruskal(9)
    console.log(solver.solve(labyrinth, strategy))
}

test()
