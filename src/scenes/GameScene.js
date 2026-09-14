import BaseLevelScene from './BaseLevelScene.js';
import GameSpawner from '../ambientacao/GameSpawner.js';
import { DEPTHS } from '../config/constants.js';

/**
 * Fase 1 do jogo Vertere (Floresta / Tutorial).
 */
export default class GameScene extends BaseLevelScene {
  constructor() {
    super('GameScene');
    this.tutorialStep = 0;
  }

  preload() {
    this.preloadSharedAssets();
    this.load.audio('gameMusic', 'assets/audio/game_theme.mp3');

    // Árvores
    this.load.image('Broken_tree1', 'assets/images/trees/Broken_tree1.png');
    this.load.image('Broken_tree3', 'assets/images/trees/Broken_tree3.png');
    this.load.image('Tree1', 'assets/images/trees/Tree1.png');
    this.load.image('Tree2', 'assets/images/trees/Tree2.png');
    this.load.image('Tree3', 'assets/images/trees/Tree3.png');
    this.load.image('fruitTree1', 'assets/images/trees/Fruit_tree1.png');
    this.load.image('fruitTree2', 'assets/images/trees/Fruit_tree2.png');
    this.load.image('fruitTree3', 'assets/images/trees/Fruit_tree3.png');

    // Arbustos
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

    // Casas
    this.load.image('medievalHouse4', 'assets/images/medieval/medievalHouse4.png');
    this.load.image('medievalHouse5', 'assets/images/medieval/medievalHouse5.png');
    this.load.image('medievalHouse6', 'assets/images/medieval/medievalHouse6.png');
    this.load.image('medievalHouse7', 'assets/images/medieval/medievalHouse7.png');
    this.load.image('medievalHouse8', 'assets/images/medieval/medievalHouse8.png');
    this.load.image('medievalHouse9', 'assets/images/medieval/medievalHouse9.png');
  }

  create() {
    this.tutorialStep = 0;

    const initialized = this.initLevel({
      musicKey: 'gameMusic',
      musicVolume: 0.4,
      groundKey: 'ground_forest',
      groundColor1: 0x018600,
      groundColor2: 0x018e00,
      playerX: 500,
      playerY: 400,
      packageX: 1680,
      packageY: 700,
      portalX: 350,
      portalY: 280
    });

    if (!initialized) return;

    const gameSpawner = new GameSpawner(this);
    gameSpawner.spawnTrees();
    gameSpawner.spawnBush();
    gameSpawner.spawnHouses();

    this.showTutorialStartModal();
  }

  onPackageCollected() {
    super.onPackageCollected();
    if (this.tutorialStep === 1) {
      this.showTutorialAfterPackageModal();
      this.tutorialStep = 2;
    }
  }

  onPortalReached() {
    this.showLevelCompleteModal({
      nextSceneKey: 'IceScene',
      progressIndex: 2
    });
  }

  showTutorialStartModal() {
    this.destroyModal();

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const bg = this.add.rectangle(
      centerX, centerY,
      this.scale.width, this.scale.height,
      0x000000, 0.6
    ).setScrollFactor(0).setDepth(DEPTHS.MODAL_BACKGROUND);

    const panel = this.add.rectangle(centerX, centerY, 400, 200, 0xffffff, 1)
      .setStrokeStyle(2, 0x000000)
      .setScrollFactor(0)
      .setDepth(DEPTHS.MODAL_CONTAINER);

    const text = this.add.text(centerX, centerY - 40,
      'Você acaba de acordar em um lugar estranho...\nEncontre o pacote perdido!',
      { fontSize: '18px', color: '#000', align: 'center', wordWrap: { width: 360 } }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(DEPTHS.MODAL_CONTAINER);

    const btn = this.add.text(centerX, centerY + 50, 'Entendido', {
      fontSize: '20px',
      color: '#0077ff',
      backgroundColor: '#cce5ff',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTHS.MODAL_BUTTON)
      .setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => {
      this.destroyModal();
      this.tutorialStep = 1;
    });

    this.modalElements = [bg, panel, text, btn];
  }

  showTutorialAfterPackageModal() {
    this.destroyModal();

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const bg = this.add.rectangle(
      centerX, centerY,
      this.scale.width, this.scale.height,
      0x000000, 0.6
    ).setScrollFactor(0).setDepth(DEPTHS.MODAL_BACKGROUND);

    const panel = this.add.rectangle(centerX, centerY, 400, 200, 0xffffff, 1)
      .setStrokeStyle(2, 0x000000)
      .setScrollFactor(0)
      .setDepth(DEPTHS.MODAL_CONTAINER);

    const text = this.add.text(centerX, centerY - 40,
      'Ótimo!\nAgora volte ao portal que apareceu onde você acordou.',
      {
        fontSize: '18px',
        color: '#000',
        align: 'center',
        wordWrap: { width: 360 }
      }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(DEPTHS.MODAL_CONTAINER);

    const btn = this.add.text(centerX, centerY + 50, 'OK!', {
      fontSize: '20px',
      color: '#0077ff',
      backgroundColor: '#cce5ff',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTHS.MODAL_BUTTON)
      .setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => {
      this.destroyModal();
    });

    this.modalElements = [bg, panel, text, btn];
  }
}