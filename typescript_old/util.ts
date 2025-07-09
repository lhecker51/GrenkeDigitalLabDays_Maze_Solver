export class Position {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

export type Square = 'X' | ' ' | 'S' | 'E'
export type Direction = 'U' | 'D' | 'L' | 'R'
export type Environment = Map<Direction, Square>

export type Labyrinth = Array<Array<Square>>
export type Path = Array<Direction>

export abstract class Strategy {
    getNextMove(environment: Environment): Direction {
        for (let [direction, square] of environment) {
            if (square === 'E') {
                return direction
            }
        }

        return this.getDirection(environment)
    }

    protected abstract getDirection(environment: Environment): Direction
}
