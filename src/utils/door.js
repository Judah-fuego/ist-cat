// utils/door.js
// Utility to create a door zone (exit area)

/**
 * Create a door zone for exiting the level.
 * @param {Phaser.Scene} scene - The scene to add the door to.
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Door width
 * @param {number} height - Door height
 * @returns {Phaser.Physics.Arcade.StaticGroup} The door zone group
 */
export function createDoorZone(scene, x, y, width = 40, height = 80) {
  const doorZone = scene.physics.add.staticGroup();
  doorZone.create(x, y - 20 , null).setDisplaySize(width, height).refreshBody();
  scene.add.rectangle(x, y - 20, width, height, 0x0).setOrigin(0.5);
  return doorZone;
}
