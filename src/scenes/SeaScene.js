import BaseLevelScene from './BaseLevelScene.js';
import Enemy from '../../entidades/Enemy.js';
import SeaSpawner from '../ambientacao/SeaSpawner.js';

/**
 * Fase 3 do jogo (Fundo do Mar / Oceano).
 */
export default class SeaScene extends BaseLevelScene {
  constructor() {
    super('SeaScene');
  }

  preload() {
    this.preloadSharedAssets();
    this.load.audio('sea_theme', 'assets/audio/sea_theme.mp3');

    this.load.image('ruins1', 'assets/images/sea/ruins1.png');
    this.load.image('ruins2', 'assets/images/sea/ruins2.png');
    this.load.image('coral1', 'assets/images/sea/coral1.png');
    this.load.image('coral2', 'assets/images/sea/coral2.png');
    this.load.image('coral3', 'assets/images/sea/coral3.png');
    this.load.image('coralP1', 'assets/images/sea/coralP1.png');
    this.load.image('coralP2', 'assets/images/sea/coralP2.png');
    this.load.image('coral_roxo', 'assets/images/sea/coral_roxo.png');
    this.load.image('seaUrchin1', 'assets/images/sea/seaUrchin1.png');
    this.load.image('seaUrchin2', 'assets/images/sea/seaUrchin2.png');
  }

  create() {
    const initialized = this.initLevel({
      musicKey: 'sea_theme',
      musicVolume: 0.4,
      groundKey: 'ground_sand',
      groundColor1: 0xC2B280,
      groundColor2: 0xD2B48C,
      playerX: 400,
      playerY: 300,
      packageX: 1950,
      packageY: 600,
      portalX: 300,
      portalY: 350
    });

    if (!initialized) return;

    const seaSpawner = new SeaSpawner(this);
    seaSpawner.spawnAll();

    this.enemySpeed = 2.5;
    this.enemies = [
      new Enemy(this, 1900, 1000)
    ];
  }

  onPortalReached() {
    this.showLevelCompleteModal({
      nextSceneKey: 'MedievalScene',
      progressIndex: 4
    });
  }
}