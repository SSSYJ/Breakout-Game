const rules = document.getElementById("rules");
const open = document.getElementById("open-rules");
const close = document.getElementById("close-rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;
//-------------------------------------Ball------------------------
// Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

// Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#a6e3e9";
  ctx.fill();
  ctx.closePath();
}

// Move ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall Collision
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
  } else if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.dy *= -1;
  }

  // Paddle Collision
  if (
    ball.x - ball.radius > paddle.x &&
    ball.x + ball.radius < paddle.x + paddle.width &&
    ball.y + ball.radius > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // Bricks Collision
  bricks.forEach((col) => {
    col.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.radius > brick.x &&
          ball.x + ball.radius < brick.x + brick.width &&
          ball.y + ball.radius > brick.y &&
          ball.y - ball.radius < brick.y + brick.height
        ) {
          brick.visible = false;
          ball.dy *= -1;
          score++;
        } else if (
          ball.y - ball.radius > brick.y &&
          ball.y + ball.radius < brick.y + brick.height &&
          ball.x + ball.radius > brick.x &&
          ball.x - ball.radius < brick.x + brick.width
        ) {
          brick.visible = false;
          ball.dx *= -1;
          score++;
        }
      }
    });
  });

  // Miss & Reset
  if (ball.y + ball.radius > canvas.height) {
    score = 0;
    bricks.forEach((col) => {
      col.forEach((brick) => {
        if (!brick.visible) {
          brick.visible = true;
        }
      });
    });
  }
}

//-------------------------------------Paddle------------------------
// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  width: 80,
  height: 10,
  speed: 8,
  dx: 0,
};

// Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = "#a6e3e9";
  ctx.fill();
  ctx.closePath();
}

// Move paddle
function movePaddle() {
  paddle.x += paddle.dx;

  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  } else if (paddle.x < 0) {
    paddle.x = 0;
  }
}

//-------------------------------------Bricks------------------------
// Create brick props
const brickInfo = {
  width: 60,
  height: 20,
  padding: 10,
  visible: true,
};

// Create bricks
const bricks = [];
for (i = 0; i < 10; i++) {
  bricks[i] = [];
  for (j = 0; j < 6; j++) {
    const x = 45 + i * (brickInfo.width + brickInfo.padding);
    const y = 60 + j * (brickInfo.height + brickInfo.padding);
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// Draw bricks on canvas
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.width, brick.height);
      ctx.fillStyle = brick.visible ? "#a6e3e9" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

//-------------------------------------Score------------------------
// Draw score on canvas
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#112d4e";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

//-------------------------------------Everything------------------------
// Draw everything
function draw() {
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

function update() {
  movePaddle();
  moveBall();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw();
  requestAnimationFrame(update);
}

update();

// Keyboard event handler
document.addEventListener("keydown", (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
});

document.addEventListener("keyup", () => {
  paddle.dx = 0;
});

// Open and Close rules event handlers
open.addEventListener("click", () => {
  rules.classList.add("open-rules");
});

close.addEventListener("click", () => {
  rules.classList.remove("open-rules");
});
