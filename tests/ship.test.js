import Ship, { ShipType } from "../src/modules/ship.js";

test("initializing", () => {
  const ship = new Ship(ShipType.BATTLESHIP, true);
  expect(ship).toHaveLength(4);
  expect(ship.numHits).toBe(0);
});

test("hit some times", () => {
  const ship = new Ship(ShipType.DESTROYER, true);
  ship.hit();
  ship.hit();
  expect(ship.sunk).toBe(false);
  expect(ship.numHits).toBe(2);
});

test("sunk", () => {
  const ship = new Ship(ShipType.PATROL_BOAT, true);
  ship.hit();
  ship.hit();
  expect(ship.sunk).toBe(true);
  const ship2 = new Ship(ShipType.SUBMARINE, false);
  ship2.hit();
  ship2.hit();
  expect(ship2.sunk).toBe(false);
  ship2.hit();
  expect(ship2.sunk).toBe(true);
});
