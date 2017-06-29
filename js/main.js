function Hero(game, x, y) {
  // Call constructor
  Phaser.Sprite.call(this, game, x, y, 'hero');
  this.anchor.set(0.5, 0.5);
  this.game.physics.enable(this);
  this.body.collideWorldBounds = true;
}
// Inherit from Phaser.sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

// Move method
Hero.prototype.move = function (direction) {
  const SPEED = 200;
  this.body.velocity.x = direction * SPEED;
}

// Jump method
Hero.prototype.jump = function () {
  const JUMP_SPEED = 600;
  let canJump = this.body.touching.down;

  if (canJump) {
  this.body.velocity.y = -JUMP_SPEED;
  }

  return canJump;
}

// Create game state
PlayState = {};

PlayState.init = function () {
  // Correct render bug
  // Pixel art so no anti-aliasing
  this.game.renderer.renderSession.roundPixels = true;

  // Create instances of Phaser.key
  this.keys = this.game.input.keyboard.addKeys({
    left: Phaser.KeyCode.LEFT,
    right: Phaser.KeyCode.RIGHT,
    up: Phaser.KeyCode.UP
  });
  // Listener for jump
  this.keys.up.onDown.add(function () {
    let didJump = this.hero.jump();
    if (didJump) {
      this.sfx.jump.play();
    }
  }, this);
}

PlayState.preload = function () {
  // Load level data
  this.game.load.json('level:1', 'data/level01.json');
  // Load background image
  this.game.load.image('background', 'images/background.png');
  // Load platform sprites
  this.game.load.image('ground', 'images/ground.png');
  this.game.load.image('grass:8x1', 'images/grass_8x1.png');
  this.game.load.image('grass:6x1', 'images/grass_6x1.png');
  this.game.load.image('grass:4x1', 'images/grass_4x1.png');
  this.game.load.image('grass:2x1', 'images/grass_2x1.png');
  this.game.load.image('grass:1x1', 'images/grass_1x1.png');
  // Load hero
  this.game.load.image('hero', 'images/hero_stopped.png');
  // Load sfx
  this.game.load.audio('sfx:jump', 'audio/jump.wav');

}

// Create
PlayState.create = function () {
  this.game.add.image(0, 0, 'background');
  this._loadLevel(this.game.cache.getJSON('level:1'));
  this.sfx = {
    jump: this.game.add.audio('sfx:jump')
  };
}

// update
PlayState.update = function () {
  this._handleCollisions();
  this._handleInput();
}

PlayState._handleCollisions = function () {
  this.game.physics.arcade.collide(this.hero, this.platforms);
}

PlayState._handleInput = function () {
  if (this.keys.left.isDown) {
    this.hero.move(-1); // Move hero left
  } else if (this.keys.right.isDown) {
    this.hero.move(1); // Move hero right
  } else {
    this.hero.move(0); // stop
  }
}

PlayState._loadLevel = function (data) {
  // Create groups
  this.platforms = this.game.add.group();
  // Spawn platforms
  data.platforms.forEach(this._spawnPlatform, this);
  // Spawn hero and enemies
  this._spawnCharacters({hero: data.hero});
  // Enable Gravity
  const GRAVITY = 1200;
  this.game.physics.arcade.gravity.y = GRAVITY;
}

PlayState._spawnPlatform = function (platform) {
  let sprite = this.platforms.create(platform.x, platform.y, platform.image);

  this.game.physics.enable(sprite);
  sprite.body.allowGravity = false;
  sprite.body.immovable = true;
}

PlayState._spawnCharacters = function (data) {
  // Spawn hero
  this.hero = new Hero(this.game, data.hero.x, data.hero.y);
  this.game.add.existing(this.hero);
}

window.onload = function () {
  let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
  game.state.add('play', PlayState);
  game.state.start('play');

}
