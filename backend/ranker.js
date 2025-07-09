"use strict";

import {generator} from "./generator.js";
import {solver} from "./solver.js";
import {RandomStrategy} from "../strategies/random.js";
import {HoldLeftStrategy} from "../strategies/hold_left.js";
import {HoldRightStrategy} from "../strategies/hold_right.js";

function create_ranking() {
    const labyrinths = [];
    const strategies = [];

    for (let i = 0; i < 10; i++) {
        labyrinths.push(generator.generateDfs(11));
    }

    strategies.push(new RandomStrategy());
    strategies.push(new HoldLeftStrategy());
    strategies.push(new HoldRightStrategy());

    for (let labyrinth of labyrinths) {
        for (let strategy of strategies) {
            console.log(solver.solve(labyrinth, strategy)); // TODO change this
        }
    }
}


create_ranking();
