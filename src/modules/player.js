import Gameboard from "./gameboard.js";
import Ship from "./ship.js";

export default class Player {
  constructor(name) {
    this.gameboard = new Gameboard();
    this.unplacedShips = [
      new Ship("carrier"),
      new Ship("battleship"),
      new Ship("destroyer"),
      new Ship("submarine"),
      new Ship("patrol_boat"),
    ];
    this.name = name;
    this.lastAttack = {};
  }
  placeShip(shipType, y, x) {
    const ind = this.unplacedShips.findIndex((ship) => ship.type === shipType);
    if (ind === -1) {
      return null;
    }
    const ship = this.unplacedShips[ind];
    if (!this.gameboard.placeShip(ship, y, x)) {
      return null;
    }
    this.unplacedShips.splice(ind, 1);
    return ship;
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
  rotateShips() {
    this.unplacedShips.forEach((ship) => ship.isHorizontal = !ship.isHorizontal);
  }
  receiveAttack(y, x) {
    const attack = this.gameboard.receiveAttack(y, x);
    if (attack) {
      this.lastAttack = attack;
    }
    return attack;
  }
  receiveAttackRandom() {
    let y, x;
    let attack = null;
    while (!attack) {
      y = Math.floor(this.gameboard.dimension * Math.random());
      x = Math.floor(this.gameboard.dimension * Math.random());
      attack = this.gameboard.receiveAttack(y, x);
    }
    this.lastAttack = attack;
    return attack;
  }
}
