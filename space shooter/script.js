
document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".game-button");
    button.style.opacity = "0";
    setTimeout(() => {
        let opacity = 0;
        const fadeIn = setInterval(() => {
            opacity += 0.05;
            button.style.opacity = opacity;
            if (opacity >= 1) clearInterval(fadeIn);
        }, 100);
    }, 2000);
});


// Select canvas & get context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1300;
canvas.height = 600;

// Load spaceship images
const playerImg = new Image();
playerImg.src = "Assets/player.png"; // Player spaceship

const enemyImg = new Image();
enemyImg.src = "Assets/enemy.png"; // Enemy spaceship

// Player object
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 80,
    width: 75,
    height: 75,
    speed: 10,
    dx: 0,
    health: 3, // Player health
    emoji: "❤️" // Heart emoji to represent health
};

// Enemy array
let enemies = [];
let bullets = [];
let enemyBullets = []; // Array for enemy bullets

let isShooting = false;
let bulletColor = "red"; // Default bullet color

// **Automatic Player Shooting Every 250ms**
// setInterval(() => {
//     bullets.push({ 
//         x: player.x + player.width / 2 - 2.5, 
//         y: player.y, 
//         width: 5, 
//         height: 10, 
//         color: bulletColor 
//     });
// }, 250);

// **Keyboard Controls**
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") player.dx = -player.speed;
    if (e.key === "ArrowRight") player.dx = player.speed;
    if (e.code === "Space") {
        isShooting = true; 
        bulletColor = "yellow"; // Change bullet color to yellow when space is held
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.dx = 0;
    if (e.code === "Space") {
        isShooting = false; 
        bulletColor = "red"; // Revert bullet color when space is released
    }
});

// **Manual Bullet Shooting (Space)**
setInterval(() => {
    if (isShooting) {
        bullets.push({ 
            x: player.x + player.width / 2 - 2.5, 
            y: player.y, 
            width: 5, 
            height: 10, 
            color: bulletColor 
        });
    }
}, 150);

// Move Player
function movePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Draw Player
function drawPlayer() {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// Draw Bullets
function drawBullets() {
    bullets.forEach((bullet, index) => {
        ctx.fillStyle = bullet.color;
        bullet.y -= 7;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        if (bullet.y < 0) bullets.splice(index, 1); // Remove bullet if off-screen
    });
}

// Create Enemies
let enemySpeed = 0.5; // Initial enemy speed
let speedIncrement = 0.1; // How much speed increases over time

// Create Enemies
function spawnEnemy() {
    const x = Math.random() * (canvas.width - 80);
    enemies.push({ x, y: 0, width: 80, height: 80, speed: enemySpeed, canShoot: Math.random() > 0.5 });

    // Increase enemy speed slightly after each spawn
    enemySpeed += speedIncrement;
}
setInterval(spawnEnemy, 1500);


// Enemy Shooting
function enemyShoot() {
    enemies.forEach((enemy) => {
        if (Math.random() > 0.5) { // 50% chance to shoot every interval
            enemyBullets.push({
                x: enemy.x + enemy.width / 2 - 2.5,
                y: enemy.y + enemy.height,
                width: 5,
                height: 10,
                color: "white",
                speed: 5
            });
        }
    });
}
setInterval(enemyShoot, 1000); // Enemies shoot every second

// Draw Enemies & Check Collisions
function drawEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);


        // Bullet-Enemy Collision
        bullets.forEach((bullet, bIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemies.splice(index, 1);
                bullets.splice(bIndex, 1);
                player.health++;
            }
        });
    });
}

// Draw Enemy Bullets & Check Player Hit
function drawEnemyBullets() {
    enemyBullets.forEach((bullet, index) => {
        ctx.fillStyle = bullet.color;
        bullet.y += bullet.speed;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Remove bullet if off-screen
        if (bullet.y > canvas.height) {
            enemyBullets.splice(index, 1);
        }

        // Check if enemy bullet hits the player
        if (
            bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y
        ) {
            enemyBullets.splice(index, 1);
            player.health--;

            if (player.health <= 0) {

                document.location.reload();
            }
        }
    });
}

// Display Player Health
function drawHealth() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Health: ${player.health}`, 20, 30);
}

// Game Loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawEnemyBullets();
    drawHealth();
    requestAnimationFrame(update);
}

update();
