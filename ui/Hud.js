import { DEPTHS } from '../src/config/constants.js';

/**
 * Interface do Usuário (HUD) com vidas, nome do personagem selecionado e botão de pausa.
 */
export default class Hud {
  /**
   * @param {Phaser.Scene} scene - Cena que hospeda a HUD.
   * @param {string} personagemSelecionado - Nome do personagem ativo.
   * @param {number} [vidas=3] - Quantidade inicial de vidas.
   */
  constructor(scene, personagemSelecionado, vidas = 3) {
    this.scene = scene;
    this.vidas = vidas;
    this.coracoes = [];
    this.modalElements = [];

    const margin = 16;
    const heartWidth = 25;
    const heartSpacing = 6;
    const screenWidth = scene.cameras.main.width;

    for (let i = 0; i < 3; i++) {
      const heart = this.scene.add.image(30 + i * 40, 30, 'heart_full')
        .setDisplaySize(25, 25)
        .setScrollFactor(0)
        .setDepth(DEPTHS.HUD);
      this.coracoes.push(heart);
    }

    const nomeX = margin + vidas * (heartWidth + heartSpacing) + 10;

    this.nomeTexto = scene.add.text(nomeX, margin + 2, personagemSelecionado, {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: '"Press Start 2P"',
      stroke: '#3b2f2f',
      strokeThickness: 2
    }).setScrollFactor(0).setDepth(DEPTHS.HUD);

    this.btnMenu = scene.add.text(screenWidth - margin, margin + 2, 'Menu', {
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#5C4033',
      padding: { x: 12, y: 4 },
      fontFamily: '"Press Start 2P"',
      stroke: '#3b2f2f',
      strokeThickness: 2
    }).setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(DEPTHS.HUD + 1)
      .setInteractive({ useHandCursor: true });

    this.btnMenu.on('pointerdown', () => {
      this.abrirMenuModal();
    });

    this.hudElements = [...this.coracoes, this.nomeTexto, this.btnMenu];
  }

  /**
   * Alterna a visibilidade dos elementos fixos do HUD.
   * 
   * @param {boolean} visible
   */
  setVisible(visible) {
    this.hudElements.forEach(el => el.setVisible(visible));
  }

  /**
   * Atualiza a exibição visual dos corações com base nas vidas restantes.
   * 
   * @param {number} vidasRestantes
   */
  atualizarVidas(vidasRestantes) {
    for (let i = 0; i < this.coracoes.length; i++) {
      const texture = i < vidasRestantes ? 'heart_full' : 'heart_empty';
      this.coracoes[i].setTexture(texture);
    }
  }

  /**
   * Abre o modal de pausa do jogo.
   */
  abrirMenuModal() {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;
    const centerX = width / 2;
    const centerY = height / 2;

    this.setVisible(false);
    this.fecharMenuModal();

    const bg = this.scene.add.rectangle(
      centerX, centerY,
      width, height,
      0xa1866f, 0.4
    ).setScrollFactor(0).setDepth(DEPTHS.MODAL_BACKGROUND);

    const panel = this.scene.add.rectangle(centerX, centerY, 360, 240, 0x3b2f2f, 0.8)
      .setStrokeStyle(2, 0x3b2f2f)
      .setScrollFactor(0)
      .setDepth(DEPTHS.MODAL_CONTAINER);

    const title = this.scene.add.text(centerX, centerY - 90, 'Menu de Pausa', {
      fontSize: '16px',
      color: '#000000',
      fontFamily: '"Press Start 2P"',
      align: 'center',
      stroke: '#3b2f2f',
      strokeThickness: 2
    }).setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTHS.MODAL_CONTAINER);

    const btnRestart = this.createMenuButton('Reiniciar Fase', centerX, centerY - 30, () => {
      this.fecharMenuModal();
      this.scene.music?.stop?.();
      this.scene.scene.restart();
    });

    const btnMenu = this.createMenuButton('Voltar ao Menu', centerX, centerY + 30, () => {
      this.fecharMenuModal();
      this.scene.music?.stop?.();
      this.scene.scene.start('MenuScene');
    });

    const btnClose = this.scene.add.text(centerX + 160, centerY - 110, 'X', {
      fontSize: '12px',
      fontFamily: '"Press Start 2P"',
      color: '#ffffff',
      backgroundColor: '#8B0000',
      padding: { x: 6, y: 4 },
      align: 'center',
      stroke: '#3b2f2f',
      strokeThickness: 2,
    }).setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTHS.MODAL_BUTTON)
      .setInteractive({ useHandCursor: true });

    btnClose.on('pointerdown', () => this.fecharMenuModal());
    btnClose.on('pointerover', () => {
      btnClose.setStyle({ backgroundColor: '#AA0000', color: '#ffffaa' });
    });
    btnClose.on('pointerout', () => {
      btnClose.setStyle({ backgroundColor: '#8B0000', color: '#ffffff' });
    });

    this.modalElements = [bg, panel, title, btnRestart, btnMenu, btnClose];
  }

  /**
   * Fecha o modal de pausa e restaura a visibilidade do HUD.
   */
  fecharMenuModal() {
    this.modalElements.forEach(el => el.destroy());
    this.modalElements = [];
    this.setVisible(true);
  }

  /**
   * Cria um botão de texto estilizado diretamente na cena com coordenadas fixas.
   * 
   * @param {string} text - Rótulo do botão.
   * @param {number} x - Posição X de tela.
   * @param {number} y - Posição Y de tela.
   * @param {Function} callback - Ação ao clicar no botão.
   * @returns {Phaser.GameObjects.Text}
   */
  createMenuButton(text, x, y, callback) {
    const btn = this.scene.add.text(x, y, text, {
      fontSize: '12px',
      fontFamily: '"Press Start 2P"',
      color: '#ffffff',
      backgroundColor: '#3b2f2f',
      padding: { x: 20, y: 12 },
      align: 'center',
      fixedWidth: 240,
      stroke: '#3b2f2f',
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000',
        blur: 0,
        fill: true,
      },
    }).setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTHS.MODAL_BUTTON)
      .setInteractive({ useHandCursor: true });

    btn.on('pointerdown', callback);
    btn.on('pointerover', () => {
      btn.setStyle({
        backgroundColor: '#5c4033',
        color: '#ffffaa',
      });
    });
    btn.on('pointerout', () => {
      btn.setStyle({
        backgroundColor: '#3b2f2f',
        color: '#ffffff',
      });
    });

    return btn;
  }
}