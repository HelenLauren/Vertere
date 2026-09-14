/**
 * Helper para criação e cache de texturas de chão em mosaico/pixel art.
 * Substitui o loop pesado de >114.000 chamadas fillRect por um único TileSprite otimizado.
 */
export function createGroundTileSprite(scene, textureKey, color1, color2, tileSize = 6, textureSize = 192) {
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
    .setDepth(-1000);
}
