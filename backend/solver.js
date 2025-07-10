"use strict";

import {Environment, Position} from "./utils.js";

export class solver {
    static solve(labyrinth, strategy) {
        const path = [];
        let position = this.getStartingPosition(labyrinth);

        while (labyrinth[position.y][position.x] !== 'E') {
            let environment = this.getEnvironment(labyrinth, position);
            let direction = strategy.getDirection(environment);
            position = this.adjustPosition(position, direction);
            path.push(direction);
        }
        return path;
    }

    static getStartingPosition(labyrinth) {
        const startingPosition = new Position(0, 0);
        for (let row of labyrinth) {
            startingPosition.x = 0;
            for (let square of row) {
                if (square === 'S') {
                    return startingPosition;
                }
                startingPosition.x++;
            }
            startingPosition.y++;
        }
        return startingPosition;
    }

    static getEnvironment(labyrinth, position) {
        const xPos = position.x;
        const yPos = position.y;

        return new Environment(
            labyrinth[yPos - 1][xPos],
            labyrinth[yPos + 1][xPos],
            labyrinth[yPos][xPos - 1],
            labyrinth[yPos][xPos + 1]
        )
    }

    static adjustPosition(position, direction) {
        switch (direction) {
            case "U": return new Position(position.x, position.y - 1);
            case "D": return new Position(position.x, position.y + 1);
            case "L": return new Position(position.x - 1, position.y);
            case "R": return new Position(position.x + 1, position.y);
        }
    }
}
