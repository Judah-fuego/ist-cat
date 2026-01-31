import Phaser from "phaser"
import MenuScene from "./scenes/MenuScene"
import Level1Scene from "./scenes/Level1Scene"
import Level2Scene from "./scenes/Level2Scene"
import Level3Scene from "./scenes/Level3Scene"
import FinalScene from "./scenes/FinalScene"



const config = {
  type: Phaser.AUTO,
  width: 1455,
  height: 780,
  backgroundColor: "#4bc50eff",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 800 },
      debug: true
    }
  },
  scene: [MenuScene, Level1Scene, Level2Scene, Level3Scene, FinalScene]
}

new Phaser.Game(config)
