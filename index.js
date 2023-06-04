const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const rectCan = canvas.getBoundingClientRect()
const start = document.querySelector('#start')
const reset = document.querySelector('#reset')
const table1 = document.querySelector('#player1')
const table2 = document.querySelector('#player2')
const score1 = document.querySelector('#score1')
const score2 = document.querySelector('#score2')
const size = document.querySelector('#size')
const kittenSize = document.querySelector('#kittens')
const player_1 = document.querySelector('#player_1')
const player_2 = document.querySelector('#player_2')
const score_win = document.querySelector('#scoreWin')
const sound = document.querySelector('#sound')
const putKitten = document.querySelector('#placed')
const download = document.querySelector('#download')
const display = document.querySelector('#timer')

canvas.style.display = "none"
let redWin = false
let greyWin = false

ctx.strokeStyle = 'black'

let gridSize = null
let cellSize = null
let numberOfKittens = null
let player1_name = null
let player2_name = null
let scoreToWin = null
let gameState = 0
let games = []

function gameData(result){
  let now = new Date()

  //current date and time
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hour = now.getHours();
  let min = now.getMinutes();
  let sec = now.getSeconds();

  var dataTimeString = `${year}-${month}-${day} ${hour}:${min}:${sec} - ${result}`

  games.push(dataTimeString)
}

function startTimer(duration, display){
  var timer = duration, minutes, seconds;
  setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;
    if (--timer < 0) {
      timer = duration;
      alert('Time is up')
      resetFunc(gridSize)
      drawBoard(cellSize)
    }
  }, 1000);
}

download.addEventListener("click", function(){
  const newData = games.join("\n") + "\n";
  const blob = new Blob([newData], {type: "text/plain"});
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a");
  link.href = url;
  link.download = "games.txt";
  link.click();
  //document.body.removeChild(link);
})

start.addEventListener('click', function(){
    if(player_1.value.length > 0 && player_2.value.length > 0){
      player1_name = player_1.value
      player2_name = player_2.value
      gridSize = parseInt(size.value)
      numberOfKittens = parseInt(kittenSize.value)
      if(isNaN(numberOfKittens) && numberOfKittens > 0){
        alert('Number of kittens has to be a positive integer!')
      }
      if(!isNaN(gridSize) && gridSize > 0){
        cellSize = Math.ceil(canvas.width / gridSize)
        resetFunc(gridSize)
        drawBoard(cellSize)
      }else{
        alert('Size has to be a positive integer!')
      }
      scoreToWin = parseInt(score_win.value)
      if(isNaN(scoreToWin) && scoreToWin < 0){
        alert('Score to win has to be a positive integer!')
      }
      let duration = 120;
      startTimer(duration, display);
      canvas.style.display = "block"
    }else{
      alert('Please enter a name for both players')
    }
    
})

let players = {
  player1_name: { score: 0, color: 'red', kittens: numberOfKittens, row: -1, col: -1 },
  player2_name: { score: 0, color: 'grey', kittens: numberOfKittens, row: -1, col: -1 }
}

reset.addEventListener('click', function(){
    resetFunc(gridSize)
    drawBoard(cellSize)
})

let board = []

function gridCreate(gridSize){
  board = []
  for(let i = 0; i < gridSize; i++){
    let row = []
    for(let j = 0; j < gridSize; j++){
      row.push(0)
    }
    board.push(row)
  }
}

const kittens = {
    player1_name: new Image(),
    player2_name: new Image()
}

let currentPlayer = 'red'

kittens.player1_name.src = "red-kitten.png"
kittens.player2_name.src = "grey-kitten.png"

function drawBoard(cellSize){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for(let i = cellSize; i < canvas.width; i+=cellSize){
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        for(let j = cellSize; j < canvas.height; j+=cellSize){
            ctx.moveTo(0, j)
            ctx.lineTo(canvas.width, j)
        }
    }
    ctx.stroke()
}

function displayRedKittens(){
  let content = `<th> ${player1_name}: </th>`
  for(let i = 0; i < players.player1_name.kittens; i++){
    content += "<td>" + `<img src="${kittens.player1_name.src}" style="width: 50px;" />` + "</td>"
  }
  table1.innerHTML = content
}

function displayGreyKittens(){
  let content = `<th> ${player2_name}: </th>`
  for(let i = 0; i < players.player2_name.kittens; i++){
    content += "<td>" +`<img src="${kittens.player2_name.src}" style="width: 50px;" />` + "</td>"
  }
  table2.innerHTML = content
}

