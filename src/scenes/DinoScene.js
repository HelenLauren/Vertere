import BaseLevelScene from './BaseLevelScene.js';
import Enemy from '../../entidades/Enemy.js';
import DinoSpawner from '../ambientacao/DinoSpawner.js';

/**
 * Fase 5 do jogo (Deserto dos Dinossauros).
 */
export default class DinoScene extends BaseLevelScene {
  constructor() {
    super('DinoScene');
  }

  preload() {
    this.preloadSharedAssets();
    this.load.audio('dinoMusic', 'assets/audio/dino_theme.mp3');

    // Cactos
    this.load.image('cactus1', 'assets/images/dino/cactus1.png');
    this.load.image('cactus2', 'assets/images/dino/cactus2.png');
    this.load.image('cactus3', 'assets/images/dino/cactus3.png');
    this.load.image('cactus4', 'assets/images/dino/cactus4.png');
    this.load.image('cactus5', 'assets/images/dino/cactus5.png');
    this.load.image('cactus6', 'assets/images/dino/cactus6.png');

    // Rochas
    this.load.image('rocha_big', 'assets/images/dino/rocha_big.png');
    this.load.image('rocha', 'assets/images/dino/rocha.png');
    this.load.image('rocha2', 'assets/images/dino/rocha2.png');
    this.load.image('rocha3', 'assets/images/dino/rocha3.png');
    this.load.image('rocha4', 'assets/images/dino/rocha4.png');

    // Fósseis
    this.load.image('dino_inc', 'assets/images/dino/dino_inc.png');
    this.load.image('dino_dir', 'assets/images/dino/dino_dir.png');
    this.load.image('dino_esq', 'assets/images/dino/dino_esq.png');
    this.load.image('dino_head', 'assets/images/dino/dino_head.png');
  }

  create() {
    const initialized = this.initLevel({
      musicKey: 'dinoMusic',
      musicVolume: 0.2,
      groundKey: 'ground_sand',
      groundColor1: 0xC2B280,
      groundColor2: 0xD2B48C,
      playerX: 400,
      playerY: 300,
      packageX: 2200,
      packageY: 200,
      portalX: 180,
      portalY: 200
    });

    if (!initialized) return;

    const spawner = new DinoSpawner(this);
    spawner.spawnAll();

    this.enemySpeed = 2.5;
    this.enemies = [
      new Enemy(this, 1900, 1000),
      new Enemy(this, 1800, 1000),
      new Enemy(this, 1600, 1000)
    ];
  }

  onPortalReached() {
    this.showLevelCompleteModal({
      nextSceneKey: 'FinalScene',
      progressIndex: 6
    });
  }
}