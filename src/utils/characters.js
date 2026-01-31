// utils/characterSelection.js
// Simple module to store the selected character globally

import { RAT_IDLE, RAT_WALK } from '../assets';

let selectedCharacter = "cat";
export function setSelectedCharacter(character) {
  selectedCharacter = character;
}

export function getSelectedCharacter() {
  return selectedCharacter;
}

export function createCharacterAnimations(scene) {
  scene.anims.create({
    key: 'cat_idle',
    frames: scene.anims.generateFrameNumbers('cat_idle', { start: 0, end: 3 }),
    frameRate: 6,
    repeat: -1
  });
  scene.anims.create({
    key: 'cat_walk',
    frames: scene.anims.generateFrameNumbers('cat_walk', { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1
  });
  scene.anims.create({
    key: 'cat2_idle',
    frames: scene.anims.generateFrameNumbers('cat2_idle', { start: 0, end: 3 }),
    frameRate: 6,
    repeat: -1
  });
  scene.anims.create({
    key: 'cat2_walk_right',
    frames: scene.anims.generateFrameNumbers('cat2_walk', { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1
  });
  scene.anims.create({
    key: 'cat2_walk_left',
    frames: scene.anims.generateFrameNumbers('cat2_walk', { start: 5, end: 0 }),
    frameRate: 10,
    repeat: -1
  });
  
  // Rat animations for Level 1 NPC
  scene.anims.create({
    key: 'rat_idle',
    frames: scene.anims.generateFrameNumbers('rat_idle', { start: 0, end: 2 }),
    frameRate: 6,
    repeat: -1
  });
  scene.anims.create({
    key: 'rat_walk_right',
    frames: scene.anims.generateFrameNumbers('rat_walk', { start: 0, end: 2 }),
    frameRate: 10,
    repeat: -1
  });
  scene.anims.create({
    key: 'rat_walk_left',
    frames: scene.anims.generateFrameNumbers('rat_walk', { start: 2, end: 0 }),
    frameRate: 10,
    repeat: -1
  });
}