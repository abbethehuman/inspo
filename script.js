document.addEventListener('DOMContentLoaded', () => {
    const minesweeper = document.getElementById('minesweeper');
    const confettiContainer = document.getElementById('confettiContainer');
    const gridSize = 10;
    const mineCount = 10;
    let mineField = [];

    function initGame() {
        mineField = Array(gridSize * gridSize).fill(0);
        for (let i = 0; i < mineCount; i++) {
            let minePosition;
            do {
                minePosition = Math.floor(Math.random() * gridSize * gridSize);
            } while (mineField[minePosition] === 'X');
            mineField[minePosition] = 'X';
        }

        for (let i = 0; i < gridSize * gridSize; i++) {
            if (mineField[i] !== 'X') {
                mineField[i] = countAdjacentMines(i);
            }
        }

        renderGrid();
    }

    function countAdjacentMines(index) {
        const adjacentIndices = getAdjacentIndices(index);
        return adjacentIndices.filter(i => mineField[i] === 'X').length;
    }

    function getAdjacentIndices(index) {
        const indices = [];
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                if (r === 0 && c === 0) continue;
                const newRow = row + r;
                const newCol = col + c;
                if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                    indices.push(newRow * gridSize + newCol);
                }
            }
        }

        return indices;
    }

    function renderGrid() {
        minesweeper.innerHTML = '';
        mineField.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.index = index;
            cellElement.addEventListener('click', onCellClick);
            minesweeper.appendChild(cellElement);
        });
    }

    function onCellClick(event) {
        const index = parseInt(event.target.dataset.index);
        revealCell(index);
    }

    function revealCell(index) {
        const cellElement = minesweeper.children[index];
        if (cellElement.classList.contains('revealed')) return;

        cellElement.classList.add('revealed');
        cellElement.textContent = mineField[index];

        if (mineField[index] === 'X') {
            cellElement.textContent = '💣';
            launchConfetti();
        } else if (mineField[index] === 0) {
            cellElement.textContent = '';
            getAdjacentIndices(index).forEach(revealCell);
        }
    }

    function launchConfetti() {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
            confettiContainer.appendChild(confetti);
        }

        setTimeout(() => {
            confettiContainer.innerHTML = '';
        }, 5000);
    }

    // Confetti CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: #00FF00;
            animation: fall linear infinite;
            opacity: 0.8;
        }

        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    initGame();
});
