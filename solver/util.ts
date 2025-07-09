export type Square = 'X' | ' ' | 'S' | 'E'
export type Direction = 'U' | 'D' | 'L' | 'R'
export type Environment = Map<Direction, Square>

export type Labyrinth = Array<Array<Square>>
export type Path = Array<Direction>

export interface Strategy {
    getNextMove(environment: Environment): Direction
}

