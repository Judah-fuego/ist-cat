/**
 * Make followers follow the player with simple AI.
 * @param {Phaser.Physics.Arcade.Group} followers - The group of followers
 * @param {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} player - The player sprite
 */
export function followFollowers(followers, player) {
  followers.getChildren().forEach(f => {
    try {
      const dx = player.x - f.x;
      const speed = 80;
      if (Math.abs(dx) > 10) {
        f.setVelocityX(Math.sign(dx) * speed);
      } else {
        f.setVelocityX(0);
      }
      // Only jump if player is above, NPC is not already moving up, and is on ground
      if (
        player.y + 20 < f.y &&
        (f.body.blocked.down || f.body.touching.down) &&
        f.body.velocity.y >= 0
      ) {
        f.setVelocityY(-350);
      }
    } catch (e) {
      // Prevent crash on direction change or missing body
      // Optionally log: console.warn('NPC follower error:', e)
    }
  });
}
// utils/npc.js
// Utility to create NPC followers

/**
 * Create a group of NPC followers.
 * @param {Phaser.Scene} scene - The scene to add followers to.
 * @param {Array<{x:number, y:number, key:string, scale?:number}>} followerConfigs - Array of follower configs
 * @returns {Phaser.Physics.Arcade.Group} The group of followers
 */
export function createFollowers(scene, followerConfigs) {
  const group = scene.physics.add.group();
  followerConfigs.forEach(cfg => {
    const f = group.create(cfg.x, cfg.y, cfg.key).setScale(cfg.scale || 0.3);
    f.setOrigin(0.5, 1);
    const tex = scene.textures.get(cfg.key).getSourceImage();
    const bottomPadding = 8;
    const visibleW = tex.width;
    const visibleH = tex.height;
    f.body.setSize(visibleW - 100, visibleH - 20);
    f.body.setOffset(0, 20)
  });
  return group;
}
