"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solver = void 0;
const util_1 = require("../util");
class solver {
    static solve(strategy, labyrinth) {
        const path = [];
        let position = this.getStartingPosition(labyrinth);
        let xPos = position.x;
        let yPos = position.y;
        while (labyrinth[yPos][xPos] !== 'E') {
            let environment = this.getEnvironment(labyrinth, position);
            let direction = strategy.getNextMove(environment);
            position = this.adjustPosition(position, direction);
            xPos = position.x;
            yPos = position.y;
            path.push(direction);
        }
        return path;
    }
    static getStartingPosition(labyrinth) {
        const startingPosition = new util_1.Position(0, 0);
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
        const environment = new Map();
        environment.set('U', labyrinth[yPos - 1][xPos]);
        environment.set('D', labyrinth[yPos + 1][xPos]);
        environment.set('L', labyrinth[yPos][xPos - 1]);
        environment.set('R', labyrinth[yPos][xPos + 1]);
        return environment;
    }
    static adjustPosition(position, direction) {
        switch (direction) {
            case "U": return new util_1.Position(position.x, position.y - 1);
            case "D": return new util_1.Position(position.x, position.y + 1);
            case "L": return new util_1.Position(position.x - 1, position.y);
            case "R": return new util_1.Position(position.x + 1, position.y);
        }
    }
}
exports.solver = solver;
