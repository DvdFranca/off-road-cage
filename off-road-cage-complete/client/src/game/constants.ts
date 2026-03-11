// ============================================================
// EXCITEBIKE WEB - Constants & Configuration
// Design: NES Excitebike faithful recreation
// Color Palette: NES-accurate orange track, green grass, blue sky
// ============================================================

export const GAME_WIDTH = 256;
export const GAME_HEIGHT = 240;
export const SCALE = 3;

// Physics
export const GRAVITY = 800;
export const PLAYER_NORMAL_SPEED = 180;
export const PLAYER_TURBO_SPEED = 280;
export const PLAYER_ACCELERATION = 200;
export const PLAYER_DECELERATION = 120;
export const JUMP_VELOCITY = -380;
export const MAX_HEAT = 100;
export const HEAT_INCREASE_RATE = 22; // per second while turbo
export const HEAT_DECREASE_RATE = 14; // per second while not turbo
export const OVERHEAT_COOLDOWN = 3.5; // seconds

// Track
export const TRACK_Y = 148; // ground level in game coords
export const TRACK_HEIGHT = 52;
export const LANE_COUNT = 3;
export const LANE_HEIGHT = 16;
export const LANE_POSITIONS = [116, 132, 148]; // y positions of each lane center

// Colors (NES palette)
export const COLORS = {
  SKY: 0x6888ff,
  GRASS_TOP: 0x58d854,
  GRASS_BOTTOM: 0x38a838,
  TRACK: 0xc87028,
  TRACK_DARK: 0xa05820,
  TRACK_LINE: 0xd89848,
  FENCE_TOP: 0xe8e8e8,
  FENCE_BOTTOM: 0xb8b8b8,
  CROWD_1: 0xe83800,
  CROWD_2: 0x0058f8,
  CROWD_3: 0x00a800,
  HUD_BG: 0x000000,
  HUD_TEXT: 0xffffff,
  HEAT_NORMAL: 0x0058f8,
  HEAT_WARNING: 0xe83800,
  PLAYER_BODY: 0xe83800,
  PLAYER_WHEEL: 0x000000,
  RAMP_COLOR: 0xd8a048,
  RAMP_SHADOW: 0x885020,
  BUMPER_COLOR: 0x585858,
  SPEED_ARROW: 0xe8d800,
};

// NES-style font
export const FONT_STYLE = {
  fontFamily: '"Press Start 2P", monospace',
  fontSize: '8px',
  color: '#ffffff',
};

// Track definitions (5 tracks like original)
export interface TrackObstacle {
  type: 'ramp_small' | 'ramp_medium' | 'ramp_large' | 'bumper' | 'speed_arrow' | 'mud';
  x: number; // world x position
  lane: number; // 0=top, 1=mid, 2=bottom
}

export interface TrackDefinition {
  id: number;
  name: string;
  length: number; // world units
  laps: number;
  obstacles: TrackObstacle[];
  colorScheme: number;
}