//resetFunc resets the game
function resetFunc(gridSize){
    //ctx.clearRect(0, 0, canvas.width, canvas.height)
    clearInterval(startTimer(120, display))
    currentPlayer = 'red'
    players = {
        player1_name: { score: 0, kittens: numberOfKittens, row: -1, col: -1 },
        player2_name: { score: 0, kittens: numberOfKittens, row: -1, col: -1 }
    }
    score1.innerText = 0
    score2.innerText = 0
    if(!isNaN(gridSize) && gridSize > 0 && !isNaN(numberOfKittens) && numberOfKittens > 0){
      gridCreate(gridSize)
      displayRedKittens()
      displayGreyKittens()
    }else{
      alert('Size and number of kittens has to be an integer and greater than 0!')
    }
}

//this function checks if the current cell is empty
function checkIfEmptyCell(board, row, col){
    if(board[row][col] == 0) return true
    else return false
}

function update(board){
  imgKitten = null
  for(let i = 0; i < board.length; i++){
    for(let j = 0; j < board.length; j++){
      imgKitten = board[i][j] === 'red' ? kittens.player1_name : kittens.player2_name
      if(imgKitten && board[i][j] !== 0){
        ctx.drawImage(imgKitten, j * cellSize, i * cellSize, cellSize, cellSize)
      }else if(board[i][j] == 0){
        ctx.clearRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1)
      }
    }
  }
  displayRedKittens()
  displayGreyKittens()
}

//This function checks for horizontal wins
function checkHorizontalWin(board){
  for(let i = 0; i < board.length; i++){
    for(let j = 0; j < board[i].length - 2; j++){
      if(board[i][j] == 'red' && board[i][j + 1] == 'red' && board[i][j + 2] == 'red'){
        board[i][j] = 0;
        board[i][j + 1] = 0;
        board[i][j + 2] = 0;
        redWin = true;
      }
      if(board[i][j] == 'grey' && board[i][j + 1] == 'grey' && board[i][j + 2] == 'grey'){
        board[i][j] = 0;
        board[i][j + 1] = 0;
        board[i][j + 2] = 0;
        greyWin = true;
      }
    }
  }
  update(board)
}

//This function checks for vertical wins
function checkVerticalWin(board){
  for(let i = 0; i < board.length - 2; i++){
    for(let j = 0; j < board[i].length; j++){
      if(board[i][j] == 'red' && board[i + 1][j] == 'red' && board[i + 2][j] == 'red'){
        board[i][j] = 0;
        board[i + 1][j] = 0;
        board[i + 2][j] = 0;
        redWin = true;
      }
      if(board[i][j] == 'grey' && board[i + 1][j] == 'grey' && board[i + 2][j] == 'grey'){
        board[i][j] = 0;
        board[i + 1][j] = 0;
        board[i + 2][j] = 0;
        greyWin = true;
      }
    }
  }
  update(board)
}

//This function checks for right diagonal wins
function checkDiagWinR(board){
  for(let i = 0; i < board.length - 2; i++){
    for(let j = 0; j < board[i].length - 2; j++){
      if(board[i][j] == 'red' && board[i + 1][j + 1] == 'red' && board[i + 2][j + 2] == 'red'){
        board[i][j] = 0;
        board[i + 1][j + 1] = 0;
        board[i + 2][j + 2] = 0;
        redWin = true;
      }
      if(board[i][j] == 'grey' && board[i + 1][j + 1] == 'grey' && board[i + 2][j + 2] == 'grey'){
        board[i][j] = 0;
        board[i + 1][j + 1] = 0;
        board[i + 2][j + 2] = 0;
        greyWin = true;
      }
    }
  }
  update(board)
}

//This function check for left diagonal wins
function checkDiagWinL(board){
  for(let i = 0; i < board.length - 2; i++){
    for(let j = 2; j < board[i].length; j++){
      if(board[i][j] == 'red' && board[i + 1][j - 1] == 'red' && board[i + 2][j - 2] == 'red'){
        board[i][j] = 0;
        board[i + 1][j - 1] = 0;
        board[i + 2][j - 2] = 0;
        redWin = true;
      }
      if(board[i][j] == 'grey' && board[i + 1][j - 1] == 'grey' && board[i + 2][j - 2] == 'grey'){
        board[i][j] = 0;
        board[i + 1][j - 1] = 0;
        board[i + 2][j - 2] = 0;
        greyWin = true;
      }
    }
  }
  update(board)
}

/*
This function gets coordinates of the newly placed kitten and checks if the right cell is empty, if it is not the kitten will be pushed
*/
function pushRight(board, row, col){
  if(col + 2 <= board.length - 1){
    if(!checkIfEmptyCell(board, row, col + 1) && checkIfEmptyCell(board, row, col + 2)){
      board[row][col + 2] = board[row][col + 1]
      board[row][col + 1] = 0
    }
  }
  else if(col + 2 > board.length - 1 && col + 1 == board.length - 1){
    if(board[row][col + 1] == 'red') players.player1_name.kittens++;
    if(board[row][col + 1] == 'grey') players.player2_name.kittens++;
    board[row][col + 1] = 0
  }
  update(board)
}

