import Phaser from "phaser"
import { createPlayer, resetPlayer } from "../utils/player"
import { getSelectedCharacter, createCharacterAnimations } from "../utils/characters"
import { getPlatforms } from "../utils/platform"

export default class Level3Scene extends Phaser.Scene {

    constructor() {
        super("Level3Scene")
    }
    preload() {
        
    }
}
