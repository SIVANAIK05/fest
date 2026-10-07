import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { playUiBeep } from '../utils/audioEngine';
import SpaceshipLaunch from './SpaceshipLaunch';
import AstronautHeroParallax from './AstronautHeroParallax';

export default function Hero({ onEnterAstrion, onLaunchStart }) {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleEnter = () => {
    if (isLaunching) return;
    playUiBeep(1100, 0.05);
    setIsLaunching(true);
    if (onLaunchStart) {
      onLaunchStart();
    }
  };

  const handleLaunchTransition = () => {
    setIsLaunching(false);
    if (onEnterAstrion) {
      onEnterAstrion();
    } else {
      const missionSection = document.getElementById('mission');
      if (missionSection) {
        missionSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      <AstronautHeroParallax>
        <div
          className="hero-wrapper"
          style={{
            minHeight: '100vh',
            background: 'transparent',
            position: 'relative',
            zIndex: 10
          }}
        >
          {/* TOP RIGHT DATE WIDGET */}
          <div className="hero-date-widget">
            <div className="month">NOV</div>
            <div className="days">23 - 24</div>
            <div className="year">2026</div>
          </div>

          {/* RIGHT SIDE VERTICAL TRACKING KEYWORDS */}
          <div className="hero-vertical-tags">
            <span>IDEAS</span>
            <span>PEOPLE</span>
            <span>CULTURE</span>
            <span>COMPETITION</span>
            <span style={{ color: 'var(--cyan-primary)', fontWeight: 700 }}>BEYOND BOUNDARIES</span>
          </div>

          {/* EMPTY TOP SPACER */}
          <div />

          {/* CENTER HERO CONTENT */}
          <div className="hero-center-content">

            {/* BIG CINEMATIC ASTRION TITLE WITH MINIMAL MOVEMENT & HOVER TRANSITIONS */}
            <h1 className="hero-title" aria-label="ASTRION">
              {"ASTRION".split('').map((char, index) => (
                <span
                  key={index}
                  className={`hero-title-letter ${isLaunching ? 'hero-letter-warp' : ''}`}
                  style={{
                    animationDelay: `${index * 0.16}s`
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>

            {/* SUBTITLE */}
            <div className="hero-subtitle">
              INNOVATE BEYOND BOUNDARIES
            </div>

            {/* TAGLINE */}
            <p className="hero-tagline">
              Where curiosity meets the unknown.
            </p>

            {/* ENTER ASTRION CTA BUTTON */}
            <div>
              <button
                onClick={handleEnter}
                className="btn-pill-cyan"
                style={{
                  padding: '0.85rem 2.2rem',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: isLaunching ? 'wait' : 'pointer'
                }}
                disabled={isLaunching}
              >
                <span style={{
                  width: '1.4rem',
                  height: '1.4rem',
                  borderRadius: '9999px',
                  background: '#020617',
                  color: '#38bdf8',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Play style={{ width: '0.65rem', height: '0.65rem', fill: 'currentColor', marginLeft: '1px' }} />
                </span>
                <span>{isLaunching ? 'ORBITAL ASCENT ACTIVE...' : 'ENTER ASTRION'}</span>
                <span>→</span>
              </button>
            </div>

          </div>

          {/* BOTTOM SCROLL TO EXPLORE WITH INTERACTIVE LAUNCH SPACESHIP */}
          <div className="hero-scroll-indicator" style={{ paddingBottom: '1rem', zIndex: 45 }}>
            <SpaceshipLaunch
              isTriggered={isLaunching}
              onLaunchStart={handleEnter}
              onLaunchComplete={handleLaunchTransition}
            />
          </div>

        </div>
      </AstronautHeroParallax>
    </section>
  );
}
