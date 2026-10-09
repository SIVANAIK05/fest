import React, { useState, useEffect } from 'react';
import { playUiBeep, playWarpSound, playSpaceBreachSound } from '../utils/audioEngine';

export default function SpaceshipLaunch({ isTriggered, onLaunchStart, onLaunchComplete }) {
  const [shipState, setShipState] = useState('idle'); // 'idle' | 'igniting' | 'launching' | 'docked'

  // Trigger launch if parent initiates it (e.g. from "ENTER ASTRION" button)
  useEffect(() => {
    if (isTriggered && shipState === 'idle') {
      triggerLaunch();
    }
  }, [isTriggered]);

  const triggerLaunch = () => {
    if (shipState !== 'idle') return;

    if (onLaunchStart) {
      onLaunchStart();
    }

    // 1. Ignition phase (0 - 200ms): Thrusters spool, pad shockwave blooms
    setShipState('igniting');
    playSpaceBreachSound();

    // 2. Main blast-off: travel from bottom to up through the 5 reference boxes
    setTimeout(() => {
      setShipState('launching');
      playWarpSound();

      // Wait until the ship has traversed Box 1 -> Box 2 -> Box 3 -> Box 4 -> Box 5 into orbit (~1450ms)
      setTimeout(() => {
        if (onLaunchComplete) {
          onLaunchComplete();
        }
      }, 1450);

      // Reset to idle ready for exploration
      setTimeout(() => {
        setShipState('idle');
      }, 3200);
    }, 200);
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: shipState === 'idle' ? 'pointer' : 'default',
        userSelect: 'none',
        zIndex: 50
      }}
      onClick={() => {
        if (shipState === 'idle') {
          playUiBeep(1200, 0.04);
          triggerLaunch();
        }
      }}
      title="Click to launch spaceship to Missions"
    >

      {/* SHOCKWAVE EXPANSION RING DURING LAUNCH */}
      {shipState === 'launching' && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            width: '120px',
            height: '24px',
            borderRadius: '50%',
            border: '2px solid rgba(56, 189, 248, 0.8)',
            boxShadow: '0 0 30px rgba(56, 189, 248, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.8)',
            animation: 'shockwaveBurst 0.9s ease-out forwards',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* THE SPACESHIP VESSEL */}
      <div
        style={{
          position: 'relative',
          transition: shipState === 'launching'
            ? 'transform 1.4s cubic-bezier(0.22, 0.72, 0.32, 1)'
            : shipState === 'igniting'
              ? 'none'
              : 'transform 0.3s ease',
          transform: shipState === 'launching'
            ? 'translate3d(0, -145vh, 0) scale(1.15)'
            : shipState === 'igniting'
              ? 'translate3d(0, 3px, 0) scale(0.98)'
              : 'translate3d(0, 0, 0)',
          filter: shipState === 'launching'
            ? 'drop-shadow(0 25px 40px rgba(56, 189, 248, 0.9))'
            : 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.8))',
          pointerEvents: shipState === 'launching' ? 'none' : 'auto',
          zIndex: 50
        }}
        className={shipState === 'idle' ? 'spaceship-hover-idle' : shipState === 'igniting' ? 'spaceship-igniting-vibe' : ''}
      >

        {/* HIGH-PRECISION AEROSPACE SHUTTLE SVG */}
        <svg
          viewBox="0 0 120 180"
          width="60"
          height="88"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            {/* Matte Titanium Hull Gradient */}
            <linearGradient id="hullMatte" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="25%" stopColor="#334155" />
              <stop offset="50%" stopColor="#64748b" />
              <stop offset="75%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Wing Composite Carbon */}
            <linearGradient id="wingMatte" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="45%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Tinted Cockpit Glass */}
            <linearGradient id="cockpitCanopy" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="35%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Intense Launch Plasma Flame */}
            <linearGradient id="launchPlasma" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="15%" stopColor="#38bdf8" />
              <stop offset="45%" stopColor="#0284c7" />
              <stop offset="80%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            {/* Gentle Idle Exhaust */}
            <linearGradient id="idlePlasma" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* 1. DELTA-WING WINGSPAN */}
          <polygon
            points="60,18 108,124 92,135 60,120 28,135 12,124"
            fill="url(#wingMatte)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.2"
          />

          {/* Wing Leading Armor Edges */}
          <line x1="60" y1="18" x2="108" y2="124" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="60" y1="18" x2="12" y2="124" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Wing RCS Pods */}
          <rect x="18" y="112" width="6" height="12" rx="1" fill="#0f172a" stroke="#64748b" strokeWidth="0.8" />
          <rect x="96" y="112" width="6" height="12" rx="1" fill="#0f172a" stroke="#64748b" strokeWidth="0.8" />

          {/* 2. AEROSPACE FUSELAGE / MAIN HULL */}
          <path
            d="M 60,6 C 66,22 74,65 72,126 L 48,126 C 46,65 54,22 60,6 Z"
            fill="url(#hullMatte)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.2"
          />

          {/* Heat-Shield Nosecone */}
          <path
            d="M 60,6 C 62,12 64,22 64,26 L 56,26 C 56,22 58,12 60,6 Z"
            fill="#090d16"
            stroke="#475569"
            strokeWidth="1"
          />

          {/* 3. COCKPIT CANOPY */}
          <path
            d="M 60,34 C 64,42 65,60 64,70 L 56,70 C 55,60 56,42 60,34 Z"
            fill="url(#cockpitCanopy)"
            opacity="0.95"
          />
          {/* Glass Specular Glint */}
          <path d="M 58,38 Q 61,46 60,56" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.85" />

          {/* 4. THERMAL PANEL JOINTS */}
          <line x1="51" y1="84" x2="69" y2="84" stroke="#1e293b" strokeWidth="1" />
          <line x1="49" y1="102" x2="71" y2="102" stroke="#1e293b" strokeWidth="1" />
          <circle cx="60" cy="93" r="1.5" fill="#38bdf8" opacity="0.8" />

          {/* 5. DUAL STABILIZER FINS */}
          <polygon points="40,88 35,125 43,125" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
          <polygon points="80,88 85,125 77,125" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />

          {/* 6. TWIN MAIN ENGINE NOZZLES */}
          <rect x="50" y="126" width="7" height="6" rx="1.5" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
          <rect x="63" y="126" width="7" height="6" rx="1.5" fill="#0f172a" stroke="#64748b" strokeWidth="1" />

          {/* 7. DYNAMIC ENGINE THRUST PLUMES */}
          {shipState === 'launching' ? (
            /* HUGE LAUNCH THRUST TRAILS WITH SUPERSONIC MACH DIAMONDS */
            <g>
              {/* Left Engine Main Jet */}
              <polygon points="50,132 53.5,235 57,132" fill="url(#launchPlasma)" opacity="0.95" />
              {/* Right Engine Main Jet */}
              <polygon points="63,132 66.5,235 70,132" fill="url(#launchPlasma)" opacity="0.95" />
              {/* Mach Shock Diamonds - Left */}
              <polygon points="53.5,145 55.5,152 53.5,160 51.5,152" fill="#ffffff" opacity="0.95" />
              <polygon points="53.5,168 55,174 53.5,180 52,174" fill="#ffffff" opacity="0.85" />
              {/* Mach Shock Diamonds - Right */}
              <polygon points="66.5,145 68.5,152 66.5,160 64.5,152" fill="#ffffff" opacity="0.95" />
              <polygon points="66.5,168 68,174 66.5,180 65,174" fill="#ffffff" opacity="0.85" />
              {/* Combined Core Plasma Flare */}
              <ellipse cx="60" cy="135" rx="18" ry="7" fill="#ffffff" opacity="0.95" />
              <ellipse cx="60" cy="142" rx="24" ry="12" fill="#38bdf8" opacity="0.65" />
            </g>
          ) : shipState === 'igniting' ? (
            /* PRE-IGNITION BURST */
            <g>
              <ellipse cx="53.5" cy="136" rx="6" ry="10" fill="#38bdf8" opacity="0.9" />
              <ellipse cx="66.5" cy="136" rx="6" ry="10" fill="#38bdf8" opacity="0.9" />
              <ellipse cx="60" cy="132" rx="14" ry="4" fill="#ffffff" opacity="0.9" />
            </g>
          ) : (
            /* GENTLE IDLE ION PULSE */
            <g className="spaceship-idle-flame">
              <polygon points="51,132 53.5,145 56,132" fill="url(#idlePlasma)" opacity="0.8" />
              <polygon points="64,132 66.5,145 69,132" fill="url(#idlePlasma)" opacity="0.8" />
              <circle cx="53.5" cy="133" r="2.5" fill="#ffffff" opacity="0.9" />
              <circle cx="66.5" cy="133" r="2.5" fill="#ffffff" opacity="0.9" />
            </g>
          )}
        </svg>

        {/* ION EXHAUST SMOKE & GLOW EFFECT */}
        {shipState === 'launching' && (
          <div
            style={{
              position: 'absolute',
              top: '95%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '5px',
              height: '180px',
              background: 'linear-gradient(to bottom, #ffffff 0%, rgba(56, 189, 248, 0.95) 25%, rgba(14, 165, 233, 0.5) 60%, transparent 100%)',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.9), 0 0 45px rgba(56, 189, 248, 0.4)',
              opacity: 0.95,
              pointerEvents: 'none',
              filter: 'blur(0.5px)'
            }}
          />
        )}

      </div>

      {/* LAUNCH CALLOUT / STATUS LABEL */}
      <div
        style={{
          marginTop: '0.45rem',
          fontFamily: 'var(--font-space)',
          fontSize: '9.5px',
          letterSpacing: '0.2em',
          color: shipState === 'launching' ? '#38bdf8' : '#94a3b8',
          textTransform: 'uppercase',
          fontWeight: 600,
          transition: 'color 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}
      >
        {shipState === 'launching' ? (
          <span style={{ color: '#38bdf8', animation: 'pulse 0.4s infinite' }}>▲ ORBITAL ASCENT // ENGAGING EXPEDITIONS ▲</span>
        ) : shipState === 'igniting' ? (
          <span style={{ color: '#fbbf24' }}>● MAIN ENGINES SPOOLING...</span>
        ) : (
          <span>SCROLL TO EXPLORE</span>
        )}
      </div>

      {/* VERTICAL GUIDANCE INDICATOR LINE */}
      <div
        style={{
          width: '1px',
          height: '20px',
          background: shipState === 'launching'
            ? 'linear-gradient(to bottom, #38bdf8, transparent)'
            : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4), transparent)',
          marginTop: '0.3rem',
          transition: 'all 0.2s ease'
        }}
      />

    </div>
  );
}
