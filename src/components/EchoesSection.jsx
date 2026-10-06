import React, { useState } from 'react';
import { playUiBeep } from '../utils/audioEngine';

export default function EchoesSection() {
  const [activeYear, setActiveYear] = useState('2024');

  const years = ['2022', '2023', '2024', '2025'];

  const moments = [
    {
      img: '/images/echoes_concert.jpg',
      title: 'Galactic DJ & Laser Spectacle'
    },
    {
      img: '/images/hero_blackhole.jpg',
      title: 'Cosmic Arena Conclave'
    },
    {
      img: '/images/echoes_mascot.jpg',
      title: 'ASTRION AstroBot Mascot'
    },
    {
      img: '/images/mission_station.jpg',
      title: 'Singularity Hackathon Stage'
    }
  ];

  return (
    <section id="gallery" className="ast-section">
      
      {/* SECTION HEADER (matching reference image) */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="section-index">04 —</div>
        <h2 className="ast-heading">
          ECHOES THROUGH TIME
        </h2>
        <p className="ast-subheading">
          Moments that survived the passage of time.
        </p>
      </div>

      {/* 4 MOMENT CARDS MATCHING REFERENCE IMAGE */}
      <div className="echoes-cards-grid">
        {moments.map((m, idx) => (
          <div 
            key={idx}
            className="echo-card-item"
            onClick={() => playUiBeep(1100, 0.03)}
          >
            <img 
              src={m.img} 
              alt={m.title}
            />
            <div className="echo-card-overlay">
              <div className="echo-card-title">
                {m.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* YEAR SELECTOR TIMELINE (matching reference image) */}
      <div className="year-slider-row">
        {years.map((year) => {
          const isActive = activeYear === year;
          return (
            <button
              key={year}
              onClick={() => {
                playUiBeep(1000);
                setActiveYear(year);
              }}
              className={`year-btn ${isActive ? 'active' : ''}`}
            >
              <span>{year}</span>
            </button>
          );
        })}
      </div>

    </section>
  );
}
