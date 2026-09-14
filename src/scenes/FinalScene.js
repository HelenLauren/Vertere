import BaseLevelScene from './BaseLevelScene.js';
import GameSpawner from '../ambientacao/GameSpawner.js';

export default class FinalScene extends BaseLevelScene {
  constructor() {
    super('FinalScene');
  }

  preload() {
    this.load.spritesheet('Helen', 'entidades/helen_idle.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('Helena', 'entidades/helena_idle.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('Raissa', 'entidades/raissa_idle.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image('portal_center', 'assets/images/portal.png');
    this.load.image('heart_full', 'assets/images/coracaoRosa.png');
    this.load.image('heart_empty', 'assets/images/coracaoCinza.PNG');
    this.load.image('package', 'assets/images/package.png');
    this.load.audio('gameMusic', 'assets/audio/game_theme.mp3');

    this.load.image('Broken_tree1', 'assets/images/trees/Broken_tree1.png');
    this.load.image('Broken_tree3', 'assets/images/trees/Broken_tree3.png');
    this.load.image('Tree1', 'assets/images/trees/Tree1.png');
    this.load.image('Tree2', 'assets/images/trees/Tree2.png');
    this.load.image('Tree3', 'assets/images/trees/Tree3.png');
    this.load.image('fruitTree1', 'assets/images/trees/Fruit_tree1.png');
    this.load.image('fruitTree2', 'assets/images/trees/Fruit_tree2.png');
    this.load.image('fruitTree3', 'assets/images/trees/Fruit_tree3.png');
    this.load.image('bush21', 'assets/images/bush/Bush_simple2_1.png');
    this.load.image('bush22', 'assets/images/bush/Bush_simple2_2.png');
    this.load.image('bush23', 'assets/images/bush/Bush_simple2_3.png');
    this.load.image('blueflowerbush1', 'assets/images/bush/Bush_blue_flowers1.png');
    this.load.image('blueflowerbush2', 'assets/images/bush/Bush_blue_flowers2.png');
    this.load.image('orangeflowerbush1', 'assets/images/bush/Bush_orange_flowers1.png');
    this.load.image('orangeflowerbush2', 'assets/images/bush/Bush_orange_flowers2.png');
    this.load.image('pinkflowerbush1', 'assets/images/bush/Bush_pink_flowers1.png');
    this.load.image('pinkflowerbush2', 'assets/images/bush/Bush_pink_flowers2.png');
    this.load.image('pinkflowerbush3', 'assets/images/bush/Bush_pink_flowers3.png');
    this.load.image('medievalHouse4', 'assets/images/medieval/medievalHouse4.png');
    this.load.image('medievalHouse5', 'assets/images/medieval/medievalHouse5.png');
    this.load.image('medievalHouse6', 'assets/images/medieval/medievalHouse6.png');
    this.load.image('medievalHouse7', 'assets/images/medieval/medievalHouse7.png');
    this.load.image('medievalHouse8', 'assets/images/medieval/medievalHouse8.png');
    this.load.image('medievalHouse9', 'assets/images/medieval/medievalHouse9.png');
  }

  create() {
    const initialized = this.initLevel({
      musicKey: 'gameMusic',
      musicVolume: 0.4,
      groundKey: 'ground_forest',
      groundColor1: 0x018600,
      groundColor2: 0x018e00,
      playerX: 500,
      playerY: 400,
      packageX: 2500,
      packageY: 1050,
      portalX: 200,
      portalY: 350
    });

    if (!initialized) return;

    const gameSpawner = new GameSpawner(this);
    gameSpawner.spawnTrees();
    gameSpawner.spawnBush();
    gameSpawner.spawnHouses();
  }

  onPortalReached() {
    this.showLevelCompleteModal({
      titleText: 'Jogo Concluído!',
      customMessage: 'Parabéns por finalizar a jornada!',
      panelWidth: 320
    });
  }
}