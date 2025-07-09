import { generator } from '../backend/generator.js';


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
// Enhanced prototype with wall collision and proper termination
const PROTOTYPE_PATHS = {
    LeftHand: ['R', 'R', 'D', 'D', 'R', 'R', 'U', 'U', 'R', 'D', 'D', 'L', 'L', 'D', 'D', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R' ,'R', 'R', 'R', 'R', 'R'],
    RightHand: ['D', 'D', 'R', 'R', 'U', 'U', 'R', 'D', 'D', 'R', 'R', 'D', 'D', 'L', 'L', 'D', 'D'],
    RandomWalk: ['R', 'D', 'R', 'U', 'R', 'D', 'L', 'D', 'R', 'D', 'R', 'U', 'R', 'D', 'D', 'R', 'R'],
    ShortestPath: ['R', 'R', 'D', 'D', 'R', 'R', 'D', 'D', 'R', 'R']
};

const ALGORITHM_COLORS = {
    'LeftHand': '#3498db',
    'RightHand': '#e67e22',
    'RandomWalk': '#9b59b6',
    'ShortestPath': '#2ecc71'
};

document.getElementById('solve-btn').addEventListener('click', function() {
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
    
    solveAndVisualize(selectedAlgorithms, window.lastMaze);
});

document.getElementById('clear-btn').addEventListener('click', function() {
    if (window.lastMaze) {
        visualizePattern(window.lastMaze);
    }
    if (window.animationInterval) {
        clearInterval(window.animationInterval);
    }
});

function solveAndVisualize(algorithms, maze) {
    if (window.animationInterval) {
        clearInterval(window.animationInterval);
    }
    
    visualizePattern(maze);
    
    // Generate valid paths that respect walls
    const solutions = generateValidPaths(algorithms, maze);
    
    animateSolutions(solutions, maze);
}

function generateValidPaths(algorithms, maze) {
    const solutions = {};
    const startPos = findStartPosition(maze);
    const endPos = findEndPosition(maze);
    
    algorithms.forEach(alg => {
        // Start with prototype path but validate each step
        const prototypePath = PROTOTYPE_PATHS[alg] || [];
        const validPath = [];
        let currentPos = { ...startPos };
        let reachedEnd = false;
        
        for (const direction of prototypePath) {
            if (reachedEnd) break;
            
            const newPos = getNewPosition(currentPos, direction);
            
            // Check if new position is valid (not a wall and within bounds)
            if (isValidPosition(newPos, maze)) {
                validPath.push(direction);
                currentPos = newPos;
                
                // Check if we reached the end
                if (maze[currentPos.y][currentPos.x] === 'E') {
                    reachedEnd = true;
                }
            }
        }
        
        solutions[alg] = validPath;
    });
    
    return solutions;
}

function animateSolutions(solutions, maze) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const cellSize = canvas.width / maze[0].length;
    const startPos = findStartPosition(maze);
    const endPos = findEndPosition(maze);
    
    const positions = {};
    const activeAlgorithms = {};
    Object.keys(solutions).forEach(alg => {
        positions[alg] = { ...startPos };
        activeAlgorithms[alg] = true;
    });
    
    let currentStep = 0;
    const maxSteps = Math.max(...Object.values(solutions).map(s => s.length));
    
    function animationFrame() {
        // Clear only the algorithm markers area
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        visualizePattern(maze);
        
        let allFinished = true;
        
        Object.keys(solutions).forEach(alg => {
            if (!activeAlgorithms[alg]) return;
            
            // Check if current position is the end
            if (maze[positions[alg].y][positions[alg].x] === 'E') {
                activeAlgorithms[alg] = false;
                return;
            }
            
            // Move if there are steps left
            if (currentStep < solutions[alg].length) {
                const direction = solutions[alg][currentStep];
                const newPos = getNewPosition(positions[alg], direction);
                
                if (isValidPosition(newPos, maze)) {
                    positions[alg] = newPos;
                }
            }
            
            // Draw marker if still active
            if (activeAlgorithms[alg]) {
                drawMarker(alg, positions[alg]);
                allFinished = false;
            }
        });
        
        currentStep++;
        
        if (!allFinished && currentStep <= maxSteps + 10) { // +10 for final drawing
            window.animationFrameId = requestAnimationFrame(animationFrame);
        }
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
    
    // Start animation
    window.animationFrameId = requestAnimationFrame(animationFrame);
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
Generator.printField = function(field) {
    window.lastMaze = field;
    visualizePattern(field);
};