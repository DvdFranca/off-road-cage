// ============================================================
// OFF ROAD CAGE - Home Page
// React wrapper for the Phaser.js game
// Design: NES retro aesthetic, dark background, pixel font
// ============================================================

import { useEffect, useRef } from 'react';
import { createGame, gameInstance } from '@/game/Game';
import type Phaser from 'phaser';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    gameRef.current = createGame(containerRef.current);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  const handleUpButton = () => {
    if (gameInstance && gameInstance.scene.isActive('GameScene')) {
      const scene = gameInstance.scene.getScene('GameScene') as any;
      if (scene && typeof scene.pressUpButton === 'function') {
        scene.pressUpButton();
      }
    }
  };

  const handleDownButton = () => {
    if (gameInstance && gameInstance.scene.isActive('GameScene')) {
      const scene = gameInstance.scene.getScene('GameScene') as any;
      if (scene && typeof scene.pressDownButton === 'function') {
        scene.pressDownButton();
      }
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        fontFamily: '"Press Start 2P", monospace',
        padding: 0,
        margin: 0,
        position: 'relative',
      }}
    >
      {/* Game container - maximized */}
      <div
        ref={containerRef}
        style={{
          imageRendering: 'pixelated',
          border: '3px solid #e83800',
          boxShadow: '0 0 30px rgba(232, 56, 0, 0.5), 0 0 60px rgba(232, 56, 0, 0.2)',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      />

      {/* Controls legend and mobile buttons below game */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          gap: '24px',
          color: '#888888',
          fontSize: '9px',
          letterSpacing: '0.05em',
          background: '#000000',
          width: '100%',
          justifyContent: 'center',
          borderTop: '2px solid #e83800',
          alignItems: 'center',
          position: 'relative',
          minHeight: '80px',
        }}
      >
        {/* Left side - keyboard controls legend */}
        <div style={{ display: 'flex', gap: '24px' }}>
          <span style={{ color: '#e8d800' }}>↑↓</span>
          <span>LANE</span>
          <span style={{ color: '#e8d800' }}>Z</span>
          <span>TURBO</span>
          <span style={{ color: '#e8d800' }}>X</span>
          <span>BRAKE</span>
          <span style={{ color: '#e8d800' }}>ESC</span>
          <span>MENU</span>
        </div>

        {/* Right side - mobile buttons */}
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            gap: '15px',
            flexDirection: 'column',
            zIndex: 9999,
          }}
        >
          {/* Up button */}
          <button
            onMouseDown={handleUpButton}
            onTouchStart={(e) => {
              e.preventDefault();
              handleUpButton();
            }}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '8px',
              border: '2px solid #ffffff',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.1s',
              fontFamily: 'monospace',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            ▲
          </button>

          {/* Down button */}
          <button
            onMouseDown={handleDownButton}
            onTouchStart={(e) => {
              e.preventDefault();
              handleDownButton();
            }}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '8px',
              border: '2px solid #ffffff',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.1s',
              fontFamily: 'monospace',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
}
