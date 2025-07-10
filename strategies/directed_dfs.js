"use strict";

import { Strategy } from "../backend/utils.js";

export class DfsStrategy extends Strategy {


    constructor() {
        super();
        this.visited = new Set()
        this.cur = [0, 0]
        this.path = [[0, 0]]
    }

    calculateDirection(environment) {
        const deltas = { 'U': [0, -1], 'D': [0, 1], 'L': [-1, 0], 'R': [1, 0] }
        const dirs = { "0 -1": 'U', "0 1": 'D', "-1 0": 'L', "1 0": 'R' }
        var order = []
        if (cur[0] > cur[1]) {
            order = ['D', 'R', 'L', 'U']
        } else {
            order = ['R', 'D', 'U', 'L']
        }
        for (const dir of order) {
            const delta = deltas[dir]
            const newpos = [cur[0] + delta[0], cur[1] + delta[1]]
            if (this.checkDirection(environment, dir) && !this.visited.has(this.visitedString(newpos))) {
                this.visited.add(this.visitedString(newpos))
                cur = newpos
                this.path.push(newpos)
                return dir
            }
        }
        this.path.pop()
        var prev = this.path[this.path.length - 1]
        var dir = dirs[this.visitedString([prev[0] - cur[0], prev[1] - dir[1]])]
        cur = prev
        return dir
    }

    visitedString(pos) {
        return pos.join(' ')
    }

    visitedPos(string) {
        return string.split(' ').map(Number)
    }
}