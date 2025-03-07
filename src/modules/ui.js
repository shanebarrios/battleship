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

const playerGrid = createGrid(10, "player-grid");
const opponentGrid = createGrid(10, "opponent-grid");
const gridContainer = document.querySelector(".grid-container");
gridContainer.appendChild(playerGrid);
// gridContainer.appendChild(opponentGrid);

// const gc = new GameController();
// gc.player1.rotateShip(Ship.ShipType.BATTLESHIP);
// gc.player1.rotateShip(Ship.ShipType.DESTROYER);
// gc.player1.placeShip(Ship.ShipType.BATTLESHIP, 1, 1);
// placeGridShip(
//   playerGrid,
//   gc.player1.gameboard.ships[gc.player1.gameboard.ships.length - 1],
//   1,
//   1
// );
// gc.player1.placeShip(Ship.ShipType.CARRIER, 4, 5);
// placeGridShip(
//   playerGrid,
//   gc.player1.gameboard.ships[gc.player1.gameboard.ships.length - 1],
//   4,
//   5
// );
// gc.player1.placeShip(Ship.ShipType.DESTROYER, 5, 8);
// placeGridShip(
//   playerGrid,
//   gc.player1.gameboard.ships[gc.player1.gameboard.ships.length - 1],
//   5,
//   8
// );
// gc.player1.placeShip(Ship.ShipType.PATROL_BOAT, 9, 7);
// placeGridShip(
//   playerGrid,
//   gc.player1.gameboard.ships[gc.player1.gameboard.ships.length - 1],
//   9,
//   7
// );
// gc.player1.placeShip(Ship.ShipType.SUBMARINE, 3, 4);
// placeGridShip(
//   playerGrid,
//   gc.player1.gameboard.ships[gc.player1.gameboard.ships.length - 1],
//   3,
//   4
// );

// gc.player2.placeShipsRandom();
// gc.init();

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
