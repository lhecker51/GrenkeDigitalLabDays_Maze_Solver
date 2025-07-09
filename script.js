document.getElementById('file').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const errorEl = document.getElementById('error');
    errorEl.textContent = "";

    reader.onload = function(e) {
        try {
            visualizePattern(e.target.result);
        } catch (err) {
            errorEl.textContent = `Error: ${err.message}`;
        }
    };

    reader.onerror = function() {
        errorEl.textContent = "Failed to read file.";
    };

    reader.readAsText(file);
});

function visualizePattern(text) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('canvas-container');
    
    // Parse maze and validate
    const lines = text.split('\n')
        .map(line => line.replace(/\r/g, ''))
        .filter(line => line.trim() !== '');
        
    if (lines.length === 0) throw new Error("File is empty or invalid");

    const rows = lines.length;
    const cols = Math.max(...lines.map(line => line.length));
    
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
        for (let x = 0; x < lines[y].length; x++) {
            const char = lines[y][x];
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
}

// Handle window resizing
window.addEventListener('resize', function() {
    const fileInput = document.getElementById('file');
    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            visualizePattern(e.target.result);
        };
        reader.readAsText(fileInput.files[0]);
    }
});