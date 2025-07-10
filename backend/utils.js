"use strict";

export class Position {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

export class Environment {
    constructor(u, d, l, r) {
        this.u = u
        this.d = d
        this.l = l
        this.r = r
    }
}

export class LabyrinthCategory {
    constructor(name, labyrinths) {
        this.name = name
        this.labyrinths = labyrinths
    }
}

export class Strategy {
    constructor(name) {
        this.name = name
    }

     getDirection(environment) {
        if (environment.u === 'E') return 'U'
        if (environment.d === 'E') return 'D'
        if (environment.l === 'E') return 'L'
        if (environment.r === 'E') return 'R'

        return this.calculateDirection(environment)
    }

    checkDirection(environment, direction) {
        switch (direction) {
            case "U": return environment.u !== "X"
            case "D": return environment.d !== "X"
            case "L": return environment.l !== "X"
            case "R": return environment.r !== "X"
        }
    }

    calculateDirection(environment) {}  // override in subclasses
}
