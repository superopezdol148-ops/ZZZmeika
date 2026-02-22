const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 200;
canvas.height = 200;

let maxPoints;
let widthmode;
let heightmode;

let direction = 'right';    

snake = [{x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}];

$("[data-mode]").click(function(){
  let mode = $(this).data("mode");
  let points = document.getElementById(mode);
  maxPoints = points.classList[1];
  widthmode = heightmode = points.classList[2];
  canvas.width = widthmode;
  canvas.height = heightmode;
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

//let gameisstart = setInterval(gameStart, 1000);

function gameStart(){
  
};


$("[data-start]").click(function(){
  gameStart();
});