// ============================================================
// EXCITEBIKE WEB - GameScene (Enhanced)
// Core gameplay: track scrolling, bike physics, obstacles,
// AI opponents, heat system, lane switching
// ============================================================

import Phaser from 'phaser';
import {
  COLORS, GAME_WIDTH, GAME_HEIGHT, FONT_STYLE,
  TRACKS, OPPONENTS, TrackDefinition, TrackObstacle,
  PLAYER_NORMAL_SPEED, PLAYER_TURBO_SPEED, PLAYER_ACCELERATION,
  PLAYER_DECELERATION, JUMP_VELOCITY, MAX_HEAT,
  HEAT_INCREASE_RATE, HEAT_DECREASE_RATE, OVERHEAT_COOLDOWN,
  LANE_POSITIONS, LANE_COUNT,
} from '../constants';

// ---- Types ----
interface Obstacle {
  sprite: Phaser.GameObjects.Image;
  worldX: number;
  lane: number;
  type: TrackObstacle['type'];
  rampHeight: number;
  rampWidth: number;
  hit: boolean;
}

interface Opponent {
  sprite: Phaser.GameObjects.Image;
  worldX: number;
  lane: number;
  speed: number;
  isWipedOut: boolean;
  wipeoutTimer: number;
  laneChangeTimer: number;
  targetLane: number;
  laneY: number;
  bikeKey: string;
  isJumping: boolean;
  jumpVelY: number;
  jumpY: number;
}

// ---- Constants ----
const RAMP_HEIGHTS: Record<string, number> = {
  ramp_small: 20,
  ramp_medium: 30,
  ramp_large: 44,
  bumper: 0,
  speed_arrow: 0,
  mud: 0,
};
const RAMP_WIDTHS: Record<string, number> = {
  ramp_small: 24,
  ramp_medium: 32,
  ramp_large: 40,
  bumper: 24,
  speed_arrow: 16,
  mud: 20,
};

export class GameScene extends Phaser.Scene {
  // Track data
  private track!: TrackDefinition;
  private trackIndex = 0;

  // World scroll
  private worldX = 0;
  private lapCount = 0;
  private raceFinished = false;
  private raceStarted = false;
  private countdownValue = 3;
  private countdownText!: Phaser.GameObjects.Text;

  // Player state
  private playerLane = 1;
  private playerY = 0;
  private playerVelY = 0;
  private playerIsJumping = false;
  private playerIsWipedOut = false;
  private wipeoutTimer = 0;
  private playerSprite!: Phaser.GameObjects.Image;
  private playerSpeed = 0;
  private playerHeat = 0;
  private playerOverheated = false;
  private overheatTimer = 0;
  private playerAngle = 0;
  private isTurbo = false;
  private isBraking = false;
  private speedBoostTimer = 0;
  private laneY = 0;
  private targetLane = 1;

  // Obstacles
  private obstacles: Obstacle[] = [];

  // Opponents
  private opponents: Opponent[] = [];

  // Background layers
  private crowdLayer!: Phaser.GameObjects.TileSprite;
  private fenceLayer!: Phaser.GameObjects.TileSprite;
  private trackLayer!: Phaser.GameObjects.TileSprite;

  // HUD elements
  private positionText!: Phaser.GameObjects.Text;
  private heatBar!: Phaser.GameObjects.Rectangle;
  private timeText!: Phaser.GameObjects.Text;
  private lapText!: Phaser.GameObjects.Text;
  private bestText!: Phaser.GameObjects.Text;
  private overheatWarning!: Phaser.GameObjects.Text;
  private steamEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private speedLines: Phaser.GameObjects.Rectangle[] = [];

  // Timing
  private raceTime = 0;
  private bestTime = 0;
  private lapStartTime = 0;

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyZ!: Phaser.Input.Keyboard.Key;
  private keyX!: Phaser.Input.Keyboard.Key;
  private keyEsc!: Phaser.Input.Keyboard.Key;

  // Finish line
  private finishLineX = 0;
  private finishSprite!: Phaser.GameObjects.Image;

  // Position tracking
  private playerPosition = 1;
  private blinkTimer = 0;

  // Audio context for synthetic sounds
  private audioCtx: AudioContext | null = null;
  private engineNode: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private lastEngineFreq = 0;

  // Background music
  private backgroundMusic: Phaser.Sound.BaseSound | null = null;

  // Mobile controls
  private upButton!: Phaser.GameObjects.Rectangle;
  private downButton!: Phaser.GameObjects.Rectangle;
  private isMobile = false;
  private mobileUpPressed = false;
  private mobileDownPressed = false;

