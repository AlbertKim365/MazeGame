// 캔버스 설정
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800; // 캔버스 가로
canvas.height = 800; // 캔버스 세로

// 미로 크기 설정
const mazeRows = 19; // 세로 크기 (홀수)
const mazeCols = 19; // 가로 크기 (홀수)
const cellSize = canvas.width / mazeCols; // 한 칸 크기

// 초기 미로 배열 생성 (모든 칸을 벽으로 초기화)
let maze = Array.from({ length: mazeRows }, () =>
  Array(mazeCols).fill(1)
);

// 방향 벡터 (위, 아래, 왼쪽, 오른쪽)
const directions = [
  [-1, 0], // 위
  [1, 0],  // 아래
  [0, -1], // 왼쪽
  [0, 1],  // 오른쪽
];

// 미로 생성 함수
function generateMaze(x, y) {
  maze[y][x] = 0; // 현재 칸을 길로 설정
  const shuffledDirections = directions.sort(() => Math.random() - 0.5); // 방향 섞기

  shuffledDirections.forEach(([dx, dy]) => {
    const nx = x + dx * 2; // 다음 x 좌표
    const ny = y + dy * 2; // 다음 y 좌표

    if (
      nx > 0 && nx < mazeCols - 1 &&
      ny > 0 && ny < mazeRows - 1 &&
      maze[ny][nx] === 1
    ) {
      maze[y + dy][x + dx] = 0; // 벽을 허물어 길로 만듦
      generateMaze(nx, ny); // 재귀 호출로 다음 칸 처리
    }
  });
}

// 미로 경로 연결 확인 함수
function isPathConnected() {
  const visited = Array.from({ length: mazeRows }, () =>
    Array(mazeCols).fill(false)
  );

  function dfs(x, y) {
    if (x < 0 || y < 0 || x >= mazeCols || y >= mazeRows || visited[y][x] || maze[y][x] === 1) {
      return false;
    }
    visited[y][x] = true;
    if (x === goal.x && y === goal.y) {
      return true; // 출구에 도달
    }
    // 상하좌우 탐색
    return (
      dfs(x + 1, y) ||
      dfs(x - 1, y) ||
      dfs(x, y + 1) ||
      dfs(x, y - 1)
    );
  }

  return dfs(player.x, player.y); // 시작점에서 DFS 탐색
}

// 미로 초기화
function initMaze() {
  do {
    maze = Array.from({ length: mazeRows }, () => Array(mazeCols).fill(1)); // 초기화
    generateMaze(1, 1); // 새로운 미로 생성
    maze[mazeRows - 2][mazeCols - 2] = 0; // 출구 설정
  } while (!isPathConnected()); // 경로가 연결될 때까지 반복
}

// 플레이어 초기 위치
const player = { x: 1, y: 1 };

// 출구 위치
const goal = { x: mazeCols - 2, y: mazeRows - 2 };

// 키보드 입력 처리
document.addEventListener("keydown", (event) => {
  const { x, y } = player;
  switch (event.key) {
    case "ArrowUp":
      if (maze[y - 1][x] === 0) player.y--;
      break;
    case "ArrowDown":
      if (maze[y + 1][x] === 0) player.y++;
      break;
    case "ArrowLeft":
      if (maze[y][x - 1] === 0) player.x--;
      break;
    case "ArrowRight":
      if (maze[y][x + 1] === 0) player.x++;
      break;
    case "r":
    case "R":
      resetGame(); // R 키로 재시작
      break;
  }

  // 출구 도착 확인
  if (player.x === goal.x && player.y === goal.y) {
    alert("You Win!");
    resetGame();
  }
});

// 게임 초기화
function resetGame() {
  player.x = 1;
  player.y = 1;
  initMaze(); // 미로 다시 생성
}

// 미로 그리기
function drawMaze() {
  maze.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      ctx.fillStyle = cell === 1 ? "#fff" : "#000"; // 벽은 흰색, 길은 검정색
      ctx.fillRect(
        colIndex * cellSize,
        rowIndex * cellSize,
        cellSize,
        cellSize
      );
    });
  });
}

// 플레이어 그리기
function drawPlayer() {
  ctx.fillStyle = "#ff0000"; // 플레이어 색상
  ctx.fillRect(
    player.x * cellSize,
    player.y * cellSize,
    cellSize,
    cellSize
  );
}

// 출구 그리기
function drawGoal() {
  ctx.fillStyle = "#00ff00"; // 출구 색상
  ctx.fillRect(
    goal.x * cellSize,
    goal.y * cellSize,
    cellSize,
    cellSize
  );
}

// 게임 루프
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 화면 초기화
  drawMaze(); // 미로 그리기
  drawPlayer(); // 플레이어 그리기
  drawGoal(); // 출구 그리기
  requestAnimationFrame(gameLoop); // 반복
}

// 게임 시작
initMaze();
gameLoop();
