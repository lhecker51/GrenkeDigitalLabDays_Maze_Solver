import { generator } from '../backend/generator.js';
import { solver } from "../backend/solver.js";
import { ranker } from "../backend/ranker.js";
import { RandomStrategy } from "../strategies/random.js";
import { HoldLeftStrategy } from "../strategies/hold_left.js";
import { HoldRightStrategy } from "../strategies/hold_right.js"
import { DfsStrategy } from "../strategies/directed_dfs.js"

let currentAnimationSpeed = 500;
let animationRunning = false;

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
        const minCellSize = 10;  // Reduced minimum cell size
        const preferredCellSize = 30;  // Reduced preferred size
        const maxViewportRatio = 0.8;  // Max percentage of viewport to use

        // Calculate maximum available space based on viewport
        const maxViewportWidth = window.innerWidth * maxViewportRatio;
        const maxViewportHeight = window.innerHeight * maxViewportRatio;

        // Calculate cell size that fits available space
        let cellSize = Math.min(
            maxViewportWidth / cols,
            maxViewportHeight / rows,
            preferredCellSize
        );

        // Enforce minimum size
        cellSize = Math.max(minCellSize, cellSize);

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
    animationRunning = false
    if (window.lastMaze) {
        visualizePattern(window.lastMaze);
    }
    if (window.animationTimeout != null) {
        clearTimeout(window.animationTimeout)
        window.animationTimeout = null
    }
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
        const generationAlgo = document.getElementById("generator-select").value
        var maze = []
        console.log(generationAlgo)
        switch (generationAlgo) {
            case "DFS":
                maze = generator.generateDfs(size)
            case "Kruskal":
                maze = generator.generateKruskal(size)
            case "Wilson":
                maze = generator.generateWilson(size)
        }
        window.lastMaze = maze; // Store for resize handling
        visualizePattern(maze);
    } catch (err) {
        document.getElementById('error').textContent = `Error: ${err.message}`;
    }
});

//SECTION FOR MAZE SOLVING
const ALGORITHM_COLORS = {
    'HoldLeftStrategy': '#F4433657',
    'HoldRightStrategy': '#9C27B04A',
    'RandomStrategy': '#2196F35C',
    "DfsStrategy": '#00968854'
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

document.getElementById('clear-btn').addEventListener('click', () => {
    animationRunning = false;
    if (window.animationTimeout) {
        clearTimeout(window.animationTimeout);
        window.animationTimeout = null;
    }
    if (window.lastMaze) visualizePattern(window.lastMaze);
});


function solveAndVisualize(algorithms, maze) {
    if (animationRunning) return;
    animationRunning = true;

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

    let running = true;
    window.animationTimeout = null;

    function stepAnimation() {
        if (!running) return;

        redrawCanvas();

        let allFinished = true;

        Object.keys(solutions).forEach(alg => {
            if (!activeAlgorithms[alg]) return;

            if (maze[positions[alg].y][positions[alg].x] === 'E') {
                activeAlgorithms[alg] = false;
                return;
            }

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

        if (allFinished || currentStep > maxSteps) {
            redrawCanvas();
            return;
        }
        if (!animationRunning) {
            redrawCanvas(); // Force cleanup redraw
            return;
        }


        window.animationTimeout = setTimeout(stepAnimation, currentAnimationSpeed);
    }

    // Start animation
    stepAnimation();


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
        case 'U':
            return { x: pos.x, y: pos.y - 1 };
        case 'D':
            return { x: pos.x, y: pos.y + 1 };
        case 'L':
            return { x: pos.x - 1, y: pos.y };
        case 'R':
            return { x: pos.x + 1, y: pos.y };
        default:
            return { ...pos };
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

// Emilias Bereich

document.getElementById('ranking-btn').addEventListener('click', function () {
    try {
        document.getElementById('ranking-error').textContent = ""
        visualizeRanking(ranker.create_ranking())
    } catch (err) {
        document.getElementById('ranking-error').textContent = `Error: ${err.message}`
    }
});
// Add Select All functionality
document.getElementById('select-all').addEventListener('change', function (e) {
    const checkboxes = document.querySelectorAll('input[name="algorithm"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
    });
});

// Add logic to uncheck "Select All" if any algorithm is unchecked
const algorithmCheckboxes = document.querySelectorAll('input[name="algorithm"]');
algorithmCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        const allChecked = document.querySelectorAll('input[name="algorithm"]:checked').length === algorithmCheckboxes.length;
        document.getElementById('select-all').checked = allChecked;
    });
});

function visualizeRanking(rankingTable) {
    const canvas = document.getElementById('ranking-sqr')
    const ctx = canvas.getContext('2d')
    const container = document.getElementById('ranking-container')

    const rows = field.length
    const cols = field[0].length

    const minCellSize = 10
    const preferredCellSize = 30
    const maxViewportRatio = 0.8

    const maxViewportWidth = window.innerWidth * maxViewportRatio
    const maxViewportHeight = window.innerHeight * maxViewportRatio

    let cellSize = Math.min(
        maxViewportWidth / cols,
        maxViewportHeight / rows,
        preferredCellSize
    )

    cellSize = Math.max(minCellSize, cellSize)

    canvas.width = cols * cellSize
    canvas.height = rows * cellSize

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const content = rankingTable[y][x]

            if (x > 0 && y > 0) {
                ctx.fillStyle = '#00ff00' // TODO change
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
                ctx.strokeStyle = '#eeeeee'
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize)
            }

            // TODO add text
        }
    }
}
