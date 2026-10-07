import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  CalendarDays,
  X
} from 'lucide-react';
import { playUiBeep } from '../utils/audioEngine';

export default function EventModal({ event, onClose, onRegisterEvent }) {
  useEffect(() => {
    if (event) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [event]);

  if (!event) return null;

  return typeof document !== 'undefined' && createPortal(
    <div className="cosmic-modal-overlay" onClick={onClose}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '860px',
          background: 'rgba(3, 7, 18, 0.96)',
          border: '1px solid var(--border-cyan)',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(20px)'
        }}
        className="animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', minHeight: '440px' }}>

          {/* LEFT SIDE: EVENT SPECS (matching reference image) */}
          <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' }}>

            <div>
              {/* Back to Events Navigation */}
              <button
                onClick={() => {
                  playUiBeep(800, 0.04);
                  onClose();
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-space)', fontSize: '0.8rem', color: 'var(--text-slate)', marginBottom: '1.25rem', cursor: 'pointer' }}
              >
                <ArrowLeft style={{ width: '0.9rem', height: '0.9rem' }} />
                <span>Back to Events</span>
              </button>

              {/* Title & Subtitle */}
              <h2 className="ast-heading" style={{ fontSize: '2rem' }}>
                {event.title}
              </h2>
              <p className="ast-subheading">
                {event.tagline}
              </p>

              {/* Badges Row (Technical, Team Event, Pre-Registration) */}
              <div className="badges-row" style={{ marginTop: '0.75rem' }}>
                <span className="badge-tech-pill">
                  {event.category === 'technical' ? 'TECHNICAL' : 'NON-TECHNICAL'}
                </span>
                <span className="badge-tech-pill">
                  {event.teamSize?.includes('Solo') ? 'SOLO EVENT' : 'TEAM EVENT'}
                </span>
                <span className={event.regType === 'pre-registration' ? 'badge-prereg-pill' : 'badge-spot-pill'}>
                  {event.regType === 'pre-registration' ? 'PRE-REGISTRATION' : 'SPOT EVENT'}
                </span>
              </div>

              {/* Description */}
              <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-slate)', lineHeight: 1.6, fontWeight: 300 }}>
                {event.description}
              </p>
            </div>

            {/* Event Details Grid (matching reference image) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(56, 189, 248, 0.15)' }}>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '11px', fontFamily: 'var(--font-space)', color: 'var(--text-slate)' }}>
                  <Calendar style={{ width: '0.85rem', height: '0.85rem', color: 'var(--cyan-primary)' }} />
                  <span>Date</span>
                </div>
                <div style={{ fontFamily: 'var(--font-space)', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginTop: '0.2rem' }}>
                  {event.date || '15 Oct 2026'}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '11px', fontFamily: 'var(--font-space)', color: 'var(--text-slate)' }}>
                  <Clock style={{ width: '0.85rem', height: '0.85rem', color: 'var(--cyan-primary)' }} />
                  <span>Time</span>
                </div>
                <div style={{ fontFamily: 'var(--font-space)', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginTop: '0.2rem' }}>
                  {event.time || '10:00 AM'}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '11px', fontFamily: 'var(--font-space)', color: 'var(--text-slate)' }}>
                  <MapPin style={{ width: '0.85rem', height: '0.85rem', color: 'var(--cyan-primary)' }} />
                  <span>Venue</span>
                </div>
                <div style={{ fontFamily: 'var(--font-space)', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginTop: '0.2rem' }}>
                  {event.venue || 'CSE Block'}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '11px', fontFamily: 'var(--font-space)', color: 'var(--text-slate)' }}>
                  <Users style={{ width: '0.85rem', height: '0.85rem', color: 'var(--cyan-primary)' }} />
                  <span>Team Size</span>
                </div>
                <div style={{ fontFamily: 'var(--font-space)', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginTop: '0.2rem' }}>
                  {event.teamSize || '2 - 4'}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '11px', fontFamily: 'var(--font-space)', color: 'var(--text-slate)' }}>
                  <FileText style={{ width: '0.85rem', height: '0.85rem', color: 'var(--cyan-primary)' }} />
                  <span>Registration</span>
                </div>
                <div style={{ fontFamily: 'var(--font-space)', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginTop: '0.2rem' }}>
                  {event.regType === 'pre-registration' ? 'Pre-Registration' : 'Spot Walk-In'}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '11px', fontFamily: 'var(--font-space)', color: 'var(--text-slate)' }}>
                  <CalendarDays style={{ width: '0.85rem', height: '0.85rem', color: 'var(--cyan-primary)' }} />
                  <span>Closes</span>
                </div>
                <div style={{ fontFamily: 'var(--font-space)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--amber-primary)', marginTop: '0.2rem' }}>
                  {event.closes || '12 Oct 2026'}
                </div>
              </div>

              {event.prizePool && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '11px', fontFamily: 'var(--font-space)', color: 'var(--amber-primary)' }}>
                    <span>Prize Pool</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-space)', fontSize: '0.8rem', fontWeight: 700, color: '#fcd34d', marginTop: '0.2rem' }}>
                    {event.prizePool}
                  </div>
                </div>
              )}

            </div>

            {/* CTA Button */}
            <div style={{ paddingTop: '0.5rem' }}>
              <button
                onClick={() => {
                  playUiBeep(1300, 0.08);
                  onRegisterEvent(event.id);
                  onClose();
                }}
                className="btn-pill-cyan"
              >
                <span>Register Now</span>
                <span>→</span>
              </button>
            </div>

          </div>

          {/* RIGHT SIDE: ORBITAL WHEEL / PLANET VISUAL (matching reference image) */}
          <div style={{ position: 'relative', overflow: 'hidden', minHeight: '260px' }}>
            <img
              src={event.image || "/images/mission_station.jpg"}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(3, 7, 18, 0.95), transparent)', pointerEvents: 'none' }} />

            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '0.5rem',
                borderRadius: '9999px',
                background: 'rgba(2, 6, 23, 0.8)',
                border: '1px solid var(--border-cyan)',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X style={{ width: '1rem', height: '1rem' }} />
            </button>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}
