export const Cell = Object.freeze({
  MISSED: -3,
  HIT: -2,
  EMPTY: -1,
});

export default class Gameboard {
  constructor(dimension = 10) {
    this.ships = [];
    this.dimension = dimension;
    // no idea why initializing 2d arrays in JS is such a pain
    this.board = Array.from({ length: dimension }, () =>
      Array.from({ length: dimension }, () => Cell.EMPTY)
    );
  }
  static ithShipCoords(ship, y0, x0, i) {
    if (ship.isHorizontal) {
      return [y0, x0 + i];
    } else {
      return [y0 + i, x0];
    }
  }

  inBounds(y, x) {
    return x >= 0 && x < this.dimension && y >= 0 && y < this.dimension;
  }

  shipInBounds(ship, y0, x0) {
    const [y, x] = Gameboard.ithShipCoords(ship, y0, x0, ship.length - 1);
    return this.inBounds(y0, x0) && this.inBounds(y, x);
  }

  wouldOverlap(ship, y0, x0) {
    for (let i = 0; i < ship.length; i++) {
      const [y, x] = Gameboard.ithShipCoords(ship, y0, x0, i);
      if (this.board[y][x] !== Cell.EMPTY) {
        return true;
      }
    }
    return false;
  }

  placeShip(ship, y0, x0) {
    if (!this.shipInBounds(ship, y0, x0) || this.wouldOverlap(ship, y0, x0)) {
      return false;
    }
    const id = this.ships.length;
    for (let i = 0; i < ship.length; i++) {
      const [y, x] = Gameboard.ithShipCoords(ship, y0, x0, i);
      this.board[y][x] = id;
    }
    ship.y0 = y0;
    ship.x0 = x0;
    this.ships.push(ship);
    return true;
  }

  receiveAttack(y, x) {
    if (
      !this.inBounds(y, x) ||
      this.board[y][x] === Cell.HIT ||
      this.board[y][x] === Cell.MISSED
    ) {
      return null;
    } else if (this.board[y][x] === Cell.EMPTY) {
      this.board[y][x] = Cell.MISSED;
      return { attackStatus: "missed", y: y, x: x, sank: null };
    } else {
      const id = this.board[y][x];
      this.ships[id].hit();
      this.board[y][x] = Cell.HIT;
      const sank = this.ships[id].sunk ? this.ships[id] : null;
      return { attackStatus: "hit", y: y, x: x, sank: sank };
    }
  }

  allSunk() {
    return this.ships.every((ship) => ship.sunk);
  }
}
