class Beam extends Phaser.GameObjects.Sprite {
  constructor (scene) {
    let x = scene.player.x;
    let y = scene.player.y;

    super (scene, x, y, "beam")    
    //scene.projectiles.add(this)
    scene.add.existing(this);

    this.play("beam_anim");
    scene.physics.world.enableBody(this);
    this.body.velocity.y = - 250;

<<<<<<< HEAD
    scene.projectTiles .add(this)
  }

  update () {
    if (this.x > 32) {
      this.destroy()
    }
=======
    scene.projectiles.add(this);
>>>>>>> 8ae9d7a59e0b3c896270c4df375a4af2bed89c7d
  }
}

