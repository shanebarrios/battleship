import Gameboard, { AttackStatus } from "./gameboard.js";
import Ship from "./ship.js";

export default class Player {
  constructor() {
    this.gameboard = new Gameboard();
    this.unplacedShips = [
      new Ship("carrier"),
      new Ship("battleship"),
      new Ship("destroyer"),
      new Ship("submarine"),
      new Ship("patrol_boat"),
    ];
    this.lastAttack = {};
  }
  placeShip(shipType, y, x) {
    const ind = this.unplacedShips.findIndex((ship) => ship.type === shipType);
    if (ind === -1) {
      return false;
    }
    if (!this.gameboard.placeShip(this.unplacedShips[ind], y, x)) {
      return false;
    }
    this.unplacedShips.splice(ind, 1);
    return true;
  }
  placeShipsRandom() {
    while (this.unplacedShips.length > 0) {
      const ship = this.unplacedShips[0];
      ship.isHorizontal = Math.floor(2 * Math.random()) ? true : false;
      let y, x;
      do {
        y = Math.floor(this.gameboard.dimension * Math.random());
        x = Math.floor(this.gameboard.dimension * Math.random());
      } while (!this.gameboard.placeShip(ship, y, x));
      this.unplacedShips.shift();
    }
  }
  rotateShip(shipType) {
    const ship = this.unplacedShips.find((ship) => ship.type === shipType);
    if (!ship) {
      return false;
    }
    ship.isHorizontal = !ship.isHorizontal;
  }
  receiveAttack(y, x) {
    const attackStatus = this.gameboard.receiveAttack(y, x);
    if (attackStatus) {
      this.lastAttack = { attackStatus, y, x };
    }
    return attackStatus;
  }
  receiveAttackRandom() {
    let y, x;
    let attackStatus = AttackStatus.FAILED_ATTACK;
    while (!attackStatus) {
      y = Math.floor(this.gameboard.dimension * Math.random());
      x = Math.floor(this.gameboard.dimension * Math.random());
      attackStatus = this.gameboard.receiveAttack(y, x);
    }
    this.lastAttack = { attackStatus, y, x };
    return attackStatus;
  }
}
