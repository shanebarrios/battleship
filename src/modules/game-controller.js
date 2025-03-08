import Player from "./player.js";

export default class GameController {
  constructor(player1Name="PLAYER1", player2Name="COMPUTER") {
    this.player1 = new Player(player1Name);
    this.player2 = new Player(player2Name);
    this.started = false;
    this.player1Turn = true;
    this.victor = null;
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
  playTurn(receiveMethod) {
    if (!this.started || this.victor) {
      return null;
    }
    let res = this.player1Turn
      ? receiveMethod(this.player2)
      : receiveMethod(this.player1);
    if (res) {
      this.player1Turn = !this.player1Turn;
      if (res.sank) {
        this.updateVictor();
      }
    }
    return res;
  }
  playManualTurn(y, x) {
    return this.playTurn((player) => player.receiveAttack(y, x));
  }
  playRandomTurn() {
    return this.playTurn((player) => player.receiveAttackRandom());
  }
  updateVictor() {
    if (this.player1.gameboard.allSunk()) {
      this.victor = this.player2.name;
    }
    else if (this.player2.gameboard.allSunk()) {
      this.victor = this.player1.name;
    }
    else {
      this.victor = null;
    }
  }
}
