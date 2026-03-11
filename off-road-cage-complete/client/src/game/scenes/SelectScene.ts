// ============================================================
// EXCITEBIKE WEB - SelectScene (Enhanced)
// Track & mode selection screen
// ============================================================

import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, FONT_STYLE, TRACKS } from '../constants';

export class SelectScene extends Phaser.Scene {
  // 0-1 = modes, 2-6 = tracks
  private selectedItem = 0;
  private blinkTimer = 0;
  private flagVisible = true;
  private flagGfx!: Phaser.GameObjects.Graphics;
  private itemTexts: Phaser.GameObjects.Text[] = [];

  private readonly ITEMS = [
    { label: 'SELECTION A  (RACE)', isMode: true, modeId: 0 },
    { label: 'SELECTION B  (TIME TRIAL)', isMode: true, modeId: 1 },
    ...TRACKS.map((t, i) => ({ label: t.name, isMode: false, trackId: i })),
  ];

  constructor() {
    super({ key: 'SelectScene' });
  }

  create() {
    this.cameras.main.fadeIn(300);
    this.createBackground();
    this.createMenu();
    this.setupInput();
  }

  private createBackground() {
    // Dark blue NES menu background
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000088);

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
    border.strokeRect(8, 20, GAME_WIDTH - 16, GAME_HEIGHT - 32);
    border.lineStyle(1, 0xe86800);
    border.strokeRect(10, 22, GAME_WIDTH - 20, GAME_HEIGHT - 36);
  }

  private createMenu() {
    // Title
    this.add.text(GAME_WIDTH / 2, 30, 'EXCITEBIKE', {
      ...FONT_STYLE,
      fontSize: '10px',
      color: '#e83800',
    }).setOrigin(0.5, 0);

    // Section: Game Mode
    this.add.text(20, 50, 'GAME MODE', {
      ...FONT_STYLE,
      fontSize: '6px',
      color: '#e8d800',
    });
    this.add.graphics().lineStyle(1, 0xe8d800, 0.5).lineBetween(20, 58, GAME_WIDTH - 20, 58);

    // Section: Track
    this.add.text(20, 108, 'SELECT TRACK', {
      ...FONT_STYLE,
      fontSize: '6px',
      color: '#e8d800',
    });
    this.add.graphics().lineStyle(1, 0xe8d800, 0.5).lineBetween(20, 116, GAME_WIDTH - 20, 116);

    // Items
    const yPositions = [64, 80, 122, 136, 150, 164, 178];
    this.ITEMS.forEach((item, i) => {
      const y = yPositions[i] ?? (64 + i * 14);
      const text = this.add.text(36, y, item.label, {
        ...FONT_STYLE,
        fontSize: '6px',
        color: i === this.selectedItem ? '#ffffff' : '#8888cc',
      });
      this.itemTexts.push(text);
    });

    // Checkered flag cursor
    this.flagGfx = this.add.graphics();
    this.drawFlag();
    this.updateCursor();

    // Bottom hint
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 14, 'ENTER / CLICK TO START', {
      ...FONT_STYLE,
      fontSize: '6px',
      color: '#ffffff',
    }).setOrigin(0.5, 0.5);
  }

  private drawFlag() {
    this.flagGfx.clear();
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const isWhite = (row + col) % 2 === 0;
        this.flagGfx.fillStyle(isWhite ? 0xffffff : 0x000000);
        this.flagGfx.fillRect(col * 4, row * 4, 4, 4);
      }
    }
  }

  private updateCursor() {
    const yPositions = [64, 80, 122, 136, 150, 164, 178];
    const y = yPositions[this.selectedItem] ?? (64 + this.selectedItem * 14);
    this.flagGfx.x = 20;
    this.flagGfx.y = y + 2;

    this.itemTexts.forEach((text, i) => {
      text.setColor(i === this.selectedItem ? '#ffffff' : '#8888cc');
    });
  }

  private setupInput() {
    const keys = this.input.keyboard!;

    keys.on('keydown-UP', () => {
      this.selectedItem = Math.max(0, this.selectedItem - 1);
      this.updateCursor();
    });

    keys.on('keydown-DOWN', () => {
      this.selectedItem = Math.min(this.ITEMS.length - 1, this.selectedItem + 1);
      this.updateCursor();
    });

    keys.on('keydown-ENTER', () => this.confirmSelection());
    keys.on('keydown-SPACE', () => this.confirmSelection());
    keys.on('keydown-Z', () => this.confirmSelection());
    this.input.on('pointerdown', () => this.confirmSelection());
    keys.on('keydown-ESC', () => {
      this.cameras.main.fade(200, 0, 0, 0, false, (_: unknown, p: number) => {
        if (p === 1) this.scene.start('TitleScene');
      });
    });
  }

  private confirmSelection() {
    const item = this.ITEMS[this.selectedItem];
    let trackIndex = 0;
    let mode = 0;

    if (item.isMode) {
      mode = (item as any).modeId ?? 0;
      trackIndex = 0;
    } else {
      mode = 0;
      trackIndex = (item as any).trackId ?? 0;
    }

    this.cameras.main.fade(300, 0, 0, 0, false, (_: unknown, progress: number) => {
      if (progress === 1) {
        this.scene.start('GameScene', { trackIndex, mode });
      }
    });
  }

  update(_time: number, delta: number) {
    this.blinkTimer += delta;
    if (this.blinkTimer > 400) {
      this.flagVisible = !this.flagVisible;
      this.flagGfx.setVisible(this.flagVisible);
      this.blinkTimer = 0;
    }
  }
}
