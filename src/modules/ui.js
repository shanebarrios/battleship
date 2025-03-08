import Gameboard from "./gameboard.js";
import GameController from "./game-controller.js";

let draggedShip;
let gc;

export function init() {
  gc = new GameController;
  draggedShip = null;
  setupDisplay();
  document.querySelector("#new-game-button").addEventListener("click", restartGame);
}

function restartGame() {
  gc = new GameController();
  document.querySelector("#overlay-container").style.display = "none";
  setupDisplay();
}

function getCellFromCoords(grid, y, x) {
  return grid.querySelector(
    `#${grid.id}-cell-${y * grid.dataset.dimension + x}`
  );
}

function getCoordsFromCell(cell) {
  const s = cell.id.split("-");
  const num = Number(s[s.length - 1]);
  const grid = cell.closest(".game-grid");
  const y = Math.floor(num / grid.dataset.dimension);
  const x = num % grid.dataset.dimension;
  return [y, x];
}

function createGrid(dimension, id) {
  const grid = document.createElement("div");
  grid.classList.add("game-grid");
  grid.dataset.dimension = dimension;
  grid.id = id;
  for (let i = 0; i < dimension * dimension; i++) {
    const div = document.createElement("div");
    div.classList.add("grid-cell");
    div.id = `${id}-cell-${i}`;
    grid.appendChild(div);
  }
  return grid;
}

function createPeg(type) {
  const peg = document.createElement("div");
  peg.className = `peg ${type}`;
  return peg;
}

function placeGridShip(grid, ship) {
  for (let i = 0; i < ship.length; i++) {
    const [y, x] = Gameboard.ithShipCoords(ship, ship.y0, ship.x0, i);
    const cellDiv = getCellFromCoords(grid, y, x);
    cellDiv.classList = "grid-cell ship";
  }
  if (!gc.started && gc.player1.unplacedShips.length === 0) {
    displayStartGameButton();
  }
}

function updateGridFromAttack(grid, attack) {
  const cell = getCellFromCoords(grid, attack.y, attack.x);
  console.log(cell);
  const peg = cell.querySelector(".peg");
  // just in case same cell gets updated multiple times for whatever reason
  if (peg) {
    peg.remove();
  }
  switch (attack.attackStatus) {
    case "hit":
      cell.appendChild(createPeg("hit"));
      if (attack.sank) {
        placeGridShip(grid, attack.sank);
      }
      break;
    case "missed":
      cell.appendChild(createPeg("missed"));
      break;
    default:
      break;
  }
}

function createShipDiv(ship) {
  const shipDiv = document.createElement("div");
  shipDiv.className = "unplaced-ship horizontal";
  shipDiv.id = ship.type;
  for (let i = 0; i < ship.length; i++) {
    const shipCell = document.createElement("div");
    shipCell.className = "unplaced-ship-cell";
    shipDiv.appendChild(shipCell);
  }
  return shipDiv;
}

function displayStartGameButton() {
  const startGameButton = document.createElement("button");
  startGameButton.id = "start-game-button";
  startGameButton.textContent = "START GAME";
  const shipContainer = document.querySelector(".ship-container");
  shipContainer.classList.add("centered");
  startGameButton.addEventListener("click", gameStartDisplay);
  shipContainer.appendChild(startGameButton);
}

function rotateShips() {
  const shipContainer = document.querySelector(".ship-container");
  let outerClass = "ship-container horizontal";
  let innerClass = "unplaced-ship vertical";
  if (shipContainer.classList[1] === "horizontal") {
    outerClass = "ship-container vertical";
    innerClass = "unplaced-ship horizontal";
  }
  shipContainer.className = outerClass;
  document.querySelectorAll(".unplaced-ship").forEach((element) => element.className = innerClass);
  gc.player1.rotateShips();
}

function dragStartCallback(e) {
  if (draggedShip) {
    return;
  }
  draggedShip = e.currentTarget.cloneNode(true);
  draggedShip.classList.add("clone");
  e.currentTarget.style.visibility = "hidden";
  document.documentElement.appendChild(draggedShip);
  draggingCallback(e);
}

