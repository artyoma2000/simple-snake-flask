document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreElement = document.getElementById("score");

    const gridSize = 20;
    let snake = [{ x: 10, y: 10 }];
    let food = {};
    let direction = "right";
    let gameLoop;
    let score = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        ctx.fillStyle = "green";
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });

        // Draw food
        ctx.fillStyle = "red";
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

        // Draw score
        scoreElement.textContent = "Score: " + score;
    }

    function move() {
        const head = { x: snake[0].x, y: snake[0].y };

        // Update direction
        switch(direction) {
            case "up":
                head.y -= 1;
                break;
            case "down":
                head.y += 1;
                break;
            case "left":
                head.x -= 1;
                break;
            case "right":
                head.x += 1;
                break;
        }

        // Check collision with walls or self
        if (head.x < 0 || head.x * gridSize >= canvas.width || head.y < 0 || head.y * gridSize >= canvas.height || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            clearInterval(gameLoop);
            alert("Игра окончена! Очки: " + score);
            // Сохранение результатов игры
            saveScore();
            return;
        }

        // Check if food is eaten
        if (head.x === food.x && head.y === food.y) {
            snake.unshift(head);
            generateFood();
            score += 10;
        } else {
            snake.unshift(head);
            snake.pop();
        }
    }

    function generateFood() {
        food.x = Math.floor(Math.random() * (canvas.width / gridSize));
        food.y = Math.floor(Math.random() * (canvas.height / gridSize));
        // Check if food overlaps with snake
        if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            generateFood();
        }
    }

    function startGame() {
        snake = [{ x: 10, y: 10 }];
        generateFood();
        score = 0;
        gameLoop = setInterval(() => {
            move();
            draw();
        }, 100);
    }

    function saveScore() {
        const playerName = prompt("Введите ваше имя:");
        if (playerName) {
            fetch("/save_score", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ player_name: playerName, score: score })
            })
            .then(response => {
                if (response.ok) {
                    alert("Результат игры сохранен успешно!");
                } else {
                    alert("Произошла ошибка при сохранении результата игры.");
                }
            })
            .catch(error => {
                console.error("Ошибка при сохранении результата игры:", error);
                alert("Произошла ошибка при сохранении результата игры.");
            });
        }
    }

    document.getElementById("startButton").addEventListener("click", startGame);

    // Change direction on arrow key press
    document.addEventListener("keydown", function(event) {
        switch(event.key) {
            case "ArrowUp":
                if (direction !== "down") direction = "up";
                break;
            case "ArrowDown":
                if (direction !== "up") direction = "down";
                break;
            case "ArrowLeft":
                if (direction !== "right") direction = "left";
                break;
            case "ArrowRight":
                if (direction !== "left") direction = "right";
                break;
        }
    });

});
