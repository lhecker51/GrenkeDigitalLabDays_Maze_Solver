export class generatorWrapper {
    static generateDFSLabyrinth(size) {
        return generator.generateDfs(size)
    }

    static generateKruskalLabyrinth(size) {
        return generator.generateKruskal(size)
    }

    static generateWilsonLabyrinth(size) {
        return generator.generateWilson(size)
    }
}