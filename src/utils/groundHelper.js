import { DEPTHS, WORLD_CONFIG } from '../config/constants.js';

/**
 * Cria ou recupera uma textura procedural em padrão de mosaico e adiciona um TileSprite na cena.
 * 
 * @param {Phaser.Scene} scene - Cena do Phaser onde o chão será adicionado.
 * @param {string} textureKey - Chave identificadora única da textura no cache do Phaser.
 * @param {number} color1 - Cor primária em formato hexadecimal
 * @param {number} color2 - Cor secundária em formato hexadecimal
 * @param {number} [tileSize=WORLD_CONFIG.TILE_SIZE] - Tamanho em pixels de cada ladrilho de ruído.
 * @param {number} [textureSize=192] - Tamanho total da textura gerada (largura e altura).
 * @returns {Phaser.GameObjects.TileSprite} Instância do TileSprite criado e posicionado.
 */
export function createGroundTileSprite(
  scene,
  textureKey,
  color1,
  color2,
  tileSize = WORLD_CONFIG.TILE_SIZE,
  textureSize = 192
) {
  if (!scene.textures.exists(textureKey)) {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    const tilesPerSide = Math.floor(textureSize / tileSize);

    for (let y = 0; y < tilesPerSide; y++) {
      for (let x = 0; x < tilesPerSide; x++) {
        const color = Phaser.Math.Between(0, 1) === 0 ? color1 : color2;
        graphics.fillStyle(color, 1);
        graphics.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }

    graphics.generateTexture(textureKey, textureSize, textureSize);
    graphics.destroy();
  }

  return scene.add.tileSprite(0, 0, scene.worldWidth, scene.worldHeight, textureKey)
    .setOrigin(0, 0)
    .setDepth(DEPTHS.GROUND);
}
