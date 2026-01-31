// utils/platform.js
// Utility to create platforms and ground for a scene

/**
 * Get predefined platforms for a specific level.
 * @param {Phaser.Scene} scene - The scene to add platforms to.
 * @param {string} levelName - The level name (e.g., 'Level1Scene')
 * @returns {object} { platforms: [], platformInfos: [] }
 */
const PLATFORMCOLOR1 =      0x808080
const PLATFORMCOLOR2 =      0xd1001f
const PLATFORMCOLOR3 =      0x00008B
const LAVACOLOR      =      0xF76806
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
  const groundRect1 = scene.add.rectangle(0, H - groundH / 2, W /2, groundH, PLATFORMCOLOR1).setOrigin(0.5);
  scene.physics.add.existing(groundRect1, true);
  platforms.push(groundRect1);
  platformInfos.push({ x:0, y: H - groundH / 2, w: W/2, h: groundH, rect: groundRect1 });

  const groundRect2 = scene.add.rectangle(W / 2.37 , H - groundH / 2, W /20, groundH, PLATFORMCOLOR1).setOrigin(0.5);
  scene.physics.add.existing(groundRect2, true);
  platforms.push(groundRect2);
  platformInfos.push({ x: W / 2.37, y: H - groundH / 2, w: W /20 , h: groundH, rect: groundRect2 });

  const groundRect3 = scene.add.rectangle(W / 1.7 , H - groundH / 2, W /20, groundH, PLATFORMCOLOR1).setOrigin(0.5);
  scene.physics.add.existing(groundRect3, true);
  platforms.push(groundRect3);
  platformInfos.push({ x: W / 1.7, y: H - groundH / 2, w: W /20 , h: groundH, rect: groundRect3 });

  const groundRect4 = scene.add.rectangle(W, H - groundH / 2, W /2, groundH, PLATFORMCOLOR1).setOrigin(0.5);
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

  const latter1 = scene.add.rectangle(W * 0.95, H - (groundH * 2), W/10, groundH * 0.5, PLATFORMCOLOR1).setOrigin(0.5);
  scene.physics.add.existing(latter1, true);
  platforms.push(latter1);
  platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: latter1 });

  const latter2 = scene.add.rectangle(W * 0.77, H - (groundH * 4), W/10, groundH * 0.5, PLATFORMCOLOR1).setOrigin(0.5);
  scene.physics.add.existing(latter2, true);
  platforms.push(latter2);
  platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: latter2 });

  const latter3 = scene.add.rectangle(W * 0.95, H - (groundH * 6 ), W/10, groundH * 0.5, PLATFORMCOLOR1).setOrigin(0.5);
  scene.physics.add.existing(latter3, true);
  platforms.push(latter3);
  platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: latter3 });

  const latter4 = scene.add.rectangle(W * 0.8, H - (groundH * 8), W/15, groundH * 0.5, PLATFORMCOLOR1).setOrigin(0.5);
  scene.physics.add.existing(latter4, true);
  platforms.push(latter4);
  platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: latter4 });


  const latter5 = scene.add.rectangle(W * 0.6, H - (groundH * 8), W/15, groundH * 0.5, PLATFORMCOLOR1).setOrigin(0.5);
  scene.physics.add.existing(latter5, true);
  platforms.push(latter5);
  platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: latter5 });

  // Add falling backpack (rectangle) between latter5 and latter6
  const StartY = 0;
  const X = (latter5.x + (W * 0.47)) / 2;
  const spike = scene.add.rectangle(X, StartY, W/25, groundH * 0.7, 0x3399ff).setOrigin(0.5);
  scene.physics.add.existing(spike);
  spike.body.setAllowGravity(false);
  spike.body.setVelocityY(200); // Falling speed
  spike.isSpike = true; // Mark for update
  platforms.push(spike);

  const latter6 = scene.add.rectangle(W * 0.47, H - (groundH * 10), W/25, groundH * 0.5, PLATFORMCOLOR1).setOrigin(0.5);
  scene.physics.add.existing(latter6, true);
  platforms.push(latter6);
  platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: latter6 });

  const latter7 = scene.add.rectangle(W * 0.6, H - (groundH * 12), W/15, groundH * 0.5, PLATFORMCOLOR1).setOrigin(0.5);
  scene.physics.add.existing(latter7, true);
  platforms.push(latter7);
  platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: latter7 });

  const latter8 = scene.add.rectangle(W * 0.47, H - (groundH * 14), W/15, groundH * 0.5, PLATFORMCOLOR1).setOrigin(0.5);
  scene.physics.add.existing(latter8, true);
  platforms.push(latter8);
  platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: latter8 });

  const topCircle1 = scene.add.circle(W *0.35, H - (groundH * 12), 50, PLATFORMCOLOR1);
  scene.physics.add.existing(topCircle1, true);
  platforms.push(topCircle1);
  platformInfos.push({ x: W*0.3, y: H - groundH / 12, r: 2 , rect: topCircle1 });

  const topRect1 = scene.add.circle(W *0.2, H - (groundH * 12), 30, PLATFORMCOLOR1);
  scene.physics.add.existing(topRect1, true);
  platforms.push(topRect1);
  platformInfos.push({ x: W*0.2, y: H - groundH / 12, r: 30 , rect: topRect1 });

  const topRectd = scene.add.rectangle(0, H*0.3, W /6, groundH, PLATFORMCOLOR1).setOrigin(0.5);
  scene.physics.add.existing(topRectd, true);
  platforms.push(topRectd);
  platformInfos.push({ x:0, y: H - groundH / 2, w: W/2, h: groundH, rect: topRectd, door:true });


  // Expose backpack for update in scene
  return { platforms, platformInfos, spike };
}

