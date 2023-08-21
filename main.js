const config = {
  width: 256,
  height: 256,
  backgroundColor: 0x000000,
  scene: [Scene1, Scene2],
  physics: {
    default: "arcade",
    arcade: {
      debug:false
    }
  }
}

var game = new Phaser.Game(config)
