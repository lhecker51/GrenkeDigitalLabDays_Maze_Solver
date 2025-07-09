function visualizePattern(field) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('canvas-container');
    const errorEl = document.getElementById('error');
    errorEl.textContent = "";

    try {
        if (!field || field.length === 0) throw new Error("No maze data provided");

        const rows = field.length;
        const cols = field[0].length;

        // Configuration
        const minCellSize = 20;    
        const preferredCellSize = 40;
        const maxCellSize = 50;

        // Calculate available space (with padding)
        const availableWidth = container.clientWidth - 40;
        const availableHeight = container.clientHeight - 40;

        // Calculate cell size that fits available space
        let cellSize = Math.min(
            availableWidth / cols,
            availableHeight / rows,
            //preferredCellSize
        );

        // Enforce size constraints
        cellSize = Math.max(minCellSize, Math.min(maxCellSize, cellSize));

        // Set canvas dimensions
        canvas.width = cols * cellSize;
        canvas.height = rows * cellSize;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw maze
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const char = field[y][x];
                switch (char.toUpperCase()) {
                    case 'X':
                        ctx.fillStyle = '#333';
                        break;
                    case 'S':
                        ctx.fillStyle = '#e74c3c';
                        break;
                    case 'E':
                        ctx.fillStyle = '#2ecc71';
                        break;
                    case ' ':
                        ctx.fillStyle = '#fff';
                        break;
                    default:
                        ctx.fillStyle = '#ddd'; // Unknown characters
                }
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                ctx.strokeStyle = '#eee';
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    } catch (err) {
        errorEl.textContent = `Error: ${err.message}`;
    }
}

// Handle window resizing
window.addEventListener('resize', function () {
    const canvas = document.getElementById('canvas');
    if (canvas.width > 0 && canvas.height > 0) {
        // Redraw the last maze if one was displayed
        const lastMaze = window.lastMaze;
        if (lastMaze) {
            visualizePattern(lastMaze);
        }
    }
});

// Handle generate button click
document.getElementById('generate-btn').addEventListener('click', function () {
    const sizeInput = document.getElementById('maze-size');
    let size = parseInt(sizeInput.value);

    // Ensure size is odd and ≥5
    if (size % 2 === 0) {
        size++; // Make it odd
        sizeInput.value = size;
    }
    if (size < 5) {
        size = 5;
        sizeInput.value = 5;
    }

    try {
        const maze = generator.generateDfs(size);
        window.lastMaze = maze; // Store for resize handling
        visualizePattern(maze);
    } catch (err) {
        document.getElementById('error').textContent = `Error: ${err.message}`;
    }
});