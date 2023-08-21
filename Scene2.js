class Scene2 extends Phaser.Scene {
  constructor () {
    super ("bootGame");
  }

  create () {

    this.background = this.add.tileSprite(0,0,config.width, config.height, "background");
    this.background.setOrigin(0,0);

    this.ship1 = this.add.sprite(config.width/2 - 50, config.height/2, "ship1")
    this.ship2 = this.add.sprite(config.width/2, config.height/2, "ship2")
    this.ship3 = this.add.sprite(config.width/2 + 50, config.height/2, "ship3")

    this.player = this.physics.add.sprite(config.width/2 - 8, config.height - 64, "player");
    this.player.play("player_anim")
    this.player.setCollideWorldBounds()

    this.ship1.setInteractive()
    this.ship2.setInteractive()
    this.ship3.setInteractive()

    this.cursorKeys = this.input.keyboard.createCursorKeys()
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

  
    this.powerUps = this.physics.add.group()
    for (let i = 0; i < 4; i++){

      let powerUp = this.physics.add.sprite(16, 16, "power-up")
      this.powerUps.add(powerUp)
      powerUp.setRandomPosition(0, 0,config.width, config.height)

      if(Math.random() > 0.5){
        powerUp.play("red")
      }else {
        powerUp.play("gray")
      }
    
      powerUp.setVelocity(100, 100)
      powerUp.setCollideWorldBounds(true)
      powerUp.setBounce(1)
    }

    this.input.on('gameobjectdown', this.destroyShip, this)

    this.add.text(20, 20, "Playing Game", {
      font: "25px Arial"
    })
    
    this.ship1.play("ship1_anim")
    this.ship2.play("ship2_anim")
    this.ship3.play("ship3_anim")
  }

  destroyShip (pointer, gameObject) {
    gameObject.setTexture("explosion")
    gameObject.play("explode")
  }

  moveShip (ship, speed) {
    ship.y += speed;
    if (ship.y > config.height) {
      ship.y = 0;
      ship.x = Phaser.Math.Between(0, config.width)
    }
  }

  controlPlayer () {
    if(this.cursorKeys.left.isDown) {
      this.player.x -= 2;
    }else if (this.cursorKeys.right.isDown) {
      this.player.x += 2;
    }

    if (this.cursorKeys.up.isDown) {
      this.player.y -= 2;
    }
    else if (this.cursorKeys.down.isDown) {
      this.player.y += 2;
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
      this.shotBeam()
    }
  }
  
  shotBeam () {
    var beam = new Beam (this)

   // this.beam = this.physics.add.sprite(this.player.x, this.player.y, "beam")
  }

  update () {
    this.moveShip(this.ship1, 1)
    this.moveShip(this.ship2, 2)
    this.moveShip(this.ship3, 3)

    this.background.tilePositionY -= 0.5
    this.controlPlayer()
  }
}