/*
This function gets coordinates of the newly placed kitten and checks if the left cell is empty, if it is not the kitten will be pushed
*/
function pushLeft(board, row, col){
  if(col - 2 >= 0){
    if(!checkIfEmptyCell(board, row, col - 1) && checkIfEmptyCell(board, row, col - 2)){
      board[row][col - 2] = board[row][col - 1]
      board[row][col - 1] = 0
    }
  }
  else if(col - 2 < 0 && col - 1 == 0){
    if(board[row][col - 1] == 'red') players.player1_name.kittens++;
    if(board[row][col - 1] == 'grey') players.player2_name.kittens++;
    board[row][col - 1] = 0
  }
  update(board)
}

/*
This function gets coordinates of the newly placed kitten and checks if the upper cell is empty, if it is not the kitten will be pushed
*/
function pushUp(board, row, col){
  if(row - 2 >= 0){
    if(!checkIfEmptyCell(board, row - 1, col) && checkIfEmptyCell(board, row - 2, col)){
      board[row - 2][col] = board[row - 1][col]
      board[row - 1][col] = 0
    }
  }
  else if(row - 2 < 0 && row - 1 == 0){
    if(board[row - 1][col] == 'red') players.player1_name.kittens++;
    if(board[row - 1][col] == 'grey') players.player2_name.kittens++;
    board[row - 1][col] = 0
  }
  update(board)
}

/*
This function gets coordinates of the newly placed kitten and checks if the bottom cell is empty, if it is not the kitten will be pushed
*/
function pushDown(board, row, col){
  if(row + 2 <= board.length - 1){
    if(!checkIfEmptyCell(board, row + 1, col) && checkIfEmptyCell(board, row + 2, col)){
      board[row + 2][col] = board[row + 1][col]
      board[row + 1][col] = 0
    }
  }
  else if(row + 2 > board.length - 1 && row + 1 == board.length - 1){
    if(board[row + 1][col] == 'red') players.player1_name.kittens++;
    if(board[row + 1][col] == 'grey') players.player2_name.kittens++;
    board[row + 1][col] = 0
  }
  update(board)
}

/*
This function gets coordinates of the newly placed kitten and checks if the bottom right cell is empty, if it is not the kitten will be pushed
*/
function pushDiagDownR(board, row, col){
  if(row + 2 <= board.length - 1 && col + 2 <= board.length - 1){
    if(!checkIfEmptyCell(board, row + 1, col + 1) && checkIfEmptyCell(board, row + 2, col + 2)){
      board[row + 2][col + 2] = board[row + 1][col + 1]
      board[row + 1][col + 1] = 0
    }
  }
  else if((row + 1 == board.length - 1) || (col + 1 == board.length - 1)){
    if(board[row + 1][col + 1] == 'red') players.player1_name.kittens++;
    if(board[row + 1][col + 1] == 'grey') players.player2_name.kittens++;
    board[row + 1][col + 1] = 0
  }
  update(board)
}

/*
This function gets coordinates of the newly placed kitten and checks if the upper right cell is empty, if it is not the kitten will be pushed
*/
function pushDiagUpR(board, row, col){
  if(row - 2 >= 0 && col + 2 <= board.length - 1){
    if(!checkIfEmptyCell(board, row - 1, col + 1) && checkIfEmptyCell(board, row - 2, col + 2)){
      board[row - 2][col + 2] = board[row - 1][col + 1]
      board[row - 1][col + 1] = 0
    }
  }
  else if((row - 2 < 0 && row - 1 == 0) || (col + 2 > board.length - 1 && col + 1 == board.length - 1)){
    if(board[row - 1][col + 1] == 'red') players.player1_name.kittens++;
    if(board[row - 1][col + 1] == 'grey') players.player2_name.kittens++;
    board[row - 1][col + 1] = 0
  }
  update(board)
}

/*
This function gets coordinates of the newly placed kitten and checks if the upper left cell is empty, if it is not the kitten will be pushed
*/
function pushDiagUpL(board, row, col){
  if(row - 2 >= 0 && col - 2 >= 0){
    if(!checkIfEmptyCell(board, row - 1, col - 1) && checkIfEmptyCell(board, row - 2, col - 2)){
      board[row - 2][col - 2] = board[row - 1][col - 1]
      board[row - 1][col - 1] = 0
    }
  }
  else if((row - 2 < 0 && row - 1 == 0) || (col - 2 < 0 && col - 1 == 0)){
    if(board[row - 1][col - 1] == 'red') players.player1_name.kittens++;
    if(board[row - 1][col - 1] == 'grey') players.player2_name.kittens++;
    board[row - 1][col - 1] = 0
  }
  update(board)
}

