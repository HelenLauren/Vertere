import { PLAYER_CONFIG } from '../src/config/constants.js';

/**
 * Representa o personagem controlado pelo jogador no mundo físico Matter.js.
 */
export default class Player extends Phaser.Physics.Matter.Sprite {
  /**
   * @param {Phaser.Scene} scene - Cena ativa do Phaser.
   * @param {number} x - Posição inicial X.
   * @param {number} y - Posição inicial Y.
   * @param {string} texture - Chave da textura do personagem selecionado.
   */
  constructor(scene, x, y, texture) {
    super(scene.matter.world, x, y, texture);

    scene.add.existing(this);

    this.setScale(PLAYER_CONFIG.SCALE);
    this.setFixedRotation();
    this.setFrictionAir(PLAYER_CONFIG.FRICTION_AIR);
    this.setData('tag', 'player');

    this.personagem = texture;
    this.lastDirection = 'front';
    this.vidas = PLAYER_CONFIG.INITIAL_LIVES;
    this.invulneravel = false;

    this.initAnimations(scene, texture);
  }

  /**
   * Processa a perda de vida do jogador, ativando estado temporário de invulnerabilidade.
   */
  perderVida() {
    if (this.invulneravel) return;

    this.vidas--;
    this.invulneravel = true;

    this.scene.hud?.atualizarVidas(this.vidas);
    this.scene.time.delayedCall(PLAYER_CONFIG.INVULNERABILITY_TIME_MS, () => {
      this.invulneravel = false;
    });

    if (this.vidas <= 0) {
      this.scene.scene.restart();
    }
  }

  /**
   * Cria as animações de spritesheet caso ainda não existam no AnimationManager da cena.
   * 
   * @param {Phaser.Scene} scene
   * @param {string} prefix - Nome do personagem (ex: 'Helen', 'Helena', 'Raissa').
   */
  initAnimations(scene, prefix) {
    const anims = scene.anims;

    const animConfigs = [
      { key: `${prefix}_front`, frames: [0, 1, 2, 3, 4], frameRate: 5 },
      { key: `${prefix}_left`, frames: [12, 13, 14, 15, 16], frameRate: 5 },
      { key: `${prefix}_right`, frames: [24, 25, 26, 27, 28], frameRate: 5 },
      { key: `${prefix}_back`, frames: [36], frameRate: 1 },
      { key: `${prefix}_idle`, frames: [0, 1, 2, 3, 4], frameRate: 1 }
    ];

    animConfigs.forEach(({ key, frames, frameRate }) => {
      if (!anims.exists(key)) {
        anims.create({
          key,
          frames: anims.generateFrameNumbers(prefix, { frames }),
          frameRate,
          repeat: -1
        });
      }
    });
  }

  /**
   * Toca a animação da direção especificada caso não esteja em execução.
   * 
   * @param {string} direction - 'front' | 'back' | 'left' | 'right' | 'idle'
   */
  playAnimation(direction) {
    const animKey = `${this.personagem}_${direction}`;
    if (this.anims.currentAnim?.key !== animKey) {
      this.anims.play(animKey, true);
    }
  }

  /**
   * Atualiza os vetores de velocidade e animação com base no estado das teclas direcionais.
   * 
   * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors - Objeto com as teclas de cursor.
   */
  updateMovement(cursors) {
    if (!cursors) return;

    let moving = false;
    let vx = 0;
    let vy = 0;
    const speed = PLAYER_CONFIG.SPEED;

    if (cursors.left?.isDown) {
      vx = -speed;
      this.lastDirection = 'left';
      moving = true;
    } else if (cursors.right?.isDown) {
      vx = speed;
      this.lastDirection = 'right';
      moving = true;
    }

    if (cursors.up?.isDown) {
      vy = -speed;
      this.lastDirection = 'back';
      moving = true;
    } else if (cursors.down?.isDown) {
      vy = speed;
      this.lastDirection = 'front';
      moving = true;
    }

    this.setVelocity(vx, vy);

    if (moving) {
      this.playAnimation(this.lastDirection);
    } else {
      this.playAnimation('idle');
    }
  }
}