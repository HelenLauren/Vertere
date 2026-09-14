import BaseLevelScene from './BaseLevelScene.js';
import GameSpawner from '../ambientacao/GameSpawner.js';

export default class GameScene extends BaseLevelScene {
  constructor() {
    super('GameScene');
    this.tutorialStep = 0;
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
    const hudDepth = 30000;
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.modalBackground = this.add.rectangle(
      centerX, centerY,
      this.scale.width, this.scale.height,
      0x000000, 0.6
    ).setScrollFactor(0).setDepth(hudDepth - 1);

    const panel = this.add.rectangle(0, 0, 400, 200, 0xffffff, 1).setStrokeStyle(2, 0x000000);
    const text = this.add.text(0, -40,
      'Você acaba de acordar em um lugar estranho...\nEncontre o pacote perdido!',
      { fontSize: '18px', color: '#000', align: 'center', wordWrap: { width: 360 } }
    ).setOrigin(0.5);

    const btn = this.add.text(0, 50, 'Entendido', {
      fontSize: '20px',
      color: '#0077ff',
      backgroundColor: '#cce5ff',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => {
      this.destroyModal();
      this.tutorialStep = 1;
    });

    this.modalContainer = this.add.container(centerX, centerY, [panel, text, btn])
      .setScrollFactor(0)
      .setDepth(hudDepth);
  }

  showTutorialAfterPackageModal() {
    const hudDepth = 30000;
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.modalBackground = this.add.rectangle(
      centerX, centerY,
      this.scale.width, this.scale.height,
      0x000000, 0.6
    ).setScrollFactor(0).setDepth(hudDepth - 1);

    const panel = this.add.rectangle(0, 0, 400, 200, 0xffffff, 1).setStrokeStyle(2, 0x000000);
    const text = this.add.text(0, -40,
      'Ótimo!\nAgora volte ao portal que apareceu onde você acordou.',
      {
        fontSize: '18px',
        color: '#000',
        align: 'center',
        wordWrap: { width: 360 }
      }
    ).setOrigin(0.5);

    const btn = this.add.text(0, 50, 'OK!', {
      fontSize: '20px',
      color: '#0077ff',
      backgroundColor: '#cce5ff',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => {
      this.destroyModal();
    });

    this.modalContainer = this.add.container(centerX, centerY, [panel, text, btn])
      .setScrollFactor(0)
      .setDepth(hudDepth);
  }
}