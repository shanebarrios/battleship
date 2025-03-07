export default class Ship {
  static ShipType = Object.freeze({
    CARRIER: 1,
    BATTLESHIP: 2,
    DESTROYER: 3,
    SUBMARINE: 4,
    PATROL_BOAT: 5,
  });
  constructor(type, isHorizontal = true) {
    this.type = type;
    this.length = Ship.lengthMapping(type);
    this.isHorizontal = isHorizontal;
    this.numHits = 0;
    this.sunk = false;
  }
  static lengthMapping(type) {
    switch (type) {
      case Ship.ShipType.CARRIER:
        return 5;
      case Ship.ShipType.BATTLESHIP:
        return 4;
      case Ship.ShipType.DESTROYER:
        return 3;
      case Ship.ShipType.SUBMARINE:
        return 3;
      case Ship.ShipType.PATROL_BOAT:
        return 2;
      default:
        return -1;
    }
  }
  hit() {
    this.numHits++;
    if (this.numHits >= this.length) {
      this.sunk = true;
    }
  }
}
