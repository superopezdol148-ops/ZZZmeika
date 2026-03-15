const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const score_title = document.querySelector(".score");
const game_Over = document.querySelector("#gameOver");
const game_Win = document.querySelector("#gameWin");
const final_score_over = document.querySelector(".finalScoreOver");
const final_score_win = document.querySelector(".finalScoreWin");

let gameid;
canvas.width = 200;
canvas.height = 200;

let maxPoints = 4000;
let widthmode = 200;
let heightmode = widthmode; 
let apples = [];
let cell = 10;
let max = canvas.width/10;
let gamestart = false;
let score = 0;

let direction = 'right';    
let nextdirection = 'right';

let snake = [{x: 1, y: 1}];

$("[data-over]").click(function(){
  game_Over.classList.remove("active");
  game_Win.classList.remove("active");
  apples = [];
  snake = [{x: 1, y: 1}];
  direction = nextdirection = 'right';
  score = 0;
  score_title.innerText = score;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  NewApple();
  drawSnake();
});

$("[data-mode]").click(function(){
  if(gamestart == true)
    return;

  apples = [];
  snake = [{x: 1, y: 1}];
  direction = nextdirection = 'right';

  let mode = $(this).data("mode");
  let points = document.getElementById(mode);
  maxPoints = points.classList[1];
  widthmode = heightmode = points.classList[2];
  canvas.width = widthmode;
  canvas.height = heightmode;
  max = canvas.width/10;

  $(`#modeSmall`).removeClass("active");
  
  $(`#modeMedium`).removeClass("active");
  
  $(`#modeLarge`).removeClass("active");

  $(`#${mode}`).addClass("active");

  ctx.clearRect(0,0,canvas.width,canvas.height);
  NewApple();
  drawSnake();
});

document.addEventListener("keydown", (e) => {
  if (e.keyCode == 37 && direction != "right")
    nextdirection = "left";
  else if (e.keyCode == 38 && direction != "down") 
    nextdirection = "up";
  else if (e.keyCode == 39 && direction != "left") 
    nextdirection = "right";
  else if (e.keyCode == 40 && direction != "up") 
    nextdirection = "down";
});

function rand(min, max){
  let x = Math.random() * (max - min) + min
  return Math.trunc(x);
}
console.log(rand(0, 10));

function NewApple(){
  const targetCount = Math.max(1, Math.floor(widthmode / 100));
  while (apples.length < targetCount) {
      let newX = rand(0, max);
      let newY = rand(0, max);
      
      const inSnake = snake.some(part => part.x === newX && part.y === newY);
      if (!inSnake) {
          apples.push({ x: newX, y: newY });
      }
  }
  ctx.fillStyle = "red";
  apples.forEach((apple) => ctx.fillRect(apple.x*10+1,apple.y*10+1,8,8));
}

function drawSnake(){
  ctx.fillStyle = "green";
  snake.forEach((snake) => ctx.fillRect(snake.x*10+1,snake.y*10+1,8,8));
}
  function draw(){
  if(gamestart){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    NewApple();
    drawSnake();

    direction = nextdirection;
    let head = { ...snake[0] };

    if (direction === "right") head.x++;
    else if (direction === "left") head.x--;
    else if (direction === "up") head.y--;
    else if (direction === "down") head.y++;

    const snakeBody = snake.findIndex(snake => head.x == snake.x && head.y == snake.y);
    if(head.x > max || head.x < 0 || head.y > max || head.y < 0 || snakeBody != -1){
      gamestart = false;
      final_score_over.innerText = `Ваш счeт : ${score}`;
      game_Over.classList.add("active");
      clearInterval(gameid);
    }

    const appleIndex = apples.findIndex(apple => head.x == apple.x && head.y == apple.y);
    if(appleIndex != -1){
      apples.splice(appleIndex, 1);
       snake.unshift(head); 
      ctx.clearRect(0,0,canvas.width,canvas.height);
      NewApple();
      drawSnake();
      score+=20;
      score_title.innerText = score;
      if(score == maxPoints){
        gamestart = false;
        final_score_win.innerText = `Ваш счeт : ${score}`;
        game_Win.classList.add("active");
        clearInterval(gameid);
      }
    }

     else{
      snake.unshift(head); 
      snake.pop();
     }
        
   }
    else{
       clearInterval(gameid);
    }
  };
  
$("[data-start]").click(function(){
  if(gamestart != true){
    gamestart = true;
    gameid = setInterval(draw,150);
  }
});

NewApple();
drawSnake();