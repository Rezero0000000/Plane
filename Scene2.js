class Scene2 extends Phaser.Scene {
  constructor () {
    super ("bootGame");
  }

  create () {
    this.beamSound = this.sound.add("audio_beam");
    this.explosionSound = this.sound.add("audio_explosion");
    this.music = this.sound.add("music");

    var musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    }
    this.music.play(musicConfig);

    this.background = this.add.tileSprite(0,0,config.width, config.height, "background");
    this.background.setOrigin(0,0);

    this.ship1 = this.add.sprite(config.width/2 - 50, config.height/2, "ship1")
    this.ship2 = this.add.sprite(config.width/2, config.height/2, "ship2")
    this.ship3 = this.add.sprite(config.width/2 + 50, config.height/2, "ship3")

    this.player = this.physics.add.sprite(config.width/2 - 8, config.height - 64, "player");
    this.player.play("player_anim")
    this.player.setCollideWorldBounds()

    this.cursorKeys = this.input.keyboard.createCursorKeys()
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.projectTiles = this.add.group();

  
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

    this.physics.add.collider(this.projectTiles, this.powerUps, function (projectTiles, powerUps) {
      projectTiles.destroy();
    })

    this.physics.add.overlap(this.player, this.powerUps, function (player, powerUp) {
        powerUp.disableBody(true, true)
    }, this.hitPowerUp, null, this)

    this.ship1.play("ship1_anim")
    this.ship2.play("ship2_anim")
    this.ship3.play("ship3_anim")

    this.enemies = this.physics.add.group()
    this.enemies.add(this.ship1)
    this.enemies.add(this.ship2)
    this.enemies.add(this.ship3)
    
    this.physics.add.overlap(this.player, this.enemies, function (player, enemy) { 
      this.resetShipPos(enemy);

      if(this.player.alpha < 1){
          return;
      }

      var explosion = new Explosion(this, player.x, player.y);
      player.disableBody(true, true);
      this.time.addEvent({
        delay: 1000,
        callback: this.resetPlayer,
        callbackScope: this,
        loop: false
      });
    }, null, this)

    this.physics.add.overlap(this.projectTiles, this.enemies, function (beam, enemy) {
      var explosion = new Explosion (this, enemy.x, enemy.y)

      beam.destroy()
      this.resetShipPos(enemy)
      this.score += 15;

      var scoreFormated = this.zeroPad(this.score, 6);
      this.scoreLabel.text = "SCORE " + scoreFormated;
      this.explosionSound.play();
    }, null, this)

    var graphics = this.add.graphics();

    graphics.fillStyle(0x000000, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(config.width, 0);
    graphics.lineTo(config.width, 20);
    graphics.lineTo(0, 20);
    graphics.lineTo(0, 0);
    
    graphics.closePath();
    graphics.fillPath();

    this.score = 0;
    var scoreFormated = this.zeroPad(this.score, 6);
    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE " + scoreFormated  , 16);
  
  }

  zeroPad(number, size){
    var stringNumber = String(number);
     
    while(stringNumber.length < (size || 2)){
      stringNumber = "0" + stringNumber;
    }

    return stringNumber;
  }

  moveShip (ship, speed) {
    ship.y += speed;
    if (ship.y > config.height) {
      this.resetShipPos(ship)
    }
  }
  
  resetPlayer(){
    var x = config.width / 2 - 8;
    var y = config.height + 64;
    this.player.enableBody(true, x, y, true, true);

    this.player.alpha = 0.5;
    
    var tween = this.tweens.add({
      targets: this.player,
      y: config.height - 64,
      ease: 'Power1',
      duration: 1500,
      repeat:0,
      onComplete: function(){
        this.player.alpha = 1;
      },
      callbackScope: this
    });
  }

  resetShipPos (ship) {
    ship.y = 0;
    ship.x = Phaser.Math.Between(0, config.width)
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
    this.beamSound.play();
  }

  update () {
    this.moveShip(this.ship1, 1)
    this.moveShip(this.ship2, 2)
    this.moveShip(this.ship3, 3)

    for (let i = 0; i < this.projectTiles.getChildren().length; i++) {
      this.projectTiles.getChildren()[i].update;
    }
    this.background.tilePositionY -= 0.5
    this.controlPlayer()
  }
}
