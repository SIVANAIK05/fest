import React from 'react';
import { playUiBeep } from '../utils/audioEngine';

export default function TheCrewSection() {
  const crewTeams = [
    {
      role: 'Overall Coordinators',
      img: '/images/crew_lead.jpg'
    },
    {
      role: 'Technical Team',
      img: '/images/crew_engineer.jpg'
    },
    {
      role: 'Cultural Team',
      img: '/images/crew_lead.jpg'
    },
    {
      role: 'Publicity Team',
      img: '/images/crew_engineer.jpg'
    },
    {
      role: 'Volunteers',
      img: '/images/crew_lead.jpg'
    }
  ];

  return (
    <section id="crew" className="ast-section" style={{ borderTop: '1px solid rgba(56, 189, 248, 0.15)', paddingTop: '4rem', paddingBottom: '4rem' }}>

      {/* HEADER (matching reference image) */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 className="ast-heading" style={{ fontSize: '1.75rem' }}>
          THE CREW
        </h3>
        <p className="ast-subheading">
          Every mission needs people willing to explore the unknown.
        </p>
      </div>

      {/* CIRCULAR GLOWING ASTRONAUT PORTRAITS (matching reference image) */}
      <div className="crew-avatars-grid">
        {crewTeams.map((team, idx) => (
          <div
            key={idx}
            onClick={() => playUiBeep(1100 + idx * 50, 0.03)}
            style={{ cursor: 'pointer' }}
          >
            {/* Circular Avatar Ring with Astronaut Photo */}
            <div className="crew-avatar-circle">
              <img
                src={team.img}
                alt={team.role}
              />
            </div>

            {/* Role Title below circle */}
            <h4 className="crew-role-title">
              {team.role}
            </h4>
          </div>
        ))}
      </div>

    </section>
  );
}
