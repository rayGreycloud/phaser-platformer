// Create game state
PlayState = {};

PlayState.preload = function () {
  // Load level data
  this.game.load.json('level:1', 'data/level01.json');
  // Load background image
  this.game.load.image('background', 'images/background.png');
}
// Render image
PlayState.create = function () {
  this.game.add.image(0, 0, 'background');
  this._loadLevel(this.game.cache.getJSON('level:1'));
}

PlayState._loadLevel = function (data) {
  console.log(data);
}

window.onload = function () {
  let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
  game.state.add('play', PlayState);
  game.state.start('play');

}