  // Track color schemes
  private readonly COLOR_SCHEMES = [
    { track: 0xc87028, grass: 0x58d854, sky: 0x6888ff, trackDark: 0xa05820 },
    { track: 0x4848c8, grass: 0x58d854, sky: 0x000088, trackDark: 0x3030a0 },
    { track: 0x58a858, grass: 0x38d838, sky: 0x6888ff, trackDark: 0x408040 },
    { track: 0xc84848, grass: 0x58d854, sky: 0x8888ff, trackDark: 0xa03030 },
    { track: 0x888888, grass: 0x58d854, sky: 0x000000, trackDark: 0x666666 },
  ];

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { trackIndex: number; mode: number }) {
    this.trackIndex = data.trackIndex ?? 0;
    this.track = TRACKS[this.trackIndex];
    this.worldX = 0;
    this.lapCount = 0;
    this.raceFinished = false;
    this.raceStarted = false;
    this.countdownValue = 3;
    this.playerLane = 1;
    this.targetLane = 1;
    this.playerY = LANE_POSITIONS[1];
    this.laneY = LANE_POSITIONS[1];
    this.playerVelY = 0;
    this.playerIsJumping = false;
    this.playerIsWipedOut = false;
    this.wipeoutTimer = 0;
    this.playerSpeed = PLAYER_NORMAL_SPEED * 0.5;
    this.playerHeat = 0;
    this.playerOverheated = false;
    this.overheatTimer = 0;
    this.playerAngle = 0;
    this.isTurbo = false;
    this.isBraking = false;
    this.speedBoostTimer = 0;
    this.raceTime = 0;
    this.bestTime = 0;
    this.lapStartTime = 0;
    this.obstacles = [];
    this.opponents = [];
    this.playerPosition = 1;
    this.blinkTimer = 0;
    this.finishLineX = this.track.length;
  }

  create() {
    this.createBackground();
    this.createTrackElements();
    this.createPlayer();
    this.createOpponents();
    this.createHUD();
    this.createSpeedLines();
    this.createCountdown();
    this.setupInput();
    this.createSteamEffect();
    this.initAudio();
    this.cameras.main.fadeIn(400);
  }

  // ---- AUDIO ----
  private initAudio() {
    // Load and play background music
    try {
      this.backgroundMusic = this.sound.add('cotton_eye_joe', { loop: true, volume: 0.6 });
      this.backgroundMusic.play();
    } catch (e) {
      console.log('Music not available');
    }
  }

  private updateEngineSound() {
    if (!this.audioCtx || !this.engineNode || !this.engineGain) return;
    if (!this.raceStarted || this.raceFinished) {
      this.engineGain.gain.value = 0;
      return;
    }

    const speedRatio = this.playerSpeed / PLAYER_TURBO_SPEED;
    const targetFreq = 60 + speedRatio * 180 + (this.isTurbo ? 40 : 0);

    if (Math.abs(targetFreq - this.lastEngineFreq) > 2) {
      this.engineNode.frequency.setTargetAtTime(targetFreq, this.audioCtx.currentTime, 0.05);
      this.lastEngineFreq = targetFreq;
    }

    this.engineGain.gain.value = this.playerIsWipedOut || this.playerOverheated ? 0.02 : 0.08;
  }

  private playSound(type: 'jump' | 'land' | 'wipeout' | 'boost' | 'overheat') {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
      case 'jump':
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
        break;
      case 'land':
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.12);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.12);
        break;
      case 'wipeout':
        osc.type = 'noise' as OscillatorType;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
        break;
      case 'boost':
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
        break;
      case 'overheat':
        osc.type = 'square';
        for (let i = 0; i < 3; i++) {
          const t = ctx.currentTime + i * 0.15;
          osc.frequency.setValueAtTime(800, t);
          osc.frequency.linearRampToValueAtTime(400, t + 0.1);
        }
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
        break;
    }
  }

  // ---- BACKGROUND ----
  private createBackground() {
    const scheme = this.COLOR_SCHEMES[this.track.colorScheme] || this.COLOR_SCHEMES[0];

    // Sky
    this.add.rectangle(GAME_WIDTH / 2, 40, GAME_WIDTH, 80, scheme.sky);

    // Crowd (scrolls slowly)
    this.crowdLayer = this.add.tileSprite(GAME_WIDTH / 2, 28, GAME_WIDTH, 8, 'crowd_tile');

    // Fence
    this.fenceLayer = this.add.tileSprite(GAME_WIDTH / 2, 38, GAME_WIDTH, 8, 'fence_tile');

    // Top grass
    this.add.rectangle(GAME_WIDTH / 2, 52, GAME_WIDTH, 20, scheme.grass);

    // Track (3 lanes)
    this.trackLayer = this.add.tileSprite(GAME_WIDTH / 2, 132, GAME_WIDTH, 52, 'track_tile');

    // Bottom grass
    this.add.rectangle(GAME_WIDTH / 2, 162, GAME_WIDTH, 16, scheme.grass);

    // Lane dividers (dashed lines drawn on track)
    this.drawLaneDividers();
  }

  private drawLaneDividers() {
    // These are baked into the tile, but we add extra visual lane markers
    const gfx = this.add.graphics();
    gfx.lineStyle(1, 0xd89848, 0.6);
    // Lane 0-1 divider
    gfx.beginPath();
    for (let x = 0; x < GAME_WIDTH; x += 12) {
      gfx.moveTo(x, LANE_POSITIONS[0] + 8);
      gfx.lineTo(x + 6, LANE_POSITIONS[0] + 8);
    }
    // Lane 1-2 divider
    for (let x = 0; x < GAME_WIDTH; x += 12) {
      gfx.moveTo(x, LANE_POSITIONS[1] + 8);
      gfx.lineTo(x + 6, LANE_POSITIONS[1] + 8);
    }
    gfx.strokePath();
    gfx.setDepth(1);
  }

  // ---- TRACK ELEMENTS ----
  private createTrackElements() {
    this.track.obstacles.forEach(obsDef => {
      this.createObstacle(obsDef);
    });

    // Finish line
    this.finishSprite = this.add.image(0, 130, 'finish_line');
    this.finishSprite.setDepth(5);
    this.finishSprite.setVisible(false);

    // Start line
    const startSprite = this.add.image(60, 130, 'start_line');
    startSprite.setDepth(5);
  }

  private createObstacle(def: TrackObstacle) {
    const laneY = LANE_POSITIONS[def.lane];
    let textureKey = '';

    switch (def.type) {
      case 'ramp_small': textureKey = 'ramp_small'; break;
      case 'ramp_medium': textureKey = 'ramp_medium'; break;
      case 'ramp_large': textureKey = 'ramp_large'; break;
      case 'bumper': textureKey = 'bumper'; break;
      case 'speed_arrow': textureKey = 'speed_arrow'; break;
      default: textureKey = 'bumper'; break;
    }

    const sprite = this.add.image(0, laneY, textureKey);
    sprite.setOrigin(0, 1);
    sprite.setDepth(3);
    sprite.setVisible(false);

    this.obstacles.push({
      sprite,
      worldX: def.x,
      lane: def.lane,
      type: def.type,
      rampHeight: RAMP_HEIGHTS[def.type] || 0,
      rampWidth: RAMP_WIDTHS[def.type] || 24,
      hit: false,
    });
  }

  // ---- PLAYER ----
  private createPlayer() {
    this.playerY = LANE_POSITIONS[this.playerLane];
    this.laneY = this.playerY;
    this.playerSprite = this.add.image(60, this.playerY, 'buggy_player_ultra');
    this.playerSprite.setOrigin(0.5, 1);
    this.playerSprite.setScale(0.1);
    this.playerSprite.setDepth(10);
  }

  // ---- OPPONENTS ----
  private createOpponents() {
    const bikeKeys = ['buggy_main', 'buggy_main', 'buggy_main', 'buggy_main'];

    OPPONENTS.forEach((def, i) => {
      const laneY = LANE_POSITIONS[def.lane];
      const sprite = this.add.image(60 + def.startOffset, laneY, bikeKeys[i]);
      sprite.setOrigin(0.5, 1);
      sprite.setScale(0.4);
      sprite.setDepth(9);

      this.opponents.push({
        sprite,
        worldX: def.startOffset,
        lane: def.lane,
        targetLane: def.lane,
        speed: PLAYER_NORMAL_SPEED * def.speed,
        isWipedOut: false,
        wipeoutTimer: 0,
        laneChangeTimer: Phaser.Math.Between(2, 5),
        laneY,
        bikeKey: bikeKeys[i],
        isJumping: false,
        jumpVelY: 0,
        jumpY: laneY,
      });
    });
  }

  // ---- HUD ----
  private createHUD() {
    // HUD background bar at bottom
    const hudBg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 12, GAME_WIDTH, 24, 0x000000);
    hudBg.setDepth(20);

    // Position label
    this.add.text(4, GAME_HEIGHT - 20, '1ST', {
      ...FONT_STYLE,
      fontSize: '8px',
      color: '#e83800',
    }).setDepth(21).setName('pos_label');

    this.positionText = this.add.text(4, GAME_HEIGHT - 20, '1ST', {
      ...FONT_STYLE,
      fontSize: '8px',
      color: '#e83800',
    }).setDepth(21);

    // TEMP label
    this.add.text(GAME_WIDTH / 2 - 28, GAME_HEIGHT - 20, 'TEMP', {
      ...FONT_STYLE,
      fontSize: '6px',
      color: '#e83800',
    }).setDepth(21);

    // Heat bar background
    this.add.rectangle(GAME_WIDTH / 2 + 16, GAME_HEIGHT - 12, 48, 8, 0x003888).setDepth(21);

    // Heat bar fill
    this.heatBar = this.add.rectangle(GAME_WIDTH / 2 - 8, GAME_HEIGHT - 12, 0, 6, COLORS.HEAT_NORMAL);
    this.heatBar.setOrigin(0, 0.5);
    this.heatBar.setDepth(22);

    // TIME label
    this.add.text(GAME_WIDTH - 72, GAME_HEIGHT - 20, 'TIME', {
      ...FONT_STYLE,
      fontSize: '6px',
      color: '#ffffff',
    }).setDepth(21);

    // Time display
    this.timeText = this.add.text(GAME_WIDTH - 72, GAME_HEIGHT - 12, '0:00:00', {
      ...FONT_STYLE,
      fontSize: '6px',
      color: '#ffffff',
    }).setDepth(21);

    // LAP counter
    this.lapText = this.add.text(GAME_WIDTH / 2, 20, `LAP 1 / ${this.track.laps}`, {
      ...FONT_STYLE,
      fontSize: '6px',
      color: '#ffffff',
    }).setOrigin(0.5, 0).setDepth(21);

    // BEST time
    this.bestText = this.add.text(GAME_WIDTH - 4, 20, 'BEST  -:--:--', {
      ...FONT_STYLE,
      fontSize: '6px',
      color: '#ffffff',
    }).setOrigin(1, 0).setDepth(21);

    // Overheat warning
    this.overheatWarning = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, 'OVERHEAT!', {
      ...FONT_STYLE,
      fontSize: '10px',
      color: '#e83800',
    }).setOrigin(0.5, 0.5).setDepth(25).setVisible(false);

    // Header bar (NINTENDO)
    const headerBg = this.add.rectangle(GAME_WIDTH / 2, 8, GAME_WIDTH, 16, 0x0000a8);
    headerBg.setDepth(20);
    this.add.text(GAME_WIDTH / 2, 8, 'NINTENDO', {
      ...FONT_STYLE,
      fontSize: '6px',
      color: '#ffffff',
    }).setOrigin(0.5, 0.5).setDepth(21);
  }

  private createSpeedLines() {
    // Speed lines for turbo effect
    for (let i = 0; i < 6; i++) {
      const line = this.add.rectangle(
        Phaser.Math.Between(0, GAME_WIDTH),
        Phaser.Math.Between(100, 160),
        Phaser.Math.Between(20, 50),
        1,
        0xffffff,
        0.4
      );
      line.setDepth(8);
      line.setVisible(false);
      this.speedLines.push(line);
    }
  }

  // ---- COUNTDOWN ----
  private createCountdown() {
    this.countdownText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10, '3', {
      ...FONT_STYLE,
      fontSize: '32px',
      color: '#e83800',
    }).setOrigin(0.5, 0.5).setDepth(30);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.countdownValue--;
        if (this.countdownValue > 0) {
          this.countdownText.setText(String(this.countdownValue));
          this.countdownText.setColor(this.countdownValue === 1 ? '#00a800' : '#e83800');
          this.countdownText.setScale(1);
          this.tweens.add({
            targets: this.countdownText,
            scaleX: { from: 1.5, to: 1 },
            scaleY: { from: 1.5, to: 1 },
            duration: 300,
            ease: 'Quad.easeOut',
          });
        } else {
          this.countdownText.setText('GO!');
          this.countdownText.setColor('#00a800');
          this.raceStarted = true;
          this.tweens.add({
            targets: this.countdownText,
            scaleX: { from: 1.5, to: 1 },
            scaleY: { from: 1.5, to: 1 },
            duration: 300,
            ease: 'Quad.easeOut',
          });
          this.time.addEvent({
            delay: 700,
            callback: () => {
              this.tweens.add({
                targets: this.countdownText,
                alpha: 0,
                duration: 300,
                onComplete: () => this.countdownText.setVisible(false),
              });
            },
          });
        }
      },
      repeat: 3,
    });
  }

  // ---- STEAM ----
  private createSteamEffect() {
    this.steamEmitter = this.add.particles(0, 0, 'steam', {
      speed: { min: 15, max: 40 },
      angle: { min: 230, max: 310 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.9, end: 0 },
      lifespan: 700,
      frequency: 60,
      quantity: 3,
    });
    this.steamEmitter.setDepth(15);
    this.steamEmitter.stop();
  }

  // ---- INPUT ----
  private setupInput() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyZ = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.keyX = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.keyEsc = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this.keyEsc.on('down', () => {
      this.stopAudio();
      this.scene.start('TitleScene');
    });

    this.createMobileControls();
  }

  private stopAudio() {
    if (this.backgroundMusic) {
      this.backgroundMusic.stop();
      this.backgroundMusic = null;
    }
    if (this.engineNode) {
      try { this.engineNode.stop(); } catch (e) {}
      this.engineNode = null;
    }
    if (this.audioCtx) {
      try { this.audioCtx.close(); } catch (e) {}
      this.audioCtx = null;
    }
  }

  // ---- MAIN UPDATE ----
  update(_time: number, delta: number) {
    const dt = delta / 1000;

    if (!this.raceStarted || this.raceFinished) {
      this.updateBackground(dt * 0.2);
      return;
    }

    this.raceTime += dt;
    this.updateInput();
    this.updatePlayer(dt);
    this.updateOpponents(dt);
    this.updateObstacles();
    this.updateBackground(dt);
    this.updateHUD();
    this.updateSpeedLines();
    this.updateSteam();
    this.checkLapCompletion();
    // Engine sound disabled - using background music instead
    // this.updateEngineSound();
    this.blinkTimer += delta;
  }

  // ---- INPUT UPDATE ----
  private updateInput() {
    if (this.playerIsWipedOut || this.playerOverheated) return;

    this.isTurbo = this.keyZ.isDown;
    this.isBraking = this.keyX.isDown || this.cursors.left!.isDown;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up!)) {
      this.targetLane = Math.max(0, this.targetLane - 1);
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.down!)) {
      this.targetLane = Math.min(LANE_COUNT - 1, this.targetLane + 1);
    }
    
    // Mobile touch input
    if (this.mobileUpPressed) {
      this.targetLane = Math.max(0, this.targetLane - 1);
      this.mobileUpPressed = false;
    }
    if (this.mobileDownPressed) {
      this.targetLane = Math.min(LANE_COUNT - 1, this.targetLane + 1);
      this.mobileDownPressed = false;
    }
  }
  
  public pressUpButton() {
    this.mobileUpPressed = true;
  }
  
  public pressDownButton() {
    this.mobileDownPressed = true;
  }

  // ---- PLAYER UPDATE ----
  private updatePlayer(dt: number) {
    // Wipeout recovery
    if (this.playerIsWipedOut) {
      this.wipeoutTimer -= dt;
      if (this.wipeoutTimer <= 0) {
        this.playerIsWipedOut = false;
        this.playerSprite.setTexture('buggy_player_ultra');
        this.playerSprite.setAngle(0);
        this.playerSpeed = PLAYER_NORMAL_SPEED * 0.3;
      }
      // Slow deceleration during wipeout
      this.playerSpeed = Math.max(0, this.playerSpeed - PLAYER_DECELERATION * 0.5 * dt);
      this.worldX += this.playerSpeed * dt;
      return;
    }

    // Overheat recovery
    if (this.playerOverheated) {
      this.overheatTimer -= dt;
      this.playerHeat = Math.max(0, this.playerHeat - HEAT_DECREASE_RATE * 2 * dt);
      if (this.overheatTimer <= 0) {
        this.playerOverheated = false;
        this.overheatWarning.setVisible(false);
      }
      this.playerSpeed = Math.max(0, this.playerSpeed - PLAYER_DECELERATION * dt);
      this.worldX += this.playerSpeed * dt;
      return;
    }

    // Speed management
    const targetSpeed = this.isBraking
      ? PLAYER_NORMAL_SPEED * 0.25
      : this.isTurbo
        ? PLAYER_TURBO_SPEED + (this.speedBoostTimer > 0 ? 50 : 0)
        : PLAYER_NORMAL_SPEED + (this.speedBoostTimer > 0 ? 30 : 0);

    if (this.playerSpeed < targetSpeed) {
      this.playerSpeed = Math.min(targetSpeed, this.playerSpeed + PLAYER_ACCELERATION * dt);
    } else if (this.playerSpeed > targetSpeed) {
      this.playerSpeed = Math.max(targetSpeed, this.playerSpeed - PLAYER_DECELERATION * dt);
    }

    if (this.speedBoostTimer > 0) this.speedBoostTimer -= dt;

    // Heat management
    if (this.isTurbo) {
      this.playerHeat += HEAT_INCREASE_RATE * dt;
      if (this.playerHeat >= MAX_HEAT) {
        this.playerHeat = MAX_HEAT;
        this.triggerOverheat();
      }
    } else {
      this.playerHeat = Math.max(0, this.playerHeat - HEAT_DECREASE_RATE * dt);
    }

    // World scroll
    this.worldX += this.playerSpeed * dt;

    // Lane transition (smooth)
    const targetY = LANE_POSITIONS[this.targetLane];
    if (Math.abs(this.laneY - targetY) > 0.5) {
      const dir = targetY > this.laneY ? 1 : -1;
      const speed = 90;
      this.laneY += dir * speed * dt;
      if ((dir > 0 && this.laneY >= targetY) || (dir < 0 && this.laneY <= targetY)) {
        this.laneY = targetY;
        this.playerLane = this.targetLane;
      }
    } else {
      this.laneY = targetY;
      this.playerLane = this.targetLane;
    }

    // Jumping physics
    if (this.playerIsJumping) {
      this.playerVelY += 900 * dt;
      this.playerY += this.playerVelY * dt;

      if (this.playerY >= this.laneY) {
        this.playerY = this.laneY;
        this.playerVelY = 0;
        this.playerIsJumping = false;
        this.playerAngle = 0;
        this.playSound('land');
      }

      // Tilt during jump
      this.playerAngle += 45 * dt * (this.playerVelY < 0 ? -1 : 1);
      this.playerAngle = Phaser.Math.Clamp(this.playerAngle, -25, 25);
    } else {
      this.playerY = this.laneY;
      this.playerAngle = 0;
    }

    // Update sprite
    this.playerSprite.y = this.playerY + (this.playerIsJumping ? 0 : Math.sin(this.raceTime * 25) * 0.4);
    this.playerSprite.setAngle(this.playerIsJumping ? this.playerAngle : 0);

    // Check obstacle collisions
    this.checkPlayerObstacleCollisions();
  }

  private triggerOverheat() {
    if (this.playerOverheated) return;
    this.playerOverheated = true;
    this.overheatTimer = OVERHEAT_COOLDOWN;
    this.isTurbo = false;
    this.overheatWarning.setVisible(true);
    this.steamEmitter.start();
    this.cameras.main.shake(300, 0.006);
    this.playSound('overheat');
  }

  private checkPlayerObstacleCollisions() {
    for (const obs of this.obstacles) {
      if (!obs.sprite.visible) continue;
      if (obs.lane !== this.playerLane) continue;

      const screenX = obs.worldX - this.worldX + 60;
      const playerX = 60;

      // Horizontal overlap
      if (playerX + 12 < screenX || playerX - 12 > screenX + obs.rampWidth) continue;

      if (obs.type === 'ramp_small' || obs.type === 'ramp_medium' || obs.type === 'ramp_large') {
        if (!this.playerIsJumping) {
          this.playerIsJumping = true;
          this.playerVelY = JUMP_VELOCITY - obs.rampHeight * 4;
          this.playerAngle = -15;
          this.playSound('jump');
        }
      } else if (obs.type === 'bumper') {
        if (!obs.hit) {
          obs.hit = true;
          this.triggerWipeout();
          // Reset hit after wipeout
          this.time.addEvent({ delay: 3000, callback: () => { obs.hit = false; } });
        }
      } else if (obs.type === 'speed_arrow') {
        if (this.speedBoostTimer <= 0) {
          this.speedBoostTimer = 1.5;
          this.playSound('boost');
        }
      }
    }
  }

  private triggerWipeout() {
    if (this.playerIsWipedOut) return;
    this.playerIsWipedOut = true;
    this.wipeoutTimer = 2.5;
    this.playerSpeed *= 0.2;
        this.playerSprite.setTexture('buggy_wipeout');
    this.cameras.main.shake(400, 0.01);
    this.playSound('wipeout');
  }

  // ---- OPPONENTS UPDATE ----
  private updateOpponents(dt: number) {
    const bikeKeys = ['buggy_main', 'buggy_main', 'buggy_main', 'buggy_main'];

    this.opponents.forEach((opp, idx) => {
      if (opp.isWipedOut) {
        opp.wipeoutTimer -= dt;
        if (opp.wipeoutTimer <= 0) {
          opp.isWipedOut = false;
          opp.sprite.setTexture(bikeKeys[idx]);
          opp.sprite.setAngle(0);
          opp.speed = PLAYER_NORMAL_SPEED * OPPONENTS[idx].speed;
        }
        return;
      }

      // Move
      opp.worldX += opp.speed * dt;

      // AI lane changing
      opp.laneChangeTimer -= dt;
      if (opp.laneChangeTimer <= 0) {
        opp.laneChangeTimer = Phaser.Math.FloatBetween(2, 5);

        // Avoid bumpers ahead
        const aheadBumper = this.obstacles.find(o => {
          const relX = o.worldX - opp.worldX;
          return relX > 0 && relX < 120 && o.lane === opp.lane && o.type === 'bumper';
        });

        if (aheadBumper) {
          const options = [0, 1, 2].filter(l => l !== opp.lane);
          opp.targetLane = options[Math.floor(Math.random() * options.length)];
        } else if (Math.random() < 0.25) {
          opp.targetLane = Phaser.Math.Between(0, 2);
        }
      }

      // Smooth lane transition
      const targetY = LANE_POSITIONS[opp.targetLane];
      if (Math.abs(opp.laneY - targetY) > 0.5) {
        const dir = targetY > opp.laneY ? 1 : -1;
        opp.laneY += dir * 60 * dt;
        if ((dir > 0 && opp.laneY >= targetY) || (dir < 0 && opp.laneY <= targetY)) {
          opp.laneY = targetY;
          opp.lane = opp.targetLane;
        }
      }

      // Jumping
      if (opp.isJumping) {
        opp.jumpVelY += 900 * dt;
        opp.jumpY += opp.jumpVelY * dt;
        if (opp.jumpY >= opp.laneY) {
          opp.jumpY = opp.laneY;
          opp.jumpVelY = 0;
          opp.isJumping = false;
          opp.sprite.setAngle(0);
        }
      } else {
        opp.jumpY = opp.laneY;
      }

      // Check ramp collisions for opponents
      for (const obs of this.obstacles) {
        if (obs.lane !== opp.lane) continue;
        if (obs.type !== 'ramp_small' && obs.type !== 'ramp_medium' && obs.type !== 'ramp_large') continue;
        const relX = obs.worldX - opp.worldX;
        if (relX > -10 && relX < 20 && !opp.isJumping) {
          opp.isJumping = true;
          opp.jumpVelY = JUMP_VELOCITY - obs.rampHeight * 3;
        }
      }

      // Check bumper collisions
      for (const obs of this.obstacles) {
        if (obs.lane !== opp.lane || obs.type !== 'bumper') continue;
        const relX = obs.worldX - opp.worldX;
        if (relX > -10 && relX < 20 && !opp.isJumping) {
          opp.isWipedOut = true;
          opp.wipeoutTimer = 2;
          opp.speed *= 0.3;
          opp.sprite.setTexture('bike_wipeout');
          break;
        }
      }

      // Screen position
      const screenX = 60 + (opp.worldX - this.worldX);
      opp.sprite.x = screenX;
      opp.sprite.y = opp.jumpY + Math.sin(this.raceTime * 22 + idx) * 0.4;
      opp.sprite.setVisible(screenX > -50 && screenX < GAME_WIDTH + 50);
    });
  }

  // ---- OBSTACLES UPDATE ----
  private updateObstacles() {
    this.obstacles.forEach(obs => {
      const screenX = obs.worldX - this.worldX + 60;
      const laneY = LANE_POSITIONS[obs.lane];

      if (screenX > -60 && screenX < GAME_WIDTH + 60) {
        obs.sprite.setVisible(true);
        obs.sprite.x = screenX;
        obs.sprite.y = laneY;
      } else {
        obs.sprite.setVisible(false);
      }
    });

    // Finish line
    const finishScreenX = this.finishLineX - this.worldX + 60;
    this.finishSprite.x = finishScreenX;
    this.finishSprite.setVisible(finishScreenX > -40 && finishScreenX < GAME_WIDTH + 40);
  }

  // ---- BACKGROUND UPDATE ----
  private updateBackground(dt: number) {
    const scrollSpeed = this.playerSpeed;
    this.crowdLayer.tilePositionX += scrollSpeed * dt * 0.15;
    this.fenceLayer.tilePositionX += scrollSpeed * dt * 0.4;
    this.trackLayer.tilePositionX += scrollSpeed * dt;
  }

  // ---- HUD UPDATE ----
  private updateHUD() {
    // Heat bar
    const heatPercent = this.playerHeat / MAX_HEAT;
    this.heatBar.width = 44 * heatPercent;
    this.heatBar.setFillStyle(heatPercent > 0.75 ? COLORS.HEAT_WARNING : COLORS.HEAT_NORMAL);

    // Time
    const minutes = Math.floor(this.raceTime / 60);
    const seconds = Math.floor(this.raceTime % 60);
    const centiseconds = Math.floor((this.raceTime % 1) * 100);
    this.timeText.setText(`${minutes}:${String(seconds).padStart(2, '0')}:${String(centiseconds).padStart(2, '0')}`);

    // Position
    let pos = 1;
    this.opponents.forEach(opp => {
      if (opp.worldX > this.worldX) pos++;
    });
    this.playerPosition = pos;
    const posLabels = ['1ST', '2ND', '3RD', '4TH', '5TH'];
    this.positionText.setText(posLabels[pos - 1] || '5TH');

    // Lap
    this.lapText.setText(`LAP ${Math.min(this.lapCount + 1, this.track.laps)} / ${this.track.laps}`);

    // Overheat warning blink
    if (this.playerOverheated && this.blinkTimer > 180) {
      this.overheatWarning.setVisible(!this.overheatWarning.visible);
      this.blinkTimer = 0;
    }
  }

  // ---- SPEED LINES ----
  private updateSpeedLines() {
    const showLines = this.isTurbo || this.speedBoostTimer > 0;
    this.speedLines.forEach((line, i) => {
      line.setVisible(showLines);
      if (showLines) {
        line.x -= (8 + i * 2);
        if (line.x < -60) {
          line.x = GAME_WIDTH + 20;
          line.y = Phaser.Math.Between(105, 158);
          line.width = Phaser.Math.Between(15, 45);
        }
        line.setAlpha(0.2 + Math.random() * 0.3);
      }
    });
  }

  // ---- STEAM UPDATE ----
  private updateSteam() {
    if (this.playerOverheated) {
      this.steamEmitter.setPosition(this.playerSprite.x - 12, this.playerSprite.y - 8);
      if (!this.steamEmitter.active) this.steamEmitter.start();
    } else {
      this.steamEmitter.stop();
    }
  }

  // ---- LAP COMPLETION ----
  private checkLapCompletion() {
    if (this.worldX >= this.finishLineX) {
      this.lapCount++;

      if (this.lapCount >= this.track.laps) {
        this.finishRace();
      } else {
        // Reset for next lap
        const lapTime = this.raceTime - this.lapStartTime;
        if (this.bestTime === 0 || lapTime < this.bestTime) {
          this.bestTime = lapTime;
          const bm = Math.floor(this.bestTime / 60);
          const bs = Math.floor(this.bestTime % 60);
          const bc = Math.floor((this.bestTime % 1) * 100);
          this.bestText.setText(`BEST  ${bm}:${String(bs).padStart(2, '0')}:${String(bc).padStart(2, '0')}`);
        }
        this.lapStartTime = this.raceTime;
        this.worldX = 0;
        this.opponents.forEach(opp => { opp.worldX -= this.finishLineX; });
        // Reset obstacle hit flags
        this.obstacles.forEach(obs => { obs.hit = false; });
      }
    }
  }

  private finishRace() {
    this.raceFinished = true;
    this.playerSpeed = 0;
    this.stopAudio();

    const finishText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, 'FINISH!', {
      ...FONT_STYLE,
      fontSize: '20px',
      color: '#e8d800',
    }).setOrigin(0.5, 0.5).setDepth(30);

    this.tweens.add({
      targets: finishText,
      scaleX: { from: 0, to: 1 },
      scaleY: { from: 0, to: 1 },
      duration: 400,
      ease: 'Back.easeOut',
    });

    this.time.addEvent({
      delay: 2500,
      callback: () => {
        this.cameras.main.fade(400, 0, 0, 0, false, (_: unknown, progress: number) => {
          if (progress === 1) {
            this.scene.start('FinishScene', {
              time: this.raceTime,
              bestTime: this.bestTime,
              position: this.playerPosition,
              trackIndex: this.trackIndex,
            });
          }
        });
      },
    });
  }

  private createMobileControls() {
    const buttonWidth = 70;
    const buttonHeight = 70;
    const padding = 15;
    // Usar coordenadas de tela global (viewport) em vez de coordenadas de jogo
    const rightX = GAME_WIDTH - buttonWidth - padding;
    // Botões aparecem na área preta de baixo da tela (fora do canvas do jogo)
    const upButtonY = GAME_HEIGHT + 80;
    const downButtonY = GAME_HEIGHT + 170;



    // Up button - positioned above down button
    this.upButton = this.add.rectangle(rightX, upButtonY, buttonWidth, buttonHeight, 0xffffff, 0.15);
    this.upButton.setStrokeStyle(2, 0xffffff, 0.4);
    this.upButton.setInteractive();
    this.upButton.setDepth(100);
    this.upButton.on('pointerdown', () => {
      this.cursors.up.isDown = true;
      this.upButton.setFillStyle(0xffffff, 0.3);
    });
    this.upButton.on('pointerup', () => {
      this.cursors.up.isDown = false;
      this.upButton.setFillStyle(0xffffff, 0.15);
    });
    this.upButton.on('pointerout', () => {
      this.cursors.up.isDown = false;
      this.upButton.setFillStyle(0xffffff, 0.15);
    });

    // Add up arrow text
    this.add.text(rightX, upButtonY, '▲', {
      fontSize: '44px',
      color: '#ffffff',
    }).setOrigin(0.5, 0.5).setDepth(101);

    // Down button - positioned at the very bottom
    this.downButton = this.add.rectangle(rightX, downButtonY, buttonWidth, buttonHeight, 0xffffff, 0.15);
    this.downButton.setStrokeStyle(2, 0xffffff, 0.4);
    this.downButton.setInteractive();
    this.downButton.setDepth(100);
    this.downButton.on('pointerdown', () => {
      this.cursors.down.isDown = true;
      this.downButton.setFillStyle(0xffffff, 0.3);
    });
    this.downButton.on('pointerup', () => {
      this.cursors.down.isDown = false;
      this.downButton.setFillStyle(0xffffff, 0.15);
    });
    this.downButton.on('pointerout', () => {
      this.cursors.down.isDown = false;
      this.downButton.setFillStyle(0xffffff, 0.15);
    });

    // Add down arrow text
    this.add.text(rightX, downButtonY, '▼', {
      fontSize: '44px',
      color: '#ffffff',
    }).setOrigin(0.5, 0.5).setDepth(101);
  }

  shutdown() {
    this.stopAudio();
  }
}
