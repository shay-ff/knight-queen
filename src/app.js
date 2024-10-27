
const globalFalse = [1, 4, 7, 10, 12, 14, 19, 20, 21, 25, 26, 27, 28, 29, 30, 31, 32, 35, 36, 37, 42, 44, 46, 49, 52, 55, 60];
const path = [6,5,3,2,16,15,13,11,9,24,23,22,18,17,40,39,38,34,33,48,47,45,43,41,56,54,53,51,50,64,63,62,61,59,58,57];

let ptr;
let chessBoard;
var blocked = false;

let QueenImg = document.createElement("img");
let KnightImg = document.createElement("img");
let PathImg = document.createElement("img");

PathImg.id = "path";
PathImg.draggable = false;
PathImg.src = "../assets/green-circle-png-7017516945284315dlbk7j1sf.png";
PathImg.width = 75;
PathImg.height = 75;

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

function showPath(){
    const currDiv = document.getElementById(path[ptr]);
    const [row, col] = getRowCol(path[ptr]);
    const isLight = (row + col) % 2 === 0;
    if (currDiv) {
        currDiv.style.backgroundColor = '#fdf718';
    } else {
        console.error(`Div with ID ${path[ptr]} not found.`);
    }
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
    const knight = document.getElementById(data);
    const currDiv = knight.parentNode;
    const currDivId = parseInt(currDiv.id);

    if (ev.target && ev.target.id) {
        const targetDivId = parseInt(ev.target.id);
        console.log("Current Target ID:", targetDivId, "Path Target ID:", path[ptr]);

        // Check if the knight is dropped on the current path position
        if (targetDivId === path[ptr]) {
            // Move the knight to the target div
            const [row, col] = getRowCol(path[ptr]);
            const isLight = (row + col) % 2 === 0;
            ev.target.style.backgroundColor = '#66FF00';
            // Move the circle to the next path position if there is one
            new Audio('../alerts/move-sound.ogg').play();
            ev.target.appendChild(knight);
            ptr++;
            if (ptr < path.length) {
                showPath(); // Function to visually move the circle to path[ptr]
            } else {
                // End the game when the last path position is reached
                new Audio('../alerts/vicotry-sound.ogg').play();
            }
            return;
        }

        // Check if the move is legal for the knight
        if (isLegalMove(currDivId, targetDivId) || currDivId === targetDivId) {
            new Audio('../alerts/move-sound.ogg').play();
            ev.target.appendChild(knight);
        } else {
            // Play a sound if the move is not allowed
            new Audio('../alerts/decline.mp3').play();
        }
    } else {
        console.warn("Invalid target for drop - missing ID:", ev.target);
    }
}




function initBoard() {
    ptr = 0;
  chessBoard = document.querySelector(".chess-board");
  chessBoard.innerHTML = ""; // Clear any previous squares
  // create the 8 x 8 chess board
  // colour of the square

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.style.border = "1px solid black";
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
  showPath();

}

function resetBoard() {
  initBoard();
}
function showBlocked(){
    blocked = !blocked;
    globalFalse.forEach((id) => {
        const element = document.getElementById(id);
        const [row, col] = getRowCol(id);
        if (blocked) {
            // When blocked is true
            element.style.border = "1px solid black"; // Light shade border when blocked
            const isLight = (row + col) % 2 === 0;
            element.style.backgroundColor = isLight ? '#FFA08F' : '#D4613E';
        } else {
            // When blocked is false
            // Determine background color based on row and column
            const isLight = (row + col) % 2 === 0;
            element.style.backgroundColor = isLight ? '#EEEED2' : '#6B4E36'; // Use your desired colors
            element.style.border = 'none'; // No border when not blocked
        }
    });
    blockedDot.style.backgroundColor = blocked ? 'red' : 'green';
    
}


// Initialize the board for the first time
window.onload = initBoard;
