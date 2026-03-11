// ============================================================
// EXCITEBIKE WEB - FinishScene
// Race results screen
// ============================================================

import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT, FONT_STYLE } from '../constants';

export class FinishScene extends Phaser.Scene {
  private raceTime = 0;
  private bestTime = 0;
  private position = 1;
  private trackIndex = 0;
  private blinkTimer = 0;
  private blinkText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'FinishScene' });
  }

  init(data: { time: number; bestTime: number; position: number; trackIndex: number }) {
    this.raceTime = data.time ?? 0;
    this.bestTime = data.bestTime ?? 0;
    this.position = data.position ?? 1;
    this.trackIndex = data.trackIndex ?? 0;
  }

  create() {
    this.cameras.main.fadeIn(400);
    this.createBackground();
    this.createResults();
    this.setupInput();
  }

  private createBackground() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000);

    // Header
    this.add.rectangle(GAME_WIDTH / 2, 8, GAME_WIDTH, 16, 0x0000a8);
    this.add.text(GAME_WIDTH / 2, 8, 'NINTENDO', {
      ...FONT_STYLE,
      fontSize: '6px',
      color: '#ffffff',
    }).setOrigin(0.5, 0.5);

    // Decorative border
    const border = this.add.graphics();
    border.lineStyle(2, 0xe83800);
    border.strokeRect(8, 20, GAME_WIDTH - 16, GAME_HEIGHT - 40);
  }

  private createResults() {
    // Title
    this.add.text(GAME_WIDTH / 2, 32, 'RACE RESULTS', {
      ...FONT_STYLE,
      fontSize: '10px',
      color: '#e8d800',
    }).setOrigin(0.5, 0);

    // Position
    const posLabels = ['1ST', '2ND', '3RD', '4TH', '5TH'];
    const posColors = ['#e8d800', '#c8c8c8', '#c87028', '#ffffff', '#ffffff'];
    const posLabel = posLabels[this.position - 1] || '5TH';
    const posColor = posColors[this.position - 1] || '#ffffff';

    this.add.text(GAME_WIDTH / 2, 56, 'YOUR POSITION', {
      ...FONT_STYLE,
      fontSize: '6px',
      color: '#888888',
    }).setOrigin(0.5, 0);

    const posText = this.add.text(GAME_WIDTH / 2, 70, posLabel, {
      ...FONT_STYLE,
      fontSize: '24px',
      color: posColor,
    }).setOrigin(0.5, 0);

    // Animate position
    this.tweens.add({
      targets: posText,
      scaleX: { from: 0, to: 1 },
      scaleY: { from: 0, to: 1 },
      duration: 500,
      ease: 'Back.easeOut',
      delay: 200,
    });

    // Time
    this.add.text(GAME_WIDTH / 2, 104, 'RACE TIME', {
      ...FONT_STYLE,
      fontSize: '6px',
      color: '#888888',
    }).setOrigin(0.5, 0);

    const timeStr = this.formatTime(this.raceTime);
    this.add.text(GAME_WIDTH / 2, 116, timeStr, {
      ...FONT_STYLE,
      fontSize: '10px',
      color: '#ffffff',
    }).setOrigin(0.5, 0);

    // Best lap
    if (this.bestTime > 0) {
      this.add.text(GAME_WIDTH / 2, 136, 'BEST LAP', {
        ...FONT_STYLE,
        fontSize: '6px',
        color: '#888888',
      }).setOrigin(0.5, 0);

      const bestStr = this.formatTime(this.bestTime);
      this.add.text(GAME_WIDTH / 2, 148, bestStr, {
        ...FONT_STYLE,
        fontSize: '10px',
        color: '#00a800',
      }).setOrigin(0.5, 0);
    }

    // Message based on position
    const messages = [
      'EXCELLENT RIDING!',
      'GREAT RACE!',
      'GOOD EFFORT!',
      'KEEP PRACTICING!',
      'TRY AGAIN!',
    ];
    const msg = messages[this.position - 1] || 'TRY AGAIN!';

    this.add.text(GAME_WIDTH / 2, 170, msg, {
      ...FONT_STYLE,
      fontSize: '8px',
      color: this.position === 1 ? '#e8d800' : '#ffffff',
    }).setOrigin(0.5, 0);

    // Blinking continue text
    this.blinkText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 20, 'PRESS ENTER TO CONTINUE', {
      ...FONT_STYLE,
      fontSize: '6px',
      color: '#ffffff',
    }).setOrigin(0.5, 0.5);

    // Draw trophy/medal for top 3
    if (this.position <= 3) {
      this.drawTrophy(this.position);
    }
  }

  private drawTrophy(position: number) {
    const gfx = this.add.graphics();
    const colors = [0xe8d800, 0xc8c8c8, 0xc87028];
    const color = colors[position - 1];

    // Simple trophy shape
    gfx.fillStyle(color);
    gfx.fillRect(GAME_WIDTH - 40, 60, 20, 30);
    gfx.fillRect(GAME_WIDTH - 50, 56, 40, 8);
    gfx.fillRect(GAME_WIDTH - 45, 90, 30, 4);
    gfx.fillRect(GAME_WIDTH - 48, 94, 36, 4);

    // Star
    gfx.fillStyle(0xffffff);
    gfx.fillRect(GAME_WIDTH - 32, 68, 4, 12);
    gfx.fillRect(GAME_WIDTH - 36, 72, 12, 4);
  }

  private formatTime(t: number): string {
    const minutes = Math.floor(t / 60);
    const seconds = Math.floor(t % 60);
    const centiseconds = Math.floor((t % 1) * 100);
    return `${minutes}:${String(seconds).padStart(2, '0')}:${String(centiseconds).padStart(2, '0')}`;
  }

  private setupInput() {
    const keys = this.input.keyboard!;
    keys.on('keydown-ENTER', () => this.goToSelect());
    keys.on('keydown-SPACE', () => this.goToSelect());
    keys.on('keydown-Z', () => this.goToSelect());
    keys.on('keydown-ESC', () => this.scene.start('TitleScene'));
    this.input.on('pointerdown', () => this.goToSelect());
  }

  private goToSelect() {
    this.cameras.main.fade(300, 0, 0, 0, false, (_: unknown, progress: number) => {
      if (progress === 1) {
        this.scene.start('SelectScene');
      }
    });
  }

  update(_time: number, delta: number) {
    this.blinkTimer += delta;
    if (this.blinkTimer > 500) {
      this.blinkText.setVisible(!this.blinkText.visible);
      this.blinkTimer = 0;
    }
  }
}
