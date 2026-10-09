import React, { useEffect, useRef } from 'react';
import { ShieldCheck, Radio, Disc, Sparkles, ArrowRight } from 'lucide-react';
import { playHydraulicDockSound, playUiBeep } from '../utils/audioEngine';

export default function SpaceBreachOverlay({ isActive = true, onComplete, onAnimationComplete }) {
  const finishCallback = onComplete || onAnimationComplete;
  const finishCallbackRef = useRef(finishCallback);
  finishCallbackRef.current = finishCallback;

  const hasTriggeredRef = useRef(false);

  const triggerCompletion = () => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    if (finishCallbackRef.current) {
      finishCallbackRef.current();
    }
  };

  useEffect(() => {
    if (!isActive) return;

    hasTriggeredRef.current = false;
    // Immediately play hydraulic docking hiss and mechanical clamp lock sound
    playHydraulicDockSound();

    // After viewing the aircraft touchdown & crew officer pass delivery, transition to pass modal
    const timer = setTimeout(() => {
      triggerCompletion();
    }, 2000);

    return () => clearTimeout(timer);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#02040a',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(1rem, 2.5vw, 2rem)',
        fontFamily: 'var(--font-space)',
        animation: 'fadeIn 0.3s ease-out forwards'
      }}
    >
      {/* Photorealistic Aircraft Shuttle & Crew Member Staff Background */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("/images/crew_shuttle_delivery.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.94) contrast(1.06)',
          transform: 'scale(1)',
          animation: 'scaleUp 2.4s ease-out forwards'
        }}
      />

      {/* Cinematic Vignette & Atmospheric Steam Fog Gradients */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(3, 7, 18, 0.15) 0%, rgba(2, 6, 23, 0.72) 70%, rgba(2, 4, 10, 0.95) 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* Top Aerospace Telemetry Banner */}
      <div 
        style={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(3, 7, 21, 0.9)',
          border: '1.5px solid rgba(56, 189, 248, 0.45)',
          borderRadius: '1rem',
          padding: '0.75rem 1.25rem',
          backdropFilter: 'blur(16px)',
          maxWidth: '840px',
          width: '100%',
          margin: '0 auto',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.85)'
        }}
        className="animate-fadeIn"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '9999px', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
          <div>
            <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '11px', color: '#ffffff', fontWeight: 800, letterSpacing: '0.08em' }}>
              AIRCRAFT TOUCHDOWN CONFIRMED // LAUNCHPAD A7
            </span>
            <div style={{ fontSize: '10px', color: '#38bdf8' }}>
              Shuttle "STARGAZER" engines vented • Docking clamps locked
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid #34d399', padding: '0.25rem 0.65rem', borderRadius: '0.5rem' }}>
          <ShieldCheck style={{ width: '0.9rem', height: '0.9rem', color: '#34d399' }} />
          <span style={{ fontSize: '10.5px', color: '#34d399', fontWeight: 700 }}>
            DISPATCH SUCCESSFUL
          </span>
        </div>
      </div>

      {/* Center Callout: Crew Member Staff Bringing The Pass */}
      <div 
        style={{
          position: 'relative',
          zIndex: 20,
          maxWidth: '680px',
          width: '100%',
          margin: 'auto',
          background: 'rgba(2, 6, 23, 0.88)',
          border: '2px solid rgba(56, 189, 248, 0.6)',
          borderRadius: '1.5rem',
          padding: '1.75rem 2rem',
          textAlign: 'center',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.95), 0 0 40px rgba(56, 189, 248, 0.3)'
        }}
        className="animate-scaleUp"
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--amber-primary)', background: 'rgba(251, 191, 36, 0.15)', border: '1px solid rgba(251, 191, 36, 0.35)', padding: '0.3rem 0.85rem', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, marginBottom: '0.65rem' }}>
          <Radio style={{ width: '0.85rem', height: '0.85rem' }} />
          <span>OFFICIAL CREW STAFF DISPATCH</span>
        </div>

        <h3 style={{ fontFamily: 'var(--font-orbitron)', fontSize: 'clamp(1.3rem, 3.2vw, 1.8rem)', color: '#ffffff', fontWeight: 900, letterSpacing: '0.04em', margin: '0.25rem 0' }}>
          CREW OFFICER DELIVERING ENTRY PASS
        </h3>

        <p style={{ fontSize: '12.5px', color: '#cbd5e1', maxWidth: '520px', margin: '0.4rem auto 1.1rem', lineHeight: '1.4' }}>
          Flight officer astronaut has stepped off the aircraft onto the runway, presenting your encrypted clearance entry pass tablet.
        </p>

        {/* Glowing Holographic Pass Handover Status */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.18)', border: '1.5px solid var(--cyan-primary)', padding: '0.55rem 1.4rem', borderRadius: '0.75rem', boxShadow: '0 0 30px rgba(56, 189, 248, 0.35)' }}>
          <Disc style={{ width: '1rem', height: '1rem', color: 'var(--cyan-primary)' }} className="animate-spin" />
          <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '11px', color: '#ffffff', fontWeight: 800, letterSpacing: '0.06em' }}>
            DECRYPTING ENTRY CREDENTIALS // EXPANDING HOLOGRAM...
          </span>
        </div>

        {/* Immediate Proceed Action */}
        <div style={{ marginTop: '1.1rem' }}>
          <button
            type="button"
            onClick={() => {
              playUiBeep(1300, 0.05);
              triggerCompletion();
            }}
            className="btn-pill-cyan"
            style={{
              padding: '0.65rem 1.75rem',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)'
            }}
          >
            <span>VIEW BOARDING PASS</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Bottom Terminal Footnote */}
      <div style={{ position: 'relative', zIndex: 20, textAlign: 'center', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
        ASTRION 2026 • INSTITUTION'S INNOVATION COUNCIL • VVIT UNIVERSITY
      </div>

    </div>
  );
}
