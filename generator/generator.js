class UnionFind {
    constructor(size) {
        this.parent = Array.from({ length: size }, (_, i) => i);
        this.rank = Array(size).fill(0);
    }

    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); // Path compression
        }
        return this.parent[x];
    }

    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX === rootY) return false;

        // Union by rank
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        return true;
    }

    connected(x, y) {
        return this.find(x) === this.find(y);
    }
}

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
        field[1][1] = 'S';
        field[n - 2][n - 2] = 'E'
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
            let deltas = [[-1, 0], [0, -1], [1, 0], [0, 1]]
            deltas = this.shuffle(deltas)
            let neig = cur
            for (const delta of deltas) {
                neig = [cur[0] + delta[0], cur[1] + delta[1]]
                if (neig[0] < 0 || neig[0] >= gridsize || neig[1] < 0 || neig[1] >= gridsize) {
                    continue
                }
                if (!visited[neig[0]][neig[1]]) {
                    stack.push(cur)
                    stack.push(neig)
                    visited[neig[0]][neig[1]] = true
                    field[2 * cur[0] + 1 + delta[0]][2 * cur[1] + 1 + delta[1]] = ' '
                    break
                }
            }
        }
        this.printField(field);
        return field;
    }

    static generateKruskal(n) {
        let field = this.pregenField(n)
        let gridsize = Math.floor(n / 2);

        let walls = []
        for (let i = 0; i < gridsize - 1; i++) {
            for (let j = 0; j < gridsize - 1; j++) {
                walls.push([i, j, 1])
                walls.push([i, j, gridsize])
            }
        }
        for (let i = 0; i < gridsize - 1; i++) {
            walls.push([gridsize - 1, i, 1])
            walls.push([i, gridsize - 1, gridsize])
        }
        walls = this.shuffle(walls)
        const usedWalls = []

        const uf = new UnionFind(gridsize * gridsize);

        for (let [i, j, mode] of walls) {
            if (!uf.connected(i * gridsize + j, i * gridsize + j + mode)) {
                usedWalls.push([i, j, mode])
                uf.union(i * gridsize + j, i * gridsize + j + mode)
            }
        }

        for (let [i, j, mode] of usedWalls) {
            if (mode == 1) {
                field[2 * i + 1][2 * j + 2] = ' '
            } else {
                field[2 * i + 2][2 * j + 1] = ' '
            }
        }

        this.printField(field)
        return field;
    }

    static shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap
        }
        return array;
    }


    static printField(field) {
        for (let row of field) {
            console.log(row.join(''));
        }
    }
}
generator.generateDfs(51)
console.log()