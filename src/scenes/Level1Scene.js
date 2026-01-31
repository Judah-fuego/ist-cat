import Phaser from "phaser"
import { createPlayer, resetPlayer } from "../utils/player"
import { getSelectedCharacter, createCharacterAnimations } from "../utils/characters"
import { getPlatforms } from "../utils/platform"

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super("Level1Scene")
  }

  preload() {
    this.load.image("subwayBg", "/tiles/metro2.gif");
    this.load.audio('metroMusic', '/audio/metro.mp3');


  }

  create() {
    const W = this.scale.width
    const H = this.scale.height
    this.W = W

     this.music = this.sound.add('metroMusic', { loop: true, volume: 0.5 });
    this.music.play();

    // Get selected character and store for use in update
    this.character = getSelectedCharacter();

    createCharacterAnimations(this);

    // Background (cover)
    const bg = this.add.image(0, 0, "subwayBg").setOrigin(0).setDepth(-2)
    const bscale = Math.max(W / bg.width, H / bg.height)
    bg.setScale(bscale)

    // Platforms (modular, no overlap)
    const { platforms, platformInfos, spike } = getPlatforms(this, 'Level1Scene');
    this.platformBodies = platforms;
    this.platformInfos = platformInfos;
    this.spike = spike;
    this.groundY = this.scale.height - Math.max(40, Math.round(this.scale.height * 0.06)) / 2;
    
    // Player
    this.playerStart = { x: Math.round(W * 0.07), y: H - 120 }
    this.player = createPlayer(this, this.playerStart.x, this.playerStart.y, this.character);
    
    // Collide player with ONLY non-hazard platforms
    this.platformBodies.forEach((p, index) => {
      const platformData = this.platformInfos[index];
      // Don't add collider for hazards or spike
      if (!platformData?.isHazard && p !== this.spike) {
        this.physics.add.collider(this.player, p);
      }
    });

    // Add spike collision
    if (this.spike) {
      this.physics.add.overlap(this.player, this.spike, this.handleSpikeHit, null, this);
    }

    // Add lava hazard detection - use overlap, not collider
    this.platformInfos.forEach((info) => {
      if (info.isHazard && info.rect) {
        this.physics.add.overlap(this.player, info.rect, this.handleLavaHit, null, this);
      }
    });

    // Input
    this.cursors = this.input.keyboard.createCursorKeys()
    this.add.text(16, 16, "Level 1", { fontSize: "20px", color: "rgb(0, 0, 0)" })
    
    
    // Create door on final platform
    const finalPlatformInfo = platformInfos.find(p => p.door);
    if (finalPlatformInfo) {
      const doorX = 50;
      const doorY = 210;
      
      this.door = this.add.rectangle(doorX, doorY, 40, 60, 0x8B4513)
        .setOrigin(1, 1);
      this.physics.add.existing(this.door, true);
      this.physics.add.overlap(this.player, this.door, this.enterDoor, null, this);
    }
  }

  handleSpikeHit(player, spike) {
    console.log('Player hit spike!');
    this.cameras.main.flash(200, 255, 0, 0);
    this.resetPlayer();
  }

  handleLavaHit(player, lava) {
    console.log('Player hit lava!');
    this.cameras.main.flash(200, 255, 100, 0); // Orange flash for lava
    this.resetPlayer();
  }

  enterDoor(player, door) {
    // Optional: Add a transition effect
    this.cameras.main.fade(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.music.stop();
      this.scene.start('Level2Scene');
    });
  }

  update() {
    // Animate falling spike: fall faster and reset to top when it hits ground
    if (this.spike) {
      // Set fast falling speed
      this.spike.body.setVelocityY(400);
      // If spike hits ground, reset to top
      if (this.spike.y > this.groundY - this.spike.height / 2) {
        this.spike.y = 0;
      }
    }

    const cursors = this.input.keyboard.createCursorKeys();

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
    }
    else if (cursors.down.isDown)
    {
      this.player.setVelocityX(0)
      this.player.anims.play(animations.idle, true)
    }

    if (this.cursors.up.isDown && this.player.body.onFloor()) this.player.setVelocityY(-400)

    
  }

  resetPlayer() {
    resetPlayer(this.player, this.playerStart);
  }
}