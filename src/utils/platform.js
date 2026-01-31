// utils/platform.js
// Utility to create platforms and ground for a scene

/**
 * Get predefined platforms for a specific level.
 * @param {Phaser.Scene} scene - The scene to add platforms to.
 * @param {string} levelName - The level name (e.g., 'Level1Scene')
 * @returns {object} { platforms: [], platformInfos: [] }
 */
const PLATFORMCOLOR =     0xFFDE21
const LAVACOLOR     =     0xF76806
export function getPlatforms(scene, levelName) {
  const W = scene.scale.width;
  const H = scene.scale.height;
  const groundH = Math.max(40, Math.round(H * 0.06));
  
  // Level-specific platform layouts
  const levelLayouts = {
    'Level1Scene': getLevelLayout1,
    'Level2Scene': getLevelLayout2,
    'Level3Scene': getLevelLayout3,
  };
  
  const layoutFunction = levelLayouts[levelName] || getLevelLayout1;
  return layoutFunction(scene, W, H, groundH);
}

function leftEdge(p) {
  return p.x - p.w / 2;
}

function rightEdge(p) {
  return p.x + p.w / 2;
}


function createLavaBetween(scene, left, right, groundH, platforms, platformInfos) {
  const gapStart = rightEdge(left);
  const gapEnd   = leftEdge(right);
  const gapWidth = gapEnd - gapStart;

  if (gapWidth < 1) return; // no space → no lava

  const lavaX = gapStart + gapWidth / 2;
  const lavaY = left.y;

  const lava = scene.add
    .rectangle(lavaX, lavaY + (groundH * 0.3), gapWidth, groundH * 0.5, LAVACOLOR)
    .setOrigin(0.5);

  scene.physics.add.existing(lava, true);

  platforms.push(lava);
  platformInfos.push({
    x: lavaX,
    y: lavaY - (groundH * 0.3),
    w: gapWidth,
    h: groundH * 0.5,
    rect: lava,
    isHazard: true
  });
}


/**
 * Level 1 layout - Lava jumps, zig-zag climb with falling spikes in middle
 */
function getLevelLayout1(scene, W, H, groundH) {
  const platforms = [];
  const platformInfos = [];
  
  // Ground (player starts here on the left)
  const groundRect1 = scene.add.rectangle(0, H - groundH / 2, W /2, groundH, PLATFORMCOLOR).setOrigin(0.5);
  scene.physics.add.existing(groundRect1, true);
  platforms.push(groundRect1);
  platformInfos.push({ x:0, y: H - groundH / 2, w: W/2, h: groundH, rect: groundRect1 });

  const groundRect2 = scene.add.rectangle(W / 2.37 , H - groundH / 2, W /20, groundH, PLATFORMCOLOR).setOrigin(0.5);
  scene.physics.add.existing(groundRect2, true);
  platforms.push(groundRect2);
  platformInfos.push({ x: W / 2.37, y: H - groundH / 2, w: W /20 , h: groundH, rect: groundRect2 });

  const groundRect3 = scene.add.rectangle(W / 1.7 , H - groundH / 2, W /20, groundH, PLATFORMCOLOR).setOrigin(0.5);
  scene.physics.add.existing(groundRect3, true);
  platforms.push(groundRect3);
  platformInfos.push({ x: W / 1.7, y: H - groundH / 2, w: W /20 , h: groundH, rect: groundRect3 });

  const groundRect4 = scene.add.rectangle(W, H - groundH / 2, W /2, groundH, PLATFORMCOLOR).setOrigin(0.5);
  scene.physics.add.existing(groundRect4, true);
  platforms.push(groundRect4);
  platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: groundRect4 });



  const groundPlatforms = platformInfos.filter(p => !p.isHazard);

  for (let i = 0; i < groundPlatforms.length - 1; i++) {
  createLavaBetween(
    scene,
    groundPlatforms[i],
    groundPlatforms[i + 1],
    groundH,
    platforms,
    platformInfos
  );
}

const latter1 = scene.add.rectangle(W * 0.95, H - (groundH * 2), W/10, groundH * 0.5, PLATFORMCOLOR).setOrigin(0.5);
scene.physics.add.existing(latter1, true);
platforms.push(latter1);
platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: latter1 });

const latter2 = scene.add.rectangle(W * 0.77, H - (groundH * 4), W/10, groundH * 0.5, PLATFORMCOLOR).setOrigin(0.5);
scene.physics.add.existing(latter2, true);
platforms.push(latter2);
platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: latter2 });

