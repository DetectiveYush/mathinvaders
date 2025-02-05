const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

console.log("Canvas initialized:", canvas.width, canvas.height);

let enemies = [];
let score = 0;

// Load spaceship image
const spaceshipImg = new Image();
spaceshipImg.src = "https://i.imgur.com/Opk0TjT.png"; // Replace with a proper spaceship sprite

spaceshipImg.onload = () => {
    console.log("Spaceship image loaded successfully.");
};

// Enemy class
class Enemy {
    constructor(x, y, problem, answer) {
        this.x = x;
        this.y = y;
        this.problem = problem;
        this.answer = answer;
        this.speed = 1.5;
        this.destroyed = false;
    }

    move() {
        if (!this.destroyed) {
            this.y += this.speed;
        }
    }

    draw() {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(this.problem, this.x + 10, this.y - 5);
        ctx.drawImage(spaceshipImg, this.x, this.y, 50, 50);
    }
}

// Generate a math problem
function generateProblem() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operator = ['+', '-', '*'][Math.floor(Math.random() * 3)];
    let answer;

    switch (operator) {
        case '+': answer = num1 + num2; break;
        case '-': answer = num1 - num2; break;
        case '*': answer = num1 * num2; break;
    }

    return { text: `${num1} ${operator} ${num2}`, answer };
}

// Spawn a new enemy
function spawnEnemy() {
    let problem = generateProblem();
    let x = Math.random() * (canvas.width - 50);
    let enemy = new Enemy(x, 50, problem.text, problem.answer);
    enemies.push(enemy);
    console.log("Spawned enemy:", problem.text, "=", problem.answer);
}

// Update the game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    enemies.forEach((enemy, index) => {
        enemy.move();
        enemy.draw();

        // Remove enemies that leave the screen
        if (enemy.y > canvas.height) {
            console.log("Enemy left the screen:", enemy.problem);
            enemies.splice(index, 1);
        }
    });

    requestAnimationFrame(update);
}

// Handle user input
const answerInput = document.getElementById("answer");
answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        let userAnswer = parseInt(answerInput.value);
        let enemyIndex = enemies.findIndex(enemy => enemy.answer === userAnswer);

        if (enemyIndex !== -1) {
            console.log("Correct answer! Destroying enemy:", enemies[enemyIndex].problem);
            enemies.splice(enemyIndex, 1); // Remove enemy
            score++;
        } else {
            console.log("Incorrect answer:", userAnswer);
        }

        answerInput.value = "";
    }
});

// Start game
spawnEnemy();  // Spawn one enemy immediately
setInterval(spawnEnemy, 2000); // Spawn new enemy every 2 seconds
update();
