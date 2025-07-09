function visualizePattern(field, path = null) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('canvas-container');
    const errorEl = document.getElementById('error');
    let currentMaze = null;
    let solutionPath = null;
    errorEl.textContent = "";
    
    try {
        if (!field || field.length === 0) throw new Error("No maze data provided");
        
        currentMaze = field;
        const rows = field.length;
        const cols = field[0].length;
        const cellSize = calculateCellSize(container, rows, cols);
        
        canvas.width = cols * cellSize;
        canvas.height = rows * cellSize;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw maze
        drawMaze(ctx, field, cellSize);

        // Draw solution path if provided
        if (path && path.length > 0) {
            solutionPath = path;
            drawSolutionPath(ctx, field, path, cellSize);
        }
    } catch (err) {
        errorEl.textContent = `Error: ${err.message}`;
    }
}
function getStartingPosition(field) {
    for (let y = 0; y < field.length; y++) {
        for (let x = 0; x < field[y].length; x++) {
            if (field[y][x] === 'S') {
                return {x, y};
            }
        }
    }
    throw new Error("No starting position (S) found in maze");
}
function calculateCellSize(container, rows, cols) {
    const minCellSize = 25;
    const preferredCellSize = 40;
    const maxCellSize = 100;
    const availableWidth = container.clientWidth - 40;
    const availableHeight = container.clientHeight - 40;
    
    let cellSize = Math.min(
        availableWidth / cols,
        availableHeight / rows,
        preferredCellSize
    );
    
    return Math.max(minCellSize, Math.min(maxCellSize, cellSize));
}

function drawMaze(ctx, field, cellSize) {
    for (let y = 0; y < field.length; y++) {
        for (let x = 0; x < field[y].length; x++) {
            const char = field[y][x];
            switch (char.toUpperCase()) {
                case 'X': ctx.fillStyle = '#333'; break;
                case 'S': ctx.fillStyle = '#e74c3c'; break;
                case 'E': ctx.fillStyle = '#2ecc71'; break;
                case ' ': ctx.fillStyle = '#fff'; break;
                default: ctx.fillStyle = '#ddd';
            }
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            ctx.strokeStyle = '#eee';
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function drawSolutionPath(ctx, field, path, cellSize) {
    let position = getStartingPosition(field);
    ctx.fillStyle = 'rgba(65, 105, 225, 0.5)';
    
    // Draw starting position
    ctx.fillRect(
        position.x * cellSize + cellSize/4,
        position.y * cellSize + cellSize/4,
        cellSize/2,
        cellSize/2
    );
    
    // Draw path
    for (const direction of path) {
        position = adjustPosition(position, direction);
        ctx.fillRect(
            position.x * cellSize + cellSize/4,
            position.y * cellSize + cellSize/4,
            cellSize/2,
            cellSize/2
        );
    }
}

window.addEventListener('resize', function() {
    if (currentMaze) {
        visualizePattern(currentMaze, solutionPath);
    }
});

// Handle generate button click
document.getElementById('generate-btn').addEventListener('click', function() {
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
        const maze = Generator.generateDfs(size); // Use Generator directly
        currentMaze = maze; // Store the current maze
        solutionPath = null; // Clear any previous solution
        visualizePattern(maze);
    } catch (err) {
        document.getElementById('error').textContent = `Error: ${err.message}`;
    }
});

function adjustPosition(position, direction) {
    switch (direction) {
        case "U": return {x: position.x, y: position.y - 1};
        case "D": return {x: position.x, y: position.y + 1};
        case "L": return {x: position.x - 1, y: position.y};
        case "R": return {x: position.x + 1, y: position.y};
        default: throw new Error(`Invalid direction: ${direction}`);
    }
}
// Solve button handler
document.getElementById('solve-btn').addEventListener('click', function() {
    if (!currentMaze) {
        document.getElementById('error').textContent = "Please generate a maze first";
        return;
    }
    
    try {
        const strategyName = document.getElementById('strategy-select').value;
        const strategy = new window[strategyName + 'Strategy']();
        const path = solver.solve(strategy, currentMaze);
        visualizePattern(currentMaze, path);
    } catch (err) {
        document.getElementById('error').textContent = `Error solving maze: ${err.message}`;
    }
});

// Clear solution button handler
document.getElementById('clear-btn').addEventListener('click', function() {
    if (currentMaze) {
        solutionPath = null;
        visualizePattern(currentMaze);
    }
});
