const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const scoreElement = document.getElementById('score');

let score = 0;
let gameOver = false;
let enemies = [];
let bullets = [];

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    speed: 5,
    color: 'blue',
    dx: 0,
    dy: 0,
};

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function movePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    // Boundary detection
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function handleKeyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = -player.speed;
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
        player.dy = -player.speed;
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        player.dy = player.speed;
    } else if (e.key === ' ') {
        // Shoot bullet
        bullets.push({
            x: player.x + player.width / 2,
            y: player.y,
            width: 5,
            height: 10,
            speed: 7,
        });
    }
}

function handleKeyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = 0;
    }
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'ArrowDown' || e.key === 's') {
        player.dy = 0;
    }
}

function drawBullets() {
    bullets.forEach((bullet, index) => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;

        // Remove bullets that leave the screen
        if (bullet.y + bullet.height < 0) {
            bullets.splice(index, 1);
        }
    });
}

function spawnEnemy() {
    const size = Math.random() * 40 + 20;
    enemies.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        width: size,
        height: size,
        speed: Math.random() * 2 + 1,
        color: 'red',
    });
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.y += enemy.speed;

        // Check if enemy reaches player (game over)
        if (enemy.y + enemy.height > player.y && enemy.x < player.x + player.width && enemy.x + enemy.width > player.x) {
            gameOver = true;
        }

        // Remove enemies that leave the screen
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
}

function checkBulletHit() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                // Bullet hits enemy
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
                score += 10;
                scoreElement.textContent = score;
            }
        });
    });
}

function update() {
    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    drawPlayer();
    drawBullets();
    drawEnemies();
    checkBulletHit();

    requestAnimationFrame(update);
}

// Spawn enemies every 2 seconds
setInterval(spawnEnemy, 2000);

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

update();
