import Phaser from "phaser"
import { setSelectedCharacter, createCharacterAnimations } from "../utils/characters"
import { CAT_IDLE, CAT_WALK, CAT2_IDLE, CAT2_WALK } from '../assets'


export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene")
  }

  preload() {
    this.load.image('menu-bg', '/tiles/menu.png');

    // Characters
    this.load.spritesheet('cat_idle', CAT_IDLE, { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('cat_walk', CAT_WALK, { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('cat2_idle', CAT2_IDLE, { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('cat2_walk', CAT2_WALK, { frameWidth: 48, frameHeight: 48 });

    this.load.audio('menuMusic', '/audio/mall.mp3');
  }

  create() {
    const { width, height } = this.scale;

     this.music = this.sound.add('menuMusic', { loop: true, volume: 0.5 });
    this.music.play();

    // Add background image
    this.add.image(0, 0, 'menu-bg').setOrigin(0, 0).setDisplaySize(width, height);

    // Add title text
    this.add.text(width * 0.5, height * 0.2, 'Will you...', { fontSize: '48px', fill: '#000000ff' }).setOrigin(0.5);

    // Character animations
    // ...existing code...
    createCharacterAnimations(this);

    // Add Cat and Cat2 as animated sprites for selection
    const catBtn = this.add.sprite(width * 0.4, height * 0.4, 'cat_idle').setScale(2).setInteractive();
    const cat2Btn = this.add.sprite(width * 0.6, height * 0.4, 'cat2_idle').setScale(2).setInteractive();

    catBtn.play('cat_idle');
    cat2Btn.play('cat2_idle');


    let selected = 'cat';
    catBtn.setAlpha(1);
    cat2Btn.setAlpha(1);

    // Helper to show border
    const borderGraphics = this.add.graphics();
    const borderPadding = 8;
    function drawBorder(target) {
      borderGraphics.clear();
      // Draw a rounded rectangle border around the sprite
      const x = target.x - target.displayWidth / 2 - borderPadding;
      const y = target.y - target.displayHeight / 2 - borderPadding;
      const widthB = target.displayWidth + borderPadding * 2;
      const heightB = target.displayHeight + borderPadding * 2;
      borderGraphics.lineStyle(4, 0xff69b4, 1); // pink border
      borderGraphics.strokeRoundedRect(x, y, widthB, heightB, 16);
    }
    drawBorder(catBtn);

    // Hover and select logic
    catBtn.on('pointerover', () => {
      catBtn.play('cat_walk');
    });
    catBtn.on('pointerout', () => {
      catBtn.play('cat_idle');
    });
    cat2Btn.on('pointerover', () => {
      cat2Btn.play('cat2_walk_right');
    });
    cat2Btn.on('pointerout', () => {
      cat2Btn.play('cat2_idle');
    });

    catBtn.on('pointerdown', () => {
      selected = 'cat';
      catBtn.setAlpha(1);
      cat2Btn.setAlpha(0.7);
      drawBorder(catBtn);
    });
    cat2Btn.on('pointerdown', () => {
      selected = 'cat2';
      catBtn.setAlpha(0.7);
      cat2Btn.setAlpha(1);
      drawBorder(cat2Btn);
    });

    // Add Play button
    const playButton = this.add.text(width * 0.5, height * 0.6, 'Play', { fontSize: '24px', fill: '#000' }).setOrigin(0.5).setInteractive();
    const finalButton = this.add.text(width * 0.8, height * 0.8, 'Jump to the End', { fontSize: '24px', fill: '#000' }).setOrigin(0.5).setInteractive();
    
    playButton.on('pointerdown', () => {
      setSelectedCharacter(selected); // 'cat' or 'cat2'
      // Remove border and disable input to prevent double click
      borderGraphics.clear();
      playButton.disableInteractive();
      this.music.stop();
      this.scene.start('Level1Scene');
    });

    finalButton.on('pointerdown', () => {
      setSelectedCharacter(selected); // 'cat' or 'cat2'
      // Remove border and disable input to prevent double click
      borderGraphics.clear();
      playButton.disableInteractive();
      this.music.stop();
      this.scene.start('FinalScene');
    });

    playButton.on('pointerover', () => {
      playButton.setTint(0xcccccc);
    });
    playButton.on('pointerout', () => {
      playButton.clearTint();
    });
  }
}