const latter3 = scene.add.rectangle(W * 0.95, H - (groundH * 6 ), W/10, groundH * 0.5, PLATFORMCOLOR).setOrigin(0.5);
scene.physics.add.existing(latter3, true);
platforms.push(latter3);
platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: latter3 });

const latter4 = scene.add.rectangle(W * 0.8, H - (groundH * 8), W/15, groundH * 0.5, PLATFORMCOLOR).setOrigin(0.5);
scene.physics.add.existing(latter4, true);
platforms.push(latter4);
platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: latter4 });


const latter5 = scene.add.rectangle(W * 0.6, H - (groundH * 8), W/15, groundH * 0.5, PLATFORMCOLOR).setOrigin(0.5);
scene.physics.add.existing(latter5, true);
platforms.push(latter5);
platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: latter5 });

// Add falling backpack (rectangle) between latter5 and latter6
const backpackStartY = 0;
const backpackX = (latter5.x + (W * 0.47)) / 2;
const backpack = scene.add.rectangle(backpackX, backpackStartY, W/25, groundH * 0.7, 0x3399ff).setOrigin(0.5);
scene.physics.add.existing(backpack);
backpack.body.setAllowGravity(false);
backpack.body.setVelocityY(200); // Falling speed
backpack.isBackpack = true; // Mark for update
platforms.push(backpack);

const latter6 = scene.add.rectangle(W * 0.47, H - (groundH * 10), W/25, groundH * 0.5, PLATFORMCOLOR).setOrigin(0.5);
scene.physics.add.existing(latter6, true);
platforms.push(latter6);
platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: latter6 });

const latter7 = scene.add.rectangle(W * 0.6, H - (groundH * 12), W/15, groundH * 0.5, PLATFORMCOLOR).setOrigin(0.5);
scene.physics.add.existing(latter7, true);
platforms.push(latter7);
platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: latter7 });

const latter8 = scene.add.rectangle(W * 0.47, H - (groundH * 14), W/15, groundH * 0.5, PLATFORMCOLOR).setOrigin(0.5);
scene.physics.add.existing(latter8, true);
platforms.push(latter8);
platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: latter8 });

const topCircle1 = scene.add.circle(W *0.35, H - (groundH * 12), 50, PLATFORMCOLOR);
scene.physics.add.existing(topCircle1, true);
platforms.push(topCircle1);
platformInfos.push({ x: W*0.3, y: H - groundH / 12, r: 2 , rect: topCircle1 });

const topRect1 = scene.add.circle(W *0.2, H - (groundH * 12), 30, PLATFORMCOLOR);
scene.physics.add.existing(topRect1, true);
platforms.push(topRect1);
platformInfos.push({ x: W*0.2, y: H - groundH / 12, r: 30 , rect: topRect1 });

const topRectd = scene.add.rectangle(0, H*0.3, W /6, groundH, PLATFORMCOLOR).setOrigin(0.5);
scene.physics.add.existing(topRectd, true);
platforms.push(topRectd);
platformInfos.push({ x:0, y: H - groundH / 2, w: W/2, h: groundH, rect: topRectd, door:true });


  // Expose backpack for update in scene
  return { platforms, platformInfos, backpack };
}

/**
 * Level 2 layout - to be customized
 */
function getLevelLayout2(scene, W, H, groundH) {
  const platforms = [];
  const platformInfos = [];
  const colors = [0x4fc3f7, 0xffb74d, 0x81c784, 0xba68c8, 0xff8a65];
  
  // Ground
  const groundRect = scene.add.rectangle(W / 2, H - groundH / 2, W, groundH, PLATFORMCOLOR).setOrigin(0.5);
  scene.physics.add.existing(groundRect, true);
  platforms.push(groundRect);
  platformInfos.push({ x: W / 2, y: H - groundH / 2, w: W, h: groundH, rect: groundRect });
  
  return { platforms, platformInfos };
}

/**
 * Level 3 layout - to be customized
 */
function getLevelLayout3(scene, W, H, groundH) {
  const platforms = [];
  const platformInfos = [];
  const colors = [0x4fc3f7, 0xffb74d, 0x81c784, 0xba68c8, 0xff8a65];
  
  // Ground
  const groundRect = scene.add.rectangle(W / 2, H - groundH / 2, W, groundH, PLATFORMCOLOR).setOrigin(0.5);
  scene.physics.add.existing(groundRect, true);
  platforms.push(groundRect);
  platformInfos.push({ x: W / 2, y: H - groundH / 2, w: W, h: groundH, rect: groundRect });
  
  return { platforms, platformInfos };
}
