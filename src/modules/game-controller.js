import Player from "./player.js";
import { AttackStatus } from "./gameboard.js";

export default class GameController {
  constructor() {
    this.player1 = new Player();
    this.player2 = new Player();
    this.started = false;
    this.player1Turn = true;
  }
  init() {
    if (
      this.player1.unplacedShips.length === 0 &&
      this.player2.unplacedShips.length === 0
    ) {
      this.started = true;
    }
    return this.started;
  }
  playTurn(y, x) {
    if (!this.started) {
      return AttackStatus.FAILED_ATTACK;
    }
    let res = this.player1Turn
      ? this.player2.receiveAttack(y, x)
      : this.player1.receiveAttack(y, x);
    if (res) {
      this.player1Turn = !this.player1Turn;
    }
    return res;
  }
  playRandomTurn() {
    if (!this.started) {
      return AttackStatus.FAILED_ATTACK;
    }
    let res = this.player1Turn
      ? this.player2.receiveAttackRandom()
      : this.player1.receiveAttackRandom();
    if (res) {
      this.player1Turn = !this.isPlayer1Turn;
    }
    return res;
  }
}
