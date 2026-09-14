import Player from '../../entidades/Player.js';
import Hud from '../../ui/Hud.js';
import { createGroundTileSprite } from '../utils/groundHelper.js';
import { DEPTHS, STORAGE_KEYS, WORLD_CONFIG } from '../config/constants.js';

/**
 * Classe base extensível para todas as fases jogáveis do Vertere.
 * Centraliza infraestrutura de física, HUD, câmeras, colisões, áudio, portais e modais.
 */
export default class BaseLevelScene extends Phaser.Scene {
  /**
   * @param {string} key - Identificador único da cena no Phaser.
   */
  constructor(key) {
    super(key);
    this.tileSize = WORLD_CONFIG.TILE_SIZE;
    this.cols = WORLD_CONFIG.COLS;
    this.rows = WORLD_CONFIG.ROWS;
    this.worldWidth = WORLD_CONFIG.WIDTH;
    this.worldHeight = WORLD_CONFIG.HEIGHT;

    this.portalMain = null;
    this.portalRings = [];
    this.enemies = [];
    this.enemySpeed = 2.5;
    this.physicsPaused = false;
    this.modalElements = [];
  }

  /**
   * Carrega os assets compartilhados por todas as fases do jogo.
   */
  preloadSharedAssets() {
    this.load.spritesheet('Helen', 'entidades/helen_idle.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('Helena', 'entidades/helena_idle.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('Raissa', 'entidades/raissa_idle.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image('portal_center', 'assets/images/portal.png');
    this.load.image('heart_full', 'assets/images/coracaoRosa.png');
    this.load.image('heart_empty', 'assets/images/coracaoCinza.PNG');
    this.load.image('package', 'assets/images/package.png');
  }

  /**
   * Inicializa o ambiente da fase com música, chão, jogador, câmera e colisões.
   * 
   * @param {Object} options
   * @param {string} [options.musicKey] - Chave do áudio da fase.
   * @param {number} [options.musicVolume=0.4] - Volume da música.
   * @param {string} options.groundKey - Chave da textura do chão.
   * @param {number} options.groundColor1 - Cor 1 do chão em hexadecimal.
   * @param {number} options.groundColor2 - Cor 2 do chão em hexadecimal.
   * @param {number} [options.playerX=500] - Posição X de spawn do jogador.
   * @param {number} [options.playerY=400] - Posição Y de spawn do jogador.
   * @param {number} [options.packageX] - Posição X do pacote.
   * @param {number} [options.packageY] - Posição Y do pacote.
   * @param {number} [options.portalX] - Posição X do portal após pegar o pacote.
   * @param {number} [options.portalY] - Posição Y do portal após pegar o pacote.
   * @returns {boolean} True se inicializado com sucesso, False se redirecionado ao menu.
   */
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
    this.modalElements = [];

    if (musicKey) {
      this.music = this.sound.add(musicKey, { loop: true, volume: musicVolume });
      this.music.play();
    }

    const personagemSelecionado = localStorage.getItem(STORAGE_KEYS.PERSONAGEM_SELECIONADO);
    if (!personagemSelecionado) {
      this.scene.start('MenuScene');
      return false;
    }

    createGroundTileSprite(this, groundKey, groundColor1, groundColor2, this.tileSize);

    this.player = new Player(this, playerX, playerY, personagemSelecionado);
    this.player.setDepth(playerY);
    this.hud = new Hud(this, personagemSelecionado);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);

    this.cursors = this.input.keyboard.createCursorKeys();

    if (packageX !== undefined && packageY !== undefined) {
      this.package = this.matter.add.image(packageX, packageY, 'package', null, { isStatic: true });
      this.package.setData('tag', 'package');
      this.package.setDepth(packageY);
    }

    this.portalConfig = { x: portalX, y: portalY };

    this.setupCollisionHandlers();
    return true;
  }

  /**
   * Configura os tratadores de colisão da física Matter.js.
   */
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

  /**
   * Callback invocado no momento da coleta do pacote.
   */
  onPackageCollected() {
    if (this.portalConfig) {
      this.spawnPortal(this.portalConfig.x, this.portalConfig.y);
    }
  }

  /**
   * Callback invocado quando o jogador alcança o portal desbloqueado.
   */
  onPortalReached() {
    this.showLevelCompleteModal();
  }