export const TRACKS: TrackDefinition[] = [
  {
    id: 1,
    name: 'TRACK 1',
    length: 6000,
    laps: 3,
    colorScheme: 0,
    obstacles: [
      { type: 'ramp_small', x: 400, lane: 2 },
      { type: 'bumper', x: 600, lane: 1 },
      { type: 'ramp_medium', x: 800, lane: 0 },
      { type: 'bumper', x: 1000, lane: 2 },
      { type: 'speed_arrow', x: 1200, lane: 1 },
      { type: 'ramp_large', x: 1500, lane: 0 },
      { type: 'ramp_small', x: 1700, lane: 2 },
      { type: 'bumper', x: 1900, lane: 1 },
      { type: 'ramp_medium', x: 2100, lane: 0 },
      { type: 'bumper', x: 2300, lane: 2 },
      { type: 'ramp_small', x: 2500, lane: 1 },
      { type: 'speed_arrow', x: 2700, lane: 0 },
      { type: 'ramp_large', x: 3000, lane: 2 },
      { type: 'bumper', x: 3200, lane: 1 },
      { type: 'ramp_medium', x: 3400, lane: 0 },
      { type: 'bumper', x: 3600, lane: 2 },
      { type: 'ramp_small', x: 3800, lane: 1 },
      { type: 'ramp_large', x: 4100, lane: 0 },
      { type: 'bumper', x: 4300, lane: 2 },
      { type: 'speed_arrow', x: 4500, lane: 1 },
      { type: 'ramp_medium', x: 4700, lane: 0 },
      { type: 'bumper', x: 4900, lane: 2 },
      { type: 'ramp_small', x: 5100, lane: 1 },
      { type: 'bumper', x: 5300, lane: 0 },
      { type: 'ramp_large', x: 5500, lane: 2 },
    ],
  },
  {
    id: 2,
    name: 'TRACK 2',
    length: 6000,
    laps: 3,
    colorScheme: 1,
    obstacles: [
      { type: 'ramp_medium', x: 300, lane: 1 },
      { type: 'ramp_medium', x: 500, lane: 0 },
      { type: 'bumper', x: 700, lane: 2 },
      { type: 'ramp_large', x: 900, lane: 1 },
      { type: 'bumper', x: 1100, lane: 0 },
      { type: 'ramp_small', x: 1300, lane: 2 },
      { type: 'speed_arrow', x: 1500, lane: 1 },
      { type: 'ramp_medium', x: 1700, lane: 0 },
      { type: 'bumper', x: 1900, lane: 2 },
      { type: 'ramp_large', x: 2200, lane: 1 },
      { type: 'ramp_medium', x: 2400, lane: 0 },
      { type: 'bumper', x: 2600, lane: 2 },
      { type: 'ramp_small', x: 2800, lane: 1 },
      { type: 'bumper', x: 3000, lane: 0 },
      { type: 'ramp_large', x: 3300, lane: 2 },
      { type: 'speed_arrow', x: 3500, lane: 1 },
      { type: 'ramp_medium', x: 3700, lane: 0 },
      { type: 'bumper', x: 3900, lane: 2 },
      { type: 'ramp_small', x: 4100, lane: 1 },
      { type: 'ramp_large', x: 4400, lane: 0 },
      { type: 'bumper', x: 4600, lane: 2 },
      { type: 'ramp_medium', x: 4800, lane: 1 },
      { type: 'bumper', x: 5000, lane: 0 },
      { type: 'ramp_small', x: 5200, lane: 2 },
      { type: 'ramp_large', x: 5500, lane: 1 },
    ],
  },
  {
    id: 3,
    name: 'TRACK 3',
    length: 6000,
    laps: 3,
    colorScheme: 2,
    obstacles: [
      { type: 'bumper', x: 300, lane: 0 },
      { type: 'bumper', x: 350, lane: 2 },
      { type: 'ramp_large', x: 600, lane: 1 },
      { type: 'ramp_medium', x: 800, lane: 0 },
      { type: 'ramp_medium', x: 900, lane: 2 },
      { type: 'bumper', x: 1100, lane: 1 },
      { type: 'speed_arrow', x: 1300, lane: 0 },
      { type: 'ramp_large', x: 1600, lane: 2 },
      { type: 'bumper', x: 1800, lane: 1 },
      { type: 'ramp_small', x: 2000, lane: 0 },
      { type: 'ramp_small', x: 2100, lane: 2 },
      { type: 'bumper', x: 2300, lane: 1 },
      { type: 'ramp_large', x: 2600, lane: 0 },
      { type: 'speed_arrow', x: 2800, lane: 2 },
      { type: 'ramp_medium', x: 3000, lane: 1 },
      { type: 'bumper', x: 3200, lane: 0 },
      { type: 'bumper', x: 3250, lane: 2 },
      { type: 'ramp_large', x: 3500, lane: 1 },
      { type: 'ramp_small', x: 3700, lane: 0 },
      { type: 'ramp_small', x: 3800, lane: 2 },
      { type: 'bumper', x: 4000, lane: 1 },
      { type: 'ramp_large', x: 4300, lane: 0 },
      { type: 'speed_arrow', x: 4500, lane: 2 },
      { type: 'ramp_medium', x: 4700, lane: 1 },
      { type: 'bumper', x: 4900, lane: 0 },
      { type: 'ramp_large', x: 5200, lane: 2 },
      { type: 'bumper', x: 5400, lane: 1 },
    ],
  },
  {
    id: 4,
    name: 'TRACK 4',
    length: 6000,
    laps: 3,
    colorScheme: 3,
    obstacles: [
      { type: 'ramp_large', x: 300, lane: 0 },
      { type: 'ramp_large', x: 500, lane: 2 },
      { type: 'bumper', x: 700, lane: 1 },
      { type: 'ramp_medium', x: 900, lane: 0 },
      { type: 'speed_arrow', x: 1100, lane: 2 },
      { type: 'ramp_large', x: 1300, lane: 1 },
      { type: 'bumper', x: 1500, lane: 0 },
      { type: 'ramp_small', x: 1700, lane: 2 },
      { type: 'ramp_small', x: 1800, lane: 1 },
      { type: 'ramp_small', x: 1900, lane: 0 },
      { type: 'bumper', x: 2100, lane: 2 },
      { type: 'ramp_large', x: 2400, lane: 1 },
      { type: 'ramp_medium', x: 2600, lane: 0 },
      { type: 'bumper', x: 2800, lane: 2 },
      { type: 'speed_arrow', x: 3000, lane: 1 },
      { type: 'ramp_large', x: 3200, lane: 0 },
      { type: 'ramp_large', x: 3400, lane: 2 },
      { type: 'bumper', x: 3600, lane: 1 },
      { type: 'ramp_medium', x: 3800, lane: 0 },
      { type: 'ramp_small', x: 4000, lane: 2 },
      { type: 'ramp_small', x: 4100, lane: 1 },
      { type: 'bumper', x: 4300, lane: 0 },
      { type: 'ramp_large', x: 4600, lane: 2 },
      { type: 'speed_arrow', x: 4800, lane: 1 },
      { type: 'ramp_medium', x: 5000, lane: 0 },
      { type: 'bumper', x: 5200, lane: 2 },
      { type: 'ramp_large', x: 5500, lane: 1 },
    ],
  },
  {
    id: 5,
    name: 'TRACK 5',
    length: 6000,
    laps: 3,
    colorScheme: 4,
    obstacles: [
      { type: 'ramp_large', x: 200, lane: 0 },
      { type: 'ramp_large', x: 300, lane: 1 },
      { type: 'ramp_large', x: 400, lane: 2 },
      { type: 'bumper', x: 600, lane: 0 },
      { type: 'bumper', x: 650, lane: 2 },
      { type: 'ramp_medium', x: 850, lane: 1 },
      { type: 'speed_arrow', x: 1050, lane: 0 },
      { type: 'ramp_large', x: 1250, lane: 2 },
      { type: 'ramp_large', x: 1450, lane: 1 },
      { type: 'bumper', x: 1650, lane: 0 },
      { type: 'bumper', x: 1700, lane: 2 },
      { type: 'ramp_small', x: 1900, lane: 1 },
      { type: 'ramp_large', x: 2100, lane: 0 },
      { type: 'ramp_large', x: 2300, lane: 2 },
      { type: 'bumper', x: 2500, lane: 1 },
      { type: 'speed_arrow', x: 2700, lane: 0 },
      { type: 'ramp_large', x: 2900, lane: 2 },
      { type: 'ramp_medium', x: 3100, lane: 1 },
      { type: 'bumper', x: 3300, lane: 0 },
      { type: 'bumper', x: 3350, lane: 2 },
      { type: 'ramp_large', x: 3600, lane: 1 },
      { type: 'ramp_large', x: 3800, lane: 0 },
      { type: 'ramp_large', x: 4000, lane: 2 },
      { type: 'bumper', x: 4200, lane: 1 },
      { type: 'speed_arrow', x: 4400, lane: 0 },
      { type: 'ramp_large', x: 4600, lane: 2 },
      { type: 'ramp_large', x: 4800, lane: 1 },
      { type: 'bumper', x: 5000, lane: 0 },
      { type: 'bumper', x: 5050, lane: 2 },
      { type: 'ramp_large', x: 5300, lane: 1 },
    ],
  },
];

// AI opponent definitions
export interface OpponentDef {
  color: number;
  speed: number; // multiplier
  lane: number;
  startOffset: number;
}

export const OPPONENTS: OpponentDef[] = [
  { color: 0x0058f8, speed: 0.85, lane: 0, startOffset: -30 },
  { color: 0x00a800, speed: 0.90, lane: 2, startOffset: -60 },
  { color: 0xe8d800, speed: 0.95, lane: 1, startOffset: -90 },
  { color: 0xd800cc, speed: 0.80, lane: 0, startOffset: -120 },
];
