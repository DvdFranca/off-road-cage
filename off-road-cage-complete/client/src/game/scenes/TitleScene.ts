// ============================================================
// EXCITEBIKE WEB - TitleScene (Enhanced)
// NES-style title screen with animated bikes and blinking text
// ============================================================

import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT, FONT_STYLE } from '../constants';

export class TitleScene extends Phaser.Scene {
  private blinkTimer = 0;
  private blinkText!: Phaser.GameObjects.Text;
  private bikes: { sprite: Phaser.GameObjects.Image; speed: number; y: number }[] = [];
  private bgScrollX = 0;
  private crowdLayer!: Phaser.GameObjects.TileSprite;
  private fenceLayer!: Phaser.GameObjects.TileSprite;
  private trackLayer!: Phaser.GameObjects.TileSprite;

  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    this.createBackground();
    this.createDemoBikes();
    this.createUI();
    this.setupInput();
    this.cameras.main.fadeIn(400);
  }

  private createBackground() {
    // Sky
    this.add.rectangle(GAME_WIDTH / 2, 50, GAME_WIDTH, 100, COLORS.SKY);

    // Crowd
    this.crowdLayer = this.add.tileSprite(GAME_WIDTH / 2, 30, GAME_WIDTH, 8, 'crowd_tile');

    // Fence
    this.fenceLayer = this.add.tileSprite(GAME_WIDTH / 2, 40, GAME_WIDTH, 6, 'fence_tile');

    // Top grass
    this.add.rectangle(GAME_WIDTH / 2, 54, GAME_WIDTH, 18, COLORS.GRASS_TOP);

    // Track
    this.trackLayer = this.add.tileSprite(GAME_WIDTH / 2, 130, GAME_WIDTH, 52, 'track_tile');

    // Bottom grass
    this.add.rectangle(GAME_WIDTH / 2, 160, GAME_WIDTH, 14, COLORS.GRASS_BOTTOM);

    // HUD bar at bottom
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 12, GAME_WIDTH, 24, 0x000000);

    // Header bar
    this.add.rectangle(GAME_WIDTH / 2, 8, GAME_WIDTH, 16, 0x0000a8);
    this.add.text(GAME_WIDTH / 2, 8, 'CALANGO', {
      ...FONT_STYLE,
      fontSize: '6px',
      color: '#ffffff',
    }).setOrigin(0.5, 0.5);
  }

  private createDemoBikes() {
    const bikeData = [
      { key: 'buggy_small', speed: 2.2, y: 122 },
      { key: 'buggy_small', speed: 1.8, y: 138 },
      { key: 'buggy_small', speed: 2.5, y: 130 },
      { key: 'buggy_small', speed: 1.5, y: 146 },
    ];

    bikeData.forEach((data, i) => {
      const sprite = this.add.image(-40 - i * 50, data.y, data.key);
      sprite.setOrigin(0.5, 1);
      sprite.setScale(0.3);
      sprite.setDepth(5);
      this.bikes.push({ sprite, speed: data.speed, y: data.y });
    });
  }

  private createUI() {
    // Title shadow
    this.add.text(GAME_WIDTH / 2 + 2, 74, 'OFF ROAD CAGE', {
      ...FONT_STYLE,
      fontSize: '18px',
      color: '#000000',
    }).setOrigin(0.5, 0.5).setDepth(8);

    // Title
    const title = this.add.text(GAME_WIDTH / 2, 72, 'OFF ROAD CAGE', {
      ...FONT_STYLE,
      fontSize: '18px',
      color: '#e83800',
    }).setOrigin(0.5, 0.5).setDepth(9);

    // Subtitle
    this.add.text(GAME_WIDTH / 2, 88, 'WEB EDITION', {
      ...FONT_STYLE,
      fontSize: '6px',
      color: '#e8d800',
    }).setOrigin(0.5, 0.5).setDepth(9);

    // Animate title entrance
    title.setScale(0);
    this.tweens.add({
      targets: title,
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      ease: 'Back.easeOut',
      delay: 200,
    });

    // Blinking press start
    this.blinkText = this.add.text(GAME_WIDTH / 2, 100, 'PRESS ENTER OR CLICK', {
      ...FONT_STYLE,
      fontSize: '6px',
      color: '#ffffff',
    }).setOrigin(0.5, 0.5).setDepth(9);

    // Controls in HUD
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 18, '↑↓ LANE   Z TURBO   X BRAKE   ESC MENU', {
      ...FONT_STYLE,
      fontSize: '5px',
      color: '#888888',
    }).setOrigin(0.5, 0.5).setDepth(21);

    // Version
    this.add.text(GAME_WIDTH - 4, GAME_HEIGHT - 8, 'v1.0', {
      ...FONT_STYLE,
      fontSize: '5px',
      color: '#444444',
    }).setOrigin(1, 0.5).setDepth(21);
  }

  private setupInput() {
    const keys = this.input.keyboard!;
    keys.on('keydown-ENTER', () => this.startGame());
    keys.on('keydown-SPACE', () => this.startGame());
    keys.on('keydown-Z', () => this.startGame());
    this.input.on('pointerdown', () => this.startGame());
  }

  update(_time: number, delta: number) {
    const dt = delta / 16;

    // Blink
    this.blinkTimer += delta;
    if (this.blinkTimer > 500) {
      this.blinkText.setVisible(!this.blinkText.visible);
      this.blinkTimer = 0;
    }

    // Scroll background
    this.bgScrollX += 1.5 * dt;
    this.crowdLayer.tilePositionX = this.bgScrollX * 0.3;
    this.fenceLayer.tilePositionX = this.bgScrollX * 0.6;
    this.trackLayer.tilePositionX = this.bgScrollX;

    // Move demo bikes
    this.bikes.forEach(bike => {
      bike.sprite.x += bike.speed * dt;
      // Wheel bob
      bike.sprite.y = bike.y + Math.sin(_time * 0.02 + bike.speed) * 0.5;
      if (bike.sprite.x > GAME_WIDTH + 50) {
        bike.sprite.x = -40;
      }
    });
  }

  private startGame() {
    this.cameras.main.fade(300, 0, 0, 0, false, (_: unknown, progress: number) => {
      if (progress === 1) {
        this.scene.start('SelectScene');
      }
    });
  }
}
