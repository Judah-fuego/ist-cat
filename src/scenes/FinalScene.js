import Phaser from "phaser"
import { createPlayer } from "../utils/player"
import { getSelectedCharacter, createCharacterAnimations } from "../utils/characters"

export default class FinalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FinalScene' });
        this.hasAnswered = false; // Prevent multiple collisions
    }

    preload() {
        // Character sprites are loaded in the main game preload
        this.load.audio('sandman', '/audio/sandman.mp3');
        this.load.audio('no',  '/audio/no.mp3')

    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Add a romantic gradient background
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0xff69b4, 0xff69b4, 0xffc0cb, 0xffc0cb, 1);
        graphics.fillRect(0, 0, width, height);

       

        // Get selected character and create animations
        this.character = getSelectedCharacter();
        createCharacterAnimations(this);

        this.music = this.sound.add('sandman', { loop: true, volume: 0.5 });
        this.no = this.sound.add('no', { loop: false, volume: 0.5 } )
        this.music.play();  

        // Big romantic question text at the top
        const questionText = this.add.text(width / 2, 100, 'vei fi valentine meu?', {
            fontSize: '48px',
            color: '#ffffff',
            strokeThickness: 1,
            align: 'center'
        });
        questionText.setOrigin(0.5);

        // Add some floating hearts for decoration
        this.addFloatingHearts();

        // Create player character using the proper character system
        this.player = createPlayer(this, width / 2, height / 2, this.character);
        this.player.body.setCollideWorldBounds(true);

        // YES option
        this.yesZone = this.physics.add.sprite(width / 2 - 150, height - 150);
        this.yesZone.setSize(100, 60);
        this.yesZone.body.setAllowGravity(false);
        this.yesZone.body.immovable = true;

        const yesText = this.add.text(width / 2 - 150, height - 150, 'yes', {
            fontSize: '32px',
            color: '#036303',
            padding: { x: 20, y: 10 }
        });
        yesText.setOrigin(0.5);

        // NO option
        this.noZone = this.physics.add.sprite(width / 2 + 150, height - 150);
        this.noZone.setSize(100, 60);
        this.noZone.body.setAllowGravity(false);
        this.noZone.body.immovable = true;

        this.noText = this.add.text(width / 2 + 150, height - 150, 'no', {
            fontSize: '32px',
            color: '#ff0000',
            padding: { x: 20, y: 10 }
        });
        this.noText.setOrigin(0.5);

        // Setup collisions
        this.physics.add.overlap(this.player, this.yesZone, this.onYesCollision, null, this);
        this.physics.add.overlap(this.player, this.noZone, this.onNoCollision, null, this);

        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    update() {
        // Don't update if they've already answered
        if (this.hasAnswered) return;

        // Get animation names based on selected character
        const getAnimations = () => {
            if (this.character === 'cat2') {
                return { idle: 'cat2_idle', walkRight: 'cat2_walk_right', walkLeft: 'cat2_walk_left' };
            }
            return { idle: 'cat_idle', walkRight: 'cat_walk', walkLeft: 'cat_walk' };
        };

        const animations = getAnimations();

        // Player movement
        const speed = 160;
        this.player.body.setVelocityX(0);

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
            this.player.anims.play(animations.walkLeft, true);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
            this.player.anims.play(animations.walkRight, true);
        } else {
            this.player.anims.play(animations.idle, true);
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.player.setVelocityY(-200);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.player.setVelocityY(200);
        } else {
            this.player.setVelocityY(0);
        }

        // Keep NO text synced with its zone
        this.noText.x = this.noZone.x;
        this.noText.y = this.noZone.y;
    }

    onYesCollision() {
        // Prevent multiple triggers
        if (this.hasAnswered) return;
        this.hasAnswered = true;

        // They said YES! 🎉
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Stop player movement
        this.player.body.setVelocity(0, 0);

        // Clear the scene (but don't destroy physics world yet)
        this.children.removeAll();

        // Add new background
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0xff1493, 0xff1493, 0xff69b4, 0xff69b4, 1);
        graphics.fillRect(0, 0, width, height);

        // Victory message
        const victoryText = this.add.text(width / 2, height / 2, 'yuhuuhuhu te iubesc :) ', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#ff1493',
            strokeThickness: 6,
            align: 'center'
        });
        const victoryText2 = this.add.text(width / 2, height / 4, 'you make me laugh so much and are always the sweetest part of my day', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#ff1493',
            strokeThickness: 6,
            align: 'center'
        });
        victoryText2.setOrigin(0.5);
        victoryText.setOrigin(0.5);

        // Add celebration particles/effects
        this.celebrateWithHearts();
    }

    onNoCollision() {
        // Move the NO button to a random location
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const randomX = Phaser.Math.Between(100, width - 100);
        const randomY = Phaser.Math.Between(100, height - 100);

        this.no.play();
        
        this.noZone.setPosition(randomX, randomY);
        this.noText.setPosition(randomX, randomY);

        // Maybe add a playful message
        console.log('Ah, não seja assim! 😊');
    }

    addFloatingHearts() {
        // Add some decorative floating hearts
        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width);
            const y = Phaser.Math.Between(0, this.cameras.main.height);
            
            const heart = this.add.text(x, y, '❤️', {
                fontSize: '24px',
                alpha: 0.3
            });
            
            // Gentle floating animation
            this.tweens.add({
                targets: heart,
                y: y - 50,
                alpha: 0.5,
                duration: 3000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    celebrateWithHearts() {
        // Shower of hearts celebration
        const width = this.cameras.main.width;
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const x = Phaser.Math.Between(0, width);
                const heart = this.add.text(x, -20, '❤️', {
                    fontSize: '32px'
                });
                
                this.tweens.add({
                    targets: heart,
                    y: this.cameras.main.height + 50,
                    duration: 2000,
                    ease: 'Linear',
                    onComplete: () => heart.destroy()
                });
            }, i * 100);
        }
    }
}