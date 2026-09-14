/**
 * Constantes globais do jogo Vertere.
 * Centraliza configurações de mundo, renderização, camadas e armazenamento.
 */

export const WORLD_CONFIG = Object.freeze({
  TILE_SIZE: 6,
  COLS: 512,
  ROWS: 224,
  get WIDTH() {
    return this.COLS * this.TILE_SIZE; // 3072
  },
  get HEIGHT() {
    return this.ROWS * this.TILE_SIZE; // 1344
  }
});

export const DEPTHS = Object.freeze({
  GROUND: -1000,
  BACKGROUND_IMAGE: -1,
  WORLD_DEFAULT: 0,
  PORTAL_RAY: -1,
  HUD: 20000,
  MODAL_BACKGROUND: 30000,
  MODAL_CONTAINER: 30001,
  MODAL_BUTTON: 30002
});

export const STORAGE_KEYS = Object.freeze({
  PROGRESSO_FASES: 'progressoFases',
  PERSONAGEM_SELECIONADO: 'personagemSelecionado'
});

export const PLAYER_CONFIG = Object.freeze({
  SCALE: 2,
  SPEED: 5,
  FRICTION_AIR: 0.2,
  INITIAL_LIVES: 3,
  INVULNERABILITY_TIME_MS: 1500
});

export const ENEMY_CONFIG = Object.freeze({
  RADIUS: 20,
  FRICTION_AIR: 0.2,
  TEXTURE_KEY: 'enemyCircle'
});
