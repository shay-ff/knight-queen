
const globalFalse = [1, 4, 7, 10, 12, 14, 19, 20, 21, 25, 26, 27, 28, 29, 30, 31, 32, 35, 36, 37, 42, 44, 46, 49, 52, 55, 60];
let chessBoard;
var playSound = true;

function getRowCol(id) {
    // console.log(id);
    // Calculate row and column based on 1-based indexing
    var row = Math.floor((id - 1) / 8) + 1;
    var col = ((id - 1) % 8) + 1;
    
    // console.log(row, col);
    return [row, col];
}
function isLegalMove(start, end) {
    const [startRow, startCol] = getRowCol(start);
    const [endRow, endCol] = getRowCol(end);

    if(globalFalse.includes(end)){
        // console.log("end is false", end);
        return false;
    }
    let dx = [ 2, 1, -1, -2, -2, -1, 1, 2 ];
    let dy = [ 1, 2, 2, 1, -1, -2, -2, -1 ];

    for(let x = 0; x < 8; ++x){
        let new_x = startRow + dx[x];
        let new_y = startCol + dy[x];
        if(new_x === endRow && new_y === endCol){
            return true;
        }
    }
    return false;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.dropEffect = 'none';
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    // i want to know from which div the image is being dragged
    const currDiv = document.getElementById(data).parentNode;
    const currDivId = parseInt(currDiv.id);
    const targetDivId = parseInt(ev.target.id);
    // console.log(currDivId, targetDivId);
    if(isLegalMove(currDivId, targetDivId) || currDivId === targetDivId){
        ev.target.appendChild(document.getElementById(data));
    }
    else{
        if(playSound){
            new Audio('../alerts/decline.mp3').play();
        }
        return;
    }
}

let QueenImg = document.createElement("img");
let KnightImg = document.createElement("img");

QueenImg.id = "queen";
QueenImg.draggable = false;
QueenImg.src = "../assets/blackQueen.png";
QueenImg.width = 75;
QueenImg.height = 75;

KnightImg.id = "knight";
KnightImg.draggable = true;
KnightImg.ondragstart = drag;
KnightImg.src = "../assets/whiteKnight.png";
KnightImg.width = 75;
KnightImg.height = 75;

function initBoard() {
  chessBoard = document.querySelector(".chess-board");
  chessBoard.innerHTML = ""; // Clear any previous squares
  // create the 8 x 8 chess board
  // colour of the square

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.ondrop = drop;
      square.ondragover = allowDrop;
      square.className = "square";
      square.id = row * 8 + col + 1;
      // Add the queen to the square at (3,3)
      if ((row + col) % 2 === 0) {
        square.classList.add("light");
      } else {
        square.classList.add("dark");
      }
      chessBoard.appendChild(square);
    }
  }

  // Place the queen at (3,3) and knight at (0,7)
  let squares = document.querySelectorAll(".square");
  squares[3 * 8 + 3].appendChild(QueenImg); // (3,3)
  squares[7].appendChild(KnightImg); // (0,7)
}

function resetBoard() {
  initBoard();
}
function toggleSound(){
    playSound = !playSound;
    
}

// Initialize the board for the first time
window.onload = initBoard;
