// script.js
import { generator } from '../backend/generator.js';
import { solver } from "../backend/solver.js";
import { RandomStrategy } from "../strategies/random.js";
import { HoldLeftStrategy } from "../strategies/hold_left.js";
import { HoldRightStrategy } from "../strategies/hold_right.js"
import { DfsStrategy } from "../strategies/directed_dfs.js"

let currentAnimationSpeed = 500;

document.getElementById('speed-slider').addEventListener('input', function () {
    currentAnimationSpeed = parseInt(this.value);
    document.getElementById('speed-value').textContent = `${currentAnimationSpeed}ms`;
});

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
        const minCellSize = 25;
        const preferredCellSize = 40;
        const maxCellSize = 100;

        // Calculate available space (with padding)
        const availableWidth = container.clientWidth - 40;
        const availableHeight = container.clientHeight - 40;

        // Calculate cell size that fits available space
        let cellSize = Math.min(
            availableWidth / cols,
            availableHeight / rows,
            preferredCellSize
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

//SECTION FOR MAZE SOLVING
const ALGORITHM_COLORS = {
    'HoldLeftStrategy': '#3498db',
    'HoldRightStrategy': '#e67e22',
    'RandomStrategy': '#9b59b6',
    "DFSStrategy": '#42a853'
};

document.getElementById('solve-btn').addEventListener('click', function () {
    if (!window.lastMaze) {
        document.getElementById('error').textContent = "Please generate a maze first";
        return;
    }

    const selectedAlgorithms = Array.from(
        document.querySelectorAll('input[name="algorithm"]:checked')
    ).map(el => el.value);

    if (selectedAlgorithms.length === 0) {
        document.getElementById('error').textContent = "Please select at least one algorithm";
        return;
    }

    // Map checkbox values to actual strategy classes
    const strategyMap = {
        'LeftHand': HoldLeftStrategy,
        'RightHand': HoldRightStrategy,
        'RandomWalk': RandomStrategy,
        'DFS': DfsStrategy,
    };

    const selectedStrategies = selectedAlgorithms.map(alg => {
        const StrategyClass = strategyMap[alg];
        return new StrategyClass();
    });

    solveAndVisualize(selectedStrategies, window.lastMaze);
});

document.getElementById('clear-btn').addEventListener('click', function () {
    if (window.lastMaze) {
        visualizePattern(window.lastMaze);
    }
    if (window.animationInterval) {
        clearInterval(window.animationInterval);
    }
    // Reset the slider to default
    document.getElementById('speed-slider').value = 500;
    document.getElementById('speed-value').textContent = '500ms';
    currentAnimationSpeed = 500;
});

function solveAndVisualize(algorithms, maze) {
    if (window.animationInterval) {
        clearInterval(window.animationInterval);
    }

    visualizePattern(maze);

    // Get solutions from the actual solvers
    const solutions = {};
    algorithms.forEach(alg => {
        solutions[alg.constructor.name] = solver.solve(maze, alg);
    });

    animateSolutions(solutions, maze);
}

function animateSolutions(solutions, maze) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const cellSize = canvas.width / maze[0].length;
    const startPos = findStartPosition(maze);
    const endPos = findEndPosition(maze);

    const positions = {};
    const paths = {};
    const activeAlgorithms = {};
    Object.keys(solutions).forEach(alg => {
        positions[alg] = { ...startPos };
        paths[alg] = [{ ...startPos }];
        activeAlgorithms[alg] = true;
    });

    let currentStep = 0;
    const maxSteps = Math.max(...Object.values(solutions).map(s => s.length));

    // Clear any existing animation
    if (window.animationInterval) {
        clearInterval(window.animationInterval);
    }

    // Initial draw
    redrawCanvas();

    // Start animation
    window.animationInterval = setInterval(() => {
        redrawCanvas();

        let allFinished = true;

        Object.keys(solutions).forEach(alg => {
            if (!activeAlgorithms[alg]) return;

            // Check if reached end
            if (maze[positions[alg].y][positions[alg].x] === 'E') {
                activeAlgorithms[alg] = false;
                return;
            }

            // Move to next step if available
            if (currentStep < solutions[alg].length) {
                const direction = solutions[alg][currentStep];
                const newPos = getNewPosition(positions[alg], direction);

                if (isValidPosition(newPos, maze)) {
                    positions[alg] = newPos;
                    paths[alg].push({ ...newPos });
                }
            }

            if (activeAlgorithms[alg]) {
                allFinished = false;
            }
        });

        currentStep++;

        // Stop animation when all algorithms finish or we exceed max steps
        if (allFinished || currentStep > maxSteps) {
            clearInterval(window.animationInterval);
            // Draw final positions
            redrawCanvas();
        }
    }, currentAnimationSpeed);

    function redrawCanvas() {
        // Clear and redraw maze
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        visualizePattern(maze);

        // Draw paths and current positions
        Object.keys(solutions).forEach(alg => {
            if (!activeAlgorithms[alg] && paths[alg].length === 0) return;

            // Draw path
            ctx.strokeStyle = ALGORITHM_COLORS[alg];
            ctx.lineWidth = cellSize * 0.2;
            ctx.beginPath();
            ctx.moveTo(
                (paths[alg][0].x + 0.5) * cellSize,
                (paths[alg][0].y + 0.5) * cellSize
            );

            for (let i = 1; i < paths[alg].length; i++) {
                ctx.lineTo(
                    (paths[alg][i].x + 0.5) * cellSize,
                    (paths[alg][i].y + 0.5) * cellSize
                );
            }
            ctx.stroke();

            // Draw current position
            if (activeAlgorithms[alg]) {
                drawMarker(alg, positions[alg]);
            }
        });
    }

    function drawMarker(alg, pos) {
        ctx.fillStyle = ALGORITHM_COLORS[alg];
        ctx.beginPath();
        ctx.arc(
            (pos.x + 0.5) * cellSize,
            (pos.y + 0.5) * cellSize,
            cellSize * 0.4,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = `bold ${cellSize * 0.3}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            alg.charAt(0),
            (pos.x + 0.5) * cellSize,
            (pos.y + 0.5) * cellSize
        );
    }
}

// Helper functions
function findStartPosition(maze) {
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 'S') return { x, y };
        }
    }
    return null;
}

function findEndPosition(maze) {
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 'E') return { x, y };
        }
    }
    return null;
}

function getNewPosition(pos, direction) {
    switch (direction) {
        case 'U': return { x: pos.x, y: pos.y - 1 };
        case 'D': return { x: pos.x, y: pos.y + 1 };
        case 'L': return { x: pos.x - 1, y: pos.y };
        case 'R': return { x: pos.x + 1, y: pos.y };
        default: return { ...pos };
    }
}

function isValidPosition(pos, maze) {
    // Check bounds
    if (pos.y < 0 || pos.y >= maze.length || pos.x < 0 || pos.x >= maze[0].length) {
        return false;
    }

    // Check if it's a wall
    return maze[pos.y][pos.x] !== 'X';
}

// Update Generator to store maze
Generator.printField = function (field) {
    window.lastMaze = field;
    visualizePattern(field);
};