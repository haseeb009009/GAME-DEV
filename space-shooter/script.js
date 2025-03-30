// Get the canvas and set up the game
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Player Ship
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 80,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0
};

// Listen for key events
document.addEventListener("keydown", moveShip);
document.addEventListener("keyup", stopShip);

function moveShip(event) {
    if (event.key === "ArrowLeft") {
        player.dx = -player.speed;
    } else if (event.key === "ArrowRight") {
        player.dx = player.speed;
    }
}

function stopShip(event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        player.dx = 0;
    }
}

// Update game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move player
    player.x += player.dx;

    // Keep player within bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Draw player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
}
// Store bullets in an array
const bullets = [];
const bulletSpeed = 7;

// Listen for spacebar to shoot
document.addEventListener("keydown", shootBullet);

function shootBullet(event) {
    if (event.key === " ") {  // Spacebar key
        bullets.push({
            x: player.x + player.width / 2 - 5,  // Center bullet
            y: player.y,
            width: 5,
            height: 10
        });
    }
}

// Update game loop to include bullets
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move player
    player.x += player.dx;

    // Keep player within bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Draw player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Move and draw bullets
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bulletSpeed; // Move bullet up

        // Remove bullets that go off screen
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
            continue;
        }

        // Draw bullet
        ctx.fillStyle = "red";
        ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
    }

    requestAnimationFrame(update);
}

update();


update();
