import React from 'react';
import { ArrowRight } from 'lucide-react';
import TiltCard from './TiltCard';
import { playUiBeep } from '../utils/audioEngine';

export default function MissionSection() {
  const stats = [
    { value: '50+', label: 'Institutions' },
    { value: '25+', label: 'Events' },
    { value: '3', label: 'Days' },
    { value: '∞', label: 'Possibilities' }
  ];

  const verticalTags = [
    'TECHNOLOGY',
    'CREATIVITY',
    'CULTURE',
    'INNOVATION',
    'COMPETITION',
    'EXPLORATION'
  ];

  return (
    <section id="mission" className="ast-section">

      <div className="mission-grid">

        {/* LEFT COLUMN: THE MISSION CONTENT (from reference image) */}
        <div className="mission-left">

          {/* Index 01 — */}
          <div>
            <div className="section-index">01 —</div>
            <h2 className="ast-heading">
              THE MISSION
            </h2>
            <p className="ast-subheading">
              Every boundary is an invitation to explore.
            </p>
          </div>

          {/* Description Paragraph */}
          <p className="mission-body-text">
            ASTRION is more than a fest — it's a universe of ideas, creativity, and innovation. A platform where student minds from across institutions come together to compete, collaborate and create <span style={{ color: 'var(--cyan-primary)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '4px' }}>Beyond Boundaries</span>.
          </p>

          {/* Know More CTA Button */}
          <div style={{ paddingTop: '0.25rem' }}>
            <a
              href="#events"
              onClick={() => playUiBeep(1100)}
              className="btn-pill-ghost"
            >
              <span>Know More</span>
              <span>→</span>
            </a>
          </div>

          {/* Stats Metrics (50+ Institutions, 25+ Events, 3 Days, ∞ Possibilities) */}
          <div className="mission-stats-row">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-item">
                <div className="stat-value">
                  {stat.value}
                </div>
                <div className="stat-label">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: ORBITAL STATION VISUAL (from reference image) */}
        <div style={{ position: 'relative' }}>

          <TiltCard maxTilt={4} scale={1.01}>
            <div className="mission-visual-box">
              <img
                src="/images/mission_station.jpg"
                alt="Orbital Station above Planet"
              />
            </div>
          </TiltCard>

          {/* Vertical Tags on the Far Right Edge (from reference image) */}
          <div className="hero-vertical-tags" style={{ right: '-3rem', fontSize: '9px' }}>
            {verticalTags.map((tag, i) => (
              <span key={i} style={{ cursor: 'default' }}>
                {tag}
              </span>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
}
