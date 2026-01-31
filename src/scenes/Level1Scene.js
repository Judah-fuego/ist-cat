
import Phaser from "phaser"
import { createPlayer, resetPlayer } from "../utils/player"
import { getSelectedCharacter, createCharacterAnimations } from "../utils/characters"
import { getPlatforms } from "../utils/platform"
import { createFollowers, followFollowers } from "../utils/npc"
import { createDoorZone } from "../utils/door"
import { RAT_IDLE, RAT_WALK } from "../assets"

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super("Level1Scene")
  }

  preload() {
    this.load.image("subwayBg", "/tiles/metro2.gif");
    
    // Preload rat assets for NPC
    this.load.spritesheet('rat_idle', RAT_IDLE, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('rat_walk', RAT_WALK, { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    
    const W = this.scale.width
    const H = this.scale.height
    this.W = W

    // Get selected character and store for use in update
    this.character = getSelectedCharacter();

    createCharacterAnimations(this);

    

    // Background (cover)
    const bg = this.add.image(0, 0, "subwayBg").setOrigin(0).setDepth(-2)
    const bscale = Math.max(W / bg.width, H / bg.height)
    bg.setScale(bscale)

    // Platforms (modular, no overlap)
    const { platforms, platformInfos, backpack } = getPlatforms(this, 'Level1Scene');
    this.platformBodies = platforms;
    this.backpack = backpack;
    this.groundY = this.scale.height - Math.max(40, Math.round(this.scale.height * 0.06)) / 2;

    
    // Player
    this.playerStart = { x: Math.round(W * 0.07), y: H - 120 }
    this.player = createPlayer(this, this.playerStart.x, this.playerStart.y, this.character);
    // Collide player with each platform body
    this.platformBodies.forEach(p => this.physics.add.collider(this.player, p))

    // Input
    this.cursors = this.input.keyboard.createCursorKeys()
    this.add.text(16, 16, "Level 1", { fontSize: "20px", color: "#f3f2f2ff" })

    // NPC followers for Level 1 - Rat that chases the player
    this.followers = createFollowers(this, [
      { x: Math.round(W * 0.8), y: this.playerStart.y, key: 'rat_idle', type: 'rat', scale: 2 }
    ]);
      this.followers.getChildren().forEach(f => {
        f.body.setCollideWorldBounds(true);
        f.setBounce(0.2);
        f.body.setAllowGravity(true);
        f.body.setImmovable(false);
        this.platformBodies.forEach(p => this.physics.add.collider(f, p));
      });

    // Hazards (no auto spawn here; keep simple)
    this.hazards = this.physics.add.group()
    // hazards should collide with platforms
    this.platformBodies.forEach(p => this.physics.add.collider(this.hazards, p))
    this.physics.add.overlap(this.player, this.hazards, () => this.resetPlayer(), null, this)

// Lava kills player
    platformInfos
      .filter(p => p.isHazard)
      .forEach(lava => {
        this.physics.add.overlap(
          this.player,
          lava.rect,
          () => this.resetPlayer(),
          null,
          this
        );
      });
    this.physics.add.collider(this.player, this.followers, () => this.resetPlayer(), null, this)

    // Door (random platform, not ground)
    
      
    const doorPlat = platformInfos.find(p => p.door === true);

    if (!doorPlat) {
      console.error("No door platform found!");
    } else {
      const DOOR_W = 40;
      const DOOR_H = 80;

      const doorX = doorPlat.x;
      const doorY =
        doorPlat.rect.y - doorPlat.h / 2 - DOOR_H / 2;

      this.doorZone = createDoorZone(this, doorX + 40, doorY , DOOR_W, DOOR_H);

      this.canEnter = false;
      this.physics.add.overlap(
        this.player,
        this.doorZone,
        () => (this.canEnter = true),
        null,
        this
      );
    }
  }

  update() {

    // Animate falling backpack: fall faster and reset to top when it hits ground
    if (this.backpack) {
      // Set fast falling speed
      this.backpack.body.setVelocityY(400);
      // If backpack hits ground, reset to top
      if (this.backpack.y > this.groundY - this.backpack.height / 2) {
        this.backpack.y = 0;
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

      // followers simple AI: move toward player (modular, call in update)
      followFollowers(this.followers, this.player);

      this.followers.getChildren().forEach(f => {
        try {
          if (f.body.velocity.x < 0) {
            f.setFlipX(false); // left-facing sprite, not flipped
            if (f.anims.currentAnim?.key !== 'rat_walk_left') {
              f.anims.play('rat_walk_left', true);
            }
          } else if (f.body.velocity.x > 0) {
            f.setFlipX(false); // right-facing sprite, not flipped
            if (f.anims.currentAnim?.key !== 'rat_walk_right') {
              f.anims.play('rat_walk_right', true);
            }
          } else {
            if (f.anims.currentAnim?.key !== 'rat_idle') {
              f.anims.play('rat_idle', true);
            }
          }
        } catch (e) {
          // Prevent crash on direction change or missing anim
        }
      });

    // advance only if player is overlapping door zone
    if (this.canEnter && this.player.x > this.W - Math.round(this.W * 0.08)) {
      this.scene.start("Level2Scene")
    }
  }

  resetPlayer() {
    resetPlayer(this.player, this.playerStart);
  }
}
