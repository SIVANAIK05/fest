import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  ShieldCheck,
  CheckCircle,
  X,
  Users,
  User,
  Sparkles,
  ArrowLeft,
  Building,
  Calendar,
  Rocket,
  Check,
  Copy,
  IdCard,
  GraduationCap
} from 'lucide-react';
import { playUiBeep } from '../utils/audioEngine';

export default function PassVerificationModal({ pass, onClose }) {
  const [copiedId, setCopiedId] = useState(false);
  const [enrichedData, setEnrichedData] = useState(null);

  // Play subtle gateway confirmation sound on mount & lock body scroll
  useEffect(() => {
    if (pass) {
      playUiBeep(1200, 0.08);
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          playUiBeep(850, 0.04);
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      // Attempt background live database sync if roll number is available
      const targetRoll = pass.roll || (pass.id && !pass.id.startsWith('ASTR-') ? pass.id : null);
      if (targetRoll) {
        let isMounted = true;
        const fetchDbDetails = async () => {
          try {
            const rawBackendUrl = (import.meta.env.VITE_BACKEND_URL || '').trim().replace(/\/+$/, '');
            const baseUrl = rawBackendUrl && !rawBackendUrl.includes('your-render-app-name')
              ? rawBackendUrl
              : 'http://localhost:3000';

            const res = await fetch(`${baseUrl}/api/registration/${encodeURIComponent(targetRoll)}`);
            if (res.ok) {
              const json = await res.json();
              if (json.registration && isMounted) {
                setEnrichedData(json.registration);
              }
            }
          } catch {
            // Graceful fallback to embedded QR data
          }
        };
        fetchDbDetails();
        return () => {
          isMounted = false;
        };
      }

      return () => {
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [pass, onClose]);

  // Copy Pass ID
  const handleCopyId = (e) => {
    e.stopPropagation();
    if (!pass?.id) return;
    navigator.clipboard.writeText(pass.id);
    playUiBeep(1400, 0.04);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Parse crew members list
  const crewMembers = useMemo(() => {
    if (enrichedData) {
      const members = [];
      [
        enrichedData.team_member_email_2,
        enrichedData.team_member_email_3,
        enrichedData.team_member_email_4,
        enrichedData.team_member_email_5
      ].forEach((m, idx) => {
        if (m && String(m).trim()) {
          members.push({ name: String(m).trim(), index: idx + 2 });
        }
      });
      if (members.length > 0) return members;
    }

    if (!pass?.crew || pass.crew === 'Solo Explorer' || pass.crew === 'None' || pass.crew === 'None specified') {
      return [];
    }

    // Split on commas not enclosed inside parentheses
    const parts = pass.crew.split(/,\s*(?=[A-Za-z0-9])/);
    return parts
      .map((p, idx) => ({ name: p.trim(), index: idx + 2 }))
      .filter(item => item.name && item.name.toLowerCase() !== 'solo explorer');
  }, [pass, enrichedData]);

  // Determine flight mode
  const isSquad = useMemo(() => {
    if (enrichedData?.flight_mode) {
      return enrichedData.flight_mode === 'Squad';
    }
    const squadStr = (pass?.squad || '').toLowerCase();
    return (
      (pass?.squad && squadStr !== 'solo flight' && squadStr !== 'solo explorer') ||
      crewMembers.length > 0
    );
  }, [pass, enrichedData, crewMembers]);

  // Parse authorized missions
  const missionsList = useMemo(() => {
    if (enrichedData?.event_names && Array.isArray(enrichedData.event_names)) {
      return enrichedData.event_names.map(ev => typeof ev === 'string' ? ev : (ev.title || 'Mission'));
    }
    if (!pass?.events) return ['General Entry Pass'];
    return pass.events
      .split(',')
      .map(e => e.trim())
      .filter(Boolean);
  }, [pass, enrichedData]);

  if (!pass) return null;

  const leadName = enrichedData?.team_lead_name || pass.name || 'Commander';
  const rollNumber = enrichedData?.team_lead_roll_no || pass.roll || (pass.id?.startsWith('ASTR-') ? '' : pass.id);
  const collegeName = enrichedData?.college || pass.college || 'Registered Institution';
  const departmentName = enrichedData?.department || pass.dept || '';
  const yearName = enrichedData?.year_of_study || pass.year || '';
  const squadName = pass.squad && pass.squad !== 'Solo Flight' && pass.squad !== 'Solo Explorer'
    ? pass.squad
    : (isSquad ? 'Endurance Squad' : 'Solo Flight');

  return typeof document !== 'undefined' && createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(2, 4, 9, 0.94)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 2.5vw, 2rem)',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '580px',
          background: 'radial-gradient(ellipse at top, rgba(14, 116, 144, 0.25) 0%, rgba(3, 7, 21, 0.98) 75%)',
          border: '1.5px solid rgba(56, 189, 248, 0.45)',
          borderRadius: '1.5rem',
          padding: 'clamp(1.25rem, 3.5vw, 2.25rem)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95), 0 0 50px rgba(56, 189, 248, 0.25)',
          position: 'relative',
          fontFamily: 'var(--font-space)',
          color: '#f8fafc',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Aerospace Corner Tech Accents */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', width: '12px', height: '12px', borderTop: '2px solid #38bdf8', borderLeft: '2px solid #38bdf8' }} />
        <div style={{ position: 'absolute', top: '10px', right: '10px', width: '12px', height: '12px', borderTop: '2px solid #38bdf8', borderRight: '2px solid #38bdf8' }} />
        <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '12px', height: '12px', borderBottom: '2px solid #38bdf8', borderLeft: '2px solid #38bdf8' }} />
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '12px', height: '12px', borderBottom: '2px solid #38bdf8', borderRight: '2px solid #38bdf8' }} />

        {/* Top Control Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => {
              playUiBeep(850, 0.04);
              onClose();
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: 'var(--cyan-primary)',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '9999px',
              padding: '0.35rem 0.85rem',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Return to site"
          >
            <ArrowLeft style={{ width: '0.85rem', height: '0.85rem' }} />
            <span>Return to Site</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playUiBeep(900, 0.03);
              onClose();
            }}
            style={{
              color: '#94a3b8',
              cursor: 'pointer',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '9999px',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            title="Close pass"
          >
            <X style={{ width: '1.1rem', height: '1.1rem' }} />
          </button>
        </div>

        {/* Verification Status Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.25) 100%)',
            border: '1.5px solid rgba(52, 211, 153, 0.5)',
            borderRadius: '1rem',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.25rem',
            boxShadow: '0 0 25px rgba(52, 211, 153, 0.15)'
          }}
        >
          <div
            style={{
              width: '3.2rem',
              height: '3.2rem',
              borderRadius: '50%',
              background: 'rgba(52, 211, 153, 0.2)',
              border: '2px solid #34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <CheckCircle style={{ width: '1.9rem', height: '1.9rem', color: '#34d399' }} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
              <span style={{ fontSize: '10px', letterSpacing: '0.16em', color: '#34d399', fontWeight: 800, textTransform: 'uppercase' }}>
                GATEWAY CLEARANCE AUTHORIZED
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-orbitron)',
                fontSize: 'clamp(1.2rem, 2.5vw, 1.45rem)',
                color: '#ffffff',
                fontWeight: 800,
                margin: '0.15rem 0 0.2rem',
                letterSpacing: '0.04em'
              }}
            >
              REGISTRATION PASS VERIFIED
            </h2>
            <div style={{ fontSize: '11px', color: '#93c5fd', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span>ASTRION 2026</span>
              <span>•</span>
              <span>IIC VVITU OFFICIAL ENTRY</span>
            </div>
          </div>
        </div>

        {/* Pass ID & Flight Mode Bar */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '0.85rem',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              BOARDING PASS ID
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
              <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.05rem', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.05em' }}>
                {pass.id}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: copiedId ? '#34d399' : '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  transition: 'color 0.2s ease'
                }}
                title="Copy Pass ID"
              >
                {copiedId ? <Check style={{ width: '0.85rem', height: '0.85rem' }} /> : <Copy style={{ width: '0.85rem', height: '0.85rem' }} />}
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              background: isSquad ? 'rgba(251, 191, 36, 0.15)' : 'rgba(56, 189, 248, 0.15)',
              border: isSquad ? '1px solid rgba(251, 191, 36, 0.45)' : '1px solid rgba(56, 189, 248, 0.45)',
              color: isSquad ? '#fbbf24' : '#38bdf8',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            {isSquad ? <Users style={{ width: '0.9rem', height: '0.9rem' }} /> : <Rocket style={{ width: '0.9rem', height: '0.9rem' }} />}
            <span>{isSquad ? `SQUAD FLIGHT (${crewMembers.length + 1} CREW)` : 'SOLO EXPLORER'}</span>
          </div>
        </div>

        {/* Detailed Registration Dossier Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Card: Lead Commander Details */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '1rem',
              padding: '1.15rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <User style={{ width: '0.85rem', height: '0.85rem' }} />
              <span>COMMANDER / LEAD ASTRONAUT</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.65rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em' }}>
                {leadName}
              </span>
              {rollNumber && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '0.35rem'
                  }}
                >
                  PIN: {rollNumber}
                </span>
              )}
            </div>

            {(departmentName || yearName) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '11.5px', color: '#cbd5e1', marginTop: '0.35rem' }}>
                <GraduationCap style={{ width: '0.85rem', height: '0.85rem', color: '#94a3b8' }} />
                <span>{departmentName || 'General Dept'}{yearName ? ` • ${yearName}` : ''}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '12px', color: '#93c5fd', marginTop: '0.35rem' }}>
              <Building style={{ width: '0.85rem', height: '0.85rem', color: '#38bdf8', flexShrink: 0 }} />
              <span style={{ fontWeight: 600 }}>{collegeName}</span>
            </div>
          </div>

          {/* Card: Team / Squad & Crew Roster */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: isSquad ? '1px solid rgba(251, 191, 36, 0.35)' : '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '1rem',
              padding: '1.15rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isSquad ? '#fbbf24' : '#38bdf8', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                <Users style={{ width: '0.85rem', height: '0.85rem' }} />
                <span>{isSquad ? 'SQUAD & CREW ROSTER' : 'FLIGHT CONFIGURATION'}</span>
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: isSquad ? '#fef08a' : '#94a3b8' }}>
                {squadName}
              </span>
            </div>

            {isSquad && crewMembers.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                {/* Lead Pilot Entry */}
                <div
                  style={{
                    background: 'rgba(2, 6, 23, 0.7)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.55rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '9px', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                      CREW 01
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>
                      {leadName}
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Lead Pilot</span>
                </div>

                {/* Additional Crew Members */}
                {crewMembers.map((member, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(2, 6, 23, 0.7)',
                      border: '1px solid rgba(251, 191, 36, 0.2)',
                      borderRadius: '0.5rem',
                      padding: '0.55rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '9px', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' }}>
                        CREW 0{member.index}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>
                        {member.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#34d399', fontWeight: 600 }}>Confirmed</span>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(2, 6, 23, 0.6)',
                  border: '1px solid rgba(56, 189, 248, 0.15)',
                  borderRadius: '0.5rem',
                  padding: '0.65rem 0.85rem',
                  fontSize: '11.5px',
                  color: '#94a3b8'
                }}
              >
                Single-pilot solo flight clearance. No secondary crew members registered.
              </div>
            )}
          </div>

          {/* Card: Authorized Missions */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '1rem',
              padding: '1.15rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
              <Sparkles style={{ width: '0.85rem', height: '0.85rem', color: '#fbbf24' }} />
              <span>AUTHORIZED MISSIONS (PRE-REGISTERED)</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {missionsList.map((mTitle, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'rgba(10, 25, 47, 0.9)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: '0.5rem',
                    padding: '0.4rem 0.75rem',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: '#e2e8f0'
                  }}
                >
                  <span style={{ color: '#34d399', fontWeight: 900 }}>✓</span>
                  <span>{mTitle}</span>
                  <span style={{ fontSize: '9px', padding: '0.1rem 0.35rem', borderRadius: '3px', background: 'rgba(52, 211, 153, 0.18)', color: '#34d399' }}>
                    AUTHORIZED
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Security Footer */}
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#34d399', fontWeight: 700 }}>
              <ShieldCheck style={{ width: '0.9rem', height: '0.9rem' }} />
              <span>Authenticated by IIC VVITU Gateway Security</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
              <Calendar style={{ width: '0.8rem', height: '0.8rem', color: '#38bdf8' }} />
              <span>23 - 24 OCT 2026</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playUiBeep(1350, 0.05);
              onClose();
            }}
            className="btn-pill-cyan"
            style={{
              padding: '0.55rem 1.4rem',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span>Acknowledge Entry</span>
            <Rocket style={{ width: '0.85rem', height: '0.85rem' }} />
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
