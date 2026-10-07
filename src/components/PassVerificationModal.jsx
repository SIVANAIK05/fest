import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, CheckCircle, X, Users, Sparkles } from 'lucide-react';
import { playUiBeep } from '../utils/audioEngine';

export default function PassVerificationModal({ pass, onClose }) {
  useEffect(() => {
    if (pass) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [pass]);

  if (!pass) return null;

  return typeof document !== 'undefined' && createPortal(
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(2, 4, 9, 0.94)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '540px',
          background: 'radial-gradient(ellipse at top, rgba(8, 51, 68, 0.5) 0%, rgba(3, 7, 21, 0.98) 70%)',
          border: '1.5px solid rgba(56, 189, 248, 0.5)',
          borderRadius: '1.5rem',
          padding: '2rem',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 40px rgba(56, 189, 248, 0.25)',
          position: 'relative',
          fontFamily: 'var(--font-space)'
        }}
      >
        {/* Close button */}
        <button
          onClick={() => {
            playUiBeep(900, 0.03);
            onClose();
          }}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: 'var(--text-slate)',
            cursor: 'pointer',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-cyan)',
            borderRadius: '9999px',
            padding: '0.35rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X style={{ width: '1.1rem', height: '1.1rem' }} />
        </button>

        {/* Verification Status Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '3.2rem', height: '3.2rem', borderRadius: '9999px', background: 'rgba(52, 211, 153, 0.15)', border: '2px solid #34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircle style={{ width: '1.8rem', height: '1.8rem', color: '#34d399' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '9999px', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
              <span style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#34d399', fontWeight: 700, textTransform: 'uppercase' }}>
                GATEWAY CLEARANCE AUTHORIZED
              </span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.35rem', color: '#ffffff', fontWeight: 800, margin: '0.15rem 0' }}>
              PASS VERIFIED
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--cyan-primary)' }}>
              ASTRION 2026 • IIC VVITU OFFICIAL ENTRY
            </span>
          </div>
        </div>

        {/* Verified Data Grid */}
        <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '1rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(56, 189, 248, 0.15)', paddingBottom: '0.65rem' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PASS ID:</span>
            <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '13px', color: 'var(--cyan-primary)', fontWeight: 700 }}>
              {pass.id}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>LEAD ASTRONAUT</div>
            <div style={{ fontSize: '15px', color: '#ffffff', fontWeight: 700, marginTop: '0.15rem' }}>
              {pass.name}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>INSTITUTION / UNIVERSITY</div>
            <div style={{ fontSize: '13px', color: 'var(--cyan-primary)', fontWeight: 600, marginTop: '0.15rem' }}>
              {pass.college}
            </div>
          </div>

          <div style={{ background: 'rgba(2, 6, 23, 0.8)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(251, 191, 36, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--amber-primary)', fontSize: '11.5px', fontWeight: 700 }}>
              <Users style={{ width: '0.9rem', height: '0.9rem' }} />
              <span>Squad: {pass.squad}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '0.25rem' }}>
              Crew Members: {pass.crew}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>AUTHORIZED MISSIONS</div>
            <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 600, marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles style={{ width: '0.85rem', height: '0.85rem', color: 'var(--amber-primary)' }} />
              <span>{pass.events}</span>
            </div>
          </div>

        </div>

        {/* Footer Authority Stamp */}
        <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck style={{ width: '0.9rem', height: '0.9rem', color: '#34d399' }} />
            <span>Authenticated by IIC VVITU Gateway Security</span>
          </div>
          <button
            onClick={onClose}
            className="btn-pill-cyan"
            style={{ fontSize: '11px', padding: '0.4rem 1rem' }}
          >
            Acknowledge Entry
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
