import Gameboard, { Cell } from "../src/modules/gameboard.js";
import Ship from "../src/modules/ship.js";

test("initializing", () => {
  const gameboard = new Gameboard();
  expect(gameboard.board).toHaveLength(10);
  expect(gameboard.board[0]).toHaveLength(10);
  expect(gameboard.board[0][0]).toBe(Cell.EMPTY);
});

test("adding one ship vertical", () => {
  const gameboard = new Gameboard();
  const ship = new Ship("submarine", false);
  gameboard.placeShip(ship, 0, 0);
  expect(gameboard.board[0][0]).toBe(0);
  expect(gameboard.board[0][1]).toBe(Cell.EMPTY);
  expect(gameboard.board[1][0]).toBe(0);
  expect(gameboard.board[2][0]).toBe(0);
  expect(gameboard.board[3][0]).toBe(Cell.EMPTY);
});

test("adding one ship horizontal", () => {
  const gameboard = new Gameboard();
  const ship = new Ship("patrol_boat", true);
  gameboard.placeShip(ship, 1, 1);
  expect(gameboard.board[0][0]).toBe(Cell.EMPTY);
  expect(gameboard.board[1][1]).toBe(0);
  expect(gameboard.board[1][2]).toBe(0);
});

test("adding multiple ships", () => {
  const gameboard = new Gameboard();
  const ship1 = new Ship("patrol_boat", true);
  const ship2 = new Ship("patrol_boat", false);
  gameboard.placeShip(ship1, 1, 1);
  gameboard.placeShip(ship2, 7, 8);
  expect(gameboard.board[1][1]).toBe(0);
  expect(gameboard.board[1][2]).toBe(0);
  expect(gameboard.board[7][8]).toBe(1);
  expect(gameboard.board[8][8]).toBe(1);
});

test("adding overlapping ships", () => {
  const gameboard = new Gameboard();
  const ship1 = new Ship("patrol_boat", true);
  const ship2 = new Ship("patrol_boat", false);
  gameboard.placeShip(ship1, 1, 1);
  const ret = gameboard.placeShip(ship2, 0, 1);
  expect(ret).toBe(false);
  expect(gameboard.board[1][1]).toBe(0);
  expect(gameboard.board[0][1]).toBe(Cell.EMPTY);
});

test("adding out of bounds ships", () => {
  const gameboard = new Gameboard();
  const ship = new Ship("submarine", true);
  const ret = gameboard.placeShip(ship, 5, 8);
  expect(ret).toBe(false);
  expect(gameboard.board[5][8]).toBe(Cell.EMPTY);
});

test("attacking miss", () => {
  const gameboard = new Gameboard();
  const ship = new Ship("patrol_boat", false);
  gameboard.placeShip(ship, 5, 4);
  const ret = gameboard.receiveAttack(1, 1);
  expect(ret.attackStatus).toBe("missed");
  expect(gameboard.board[1][1]).toBe(Cell.MISSED);
});

test("attacking hit", () => {
  const gameboard = new Gameboard();
  const ship = new Ship("patrol_boat", false);
  gameboard.placeShip(ship, 1, 1);
  let ret = gameboard.receiveAttack(1, 1);
  expect(ret.attackStatus).toBe("hit");
  expect(gameboard.board[1][1]).toBe(Cell.HIT);
  expect(gameboard.ships[0].numHits).toBe(1);
});

// test.todo("attacking invalid");

// test.todo("attacking hit");
