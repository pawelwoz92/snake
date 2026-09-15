const game = document.getElementById("game");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");
const startButton = document.getElementById("startButton");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");

let highScore = Number(localStorage.getItem("snakeHighScore")) || 3;
let gameLoop;

highScoreDisplay.textContent = `HI ${highScore}`;
overlayText.textContent = `HIGH SCORE: ${highScore}`;

startButton.addEventListener("click", function(){
    reset();
    render();
    overlay.classList.add("hidden");
    gameLoop = setInterval(move, 200);
});

const direction = {
    x: 1,
    y: 0,
}
const food = {
    x: 15,
    y: 3,
}
let snake = [
    { x: 10, y: 3 },
    { x: 9, y: 3 },
    { x: 8, y: 3 }
]
function reset() {
 direction.x = 1;
 direction.y = 0;
    snake = [
    { x: 10, y: 3 },
    { x: 9, y: 3 },
    { x: 8, y: 3 }];
    food.x = 15;
    food.y = 3;
}
function move() {



    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
    }
 
    // WRAP 
    if (newHead.x > 19) {
    newHead.x = 0;
}

if (newHead.x < 0) {
    newHead.x = 19;
}

if (newHead.y > 14) {
    newHead.y = 0;
}

if (newHead.y < 0) {
    newHead.y = 14;
}

// COLLISION
const collision = snake.some((segment) => {
    return segment.x === newHead.x && segment.y === newHead.y;
})

if(collision) {
    clearInterval(gameLoop);
    if (snake.length > highScore){
        highScore = snake.length;
        localStorage.setItem("snakeHighScore", highScore);
    }

    highScoreDisplay.textContent = `HI ${highScore}`;

    overlayText.innerHTML = `
                        GAME OVER <br>
                        Length: ${snake.length}<br>
                        HIGH SCORE: ${highScore}                     
                        `;
    startButton.textContent = "PLAY AGAIN";
    overlay.classList.remove("hidden");
return;
}

   snake.unshift(newHead);

   // FOOD
    if(newHead.x === food.x && newHead.y === food.y) 
    {
        food.x = Math.floor(Math.random()*20);
        food.y = Math.floor(Math.random()*15);
    }else{
    snake.pop()
    };
    render();
}


function changeDirection(key) {
    if (key === "w" && direction.y !== 1) {
        direction.x = 0;
        direction.y = -1;
    }

    if (key === "s" && direction.y !== -1) {
        direction.x = 0;
        direction.y = 1;
    }

    if (key === "a" && direction.x !== 1) {
        direction.x = -1;
        direction.y = 0;
    }

    if (key === "d" && direction.x !== -1) {
        direction.x = 1;
        direction.y = 0;
    }
        updateControls();
}

document.addEventListener("keydown",function(event){
changeDirection(event.key);
   
})

document.querySelectorAll("#controls button").forEach((button) => {
    button.addEventListener("click", function() {
        changeDirection(button.dataset.dir);
    });
});

function render(){
    game.innerHTML = "";
        scoreDisplay.textContent = String(snake.length).padStart(4, "0");
    const foodIndex = food.y*20 + food.x;

    for (let i = 0; i<300; i++)
{
    const tile = document.createElement("div");

    tile.classList.add("tile");   
    if (i === foodIndex){
        tile.classList.add("food");
    }
   
    snake.forEach((segment) => {
        const segmentIndex = segment.y * 20 + segment.x;
        if ( segmentIndex === i) {
            tile.classList.add("player");
        }
    });

    game.appendChild(tile);
}

}
function updateControls() {
    document.querySelectorAll("#controls button").forEach((button) => {
        button.classList.remove("active");
    });

    let currentDirection;

    if (direction.x === 1) {
        currentDirection = "d";
    }

    if (direction.x === -1) {
        currentDirection = "a";
    }

    if (direction.y === 1) {
        currentDirection = "s";
    }

    if (direction.y === -1) {
        currentDirection = "w";
    }

    const activeButton = document.querySelector(
        `#controls button[data-dir="${currentDirection}"]`
    );

    activeButton.classList.add("active");
}
// let gameLoop = setInterval(move,200);
render();