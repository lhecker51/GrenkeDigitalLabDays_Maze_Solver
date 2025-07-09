class generator {
    static generate(n) {
        if (!(n % 2)) {
            throw new Error("n has to be uneven");
        }
        let gridsize = Math.floor(n / 2);
        const field = []
        for (let i = 0; i < n; i++) {
            const row = []
            for (let j = 0; j < n; j++) {
                row.push(j % 2 && i % 2 ? ' ' : 'X')
            }
            field.push(row)
        }
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
        this.printField(field);
    }
    static printField(field) {
        for (let row of field) {
            console.log(row.join(' '));
        }
    }
}
generator.generate(51)