export default class Ship {
  static lengthMapping = {
    carrier: 5,
    battleship: 4,
    destroyer: 3,
    submarine: 3,
    patrol_boat: 2,
  };
  constructor(type, isHorizontal = true) {
    this.type = type;
    this.length = Ship.lengthMapping[type];
    if (!this.length) {
      throw new Error("Invalid ship type");
    }
    this.isHorizontal = isHorizontal;
    this.numHits = 0;
    this.y0 = -1;
    this.x0 = -1;
    this.sunk = false;
  }
  hit() {
    this.numHits++;
    if (this.numHits >= this.length) {
      this.sunk = true;
    }
  }
}