function draggingCallback(e) {
  if (!draggedShip) {
    return;
  }
  draggedShip.style.left = `${
    e.clientX - draggedShip.firstElementChild.offsetWidth / 2
  }px`;
  draggedShip.style.top = `${e.clientY - draggedShip.firstElementChild.offsetHeight / 2}px`;
}

function dragEndCallback(e) {
  if (!draggedShip) {
    return;
  }

  const id = draggedShip.id;
  document.documentElement.removeChild(draggedShip);
  draggedShip = null;

  const cellTarget = e.target.closest(".grid-cell");
  if (cellTarget) {
    const [y, x] = getCoordsFromCell(cellTarget);
    const ship = gc.player1.placeShip(id, y, x);
    if (ship) {
      placeGridShip(document.querySelector("#player-grid"), ship, y, x);
      document.querySelector("#" + id).remove();
      return;
    }
  }
  document.querySelector("#" + id).style.visibility = "visible";
}

function keyDownCallback(e) {
  if (e.key === "r" || e.key === "R") {
    rotateShips();
  }
}

function clickGridCallback(e) {
  const cell = e.target.closest(".grid-cell");
  if (!cell) {
    return;
  }
  const [y, x] = getCoordsFromCell(cell);
  let res = gc.playManualTurn(y, x);
  console.log(res);
  if (res) {
    const playerGrid = document.querySelector("#player-grid");
    const opponentGrid = document.querySelector("#opponent-grid");
    updateGridFromAttack(opponentGrid, gc.player2.lastAttack);
    res = gc.playRandomTurn();
    if (res) {
      updateGridFromAttack(playerGrid, gc.player1.lastAttack);
    }
  }
  if (gc.victor) {
    displayOverlay(gc.victor);
  }
}

function displayOverlay(victor) {
  const overlayContainer = document.querySelector("#overlay-container")
  overlayContainer.style.display = "flex";
  overlayContainer.querySelector("h3").textContent = `${victor} WINS!`;
}

function setupDisplay() {
  const gameContainer = document.querySelector(".game-container");
  gameContainer.innerHTML = "";
  const leftSide = document.createElement("div");
  leftSide.className = "left-side";
  const h2Left = document.createElement("h2");
  h2Left.textContent = gc.player1.name;
  leftSide.appendChild(h2Left);
  const rightSide = document.createElement("div");
  rightSide.className = "right-side";
  const h2Right = document.createElement("h2");
  h2Right.textContent = "PLACE YOUR SHIPS (R TO ROTATE)";
  rightSide.appendChild(h2Right);
  gameContainer.appendChild(leftSide);
  gameContainer.appendChild(rightSide);

  const shipDivs = gc.player1.unplacedShips.map((ship) => createShipDiv(ship));
  const shipContainer = document.createElement("div");
  shipContainer.className = "ship-container vertical";

  shipDivs.forEach((shipDiv) => {
    shipDiv.addEventListener("mousedown", dragStartCallback);
  });
  document.addEventListener("mousemove", draggingCallback);
  document.addEventListener("mouseup", dragEndCallback);
  document.addEventListener("keydown", keyDownCallback);
  shipDivs.forEach((shipDiv) => shipContainer.appendChild(shipDiv));

  const playerGrid = createGrid(10, "player-grid");
  leftSide.appendChild(playerGrid);
  rightSide.appendChild(shipContainer);
}

function gameStartDisplay() {
  gc.player2.placeShipsRandom();
  if (!gc.init()) {
    return;
  }

  document.querySelector(".ship-container").remove();
  const opponentGrid = createGrid(10, "opponent-grid");
  document.querySelector(".right-side").appendChild(opponentGrid);
  document.querySelector(".right-side").querySelector("h2").textContent = gc.player2.name;

  document.removeEventListener("mousemove", draggingCallback);
  document.removeEventListener("mouseup", dragEndCallback);

  opponentGrid.addEventListener("click", clickGridCallback);
}