/**
 * Level 2 layout - to be customized
 */
function getLevelLayout2(scene, W, H, groundH) {
  const platforms = [];
  const platformInfos = [];
  
  // Ground
  const groundRect = scene.add.rectangle(70, 200, W/10, groundH, PLATFORMCOLOR2);
  scene.physics.add.existing(groundRect, true);
  platforms.push(groundRect);
  platformInfos.push({ x: W/2, y: H - groundH/2, w: W, h: groundH, rect: groundRect });

const house1body = scene.add.rectangle(300, H-75, 150, 300, PLATFORMCOLOR2);
scene.physics.add.existing(house1body, true);
platforms.push(house1body);

// Roof triangle
// Top of house body is at: H - 75 - 75 = H - 150
// We want the roof to sit on top, with apex above
const house1roof = scene.add.triangle(
  375, H - 186,        // Position at top-center of house
  0, -75,              // Top point (50 pixels above the origin)
  -75, 0,              // Bottom left (75 pixels left of origin)
  75, 0,               // Bottom right (75 pixels right of origin)
  PLATFORMCOLOR2
);

const house2body = scene.add.rectangle(600, H-75, 150, 150, PLATFORMCOLOR2);
scene.physics.add.existing(house2body, true);
platforms.push(house2body);

// Roof triangle
// Top of house body is at: H - 75 - 75 = H - 150
// We want the roof to sit on top, with apex above
const house2roof = scene.add.triangle(
  house2body.x+75, H - 111,        // Position at top-center of house
  0, -75,              // Top point (50 pixels above the origin)
  -75, 0,              // Bottom left (75 pixels left of origin)
  75, 0,               // Bottom right (75 pixels right of origin)
  PLATFORMCOLOR2
);

const house3body = scene.add.rectangle(850, H-75, 150, 345, PLATFORMCOLOR2);
scene.physics.add.existing(house3body, true);
platforms.push(house3body);

// Roof triangle
// Top of house body is at: H - 75 - 75 = H - 150
// We want the roof to sit on top, with apex above
const house3roof = scene.add.triangle(
  house3body.x+75, H - 208,        // Position at top-center of house
  0, -75,              // Top point (50 pixels above the origin)
  -75, 0,              // Bottom left (75 pixels left of origin)
  75, 0,               // Bottom right (75 pixels right of origin)
  PLATFORMCOLOR2
);

const house4body1 = scene.add.rectangle(1100, H-75, 50, 345, PLATFORMCOLOR2);
scene.physics.add.existing(house4body1, true);
platforms.push(house4body1);

const house4roof1 = scene.add.rectangle(1100, H-260, 100, 25, PLATFORMCOLOR2);
scene.physics.add.existing(house4roof1, true);
platforms.push(house4roof1);

const house4roof2 = scene.add.rectangle(1100, H-200, 100, 25, PLATFORMCOLOR2);
scene.physics.add.existing(house4roof2, true);
platforms.push(house4roof2);

const house4roof3 = scene.add.rectangle(1100, H-140, 100, 25, PLATFORMCOLOR2);
scene.physics.add.existing(house4roof3, true);
platforms.push(house4roof3);

const house4body2 = scene.add.rectangle(1100, H-322, 50, 100, PLATFORMCOLOR2);
scene.physics.add.existing(house4body2, true);
platforms.push(house4body2);

const house4body3 = scene.add.rectangle(1100, H-400, 15, 100, PLATFORMCOLOR2);
scene.physics.add.existing(house4body3, true);
platforms.push(house4body3);

const house2 = scene.add.rectangle(1355, H-153, 60, 15);
scene.physics.add.existing(house2, true);
platforms.push(house2);

return {platforms, platformInfos}
}



/**
 * Level 3 layout - to be customized
 */