  /**
   * Cria o portal e seus anéis pulsantes no local especificado.
   * 
   * @param {number} x
   * @param {number} y
   */
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
      ring.setDepth(y + DEPTHS.PORTAL_RAY);
      this.portalRings.push({ sprite: ring, baseRadius: radius, scale: 1, growing: true });
    }
  }

  /**
   * Gerencia a perda de vidas do jogador e estado de derrota.
   */
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

  /**
   * Exibe o modal de vitória/conclusão da fase com opções de navegação alinhadas diretamente.
   * 
   * @param {Object} [options]
   * @param {string} [options.titleText='Fase Completa!']
   * @param {string} [options.nextSceneKey=null]
   * @param {number} [options.progressIndex=null]
   * @param {number} [options.panelWidth=300]
   * @param {string} [options.customMessage=null]
   */
  showLevelCompleteModal({
    titleText = 'Fase Completa!',
    nextSceneKey = null,
    progressIndex = null,
    panelWidth = 300,
    customMessage = null
  } = {}) {
    this.destroyModal();

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const bg = this.add.rectangle(
      centerX, centerY,
      this.scale.width, this.scale.height,
      0x000000, 0.6
    ).setScrollFactor(0).setDepth(DEPTHS.MODAL_BACKGROUND);

    const panel = this.add.rectangle(centerX, centerY, panelWidth, 200, 0xffffff, 1)
      .setStrokeStyle(2, 0x000000)
      .setScrollFactor(0)
      .setDepth(DEPTHS.MODAL_CONTAINER);

    const title = this.add.text(centerX, centerY + (customMessage ? -60 : -70), titleText, {
      fontSize: '24px',
      color: '#000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(DEPTHS.MODAL_CONTAINER);

    let msg = null;
    if (customMessage) {
      msg = this.add.text(centerX, centerY - 20, customMessage, {
        fontSize: '18px',
        color: '#333',
        wordWrap: { width: 280, useAdvancedWrap: true },
        align: 'center'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(DEPTHS.MODAL_CONTAINER);
    }

    if (progressIndex) {
      const progresso = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESSO_FASES)) || {};
      progresso[progressIndex] = true;
      localStorage.setItem(STORAGE_KEYS.PROGRESSO_FASES, JSON.stringify(progresso));
    }

    let btnNext = null;
    if (nextSceneKey) {
      btnNext = this.add.text(centerX, centerY - 20, 'Próxima Fase', {
        fontSize: '20px',
        color: '#0077ff',
        backgroundColor: '#cce5ff',
        padding: { x: 10, y: 5 }
      }).setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(DEPTHS.MODAL_BUTTON)
        .setInteractive({ useHandCursor: true });

      btnNext.on('pointerdown', () => {
        this.destroyModal();
        this.stopMusic();
        this.scene.start(nextSceneKey);
      });
    }

    const restartY = customMessage ? 30 : (nextSceneKey ? 30 : -10);
    const btnRestart = this.add.text(centerX, centerY + restartY, 'Reiniciar Fase', {
      fontSize: '20px',
      color: '#0077ff',
      backgroundColor: '#cce5ff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTHS.MODAL_BUTTON)
      .setInteractive({ useHandCursor: true });

    btnRestart.on('pointerdown', () => {
      this.destroyModal();
      this.stopMusic();
      this.scene.restart();
    });

    const menuY = customMessage ? 80 : (nextSceneKey ? 80 : 50);
    const btnMenu = this.add.text(centerX, centerY + menuY, 'Menu Principal', {
      fontSize: '20px',
      color: '#0077ff',
      backgroundColor: '#cce5ff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTHS.MODAL_BUTTON)
      .setInteractive({ useHandCursor: true });

    btnMenu.on('pointerdown', () => {
      this.destroyModal();
      this.stopMusic();
      this.scene.start('MenuScene');
    });

    this.modalElements = [bg, panel, title, msg, btnNext, btnRestart, btnMenu].filter(Boolean);
  }

  /**
   * Exibe o modal de derrota quando as vidas do jogador se esgotam.
   */
  showGameOverModal() {
    this.destroyModal();

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const bg = this.add.rectangle(
      centerX, centerY,
      this.scale.width, this.scale.height,
      0x000000, 0.6
    ).setScrollFactor(0).setDepth(DEPTHS.MODAL_BACKGROUND);

    const panel = this.add.rectangle(centerX, centerY, 300, 200, 0xffffff, 1)
      .setStrokeStyle(2, 0x000000)
      .setScrollFactor(0)
      .setDepth(DEPTHS.MODAL_CONTAINER);

    const title = this.add.text(centerX, centerY - 70, 'Você Morreu!', {
      fontSize: '24px',
      color: '#000000',
      fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(DEPTHS.MODAL_CONTAINER);

    const btnRestart = this.add.text(centerX, centerY - 10, 'Reiniciar Fase', {
      fontSize: '20px',
      color: '#0077ff',
      backgroundColor: '#cce5ff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTHS.MODAL_BUTTON)
      .setInteractive({ useHandCursor: true });

    btnRestart.on('pointerdown', () => {
      this.destroyModal();
      this.stopMusic();
      this.scene.restart();
    });

    const btnMenu = this.add.text(centerX, centerY + 50, 'Menu Principal', {
      fontSize: '20px',
      color: '#0077ff',
      backgroundColor: '#cce5ff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTHS.MODAL_BUTTON)
      .setInteractive({ useHandCursor: true });

    btnMenu.on('pointerdown', () => {
      this.destroyModal();
      this.stopMusic();
      this.scene.start('MenuScene');
    });

    this.modalElements = [bg, panel, title, btnRestart, btnMenu];
  }

  /**
   * Destrói os elementos do modal ativo da memória da cena.
   */
  destroyModal() {
    this.modalElements?.forEach(el => el?.destroy?.());
    this.modalElements = [];
  }

  /**
   * Ciclo principal de atualização da cena.
   */
  update() {
    if (this.physicsPaused) return;

    this.player?.updateMovement?.(this.cursors);
    if (this.player) {
      this.player.setDepth(this.player.y);
    }

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

  /**
   * Encerra a reprodução do áudio da fase.
   */
  stopMusic() {
    if (this.music?.isPlaying) {
      this.music.stop();
    }
  }

  /**
   * Limpeza de recursos ao desativar ou reiniciar a cena.
   */
  shutdown() {
    this.stopMusic();
    this.destroyModal();
  }
}
