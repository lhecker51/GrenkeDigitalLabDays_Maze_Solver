class generator {
    static pregenField(n) {
        if (!(n % 2)) {
            throw new Error("The given n has to be uneven.");
        }
        if (n < 5) {
            throw new Error("The given n has to be at least 5.");
        }
        const field = []
        for (let i = 0; i < n; i++) {
            const row = []
            for (let j = 0; j < n; j++) {
                row.push(j % 2 && i % 2 ? ' ' : 'X')
            }
            field.push(row)
        }
        return field
    }

    static generateDfs(n) {
        let field = this.pregenField(n)
        let gridsize = Math.floor(n / 2);
        const visited = Array.from({ length: gridsize }, () => Array(gridsize).fill(false))
        let stack = []
        stack.push([0, 0])
        visited[0][0] = true
        while (stack.length) {
            let cur = stack.pop()
            const deltas = [[-1, 0], [0, -1], [1, 0], [0, 1]]
            let neig = cur
            while (deltas.length) {
                let nextDid = Math.floor(Math.random() * deltas.length)
                const [delta] = deltas.splice(nextDid, 1)
                neig = [cur[0] + delta[0], cur[1] + delta[1]]
                if (neig[0] < 0 || neig[0] >= gridsize || neig[1] < 0 || neig[1] >= gridsize) {
                    continue
                }
                if (!visited[neig[0]][neig[1]]) {
                    stack.push(neig)
                    visited[neig[0]][neig[1]] = true
                    field[2 * cur[0] + 1 + delta[0]][2 * cur[1] + 1 + delta[1]] = ' '
                }
            }
        }
        field[1][1] = 'S';
        field[n - 2][n - 2] = 'E'
        this.printField(field);
        return field;
    }

    static generateKruskal(n) {
        let field = this.pregenField(n)
        let gridsize = Math.floor(n / 2);
        const unions = []
        for (let i = 0; i < gridsize * gridsize; i++) {
            unions.push(i)
        }
        const walls = []
        for (let i = 0; i < gridsize - 1; i++) {
            for (let j = 0; j < gridsize - 1; j++) {
                walls.push([i, j, 'R'])
                walls.push([i, j, 'D'])
            }
        }

    }

    static printField(field) {
        for (let row of field) {
            console.log(row.join(''));
        }
    }
}
generator.generateDfs(51)
console.log()