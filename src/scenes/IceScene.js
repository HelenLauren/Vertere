import BaseLevelScene from './BaseLevelScene.js';
import IceSpawner from '../ambientacao/IceSpawner.js';

/**
 * Fase 2 do jogo (Gelo / Tundra).
 */
export default class IceScene extends BaseLevelScene {
  constructor() {
    super('IceScene');
  }

  preload() {
    this.preloadSharedAssets();
    this.load.audio('iceMusic', 'assets/audio/ice_theme.mp3');

    // Árvores de Neve
    for (let i = 1; i <= 6; i++) {
      this.load.image(`Snow_tree${i}.png`, `assets/images/ice/Snow_tree${i}.png`);
    }

    // Arbustos de Neve
    for (let i = 1; i <= 3; i++) {
      this.load.image(`Snow_bush${i}.png`, `assets/images/ice/Snow_bush${i}.png`);
    }

    // Cristais
    for (let i = 1; i <= 4; i++) {
      this.load.image(`Black_crystal${i}.png`, `assets/images/ice/Black_crystal${i}.png`);
      this.load.image(`Blue_crystal${i}.png`, `assets/images/ice/Blue_crystal${i}.png`);
    }
    for (let i = 1; i <= 3; i++) {
      this.load.image(`White_crystal${i}.png`, `assets/images/ice/White_crystal${i}.png`);
    }

    // Ruínas e arbustos simples
    for (let i = 1; i <= 5; i++) {
      this.load.image(`Snow_ruins${i}.png`, `assets/images/ice/Snow_ruins${i}.png`);
    }
    this.load.image('Bush_simple2_1.png', 'assets/images/bush/Bush_simple2_1.png');
    this.load.image('Bush_simple2_2.png', 'assets/images/bush/Bush_simple2_2.png');
  }

  create() {
    const initialized = this.initLevel({
      musicKey: 'iceMusic',
      musicVolume: 0.2,
      groundKey: 'ground_ice',
      groundColor1: 0xE0F7FA,
      groundColor2: 0xE1F5FE,
      playerX: 500,
      playerY: 400,
      packageX: 350,
      packageY: 900,
      portalX: 180,
      portalY: 200
    });

    if (!initialized) return;

    const iceSpawner = new IceSpawner(this);
    iceSpawner.spawnAll();
  }

  onPortalReached() {
    this.showLevelCompleteModal({
      nextSceneKey: 'SeaScene',
      progressIndex: 3
    });
  }
}