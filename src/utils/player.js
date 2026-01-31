/**
 * Reset the player's position and velocity.
 * @param {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} player - The player sprite
 * @param {{x:number, y:number}} start - The start position
 */
export function resetPlayer(player, start) {
  player.setPosition(start.x, start.y);
  player.setVelocity(0, 0);
}
// utils/player.js
// Utility to create a player sprite with the selected character type

export function createPlayer(scene, x, y, character = "cat") {
  // character: "cat" or "cat2"
  let spriteKey = "cat_idle";
  if (character === "cat2") spriteKey = "cat2_idle";
  const scale = 2; // match MenuScene scale
  const player = scene.physics.add.sprite(x, y, spriteKey).setScale(scale);
  player.play(spriteKey);
  player.setCollideWorldBounds(true);
  // Keep width at 48, reduce height to 20, offset to bottom
  player.body.setSize(30, 20);
  player.body.setOffset(6,  28);
  return player;
}
