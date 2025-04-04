const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

let board = createMatrix(COLUMNS, ROWS);
let dropInterval = 800;
let lastTime = 0;
let dropCounter = 0;
let score = 0;
let level = 1;

const colors = [
    null,
    'cyan',
    'blue',
    'orange',
    'yellow',
    'green',
    'purple',
    'red'
];

const tetrominos = {
    I: [[1, 1, 1, 1]],
    J: [[1, 0, 0], [1, 1, 1]],
    L: [[0, 0, 1], [1, 1, 1]],
    O: [[1, 1], [1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    T: [[0, 1, 0], [1, 1, 1]],
    Z: [[1, 1, 0], [0, 1, 1]]
};

let player = {
    pos: { x: 0, y: 0 },
    matrix: null
};

function createMatrix(w, h) {
    return Array.from({ length: h }, () => Array(w).fill(0));
}

function createPiece(type) {
    const shapes = tetrominos[type];
    const matrix = shapes;
    return matrix;
}

function collide(board, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] &&
                (board[y + o.y] && board[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function merge(board, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) board[y + player.pos.y][x + player.pos.x] = value;
        });
    });
}

function rotate(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
}

function playerDrop() {
    player.pos.y++;
    if (collide(board, player)) {
        player.pos.y--;
        merge(board, player);
        playerReset();
        sweep();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(board, player)) {
        player.pos.x -= dir;
    }
}

function playerRotate() {
    const pos = player.pos.x;
    const rotated = rotate(player.matrix);
    player.matrix = rotated;
    if (collide(board, player)) player.pos.x = pos;
}

function sweep() {
    let rowCount = 0;
    outer: for (let y = board.length - 1; y >= 0; --y) {
        if (board[y].every(cell => cell !== 0)) {
            const row = board.splice(y, 1)[0].fill(0);
            board.unshift(row);
            y++;
            rowCount++;
        }
    }
    if (rowCount > 0) {
        score += rowCount * 100;
        document.getElementById("score").textContent = score;
        level = Math.floor(score / 500) + 1;
        document.getElementById("level").textContent = level;
        dropInterval = 800 * Math.pow(0.95, level - 1);
    }
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = colors[value];
                ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(board, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) playerDrop();
    draw();
    requestAnimationFrame(update);
}

function playerReset() {
    const pieces = 'TJLOSZI';
    const type = pieces[Math.floor(Math.random() * pieces.length)];
    player.matrix = createPiece(type);
    player.pos.y = 0;
    player.pos.x = Math.floor(COLUMNS / 2) - Math.floor(player.matrix[0].length / 2);

    if (collide(board, player)) {
        board.forEach(row => row.fill(0));
        score = 0;
        level = 1;
        dropInterval = 800;
        document.getElementById("score").textContent = score;
        document.getElementById("level").textContent = level;
    }
}

function startGame() {
    board = createMatrix(COLUMNS, ROWS);
    playerReset();
    update();
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") playerMove(-1);
    else if (e.key === "ArrowRight") playerMove(1);
    else if (e.key === "ArrowDown") playerDrop();
    else if (e.key === "ArrowUp") playerRotate();
});
