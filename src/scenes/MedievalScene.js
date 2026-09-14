import BaseLevelScene from './BaseLevelScene.js';
import Enemy from '../../entidades/Enemy.js';
import MedievalSpawner from '../ambientacao/MedievalSpawner.js';

export default class MedievalScene extends BaseLevelScene {
  constructor() {
    super('MedievalScene');
  }

  preload() {
    this.load.spritesheet('Helen', 'entidades/helen_idle.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('Helena', 'entidades/helena_idle.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('Raissa', 'entidades/raissa_idle.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('vampiro1', 'entidades/vampiro1.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('vampiro2', 'entidades/vampiro2.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image('portal_center', 'assets/images/portal.png');
    this.load.image('heart_full', 'assets/images/coracaoRosa.png');
    this.load.image('heart_empty', 'assets/images/coracaoCinza.PNG');
    this.load.image('Autumn_tree1', 'assets/images/trees/Autumn_tree1.png');
    this.load.image('Autumn_tree2', 'assets/images/trees/Autumn_tree2.png');
    this.load.image('Autumn_tree3', 'assets/images/trees/Autumn_tree3.png');
    this.load.image('Burned_tree1', 'assets/images/trees/Burned_tree1.png');
    this.load.image('Burned_tree2', 'assets/images/trees/Burned_tree2.png');
    this.load.image('Burned_tree3', 'assets/images/trees/Burned_tree3.png');
    this.load.image('Broken_tree1', 'assets/images/trees/Broken_tree1.png');
    this.load.image('Broken_tree3', 'assets/images/trees/Broken_tree3.png');
    this.load.image('Tree1', 'assets/images/trees/Tree1.png');
    this.load.image('Tree2', 'assets/images/trees/Tree2.png');
    this.load.image('Tree3', 'assets/images/trees/Tree3.png');
    this.load.image('bush21', 'assets/images/bush/Bush_simple2_1.png');
    this.load.image('bush22', 'assets/images/bush/Bush_simple2_2.png');
    this.load.image('bush23', 'assets/images/bush/Bush_simple2_3.png');
    this.load.image('autumnbush1', 'assets/images/bush/Autumn_bush1.png');
    this.load.image('autumnbush2', 'assets/images/bush/Autumn_bush2.png');
    this.load.image('blueflowerbush1', 'assets/images/bush/Bush_blue_flowers1.png');
    this.load.image('blueflowerbush2', 'assets/images/bush/Bush_blue_flowers2.png');
    this.load.image('orangeflowerbush1', 'assets/images/bush/Bush_orange_flowers1.png');
    this.load.image('orangeflowerbush2', 'assets/images/bush/Bush_orange_flowers2.png');
    this.load.image('medievalHouse1', 'assets/images/medieval/medievalHouse1.png');
    this.load.image('medievalHouse2', 'assets/images/medieval/medievalHouse2.png');
    this.load.image('medievalHouse4', 'assets/images/medieval/medievalHouse4.png');
    this.load.image('medievalHouse5', 'assets/images/medieval/medievalHouse5.png');
    this.load.image('medievalHouse6', 'assets/images/medieval/medievalHouse6.png');
    this.load.image('package', 'assets/images/package.png');
    this.load.audio('medievalMusic', 'assets/audio/medieval_theme.mp3');
  }

  create() {
    const initialized = this.initLevel({
      musicKey: 'medievalMusic',
      musicVolume: 0.4,
      groundKey: 'ground_forest',
      groundColor1: 0x018600,
      groundColor2: 0x018e00,
      playerX: 500,
      playerY: 400,
      packageX: 2200,
      packageY: 200,
      portalX: 250,
      portalY: 350
    });

    if (!initialized) return;

    const medievalSpawner = new MedievalSpawner(this);
    medievalSpawner.spawnTrees();
    medievalSpawner.spawnBush();
    medievalSpawner.spawnHouses();

    this.enemySpeed = 3.5;
    this.enemies = [
      new Enemy(this, 1800, 1000),
      new Enemy(this, 1900, 1000)
    ];
  }

  onPortalReached() {
    this.showLevelCompleteModal({
      nextSceneKey: 'DinoScene',
      progressIndex: 5
    });
  }
}