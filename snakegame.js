const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const score_title = document.querySelector(".score");
const game_Over = document.querySelector("#gameOver");
const game_Win = document.querySelector("#gameWin");
const final_score_over = document.querySelector(".finalScoreOver");
const final_score_win = document.querySelector(".finalScoreWin");
const eatAudio = new Audio("apple-bite-short.mp3");

let sound = false;
let gameid;
canvas.width = 200;
canvas.height = 200;

let maxPoints = 8000;
let maxPointsDublicat = maxPoints;
let widthmode = 200;
let heightmode = widthmode; 
let apples = [];
let max = canvas.width/10;
let gamestart = false;
let score = 0;
let speed = 150;
let walls = [];
let snake = [{x: 1, y: 1}];
let wallsWill;

let direction = 'right';    
let nextdirection = 'right';



function wallCreate(a){
  walls.length = 0;
  for(let i = a; i > 0; i--){
    let newX = rand(0, max);
    let newY = rand(0, max);
    
    const inSnake = snake.some(part => part.x === newX && part.y === newY);
    const inApple = apples.some(part => part.x === newX && part.y === newY);
    const inWall = walls.some(part => part.x === newX && part.y === newY);
    if (!inSnake && !inApple && !inWall ){
        walls.push({ x: newX, y: newY });
    }
    else
      i++;
  }
  return;
}

$("[data-level]").click(function(){
  if(!gamestart){
    maxPoints = maxPointsDublicat;
    wallsWill = 0;
    walls.length = 0;
    speed = 150;
    if($(this).data("level") > 5 && $(this).data("level") != 0){
      speed = $(this).data("level");
    }

    if($(this).data("level") <= 5 && $(this).data("level") != 0){
      wallsWill = $(this).data("level");
      wallCreate(wallsWill);
      maxPoints-=wallsWill*20;
      console.log(maxPoints);
    }

    $(`.level`).removeClass("active");

    $(this).addClass("active");

    ctx.clearRect(0,0,canvas.width,canvas.height);
    NewApple();
    drawSnake();
    drawWalls();
  } 
});



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
  wallCreate(wallsWill);
  drawWalls();
});



$("[data-modal]").click(function(){
  let modalId = $(this).data("modal");

  $(`#${modalId}`).addClass("active");
});



$("[data-close]").click(function(){
  let modalId = $(this).data("close");

  $(`#${modalId}`).removeClass("active");
});


$("[data-sound").click(function(){
  sound = !sound;
  let soundImg = document.querySelector("#sound");
  if(sound)
    soundImg.src = "http://127.0.0.1:5500/Papki/Zmeika/pngwing.com (1).png";
  else
    soundImg.src = "http://127.0.0.1:5500/Papki/Zmeika/pngwing.com(2).png";
});


$("[data-mode]").click(function(){
  if(gamestart == true)
    return;

  apples = [];
  snake = [{x: 1, y: 1}];
  direction = nextdirection = 'right';

  let mode = $(this).data("mode");
  const points = document.getElementById(mode);
  maxPoints = points.classList[1];
  maxPointsDublicat = maxPoints;
  widthmode = heightmode = points.classList[2];
  canvas.width = widthmode;
  canvas.height = heightmode;
  max = canvas.width/10;


  for(let i = $(this).data("level"); i > 0; i--)
    walls.push({x: rand(0,max), y: rand(0,max)});

  $(`#modeSmall`).removeClass("active");
  
  $(`#modeMedium`).removeClass("active");
  
  $(`#modeLarge`).removeClass("active");

  $(`#${mode}`).addClass("active");

  ctx.clearRect(0,0,canvas.width,canvas.height);
  wallCreate(wallsWill);
  NewApple();
  drawSnake();
  drawWalls();
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



function NewApple(){
  const targetCount = Math.max(1, Math.floor(widthmode / 100));
  while (apples.length < targetCount) {
      let newX = rand(0, max);
      let newY = rand(0, max);
      
      const inSnake = snake.some(part => part.x === newX && part.y === newY);
      const inWall = walls.some(part => part.x === newX && part.y === newY);
      if (!inSnake && !inWall) {
          apples.push({ x: newX, y: newY });
      }
  }
  ctx.fillStyle = "red";
  apples.forEach((apple) => ctx.fillRect(apple.x*10+1,apple.y*10+1,8,8));
  return;
}



function drawSnake(){
  ctx.fillStyle = "green";
  snake.forEach((snake) => ctx.fillRect(snake.x*10+1,snake.y*10+1,8,8));
  return;
}



function drawWalls(){
  ctx.fillStyle = "gray";
  walls.forEach((wall) => ctx.fillRect(wall.x*10+1,wall.y*10+1,8,8));
  return;
}



function draw(){
  direction = nextdirection;
  
  let head = { ...snake[0] }; // копирует первый элемент массива snake

  if (direction === "right") head.x++;
  else if (direction === "left") head.x--;
  else if (direction === "up") head.y--;
  else if (direction === "down") head.y++;

  /*-Если не найдет в массиве индекс с такими показателями, то вернет -1 в ином случае поражение-*/
  const snakeBody = snake.findIndex(snake => head.x == snake.x && head.y == snake.y);
  const wallIndex = walls.findIndex(walls => head.x == walls.x && head.y == walls.y);
  /*---------------------------------------------------------------------------------------------*/


  /*----------------------------Проверка на проигрыша----------------------------*/
  if(head.x >= max || head.x < 0 || head.y >= max || head.y < 0 || snakeBody != -1 || wallIndex != -1){
    gamestart = false;
    final_score_over.innerText = `Ваш счeт : ${score}`;
    game_Over.classList.add("active");
    clearInterval(gameid);
    return;
  }
  /*-----------------------------------------------------------------------------*/

  /*----------------------------Проверка на съедение яблок----------------------------*/
  const appleIndex = apples.findIndex(apple => head.x == apple.x && head.y == apple.y);
  if(appleIndex != -1){
    if(sound)
      eatAudio.play();
    apples.splice(appleIndex, 1);
    snake.unshift(head); 
    score+=20;
    score_title.innerText = score;
    /*----------------------------------------------------------------------------------*/

    /*----------------------------Проверка на победу----------------------------*/
    if(score == maxPoints){
      gamestart = false;
      final_score_win.innerText = `Ваш счeт : ${score}`;
      game_Win.classList.add("active");
      clearInterval(gameid);
      return;
    }
    /*--------------------------------------------------------------------------*/
  }

   else{
    snake.unshift(head); 
    snake.pop();
   }

   ctx.clearRect(0,0,canvas.width,canvas.height);
   NewApple();
   drawSnake();
   drawWalls();

   ctx.fillStyle = "darkgreen";
   ctx.fillRect(head.x*10+1,head.y*10+1,8,8);
};
  
$("[data-start]").click(function(){
  if(gamestart != true){
    nextdirection = "right";
    gamestart = true;
    gameid = setInterval(draw,speed);
  }
});

$("[data-stop]").click(function(){
  let stopButton = document.getElementsByClassName("stop-btn");
  
  if(gamestart == false){
    gamestart = true;
    stopButton[0].innerText = "ПАУЗА";
    gameid = setInterval(draw,speed);
    return;
  }
  if(gamestart == true){
    gamestart = false;
    stopButton[0].innerText = "ПРОДОЛЖИТЬ";
    clearInterval(gameid);
    return;
  }
}); 

NewApple();
drawSnake();
drawWalls();