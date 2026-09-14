import Player from '../../entidades/Player.js';
import Hud from '../../ui/Hud.js';
import { createGroundTileSprite } from '../utils/groundHelper.js';

export default class BaseLevelScene extends Phaser.Scene {
  constructor(key) {
    super(key);
    this.tileSize = 6;
    this.cols = 512;
    this.rows = 224;
    this.worldWidth = this.cols * this.tileSize;  // 3072
    this.worldHeight = this.rows * this.tileSize; // 1344

    this.portalMain = null;
    this.portalRings = [];
    this.enemies = [];
    this.enemySpeed = 2.5;
    this.physicsPaused = false;
  }

  initLevel({
    musicKey,
    musicVolume = 0.4,
    groundKey,
    groundColor1,
    groundColor2,
    playerX = 500,
    playerY = 400,
    packageX,
    packageY,
    portalX,
    portalY
  }) {
    this.physicsPaused = false;
    this.portalMain = null;
    this.portalRings = [];

    // Áudio de fundo
    if (musicKey) {
      this.music = this.sound.add(musicKey, { loop: true, volume: musicVolume });
      this.music.play();
    }

    const personagemSelecionado = localStorage.getItem('personagemSelecionado');
    if (!personagemSelecionado) {
      this.scene.start('MenuScene');
      return false;
    }

    // Criação otimizada do chão
    createGroundTileSprite(this, groundKey, groundColor1, groundColor2, this.tileSize);

    // Player e HUD
    this.player = new Player(this, playerX, playerY, personagemSelecionado);
    this.player.setDepth(playerY);
    this.hud = new Hud(this, personagemSelecionado);

    // Câmera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);

    // Controles
    this.cursors = this.input.keyboard.createCursorKeys();

    // Pacote
    if (packageX !== undefined && packageY !== undefined) {
      this.package = this.matter.add.image(packageX, packageY, 'package', null, { isStatic: true });
      this.package.setData('tag', 'package');
      this.package.setDepth(packageY);
    }

    this.portalConfig = { x: portalX, y: portalY };

    this.setupCollisionHandlers();
    return true;
  }

