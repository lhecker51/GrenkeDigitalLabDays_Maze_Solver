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
        }
        const visited = Array.from({ length: gridsize }, () => Array(gridsize).fill(false))
        let stack = []
        stack.push([0, 0])
        visited[0][0] = true
        while (!stack.isEmpty()) {
            let cur = stack.pop()
            const deltas = [[-1, 0], [0, -1], [1, 0], [0, 1]]
            visited[cur[0]][cur[1]] = true
            let neig = cur
            while (!visited[neig[0]][neig[1]]) {
                nextDid = Math.floor(Math.random() * deltas.length())
                neig = [cur[0] + deltas[nextDid][0], cur[1] + deltas[nextDid][1]]
                deltas.splice(nextDid, 1);
            }
        }
    }
}