/*
This function gets coordinates of the newly placed kitten and checks if the bottom left cell is empty, if it is not the kitten will be pushed
*/
function pushDiagDownL(board, row, col){
  if(row + 2 <= board.length - 1 && col - 2 >= 0){
    if(!checkIfEmptyCell(board, row + 1, col - 1) && checkIfEmptyCell(board, row + 2, col - 2)){
      board[row + 2][col - 2] = board[row + 1][col - 1]
      board[row + 1][col - 1] = 0
    }
  }
  else if((row + 2 > board.length - 1 && row + 1 == board.length - 1) || (col - 2 < 0 && col - 1 == 0)){
    if(board[row + 1][col - 1] == 'red') players.player1_name.kittens++;
    if(board[row + 1][col - 1] == 'grey') players.player2_name.kittens++;
    board[row + 1][col - 1] = 0
  }
  update(board)
}

// function delegate(parent, type, selector, handler) {
//   parent.addEventListener(type, function (event) {
//       const targetElement = event.target.closest(selector)
//       if (this.contains(targetElement)) handler.call(targetElement, event)
//   })
// }


/*
This function places a kitten on the selected cell, before it places the kitten on that cell it checks if that cell is empty using the checkIfEmptyCell function
and if the cell is empty and the current player still has kittens it places the kitten of the current player on the cell. It then decreases the number of kittens of the current
player, checks the adjacent cells if they are empty or not and if they are not it moves the adjacent kittens using the move functions.
*/
function placeKitten(row, col) {
    var currentPlayerData = currentPlayer === 'red' ? players.player1_name : players.player2_name;
  
    if (checkIfEmptyCell(board, row, col)) {
      if (players.player1_name.kittens > 0 && players.player2_name.kittens > 0) {
        putKitten.play()
        currentPlayerData.row = row;
        currentPlayerData.col = col;
        imgKitten = currentPlayer === 'red' ? kittens.player1_name : kittens.player1_name;
        currentPlayerData.kittens--;
        board[row][col] = currentPlayer;
        currentPlayer = currentPlayer === 'red' ? 'grey' : 'red';
        pushRight(board, row, col)
        pushLeft(board, row, col)
        pushUp(board, row, col)
        pushDown(board, row, col)
        pushDiagDownR(board, row, col)
        pushDiagDownL(board, row, col)
        pushDiagUpR(board, row, col)
        pushDiagUpL(board, row, col)
      }
    }
    checkHorizontalWin(board)
    checkVerticalWin(board)
    checkDiagWinR(board)
    checkDiagWinL(board)
    if(redWin == true){
      sound.play()
      alert(player1_name + ' wins')
      players.player1_name.kittens += 3;
      players.player1_name.score++;
      score1.innerText = players.player1_name.score;
      redWin = false
    }
    else if(greyWin == true){
      sound.play()
      alert(player2_name + ' wins')
      players.player2_name.kittens += 3;
      players.player2_name.score++;
      score2.innerText = players.player2_name.score;
      greyWin = false
    }
    if((players.player1_name.kittens == 0 && players.player2_name.kittens != 0) || players.player1_name.score == scoreToWin){
      sound.play()
      alert(player1_name + ' wins the game')
      let result = "winner: " + player1_name
      gameData(result)
      resetFunc(gridSize)
      drawBoard(cellSize)
    }
    else if((players.player1_name.kittens != 0 && players.player2_name.kittens == 0) || players.player2_name.score == scoreToWin){
      sound.play()
      alert(player2_name + ' wins the game')
      let result = "winner: " + player2_name
      gameData(result)
      resetFunc(gridSize)
      drawBoard(cellSize)
    }else if(players.player1_name.kittens == 0 && players.player2_name.kittens == 0){
      alert('Draw')
      let result = "Draw"
      gameData(result)
      resetFunc(cellSize)
    }
    if(timeUp == true && currentPlayer == 'red'){
      sound.play()
      alert(player1_name + ' ran out of time')
      let result = "winner: " + player2_name
      gameData(result)
      resetFunc(gridSize)
      drawBoard(cellSize)
      timeUp = false
    }
    if(timeUp == true && currentPlayer == 'grey'){
      sound.play()
      alert(player2_name + ' ran out of time')
      let result = "winner: " + player1_name
      gameData(result)
      resetFunc(gridSize)
      drawBoard(cellSize)
      timeUp = false
    }

    update(board)
    // console.log(board);
    // console.log(players.player1_name.kittens)
    // console.log(players.player2_name.kittens)
    console.log(games)
}

canvas.addEventListener('click', function(event){
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const col = Math.floor(x / cellSize)
    const row = Math.floor(y / cellSize)
    placeKitten(row, col)
})