  setupCollisionHandlers() {
    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        const tagA = bodyA.gameObject?.getData?.('tag');
        const tagB = bodyB.gameObject?.getData?.('tag');

        if ([tagA, tagB].includes('player') && [tagA, tagB].includes('package')) {
          if (this.package && this.package.active) {
            this.package.destroy();
            this.onPackageCollected();
          }
        }

        if ([tagA, tagB].includes('player') && [tagA, tagB].includes('portal')) {
          this.player.setVelocity(0);
          if (this.player.body) this.player.body.isStatic = true;
          this.onPortalReached();
        }

        if ([tagA, tagB].includes('player') && [tagA, tagB].includes('enemy')) {
          this.perderVida();
        }
      });
    });
  }

  onPackageCollected() {
    if (this.portalConfig) {
      this.spawnPortal(this.portalConfig.x, this.portalConfig.y);
    }
  }

  onPortalReached() {
    this.showLevelCompleteModal();
  }

  spawnPortal(x, y) {
    this.portalMain?.destroy();
    this.portalRings.forEach(r => r.sprite?.destroy());
    this.portalRings = [];

    this.portalMain = this.add.image(x, y, 'portal_center').setScale(1).setAlpha(0.9);
    this.portalMain.setDepth(y);
    this.matter.add.gameObject(this.portalMain, {
      shape: { type: 'circle', radius: 30 },
      isStatic: true,
      isSensor: true
    });
    this.portalMain.setData('tag', 'portal');

    for (let i = 1; i <= 2; i++) {
      const radius = 30 + i * 10;
      const ring = this.add.circle(x, y, radius, 0xDF9CFF, 0.3);
      ring.setDepth(y - 1);
      this.portalRings.push({ sprite: ring, baseRadius: radius, scale: 1, growing: true });
    }
  }

  perderVida() {
    if (!this.player || this.player.invulneravel || this.physicsPaused) return;

    this.player.vidas--;
    this.hud?.atualizarVidas(this.player.vidas);

    if (this.player.vidas <= 0) {
      this.physicsPaused = true;
      this.player.setVelocity(0);
      this.player.setStatic(true);
      this.player.setTint(0xff0000);

      this.time.delayedCall(300, () => {
        this.showGameOverModal();
      });
    } else {
      this.player.invulneravel = true;
      this.player.setTint(0xff0000);
      this.time.delayedCall(1000, () => {
        if (this.player) {
          this.player.clearTint();
          this.player.invulneravel = false;
        }
      });
    }
  }

  showLevelCompleteModal({
    titleText = 'Fase Completa!',
    nextSceneKey = null,
    progressIndex = null,
    panelWidth = 300,
    customMessage = null
  } = {}) {
    const hudDepth = 30000;
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.modalBackground = this.add.rectangle(
      centerX, centerY,
      this.scale.width, this.scale.height,
      0x000000, 0.6
    ).setScrollFactor(0).setDepth(hudDepth - 1);

    const elements = [];
    const panel = this.add.rectangle(0, 0, panelWidth, 200, 0xffffff, 1).setStrokeStyle(2, 0x000000);
    elements.push(panel);

    const title = this.add.text(0, customMessage ? -60 : -70, titleText, {
      fontSize: '24px',
      color: '#000',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    elements.push(title);

    if (customMessage) {
      const msg = this.add.text(0, -20, customMessage, {
        fontSize: '18px',
        color: '#333',
        wordWrap: { width: 280, useAdvancedWrap: true },
        align: 'center'
      }).setOrigin(0.5);
      elements.push(msg);
    }

    if (progressIndex) {
      const progresso = JSON.parse(localStorage.getItem('progressoFases')) || {};
      progresso[progressIndex] = true;
      localStorage.setItem('progressoFases', JSON.stringify(progresso));
    }

    if (nextSceneKey) {
      const btnNext = this.add.text(0, -20, 'Próxima Fase', {
        fontSize: '20px',
        color: '#0077ff',
        backgroundColor: '#cce5ff',
        padding: { x: 10, y: 5 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btnNext.on('pointerdown', () => {
        this.destroyModal();
        this.stopMusic();
        this.scene.start(nextSceneKey);
      });
      elements.push(btnNext);
    }

    const restartY = customMessage ? 30 : (nextSceneKey ? 30 : -10);
    const btnRestart = this.add.text(0, restartY, 'Reiniciar Fase', {
      fontSize: '20px',
      color: '#0077ff',
      backgroundColor: '#cce5ff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btnRestart.on('pointerdown', () => {
      this.destroyModal();
      this.stopMusic();
      this.scene.restart();
    });
    elements.push(btnRestart);

    const menuY = customMessage ? 80 : (nextSceneKey ? 80 : 50);
    const btnMenu = this.add.text(0, menuY, 'Menu Principal', {
      fontSize: '20px',
      color: '#0077ff',
      backgroundColor: '#cce5ff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btnMenu.on('pointerdown', () => {
      this.destroyModal();
      this.stopMusic();
      this.scene.start('MenuScene');
    });
    elements.push(btnMenu);

    this.modalContainer = this.add.container(centerX, centerY, elements)
      .setScrollFactor(0)
      .setDepth(hudDepth);
  }

  showGameOverModal() {
    const hudDepth = 30000;
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.modalBackground = this.add.rectangle(
      centerX, centerY,
      this.scale.width, this.scale.height,
      0x000000, 0.6
    ).setScrollFactor(0).setDepth(hudDepth - 1);

    const panel = this.add.rectangle(0, 0, 300, 200, 0xffffff, 1).setStrokeStyle(2, 0x000000);
    const title = this.add.text(0, -70, 'Você Morreu!', {
      fontSize: '24px',
      color: '#000000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const btnRestart = this.add.text(0, -10, 'Reiniciar Fase', {
      fontSize: '20px',
      color: '#0077ff',
      backgroundColor: '#cce5ff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btnRestart.on('pointerdown', () => {
      this.destroyModal();
      this.stopMusic();
      this.scene.restart();
    });

    const btnMenu = this.add.text(0, 50, 'Menu Principal', {
      fontSize: '20px',
      color: '#0077ff',
      backgroundColor: '#cce5ff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btnMenu.on('pointerdown', () => {
      this.destroyModal();
      this.stopMusic();
      this.scene.start('MenuScene');
    });

    this.modalContainer = this.add.container(centerX, centerY, [panel, title, btnRestart, btnMenu])
      .setScrollFactor(0)
      .setDepth(hudDepth);
  }

  destroyModal() {
    this.modalBackground?.destroy();
    this.modalContainer?.destroy();
  }

  update() {
    if (this.physicsPaused) return;

    this.player?.updateMovement?.(this.cursors);
    if (this.player) {
      this.player.setDepth(this.player.y);
    }

    // Movimentação dos inimigos
    if (this.enemies?.length && this.player?.body) {
      const { x: px, y: py } = this.player.body.position;
      for (let i = 0; i < this.enemies.length; i++) {
        const enemy = this.enemies[i];
        if (!enemy?.body) continue;
        enemy.setDepth(enemy.y);
        const { x: ex, y: ey } = enemy.body.position;
        const dx = px - ex;
        const dy = py - ey;
        const dist = Math.hypot(dx, dy);

        if (dist > 0) {
          enemy.setVelocity((dx / dist) * this.enemySpeed, (dy / dist) * this.enemySpeed);
        }
      }
    }

    // Animação do portal
    if (this.portalMain) {
      this.portalMain.rotation += 0.02;
    }

    if (this.portalRings?.length) {
      this.portalRings.forEach(ring => {
        if (ring.growing) {
          ring.scale += 0.01;
          if (ring.scale >= 1.0) ring.growing = false;
        } else {
          ring.scale -= 0.01;
          if (ring.scale <= 1.0) ring.growing = true;
        }
        ring.sprite.setScale(ring.scale);
      });
    }
  }

  stopMusic() {
    if (this.music?.isPlaying) {
      this.music.stop();
    }
  }

  shutdown() {
    this.stopMusic();
    this.destroyModal();
  }
}
