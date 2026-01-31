
import Phaser from "phaser"
import { createPlayer } from "../utils/player"
import { getSelectedCharacter } from "../utils/characters"

export default class Level2Scene extends Phaser.Scene {
  constructor() {
    super("Level2Scene")
  }

  preload() {
    this.load.image("beachBg", "/tiles/beach.jpeg")
    this.load.image("oldMan", "/sprites/old_man.png")
  }

  create() {
    const W = this.scale.width
    const H = this.scale.height
    this.W = W

    // Background (cover)
    const bg = this.add.image(0, 0, "beachBg").setOrigin(0).setDepth(-2)
    const bscale = Math.max(W / bg.width, H / bg.height)
    bg.setScale(bscale)

    // Platforms - visuals + physics static bodies
    const groundH = Math.max(40, Math.round(H * 0.06))
    const groundRect = this.add.rectangle(W / 2, H - groundH / 2, W, groundH, 0x6b6b6b).setOrigin(0.5)
    this.physics.add.existing(groundRect, true)

    const plat1 = this.add.rectangle(W * 0.22, H * 0.58, Math.round(W * 0.12), 20, 0x999999).setOrigin(0.5)
    this.physics.add.existing(plat1, true)

    this.platformBodies = [groundRect, plat1]

    // Player
    this.playerStart = { x: Math.round(W * 0.07), y: H - 120 }
    const character = getSelectedCharacter();
    this.player = createPlayer(this, this.playerStart.x, this.playerStart.y, character);
    this.platformBodies.forEach(p => this.physics.add.collider(this.player, p))

    this.cursors = this.input.keyboard.createCursorKeys()
    this.add.text(16, 16, "Level 2", { fontSize: "20px", color: "#fbfbfbff" })

    // followers
    this.followers = this.physics.add.group()
    const f = this.followers.create(Math.round(W * 0.7), H - 120, "oldMan").setScale(0.3)
    f.setOrigin(0.5, 1) // pivot at bottom-center
    const tex = this.textures.get('oldMan').getSourceImage();
    const bottomPadding = 8; // Adjust this value based on your sprite's pivot
    const visibleW = tex.width; // or measured trimmed width
    const visibleH = tex.height - bottomPadding; // compute bottomPadding if known
    f.body.setSize(visibleW * f.scaleX, visibleH * f.scaleY);
    f.body.setOffset(0, bottomPadding * f.scaleY);
    this.followers.getChildren().forEach(f => {
      f.body.setCollideWorldBounds(true)
      f.setBounce(0.2)
      this.platformBodies.forEach(p => this.physics.add.collider(f, p))
    })

    // hazards
    this.hazards = this.physics.add.group()
    this.platformBodies.forEach(p => this.physics.add.collider(this.hazards, p))
    this.physics.add.overlap(this.player, this.hazards, () => this.resetPlayer(), null, this)

    

    // Door back to menu
    const doorX = W - Math.round(W * 0.06)
    const doorY = H - 120
    this.doorZone = this.physics.add.staticGroup()
    this.doorZone.create(doorX, doorY, null).setDisplaySize(40, 80).refreshBody()
    this.add.rectangle(doorX, doorY, 40, 80, 0x222222).setOrigin(0.5)
    this.canEnter = false
    this.physics.add.overlap(this.player, this.doorZone, () => { this.canEnter = true }, null, this)
  }

  update() {
    if (this.cursors.left.isDown) this.player.setVelocityX(-200)
    else if (this.cursors.right.isDown) this.player.setVelocityX(200)
    else this.player.setVelocityX(0)

    if (this.cursors.up.isDown && this.player.body.onFloor()) this.player.setVelocityY(-400)

    this.followers.getChildren().forEach(f => {
      const dx = this.player.x - f.x
      const speed = 80
      if (Math.abs(dx) > 10) f.setVelocityX(Math.sign(dx) * speed)
      else f.setVelocityX(0)
      if (this.player.y + 20 < f.y && (f.body.blocked.down || f.body.touching.down)) {
        f.setVelocityY(-350)
      }
    })

    if (this.canEnter && this.player.x > this.W - Math.round(this.W * 0.08)) this.scene.start("MenuScene")
  }

  resetPlayer() {
    this.player.setPosition(this.playerStart.x, this.playerStart.y)
    this.player.setVelocity(0,0)
  }
}
