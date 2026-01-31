import Phaser from "phaser"
import { createPlayer, resetPlayer } from "../utils/player"
import { getSelectedCharacter, createCharacterAnimations } from "../utils/characters"
import { getPlatforms } from "../utils/platform"

export default class Level3Scene extends Phaser.Scene {

    constructor() {
        super("Level3Scene")
    }

    preload() {
        // Load the video in preload
        // this.load.video('underwater', '/tiles/underwater.mp4');
        this.load.image("bg", "/tiles/blue_water.png")
        this.load.image("fish", "/characters/anchovy/Anchovy.png");
        this.load.image("goldfish", "/characters/goldfish/Goldfish.png")
        this.load.image("treasure", "/exit.jpg")
        this.load.audio('water', '/audio/water.mp3');

        this.load.audio('death', '/audio/death.mp3');

    }

    create(){
        // Create and play the video in create
        // const video = this.add.video(400, 300, 'underwater');
        // video.play(true); // true makes it loop
        
        // // Optional: scale or adjust the video size
        // video.setDisplaySize(150, 120);


        const W = this.scale.width
        const H = this.scale.height
        this.W = W

        // Get selected character and store for use in update
        this.character = getSelectedCharacter();

        createCharacterAnimations(this);

         this.music = this.sound.add('water', { loop: true, volume: 0.5 });
    this.music.play();

        const bg = this.add.image(0, 0, "bg").setOrigin(0).setDepth(-2)
        const bscale = Math.max(W / bg.width, H / bg.height)
        bg.setScale(bscale)


        const { platforms, platformInfos,  } = getPlatforms(this, 'Level3Scene');
        this.platformBodies = platforms;
        this.platformInfos = platformInfos;

        this.playerStart = { x: 50, y: 50 }
        this.player = createPlayer(this, this.playerStart.x, this.playerStart.y, this.character);

        this.platformBodies.forEach((p, index) => {
      const platformData = this.platformInfos[index];
      // Don't add collider for hazards or spike
      if (!platformData?.isHazard && p !== this.spike) {
        this.physics.add.collider(this.player, p);
      }
    });
    
    this.add.text(16, 16, "Level 3", { fontSize: "20px", color: "rgb(0, 0, 0)" })

    this.add.text(250,30, "THIS CAT CAN'T DIVE FOR LONG", { fontSize: "60px", color: "rgb(15, 6, 91)" })
    


    this.levelDuration = 30;

    this.timerText = this.add.text(16, 40, "Time: 30", {
    fontSize: "16px",
    color: "#000000"
    });

    this.startLevelTimer();


    // Initialize cursors once in create, not in update
    this.cursors = this.input.keyboard.createCursorKeys();

    // --- Fish NPC group ---
  this.fishGroup = this.physics.add.group({
    allowGravity: false
  });

  for (let i = 0; i < 5; i++) {
    const fish = this.fishGroup.create(
      Phaser.Math.Between(-400, -50),     // staggered start
      Phaser.Math.Between(120, 420),      // random Y
      "fish"
    ).setScale(3);

    fish.setVelocityX(Phaser.Math.Between(80, 160));
    fish.setFlipX(false);

    // 🔥 ghost mode
    fish.body.checkCollision.none = true;
  }

  for (let i = 0; i < 5; i++) {
    const goldfish = this.fishGroup.create(
      Phaser.Math.Between(-400, -50),     // staggered start
      Phaser.Math.Between(350, 800),      // random Y
      "goldfish"
    ).setScale(3);

    goldfish.setVelocityX(Phaser.Math.Between(80, 160));
    goldfish.setFlipX(false);

    // 🔥 ghost mode
    goldfish.body.checkCollision.none = true;
  }

  const exitX = this.W - 60;   // bottom-right X
  const exitY = this.scale.height - 120; // slightly above ground

  this.exitObject = this.physics.add
    .staticImage(exitX, exitY, "treasure")
    .setScale(0.1)
    .setDepth(2);

  // Optional: make hitbox tighter
    this.exitObject.body.setSize(
      this.exitObject.width * 0.1,
      this.exitObject.height * 0.1
    ).setOffset(550,550);

    this.physics.add.overlap(
    this.player,
    this.exitObject,
    () => {
      this.cameras.main.fade(500, 0, 0, 0);
            this.music.stop();

      this.scene.start("FinalScene");
    },
    null,
    this
  );

  this.tweens.add({
    targets: this.exitObject,
    y: this.exitObject.y - 10,
    duration: 800,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });
  
}
    
    update(){
    // Get animation names based on selected character
    const getAnimations = () => {
      if (this.character === 'cat2') {
        return { idle: 'cat2_idle', walkRight: 'cat2_walk_right', walkLeft: 'cat2_walk_left' };
      }
      return { idle: 'cat_idle', walkRight: 'cat_walk', walkLeft: 'cat_walk' };
    };

    const animations = getAnimations();

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160)
      this.player.setFlipX(true)
      this.player.anims.play(animations.walkLeft, true)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160)
      this.player.setFlipX(false)
      this.player.anims.play(animations.walkRight, true)
    }
    else if (this.cursors.down.isDown)
    {
      this.player.setVelocityX(0)
      this.player.anims.play(animations.idle, true)
    }

    if (this.cursors.up.isDown && this.player.body.onFloor()) this.player.setVelocityY(-400);

    this.fishGroup.children.iterate((fish) => {
  if (!fish.active) return;

  if (fish.x > this.W + 50) {
    fish.x = Phaser.Math.Between(-400, -50);
    fish.y = Phaser.Math.Between(120, 420);
    fish.setVelocityX(Phaser.Math.Between(80, 160));
  }
});

    }

    resetPlayer() {
    resetPlayer(this.player, this.playerStart);


  }

  startLevelTimer() {
  // clean up old timers if they exist
  this.levelTimer?.remove();
  this.timerEvent?.remove();

  this.levelTimer = this.time.addEvent({
    delay: this.levelDuration * 1000,
    callback: () => {
      this.handleLevelReset();
    },
    loop: false
  });

  this.timerEvent = this.time.addEvent({
    delay: 1000,
    callback: () => {
      const remaining = Math.ceil(this.levelTimer.getRemainingSeconds());
      this.timerText.setText(`Time: ${remaining}`);
    },
    loop: true
  });
}

handleLevelReset() {
  this.music = this.sound.add('death', { loop: true, volume: 0.5 });
  resetPlayer(this.player, this.playerStart);
  this.startLevelTimer(); // 🔥 THIS is what you were missing
}



}