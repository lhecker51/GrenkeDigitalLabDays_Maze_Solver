import { Position, Square, Direction, Environment, Labyrinth, Path, Strategy } from "../util";

export class solver {
    static solve(strategy: Strategy, labyrinth: Labyrinth): Path {
        const path: Path = []
        let position: Position = this.getStartingPosition(labyrinth)

        let xPos: number = position.x
        let yPos: number = position.y

        while (labyrinth[yPos][xPos] !== 'E') {
            let environment: Environment = this.getEnvironment(labyrinth, position)
            let direction: Direction = strategy.getNextMove(environment)
            position = this.adjustPosition(position, direction)
            xPos = position.x
            yPos = position.y
            path.push(direction)
        }

        return path
    }

    private static getStartingPosition(labyrinth: Labyrinth): Position {
        const startingPosition: Position = { x: 0, y: 0 }
        for (let row of labyrinth) {
            startingPosition.x = 0
            for (let square of row) {
                if (square === 'S') {
                    return startingPosition
                }
                startingPosition.x++
            }
            startingPosition.y++
        }
        return startingPosition
    }

    private static getEnvironment(labyrinth: Labyrinth, position: Position): Environment {
        const xPos: number = position.x
        const yPos: number = position.y

        const environment: Environment = new Map<Direction, Square>()

        environment.set('U', labyrinth[yPos - 1][xPos])
        environment.set('D', labyrinth[yPos + 1][xPos])
        environment.set('L', labyrinth[yPos][xPos - 1])
        environment.set('R', labyrinth[yPos][xPos + 1])

        return environment
    }

    private static adjustPosition(position: Position, direction: Direction): Position {
        switch (direction) {
            case "U": return { x: position.x, y: position.y - 1 }
            case "D": return { x: position.x, y: position.y + 1 }
            case "L": return { x: position.x - 1, y: position.y }
            case "R": return { x: position.x + 1, y: position.y }
        }
    }
}
