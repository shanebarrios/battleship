import Gameboard, { AttackStatus } from "./gameboard.js";
import Ship from "./ship.js";
import GameController from "./game-controller.js";

function getCellFromCoords(grid, y, x) {
  return grid.querySelector(
    `#${grid.id}-cell-${y * grid.dataset.dimension + x}`
  );
}

function getCoordsFromCell(grid, cell) {
  const s = cell.id.split("-");
  const num = Number(s[s.length - 1]);
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

function placeGridShip(grid, ship, y0, x0) {
  for (let i = 0; i < ship.length; i++) {
    const [y, x] = Gameboard.ithShipCoords(ship, y0, x0, i);
    const cellDiv = getCellFromCoords(grid, y, x);
    cellDiv.classList = "grid-cell ship";
  }
}

function updateGridFromAttack(grid, attack) {
  const cell = getCellFromCoords(grid, attack.y, attack.x);
  switch (attack.attackStatus) {
    case AttackStatus.HIT_ATTACK:
      cell.className = "grid-cell hit";
      break;
    case AttackStatus.MISSED_ATTACK:
      cell.className = "grid-cell missed";
      break;
    default:
      break;
  }
}

const gc = new GameController();

const playerGrid = createGrid(10, "player-grid");
const shipContainer = document.createElement("div");
let draggedShip = null;
shipContainer.className = "ship-container horizontal";
gc.player1.unplacedShips.forEach((ship) => {
  const shipDiv = document.createElement("div");
  shipDiv.className = "unplaced-ship";
  shipDiv.id = ship.type;
  for (let i = 0; i < ship.length; i++) {
    const shipCell = document.createElement("div");
    shipCell.className = "unplaced-ship-cell";
    shipDiv.appendChild(shipCell);
  }
  shipDiv.addEventListener("mousedown", (e) => {
    if (draggedShip) {
      return;
    }
    draggedShip = e.currentTarget.cloneNode(true);
    draggedShip.classList.add("clone");
    e.currentTarget.style.visibility = "hidden";
    document.documentElement.appendChild(draggedShip);
  });
  shipContainer.appendChild(shipDiv);
});

document.addEventListener("mousemove", (e) => {
  if (draggedShip) {
    console.log(draggedShip);
    draggedShip.style.left = e.clientX + "px";
    draggedShip.style.top = e.clientY + "px";
  }
});

document.addEventListener("mouseup", (e) => {
  if (draggedShip) {
    const id = draggedShip.id;
    document.documentElement.removeChild(draggedShip);
    draggedShip = null;
    document.querySelector("#" + id).style.visibility = "visible";
  }
});

const gridContainer = document.querySelector(".game-container");
gridContainer.appendChild(playerGrid);
gridContainer.appendChild(shipContainer);

// opponentGrid.addEventListener("click", (e) => {
//   if (!e.target.classList.contains("grid-cell")) {
//     return;
//   }
//   const [y, x] = getCoordsFromCell(playerGrid, e.target);
//   if (gc.playTurn(y, x)) {
//     updateGridFromAttack(opponentGrid, gc.player2.lastAttack);
//     gc.playRandomTurn();
//     updateGridFromAttack(playerGrid, gc.player1.lastAttack);
//     console.log(gc.player2.lastAttack);
//   }
// });