function getLevelLayout3(scene, W, H, groundH) {
  const platforms = [];
  const platformInfos = [];
  
  // Ground


// Ground (player starts here on the left)
  const GR1 = scene.add.rectangle(0, H - groundH / 2, W /2, groundH, PLATFORMCOLOR3).setOrigin(0.5);
  scene.physics.add.existing(GR1, true);
  platforms.push(GR1);
  platformInfos.push({ x:0, y: H - groundH / 2, w: W/2, h: groundH, rect: GR1 });

  const GR2 = scene.add.rectangle(W / 2.37 , H - groundH / 2, W /20, groundH, PLATFORMCOLOR3).setOrigin(0.5);
  scene.physics.add.existing(GR2, true);
  platforms.push(GR2);
  platformInfos.push({ x: W / 2.37, y: H - groundH / 2, w: W /20 , h: groundH, rect: GR2 });

  const GR3 = scene.add.rectangle(W / 1.7 , H - groundH / 2, W /20, groundH, PLATFORMCOLOR3).setOrigin(0.5);
  scene.physics.add.existing(GR3, true);
  platforms.push(GR3);
  platformInfos.push({ x: W / 1.7, y: H - groundH / 2, w: W /20 , h: groundH, rect: GR3 });

  const GR4 = scene.add.rectangle(W, H - groundH / 2, W /2, groundH, PLATFORMCOLOR3).setOrigin(0.5);
  scene.physics.add.existing(GR4, true);
  platforms.push(GR4);
  platformInfos.push({ x: W, y: H - groundH / 2, w: W / 2, h: groundH, rect: GR4 });

  const groundPlatforms = platformInfos.filter(p => !p.isHazard);

  for (let i = 0; i < groundPlatforms.length - 1; i++) {
  createLavaBetween(
    scene,
    groundPlatforms[i],
    groundPlatforms[i + 1],
    groundH,
    platforms,
    platformInfos
  );}

  const groundRect2 = scene.add.rectangle(W/2.2, 300, W, groundH, PLATFORMCOLOR3).setOrigin(0.5);
  scene.physics.add.existing(groundRect2, true);
  platforms.push(groundRect2);
  platformInfos.push({ x: W / 2.2, y: 300, w: W, h: groundH, rect: groundRect2 });

  const groundDangers = scene.physics.add.staticGroup();

[W/4, W/2.5, W/1.75, W/1.3].forEach(x => {
  const rect = scene.add.rectangle(
    x,
    300 - groundH,
    50,
    30,
    PLATFORMCOLOR3
  );

  groundDangers.add(rect);
});

platforms.push(...groundDangers.getChildren());

  const groundRect3 = scene.add.rectangle(W/1.02, 500, W/3, groundH, PLATFORMCOLOR3).setOrigin(0.5);
  scene.physics.add.existing(groundRect3, true);
  platforms.push(groundRect3);
  platformInfos.push({ x: W / 1.02, y: 150, w: W/3, h: groundH, rect: groundRect3 });

  const groundRect4 = scene.add.rectangle(W/1.3, 500, W/10, groundH, PLATFORMCOLOR3).setOrigin(0.5);
  scene.physics.add.existing(groundRect4, true);
  platforms.push(groundRect4);
  platformInfos.push({ x: W / 1.3, y: 150, w: W/10, h: groundH, rect: groundRect4 });

  const groundRect5 = scene.add.rectangle(W/1.5, 500, W/10, groundH, PLATFORMCOLOR3).setOrigin(0.5);
  scene.physics.add.existing(groundRect5, true);
  platforms.push(groundRect5);
  platformInfos.push({ x: W / 1.5, y: 150, w: W/10, h: groundH, rect: groundRect5 });

  const groundRect6 = scene.add.rectangle(W/1.8, 500, W/10, groundH, PLATFORMCOLOR3).setOrigin(0.5);
  scene.physics.add.existing(groundRect6, true);
  platforms.push(groundRect6);
  platformInfos.push({ x: W / 1.8, y: 150, w: W/10, h: groundH, rect: groundRect6 });

  const groundRect7 = scene.add.rectangle(W/2.5, 500, W/10, groundH, PLATFORMCOLOR3).setOrigin(0.5);
  scene.physics.add.existing(groundRect7, true);
  platforms.push(groundRect7);
  platformInfos.push({ x: W /2.5, y: 150, w: W/10, h: groundH, rect: groundRect7 });

  const groundRect8 = scene.add.rectangle(W/3.5, 500, W/10, groundH, PLATFORMCOLOR3).setOrigin(0.5);
  scene.physics.add.existing(groundRect8, true);
  platforms.push(groundRect8);
  platformInfos.push({ x: W / 3.5, y: 150, w: W/10, h: groundH, rect: groundRect8 });



  return { platforms, platformInfos };
}
