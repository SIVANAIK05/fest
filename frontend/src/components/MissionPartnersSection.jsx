import React from 'react';

export default function MissionPartnersSection() {
  const partners = [
    { name: 'SCALEZ ', desc:'Food Stall Partner ' },
    { name: 'IIC', desc:'Organizing Partner ' },
    { name: 'Student Tribe', desc: 'Innovation Partner' },
  ];

  return (
    <section id="partners" className="ast-section" style={{ borderTop: '1px solid rgba(56, 189, 248, 0.15)', paddingTop: '4rem', paddingBottom: '4rem' }}>

      {/* ============================================================ */}
      {/* STRATEGIC ALLIANCES & SPONSORS                                */}
      {/* ============================================================ */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 className="ast-heading" style={{ fontSize: '1.75rem' }}>
          STRATEGIC ALLIANCES
        </h3>
        <p className="ast-subheading">
          Co-sponsored and supported by:
          
        </p>
      </div>

      {/* MINIMALIST LOGOS GRID (matching reference image) */}
      <div className="partners-logo-row">
        {partners.map((p, idx) => (
          <div 
            key={idx}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'default' }}
          >
            <span style={{ fontFamily: 'var(--font-space)', fontWeight: 800, fontSize: '1.85rem', letterSpacing: '0.05em', color: '#ffffff', transition: 'color 0.2s ease' }}>
              {p.name}
            </span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-space)', color: 'var(--cyan-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '0.25rem' }}>
              {p.desc}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
}
