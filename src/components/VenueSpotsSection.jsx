import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, Users, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { playUiBeep } from '../utils/audioEngine';

export const VENUE_SPOTS_DATA = [
  {
    id: 'cse-complex',
    name: 'Tesseract Computing Complex',
    building: 'CSE Block • 3rd Floor',
    zone: 'Sector Alpha // Lab 301-304',
    category: 'tech',
    capacity: '450 Explorers',
    events: ['AI ODYSSEY', 'CODEVERSE (24H Hackathon)'],
    specs: 'High-speed gigabit fiber, AI GPU compute clusters, dedicated recharging pods',
    status: 'ONLINE // READY',
    coords: '16.3538° N, 80.5280° E',
    iconColor: '#38bdf8'
  },
  {
    id: 'cyber-arena',
    name: 'Cyber War Defense Arena',
    building: 'IoT & Security Block • Ground Floor',
    zone: 'Sector Beta // Advanced Network Deck',
    category: 'tech',
    capacity: '220 Explorers',
    events: ['CYBER WAR (Capture The Flag)'],
    specs: 'Isolated sandbox networks, threat emulation terminals, multi-screen spectator wall',
    status: 'DEFENSE READY',
    coords: '16.3541° N, 80.5276° E',
    iconColor: '#34d399'
  },
  {
    id: 'main-auditorium',
    name: 'Cosmic Keynote Auditorium',
    building: 'Central Administrative Block • Ground Floor',
    zone: 'Sector Delta // Main Concourse',
    category: 'stage',
    capacity: '1,200 Explorers',
    events: ['COSMIC PITCH', 'Keynote Sessions', 'Grand Award Convocation'],
    specs: '4K Laser Cinema Projection, Dolby Atmos soundstage, VIP investor console',
    status: 'MAIN STAGE PRIMED',
    coords: '16.3533° N, 80.5284° E',
    iconColor: '#fbbf24'
  },
  {
    id: 'sports-complex',
    name: 'The Star Gaming Pavilion',
    building: 'Indoor Sports & Recreation Complex',
    zone: 'Sector Gamma // Level 1',
    category: 'gaming',
    capacity: '600 Explorers',
    events: ['E-SPORTS ARENA (Valorant / BGMI / FIFA)'],
    specs: '240Hz tournament displays, live commentary desk, spectator arena audio',
    status: 'LAN ONLINE',
    coords: '16.3529° N, 80.5292° E',
    iconColor: '#f472b6'
  },
  {
    id: 'open-quad',
    name: 'Orion Central Quadrangle',
    building: 'Central Campus Plaza • Open Amphitheatre',
    zone: 'Sector Omega // Star Square',
    category: 'stage',
    capacity: '2,500 Explorers',
    events: ['TECH QUIZ', 'SCI-FI TRIVIA', 'BEAT GRAVITY (Music & Cultural Concert)'],
    specs: 'Concert lighting array, 360° sound system, outdoor food & merchandise stalls',
    status: 'HORIZON OPEN',
    coords: '16.3535° N, 80.5288° E',
    iconColor: '#a855f7'
  },
  {
    id: 'iic-hub',
    name: 'IIC Incubation & Innovation Deck',
    building: 'R&D Block • 2nd Floor',
    zone: 'Sector Sigma // Suite 204',
    category: 'tech',
    capacity: '300 Explorers',
    events: ['Mission Partners Expo', 'Hardware Showcase', 'Venture Connect'],
    specs: 'Rapid prototyping lab, 3D printing bay, patent assistance desk',
    status: 'INNOVATION ACTIVE',
    coords: '16.3544° N, 80.5282° E',
    iconColor: '#38bdf8'
  }
];

