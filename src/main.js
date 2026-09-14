import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import IceScene from './scenes/IceScene.js';
import SeaScene from './scenes/SeaScene.js';
import MedievalScene from './scenes/MedievalScene.js';
import DinoScene from './scenes/DinoScene.js';
import FinalScene from './scenes/FinalScene.js';

/**
 * Configuração principal da engine Phaser 3.
 * @type {Phaser.Types.Core.GameConfig}
 */
const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 580,
  backgroundColor: '#000000',
  parent: 'game-container',
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [
    MenuScene,
    GameScene,
    IceScene,
    SeaScene,
    MedievalScene,
    DinoScene,
    FinalScene
  ]
};

// Inicialização da instância global do jogo
const game = new Phaser.Game(config);

export default game;