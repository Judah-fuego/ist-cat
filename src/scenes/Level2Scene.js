import Phaser from "phaser"
import { createPlayer, resetPlayer } from "../utils/player"
import { getSelectedCharacter, createCharacterAnimations } from "../utils/characters"
import { getPlatforms } from "../utils/platform"

export default class Level2Scene extends Phaser.Scene {
  constructor() {
    super("Level2Scene")
  }

  preload() {
    this.load.image("istartBg", "/tiles/istart.png")
    this.load.audio('roof', '/audio/roof.mp3');

    this.load.audio('death', '/audio/death.mp3');

  }

  create() {
    const W = this.scale.width
    const H = this.scale.height
    this.W = W

    // Get selected character and store for use in update
    this.character = getSelectedCharacter();

    createCharacterAnimations(this);

     this.music = this.sound.add('roof', { loop: true, volume: 0.5 });
    this.music.play();

    // Background (cover)
    const bg = this.add.image(0, 0, "istartBg").setOrigin(0).setDepth(-2)
    const bscale = Math.max(W / bg.width, H / bg.height)
    bg.setScale(bscale)

    // Platforms (modular, no overlap)
    const { platforms, platformInfos } = getPlatforms(this, 'Level2Scene');
    this.platformBodies = platforms;
    this.platformInfos = platformInfos;
    
    // Player
    this.playerStart = { x: 100, y: 100 }
    this.player = createPlayer(this, this.playerStart.x, this.playerStart.y, this.character);
    
    // Collide player with platforms
    this.platformBodies.forEach((p) => {
      this.physics.add.collider(this.player, p);
    });

    // Set death zone Y position (adjust this value as needed)
    this.deathY = H - 50; // Player resets if they fall below this line

    // Input
    this.cursors = this.input.keyboard.createCursorKeys()
    this.add.text(16, 16, "Level 2", { fontSize: "20px", color: "rgb(0, 0, 0)" })
    
    // Door - moved up and to the right as requested
    const doorX = W - 100
    const doorY = H - 200
    
    // Create door visual FIRST
    this.doorRect = this.add.rectangle(doorX, doorY, 40, 80, 0x8B4513).setOrigin(0.5);
    
    // Create door physics body
    this.physics.add.existing(this.doorRect, true); // true = static body
    
    // DON'T use overlap callback - we'll check manually in update
    this.canEnter = false
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();

    // Check if player fell below death zone
    if (this.player.y > this.deathY) {
      console.log('Player fell off - resetting!');
      this.cameras.main.flash(200, 255, 0, 0);
      this.music = this.sound.add('death', { loop: true, volume: 0.5 });
      this.resetPlayer();
      return; // Exit update early after reset
    }

    // MANUALLY check if player is overlapping with door using Phaser's overlap check
    this.canEnter = this.physics.overlap(this.player, this.doorRect);

    // Get animation names based on selected character
    const getAnimations = () => {
      if (this.character === 'cat2') {
        return { idle: 'cat2_idle', walkRight: 'cat2_walk_right', walkLeft: 'cat2_walk_left' };
      }
      return { idle: 'cat_idle', walkRight: 'cat_walk', walkLeft: 'cat_walk' };
    };

    const animations = getAnimations();

    if (cursors.left.isDown) {
      this.player.setVelocityX(-160)
      this.player.setFlipX(true)
      this.player.anims.play(animations.walkLeft, true)
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(160)
      this.player.setFlipX(false)
      this.player.anims.play(animations.walkRight, true)
    } else {
      this.player.setVelocityX(0)
      this.player.anims.play(animations.idle, true)
    }

    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-400)
    }

    // Debug logging
    if (this.canEnter) {
      console.log('Player is at the door! Press DOWN to enter.');
    }

    // Door interaction
    if (this.canEnter) {
      console.log('Entering Level 3!');
      this.cameras.main.fade(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
              this.music.stop();

        this.scene.start('Level3Scene');
      });
    }
  }

  resetPlayer() {
    resetPlayer(this.player, this.playerStart);
  }
}