import { ENEMY_CONFIG } from '../src/config/constants.js';

/**
 * Representa um inimigo circular com física Matter.js no jogo.
 */
export default class Enemy extends Phaser.Physics.Matter.Image {
  /**
   * @param {Phaser.Scene} scene - Cena ativa do Phaser.
   * @param {number} x - Posição inicial X.
   * @param {number} y - Posição inicial Y.
   */
  constructor(scene, x, y) {
    const radius = ENEMY_CONFIG.RADIUS;
    const textureKey = ENEMY_CONFIG.TEXTURE_KEY;

    if (!scene.textures.exists(textureKey)) {
      const graphics = scene.add.graphics();
      graphics.fillStyle(0xff0000, 1);
      graphics.fillCircle(radius, radius, radius);
      graphics.generateTexture(textureKey, radius * 2, radius * 2);
      graphics.destroy();
    }

    super(scene.matter.world, x, y, textureKey);

    scene.add.existing(this);

    this.setCircle(radius);
    this.setFixedRotation();
    this.setFrictionAir(ENEMY_CONFIG.FRICTION_AIR);
    this.setData('tag', 'enemy');
  }
}