export default function VenueSpotsSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSpot, setSelectedSpot] = useState(VENUE_SPOTS_DATA[0]);

  const filteredSpots = activeFilter === 'all'
    ? VENUE_SPOTS_DATA
    : VENUE_SPOTS_DATA.filter(s => s.category === activeFilter);

  const handleFilterClick = (cat) => {
    playUiBeep(1100, 0.03);
    setActiveFilter(cat);
  };

  const handleSpotSelect = (spot) => {
    playUiBeep(1300, 0.04);
    setSelectedSpot(spot);
  };

  return (
    <section id="venues" className="ast-section" style={{ position: 'relative' }}>

      {/* SECTION HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="section-index" style={{ justifyContent: 'center' }}>04 —</div>
        <h2 className="ast-heading" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', letterSpacing: '0.04em' }}>
          CAMPUS VENUE SPOTS
        </h2>
        <p className="ast-subheading" style={{ maxWidth: '640px', margin: '0.5rem auto 0' }}>
          VVIT University Campus Navigation Matrix. Locate your event arenas, hackathon labs, and key stages across campus sectors.
        </p>
      </div>

      {/* FILTER BUTTONS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {[
          { id: 'all', label: 'All Venues (6)' },
          { id: 'tech', label: 'Technical Labs' },
          { id: 'stage', label: 'Auditoriums & Stages' },
          { id: 'gaming', label: 'Gaming Arenas' }
        ].map(f => (
          <button
            key={f.id}
            type="button"
            onClick={() => handleFilterClick(f.id)}
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '9999px',
              fontFamily: 'var(--font-space)',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeFilter === f.id ? 'var(--cyan-primary)' : 'rgba(15, 23, 42, 0.75)',
              color: activeFilter === f.id ? '#020617' : '#cbd5e1',
              border: activeFilter === f.id ? '1px solid var(--cyan-primary)' : '1px solid rgba(56, 189, 248, 0.2)',
              boxShadow: activeFilter === f.id ? '0 0 15px rgba(56, 189, 248, 0.35)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* MAIN VENUE MATRIX GRID & SPOTLIGHT */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1240px',
          margin: '0 auto'
        }}
      >
        {filteredSpots.map(spot => {
          const isSelected = selectedSpot.id === spot.id;
          return (
            <div
              key={spot.id}
              onClick={() => handleSpotSelect(spot)}
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(8, 25, 45, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%)'
                  : 'rgba(3, 7, 21, 0.85)',
                border: isSelected
                  ? '1.5px solid var(--cyan-primary)'
                  : '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '1.25rem',
                padding: '1.5rem',
                backdropFilter: 'blur(16px)',
                boxShadow: isSelected
                  ? '0 15px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(56, 189, 248, 0.25)'
                  : '0 10px 30px rgba(0, 0, 0, 0.6)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Accent Line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: isSelected ? 'var(--cyan-primary)' : spot.iconColor,
                  opacity: isSelected ? 1 : 0.4
                }}
              />

              <div>
                {/* Header: Zone & Live Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-space)', fontSize: '10px', color: 'var(--cyan-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
                    {spot.zone}
                  </span>
                  <span style={{ fontSize: '9px', padding: '0.15rem 0.5rem', borderRadius: '9999px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)', fontWeight: 600 }}>
                    {spot.status}
                  </span>
                </div>

                {/* Venue Name */}
                <h3 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.15rem', color: '#ffffff', fontWeight: 800, letterSpacing: '0.02em', margin: '0.2rem 0' }}>
                  {spot.name}
                </h3>

                {/* Building Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '11.5px', fontFamily: 'var(--font-space)', marginTop: '0.25rem' }}>
                  <MapPin style={{ width: '0.85rem', height: '0.85rem', color: 'var(--amber-primary)', flexShrink: 0 }} />
                  <span>{spot.building}</span>
                </div>

                {/* Hosted Events List */}
                <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(56, 189, 248, 0.12)', paddingTop: '0.75rem' }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem', fontWeight: 600 }}>
                    HOSTED MISSIONS & EVENTS
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {spot.events.map((ev, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '10px',
                          fontFamily: 'var(--font-space)',
                          fontWeight: 600,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '0.35rem',
                          background: 'rgba(56, 189, 248, 0.12)',
                          color: '#7dd3fc',
                          border: '1px solid rgba(56, 189, 248, 0.25)'
                        }}
                      >
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Facilities & Specs */}
                <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '0.75rem', lineHeight: '1.4', fontFamily: 'var(--font-space)' }}>
                  {spot.specs}
                </div>
              </div>

              {/* Card Footer: Capacity & GPS Coords */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '1.25rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(56, 189, 248, 0.1)',
                  fontSize: '10.5px',
                  color: 'var(--text-slate)',
                  fontFamily: 'var(--font-space)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Users style={{ width: '0.8rem', height: '0.8rem', color: 'var(--cyan-primary)' }} />
                  <span>Capacity: {spot.capacity}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '9.5px' }}>
                  <Navigation style={{ width: '0.75rem', height: '0.75rem', color: '#34d399' }} />
                  <span>{spot.coords}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* QUICK CAMPUS TRANSIT NOTICE */}
      <div
        style={{
          maxWidth: '860px',
          margin: '2.5rem auto 0',
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '1rem',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          backdropFilter: 'blur(12px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Compass style={{ width: '1.2rem', height: '1.2rem', color: 'var(--cyan-primary)' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '11px', color: '#ffffff', fontWeight: 700 }}>
              FREE CAMPUS NAVIGATOR ASSISTANCE
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--font-space)' }}>
              Student volunteer navigators and electric transit buggies will guide all arriving participants from Gate 1 & Gate 2 to respective venue spots.
            </div>
          </div>
        </div>

        <a
          href="#register"
          onClick={() => playUiBeep(1100, 0.04)}
          className="btn-pill-ghost"
          style={{ fontSize: '11px', padding: '0.45rem 1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
        >
          <span>Get Pass for Venue Access</span>
          <ArrowRight style={{ width: '0.8rem', height: '0.8rem' }} />
        </a>
      </div>

    </section>
  );
}
