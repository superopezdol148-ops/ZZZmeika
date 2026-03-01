const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const score_title = document.querySelector(".score");

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

let snake = [{x: 1, y: 1}];

$("[data-mode]").click(function(){
  if(gamestart == true)
    return;

  apples = [];
  snake = [{x: 1, y: 1}];
  direction = 'right';

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
    direction = "left";
  else if (e.keyCode == 38 && direction != "down") 
    direction = "up";
  else if (e.keyCode == 39 && direction != "left") 
    direction = "right";
  else if (e.keyCode == 40 && direction != "up") 
    direction = "down";
  console.log(direction);
});

function rand(min, max){
  let x = Math.random() * (max - min) + min
  return Math.trunc(x);
}
console.log(rand(0, 10));

function NewApple(){
  if(apples.length<widthmode/100){
  let newX = rand(-1,max);
  let newY = rand(-1,max);
  apples.push({x: newX, y: newY});
  console.log(apples.length);
  }
  if(apples.length<widthmode/100)
    NewApple();
  ctx.fillStyle = "red";
  apples.forEach((apple) => ctx.fillRect(apple.x*10,apple.y*10,10,10));
}

function drawSnake(){
  ctx.fillStyle = "green";
  snake.forEach((snake) => ctx.fillRect(snake.x*10,snake.y*10,10,10));
}
  function draw(){
  if(gamestart){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    NewApple();
    drawSnake();
    let dx,dy;
    switch(direction){
        case "right":
          dx = 1;
          dy = 0;
        break;
        case "left":
          dx = -1;
          dy = 0;
        break;
        case "up":
          dx = 0;
          dy = -1;
        break;
        case "down":
          dx = 0;
          dy = 1;
        break;
      }
      const head = {x: snake[0].x + dx,y: snake[0].y + dy};
      const appleIndex = apples.findIndex(apple => head.x === apple.x && head.y === apple.y);
      if(appleIndex !== -1){
        apples.splice(appleIndex, 1);
        snake.unshift(head); 
        score+=20;
        score_title.innerText = score;
      }
      else{
        snake.unshift(head); 
        snake.pop();
      }
        
    }
      else
        clearInterval(gameid);
  };
  
$("[data-start]").click(function(){
  gamestart = true;
  const gameid = setInterval(draw,100);
});

NewApple();
drawSnake();