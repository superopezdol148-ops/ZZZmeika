const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 200;
canvas.height = 200;

let maxPoints = 4000;
let widthmode = 200;
let heightmode = widthmode; 
let apples = [{x:5,y:5},{x:4,y:4}];
let cell = 10;
let max = canvas.width/10;
let gamestart = false;

let direction = 'right';    

let snake = [{x: 1, y: 1}];

$("[data-mode]").click(function(){
  apples = [];
  if(gamestart == true)
    gamestart = false;
  let mode = $(this).data("mode");
  let points = document.getElementById(mode);
  maxPoints = points.classList[1];
  widthmode = heightmode = points.classList[2];
  canvas.width = widthmode;
  canvas.height = heightmode;
  max = canvas.width/10;
  $(`#modeSmall`).apples.unshift(`{x: ${points.classList[3]}, y: ${points.classList[3]}}`);
  $(`#modeMedium`).apples.unshift(`{x: ${points.classList[3]}, y: ${points.classList[3]}},{x: ${points.classList[3]-1}, y: ${points.classList[3]-1}}`);
  $(`#modeLarge`).apples.unshift(`{x: ${points.classList[3]}, y: ${points.classList[3]}},{x: ${points.classList[3]-1}, y: ${points.classList[3]-1}},{x: ${points.classList[3]+1}, y: ${points.classList[3]+1}}`);
  console.log(apples);
  $(`#modeSmall`).removeClass("active");
  
  $(`#modeMedium`).removeClass("active");
  
  $(`#modeLarge`).removeClass("active");

  $(`#${mode}`).addClass("active");
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
  ctx.fillStyle = "red";
  ctx.fillRect(rand(-1,max-1)*10,rand(-1,max-1)*10,10,10);
}
function drawSnake(){
  ctx.fillStyle = "green";
  ctx.fillRect(snake[0].x*10,snake[0].y*10,10,10);
}
function gameStart(){
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
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head); 
    snake.pop();
  }
  else
    clearInterval(gameid);
  };
  const gameid = setInterval(draw,100);
};

$("[data-start]").click(function(){
  gamestart = true;
  gameStart();
});

draw();