// ============================================================
// EXCITEBIKE WEB - BootScene (Real Buggy Image)
// Loads the real buggy PNG image and generates other assets
// ============================================================

import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Loading screen
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, 'OFF ROAD CAGE', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '12px',
      color: '#e83800',
    }).setOrigin(0.5, 0.5);

    const bar = this.add.graphics();
    const border = this.add.graphics();
    border.lineStyle(2, 0xffffff);
    border.strokeRect(GAME_WIDTH / 2 - 60, GAME_HEIGHT / 2 + 4, 120, 12);

    this.load.on('progress', (value: number) => {
      bar.clear();
      bar.fillStyle(0xe83800);
      bar.fillRect(GAME_WIDTH / 2 - 58, GAME_HEIGHT / 2 + 6, 116 * value, 8);
    });

    // Load buggy images
    this.load.image('buggy_main', '/assets/buggy_main.png');
    this.load.image('buggy_small', '/assets/buggy_small.png');
    this.load.image('buggy_wipeout', '/assets/buggy_wipeout.png');
    this.load.image('buggy_player_ultra', '/assets/buggy_player_ultra.png');

    // Load background music from CDN
    this.load.audio('cotton_eye_joe', 'https://d2xsxph8kpxj0f.cloudfront.net/310519663390766416/gd363PbEhPM95GVCTqKbgP/cotton_eye_joe_bc60d4e5.mp3');
  }

  create() {
    this.generateTextures();
    this.scene.start('TitleScene');
  }

  private generateTextures() {
    // Generate procedural textures for obstacles and track
    this.generateRampSmall();
    this.generateRampMedium();
    this.generateRampLarge();
    this.generateBumper();
    this.generateSpeedArrow();
    this.generateTrackTile();
    this.generateGrassTile();
    this.generateFenceTile();
    this.generateCrowdTile();
    this.generateFinishLine();
    this.generateStartLine();
    this.generateSteamParticle();
  }

  // ---- RAMPS ----
  private generateRampSmall() {
    const gfx = this.add.graphics();
    gfx.fillStyle(COLORS.RAMP_COLOR);
    gfx.fillTriangle(0, 16, 24, 16, 24, 2);
    gfx.fillStyle(COLORS.RAMP_SHADOW);
    gfx.fillRect(0, 14, 24, 2);
    gfx.fillRect(0, 14, 2, 2);
    gfx.fillStyle(0xffd890, 0.6);
    gfx.fillRect(14, 4, 6, 2);
    gfx.fillRect(8, 8, 6, 2);
    gfx.fillRect(2, 12, 6, 1);
    gfx.generateTexture('ramp_small', 24, 16);
    gfx.destroy();
  }

  private generateRampMedium() {
    const gfx = this.add.graphics();
    gfx.fillStyle(COLORS.RAMP_COLOR);
    gfx.fillTriangle(0, 24, 32, 24, 32, 2);
    gfx.fillStyle(COLORS.RAMP_SHADOW);
    gfx.fillRect(0, 22, 32, 2);
    gfx.fillRect(0, 22, 2, 2);
    gfx.fillStyle(0xffd890, 0.6);
    gfx.fillRect(20, 4, 8, 2);
    gfx.fillRect(12, 10, 8, 2);
    gfx.fillRect(4, 16, 8, 2);
    gfx.generateTexture('ramp_medium', 32, 24);
    gfx.destroy();
  }

  private generateRampLarge() {
    const gfx = this.add.graphics();
    gfx.fillStyle(COLORS.RAMP_COLOR);
    gfx.fillTriangle(0, 32, 40, 32, 40, 2);
    gfx.fillStyle(COLORS.RAMP_SHADOW);
    gfx.fillRect(0, 30, 40, 2);
    gfx.fillRect(0, 30, 2, 2);
    gfx.fillStyle(0xffd890, 0.6);
    gfx.fillRect(26, 4, 10, 2);
    gfx.fillRect(16, 12, 10, 2);
    gfx.fillRect(6, 20, 10, 2);
    gfx.generateTexture('ramp_large', 40, 32);
    gfx.destroy();
  }

  // ---- BUMPER (wrecked buggy) ----
  private generateBumper() {
    const gfx = this.add.graphics();
    // Wrecked buggy body
    gfx.fillStyle(0x585858);
    gfx.fillRect(2, 8, 24, 5);
    gfx.fillStyle(0x888888);
    gfx.fillRect(3, 9, 22, 3);
    
    // Wheels
    gfx.fillStyle(0x000000);
    gfx.fillCircle(4, 16, 4);
    gfx.fillCircle(24, 16, 4);
    gfx.fillStyle(0x222222);
    gfx.fillCircle(4, 16, 2);
    gfx.fillCircle(24, 16, 2);
    
    // Debris - roll cage
    gfx.fillStyle(0x00ff00, 0.6);
    gfx.fillRect(8, 2, 12, 2);
    gfx.fillRect(8, 2, 2, 4);
    gfx.fillRect(18, 2, 2, 4);
    
    gfx.generateTexture('bumper', 28, 18);
    gfx.destroy();
  }

  // ---- SPEED ARROW ----
  private generateSpeedArrow() {
    const gfx = this.add.graphics();
    gfx.fillStyle(COLORS.SPEED_ARROW);
    gfx.fillTriangle(0, 3, 7, 8, 0, 13);
    gfx.fillRect(0, 5, 5, 6);
    gfx.fillTriangle(7, 3, 14, 8, 7, 13);
    gfx.fillRect(7, 5, 5, 6);
    gfx.lineStyle(1, 0xc8a800);
    gfx.strokeTriangle(0, 3, 7, 8, 0, 13);
    gfx.strokeTriangle(7, 3, 14, 8, 7, 13);
    gfx.generateTexture('speed_arrow', 16, 16);
    gfx.destroy();
  }

  // ---- TRACK TILE ----
  private generateTrackTile() {
    const gfx = this.add.graphics();
    gfx.fillStyle(COLORS.TRACK);
    gfx.fillRect(0, 0, 16, 16);
    gfx.fillStyle(COLORS.TRACK_DARK, 0.4);
    gfx.fillRect(2, 2, 2, 1);
    gfx.fillRect(9, 5, 2, 1);
    gfx.fillRect(4, 9, 2, 1);
    gfx.fillRect(12, 12, 2, 1);
    gfx.fillRect(6, 14, 2, 1);
    gfx.fillStyle(0xd89848, 0.7);
    gfx.fillRect(0, 5, 7, 1);
    gfx.fillRect(0, 10, 7, 1);
    gfx.generateTexture('track_tile', 16, 16);
    gfx.destroy();
  }

  // ---- GRASS TILE ----
  private generateGrassTile() {
    const gfx = this.add.graphics();
    gfx.fillStyle(COLORS.GRASS_TOP);
    gfx.fillRect(0, 0, 16, 10);
    gfx.fillStyle(COLORS.GRASS_BOTTOM);
    gfx.fillRect(0, 10, 16, 6);
    gfx.fillStyle(0x48e848);
    gfx.fillRect(0, 0, 2, 4);
    gfx.fillRect(4, 0, 2, 3);
    gfx.fillRect(8, 0, 2, 5);
    gfx.fillRect(12, 0, 2, 3);
    gfx.generateTexture('grass_tile', 16, 16);
    gfx.destroy();
  }

  // ---- FENCE TILE ----
  private generateFenceTile() {
    const gfx = this.add.graphics();
    gfx.fillStyle(0xd8d8d8);
    gfx.fillRect(0, 0, 16, 3);
    gfx.fillStyle(0xa8a8a8);
    gfx.fillRect(0, 3, 16, 3);
    gfx.fillStyle(0x888888);
    gfx.fillRect(0, 0, 2, 6);
    gfx.fillRect(7, 0, 2, 6);
    gfx.fillRect(14, 0, 2, 6);
    gfx.generateTexture('fence_tile', 16, 6);
    gfx.destroy();
  }

  // ---- CROWD TILE ----
  private generateCrowdTile() {
    const gfx = this.add.graphics();
    const colors = [COLORS.CROWD_1, COLORS.CROWD_2, COLORS.CROWD_3, 0xffffff, 0xe8a800, 0x00a8a8];
    for (let i = 0; i < 4; i++) {
      const c = colors[i % colors.length];
      gfx.fillStyle(c);
      gfx.fillRect(i * 4, 3, 3, 5);
      gfx.fillStyle(0xffd8b8);
      gfx.fillRect(i * 4 + 1, 0, 2, 3);
      if (i % 2 === 0) {
        gfx.fillStyle(c);
        gfx.fillRect(i * 4 + 2, 1, 2, 2);
      }
    }
    gfx.generateTexture('crowd_tile', 16, 8);
    gfx.destroy();
  }

  // ---- FINISH LINE ----
  private generateFinishLine() {
    const gfx = this.add.graphics();
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        const isWhite = (row + col) % 2 === 0;
        gfx.fillStyle(isWhite ? 0xffffff : 0x000000);
        gfx.fillRect(col * 8, row * 8, 8, 8);
      }
    }
    gfx.generateTexture('finish_line', 32, 48);
    gfx.destroy();
  }

  // ---- START LINE ----
  private generateStartLine() {
    const gfx = this.add.graphics();
    gfx.fillStyle(0xffffff);
    gfx.fillRect(0, 0, 4, 48);
    gfx.fillStyle(0x000000);
    gfx.fillRect(4, 0, 4, 48);
    gfx.generateTexture('start_line', 8, 48);
    gfx.destroy();
  }

  // ---- STEAM PARTICLE ----
  private generateSteamParticle() {
    const gfx = this.add.graphics();
    gfx.fillStyle(0xffffff, 0.9);
    gfx.fillCircle(4, 4, 4);
    gfx.fillStyle(0xdddddd, 0.5);
    gfx.fillCircle(4, 4, 2);
    gfx.generateTexture('steam', 8, 8);
    gfx.destroy();
  }
}
