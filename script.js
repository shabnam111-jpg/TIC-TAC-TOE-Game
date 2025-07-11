const board = document.getElementById('board');
const turnIndicator = document.getElementById('turn-indicator');
const resetBtn = document.getElementById('reset');

const xWinsText = document.getElementById('xWins');
const oWinsText = document.getElementById('oWins');
const tiesText = document.getElementById('ties');
const popup = document.getElementById('popup');

let currentPlayer = 'X';
let gameActive = true;
let gameState = Array(9).fill("");

let xWins = 0, oWins = 0, ties = 0;

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function createBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.textContent = gameState[i]; // In case of reset, this will be ""
    cell.addEventListener('click', handleCellClick); // <-- Add this line
    board.appendChild(cell);
  }
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || gameState[index] !== "") return;

  gameState[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  checkResult();
}

function checkResult() {
  let roundWon = false;
  let winningPattern = [];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
      roundWon = true;
      winningPattern = pattern;
      break;
    }
  }

  if (roundWon) {
    gameActive = false;

    // Replace winning cells with 🔥 and animate
    winningPattern.forEach(i => {
      const cell = document.querySelectorAll('.cell')[i];
      cell.classList.add('winner');
      cell.textContent = '🔥';
    });

    // Show popup after slight delay
    setTimeout(() => {
      showPopup(`Player ${currentPlayer} Wins!`);
    }, 500);

    // Update scoreboard
    if (currentPlayer === 'X') {
      xWins++;
      xWinsText.textContent = xWins;
    } else {
      oWins++;
      oWinsText.textContent = oWins;
    }

    return;
  }

  // Tie check
  if (!gameState.includes("")) {
    gameActive = false;
    setTimeout(() => {
      showPopup("It's a Tie!");
    }, 300);
    ties++;
    tiesText.textContent = ties;
    return;
  }

  // Switch player
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
  
}

function resetGame() {
  currentPlayer = 'X';
  gameActive = true;
  gameState = Array(9).fill("");
  turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
  createBoard();
}

// Custom popup
function showPopup(message) {
  popup.textContent = message;
  popup.classList.add('show');

  setTimeout(() => {
    popup.classList.remove('show');
  }, 2000);
}

// Event Listeners
createBoard();
// board.addEventListener('click', handleCellClick); // <-- Remove or comment out this line
resetBtn.addEventListener('click', resetGame);
