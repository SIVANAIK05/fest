import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Check,
  Download,
  Sparkles,
  Users,
  User,
  QrCode,
  X,
  FileCheck,
  Rocket,
  ShieldCheck,
  Cpu,
  Gamepad2,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Mail,
  Phone
} from 'lucide-react';
import { INSTITUTIONS_LIST } from '../data/eventsData';
import { MISSIONS_LIST } from './EventsSection';
import { playUiBeep, playWarpSound, playSpaceBreachSound } from '../utils/audioEngine';
import {
  buildQrPayload,
  generateQrCodeDataUrl,
  downloadAstrionPassImage
} from '../utils/passGenerator';
import SpaceBreachOverlay from './SpaceBreachOverlay';

export default function RegistrationModal({ isOpen, onClose, preselectedEventId }) {
  const backdropCanvasRef = useRef(null);

  // Form State (Clean empty initial values with intuitive placeholders)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    college: INSTITUTIONS_LIST[0],
    customCollege: '',
    pin: '',
    department: '',
    year: '1st Year',
    isSquad: false,
    teamName: '',
    teammates: [
      { name: '', email: '', mobile: '' }
    ],
    crewNames: '',
    selectedEvents: []
  });

  const [astrionId, setAstrionId] = useState('ASTR-26-8F42');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [isBreaching, setIsBreaching] = useState(false);

  // Active refs to ensure zero stale closures across asynchronous breach and download operations
  const activePassDataRef = useRef(null);
  const activeQrRef = useRef('');
  const activeIdRef = useRef('ASTR-26-8F42');

  // Continuous background cosmic starfield and stardust animation while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const canvas = backdropCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: width / 2, y: height / 2 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Dynamic cosmic stars (lightweight, zero-shadow, ultra high framerate)
    const starCount = Math.min(Math.floor((width * height) / 16000), 55);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.6,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: Math.random() * 0.3 + 0.1,
      alpha: Math.random() * 0.7 + 0.3,
      twinkle: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.5 ? '#38bdf8' : (Math.random() > 0.6 ? '#fbbf24' : '#e2e8f0')
    }));

    // Dynamic shooting stars / meteors
    const meteors = [];
    const spawnMeteor = () => {
      if (Math.random() > 0.985 && meteors.length < 2) {
        meteors.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.4),
          length: Math.random() * 80 + 35,
          speed: Math.random() * 10 + 8,
          angle: Math.PI / 4,
          alpha: 0.9
        });
      }
    };

    let time = 0;
    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Fast, lightweight stars with zero shadowBlur rasterization overhead
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.y += star.speedY;
        star.x += star.speedX;

        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;

        star.alpha += Math.sin(time * 2 + star.x) * star.twinkle;
        const currentAlpha = Math.max(0.2, Math.min(0.9, star.alpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fill();
      }

      // Meteors
      spawnMeteor();
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= 0.025;

        if (m.alpha <= 0 || m.x > width || m.y > height) {
          meteors.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(56, 189, 248, ${m.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(
          m.x - Math.cos(m.angle) * m.length,
          m.y - Math.sin(m.angle) * m.length
        );
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpen]);

  // Prevent background scrolling while Modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle preselected event from event card / briefing modal
  useEffect(() => {
    if (preselectedEventId) {
      setFormData(prev => ({
        ...prev,
        selectedEvents: prev.selectedEvents.includes(preselectedEventId)
          ? prev.selectedEvents
          : [...prev.selectedEvents, preselectedEventId]
      }));
    }
  }, [preselectedEventId]);

  // Generate QR Code payload
  useEffect(() => {
    const selectedMissions = MISSIONS_LIST.filter(m => formData.selectedEvents.includes(m.id));
    const coAstronautsText = formData.isSquad
      ? (formData.teammates && formData.teammates.length > 0
        ? formData.teammates
          .filter(t => t.name && t.name.trim())
          .map(t => `${t.name.trim()}${t.mobile ? ` (${t.mobile.trim()})` : ''}`)
          .join(', ') || 'Squad Flight'
        : (formData.crewNames || 'Squad Flight'))
      : 'Solo Explorer';

    const passFormData = {
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      institution: formData.college === 'Other Institution / University' ? formData.customCollege : formData.college,
      studentId: formData.pin,
      department: formData.department,
      yearOfStudy: formData.year,
      teamName: formData.isSquad ? (formData.teamName || 'Squad Flight') : 'Solo Explorer',
      coAstronauts: coAstronautsText
    };
    const payload = buildQrPayload({ astrionId, formData: passFormData, selectedMissions, format: 'url' });
    generateQrCodeDataUrl(payload).then(url => {
      if (url) setQrDataUrl(url);
    });
  }, [astrionId, formData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTeammateChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.teammates];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, teammates: updated };
    });
  };

  const handleAddTeammate = () => {
    playUiBeep(1250, 0.04);
    setFormData(prev => {
      if (prev.teammates.length >= 5) return prev;
      return {
        ...prev,
        teammates: [
          ...prev.teammates,
          { name: '', email: '', mobile: '' }
        ]
      };
    });
  };

  const handleRemoveTeammate = (index) => {
    playUiBeep(850, 0.04);
    setFormData(prev => {
      if (prev.teammates.length <= 1) return prev;
      return {
        ...prev,
        teammates: prev.teammates.filter((_, i) => i !== index)
      };
    });
  };

  const handleModeChange = (isSquadMode) => {
    playUiBeep(1200, 0.04);
    setFormData(prev => ({
      ...prev,
      isSquad: isSquadMode,
      teamName: isSquadMode && !prev.teamName ? 'Endurance Squadron' : prev.teamName,
      teammates: isSquadMode && (!prev.teammates || prev.teammates.length === 0)
        ? [
          { name: 'Murphy Cooper', email: 'murphy.cooper@vvit.net', mobile: '9876543211' },
          { name: 'Donald Brand', email: 'donald.brand@vvit.net', mobile: '9876543212' }
        ]
        : prev.teammates
    }));
  };

  const handleEventToggle = (id) => {
    playUiBeep(1100, 0.03);
    setFormData(prev => {
      const exists = prev.selectedEvents.includes(id);
      return {
        ...prev,
        selectedEvents: exists
          ? prev.selectedEvents.filter(x => x !== id)
          : [...prev.selectedEvents, id]
      };
    });
  };

  // SUBMIT HANDLER: Generate Pass, Pre-compile QR Code & Trigger Hyperspace Transition
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate new unique Pass ID
    const randomId = 'ASTR-26-' + Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    setAstrionId(randomId);
    activeIdRef.current = randomId;

    // Pre-generate QR Code data URL immediately so it's ready
    const selectedMissions = MISSIONS_LIST.filter(m => formData.selectedEvents.includes(m.id));
    const coAstronautsText = formData.isSquad
      ? (formData.teammates && formData.teammates.length > 0
        ? formData.teammates
          .filter(t => t.name && t.name.trim())
          .map(t => `${t.name.trim()}${t.mobile ? ` (${t.mobile.trim()})` : ''}`)
          .join(', ') || 'Squad Flight'
        : (formData.crewNames || 'Squad Flight'))
      : 'Solo Explorer';

    const passFormData = {
      fullName: formData.fullName || 'Lead Commander',
      email: formData.email || '',
      mobile: formData.mobile || '',
      institution: formData.college === 'Other Institution / University' ? (formData.customCollege || 'National University') : formData.college,
      studentId: formData.pin || 'ASTR-2026',
      department: formData.department || 'Aeronautics',
      yearOfStudy: formData.year || '1st Year',
      teamName: formData.isSquad ? (formData.teamName || 'Endurance Squadron') : 'Solo Flight',
      coAstronauts: coAstronautsText
    };

    activePassDataRef.current = {
      astrionId: randomId,
      formData: passFormData,
      selectedMissions
    };

    try {
      const payload = buildQrPayload({ astrionId: randomId, formData: passFormData, selectedMissions, format: 'url' });
      const freshQr = await generateQrCodeDataUrl(payload);
      if (freshQr) {
        setQrDataUrl(freshQr);
        activeQrRef.current = freshQr;
      }
    } catch (err) {
      console.error('Pre-generating QR error:', err);
    }

    // Play space breach sound (acceleration rumble + klaxon + sonic crash boom)
    playSpaceBreachSound();

    // Trigger full-screen cockpit transition sequence
    setIsBreaching(true);
  };

  const handleBreachComplete = async () => {
    setIsBreaching(false);
    setShowPassModal(true);

    const passData = activePassDataRef.current || {
      astrionId: activeIdRef.current || astrionId,
      formData: {
        fullName: formData.fullName || 'Lead Commander',
        email: formData.email || '',
        mobile: formData.mobile || '',
        institution: formData.college === 'Other Institution / University' ? (formData.customCollege || 'National University') : formData.college,
        studentId: formData.pin || 'ASTR-2026',
        department: formData.department || 'Aeronautics',
        yearOfStudy: formData.year || '1st Year',
        teamName: formData.isSquad ? (formData.teamName || 'Endurance Squadron') : 'Solo Flight',
        coAstronauts: formData.isSquad ? 'Squad Flight' : 'Solo Explorer'
      },
      selectedMissions: MISSIONS_LIST.filter(m => formData.selectedEvents.includes(m.id))
    };

    const targetId = activeIdRef.current || passData.astrionId || astrionId;

    // Ensure QR Code is available
    let currentQr = activeQrRef.current || qrDataUrl;
    if (!currentQr) {
      try {
        const payload = buildQrPayload({
          astrionId: targetId,
          formData: passData.formData,
          selectedMissions: passData.selectedMissions,
          format: 'url'
        });
        currentQr = await generateQrCodeDataUrl(payload);
        if (currentQr) {
          setQrDataUrl(currentQr);
          activeQrRef.current = currentQr;
        }
      } catch (err) {
        console.error('QR creation error in breach complete:', err);
      }
    }

    // Automatically download the flight pass PNG ticket directly to the user's computer!
    setIsDownloading(true);
    try {
      await downloadAstrionPassImage({
        astrionId: targetId,
        formData: passData.formData,
        selectedMissions: passData.selectedMissions,
        qrDataUrl: currentQr
      });
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 4000);
    } catch (err) {
      console.error('Auto pass download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownload = async () => {
    playUiBeep(1400, 0.08);
    setIsDownloading(true);

    const passData = activePassDataRef.current || {
      astrionId: activeIdRef.current || astrionId,
      formData: {
        fullName: formData.fullName || 'Lead Commander',
        email: formData.email || '',
        mobile: formData.mobile || '',
        institution: formData.college === 'Other Institution / University' ? (formData.customCollege || 'National University') : formData.college,
        studentId: formData.pin || 'ASTR-2026',
        department: formData.department || 'Aeronautics',
        yearOfStudy: formData.year || '1st Year',
        teamName: formData.isSquad ? (formData.teamName || 'Endurance Squadron') : 'Solo Flight',
        coAstronauts: formData.isSquad ? 'Squad Flight' : 'Solo Explorer'
      },
      selectedMissions: MISSIONS_LIST.filter(m => formData.selectedEvents.includes(m.id))
    };

    const targetId = activeIdRef.current || passData.astrionId || astrionId;
    const currentQr = activeQrRef.current || qrDataUrl;

    try {
      await downloadAstrionPassImage({
        astrionId: targetId,
        formData: passData.formData,
        selectedMissions: passData.selectedMissions,
        qrDataUrl: currentQr
      });
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 4000);
    } catch (err) {
      console.error('Manual pass download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const selectedMissionsList = MISSIONS_LIST.filter(m => formData.selectedEvents.includes(m.id));
  const technicalMissions = MISSIONS_LIST.filter(m => m.category === 'technical');
  const nonTechnicalMissions = MISSIONS_LIST.filter(m => m.category !== 'technical');

  const institutionDisplayName = formData.college === 'Other Institution / University'
    ? (formData.customCollege || 'Other College')
    : formData.college;

  if (!isOpen) return null;

  return typeof document !== 'undefined' && createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99990,
        background: 'radial-gradient(ellipse at center, rgba(10, 16, 34, 0.78) 0%, rgba(2, 4, 10, 0.90) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.75rem, 2vw, 1.5rem)',
        overflow: 'hidden'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isBreaching && !showPassModal) {
          playUiBeep(850, 0.03);
          onClose();
        }
      }}
    >
      {/* CONTINUOUS BACKGROUND COSMIC ANIMATION CANVAS */}
      <canvas
        ref={backdropCanvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          width: '100%',
          height: '100%'
        }}
      />

      {/* MODAL CONTAINER */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          background: 'linear-gradient(180deg, rgba(8, 14, 30, 0.97) 0%, rgba(2, 6, 23, 0.99) 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.45)',
          borderRadius: '1.75rem',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95), 0 0 35px rgba(56, 189, 248, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
          transform: 'translateZ(0)',
          contain: 'paint layout'
        }}
      >
        {/* SPACE TECH COMMAND COCKPIT BACKGROUND LAYER */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/images/spacetech_registration_bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            opacity: 0.22,
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* SPACE TECH TELEMETRY HUD GRID */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* SPACE TECH GRADIENT SHIELD (Ensures 100% high-contrast readability) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 15%, rgba(10, 18, 38, 0.85) 0%, rgba(2, 6, 23, 0.96) 75%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* TOP STATUS HEADER WITH CLOSE BUTTON */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
            padding: '1.25rem 1.75rem',
            background: 'rgba(3, 7, 18, 0.92)',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '9px', height: '9px', borderRadius: '9999px', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '13px', color: '#ffffff', fontWeight: 800, letterSpacing: '0.08em' }}>
                CREW REGISTRATION TERMINAL // POPUP CONSOLE
              </div>
              <div style={{ fontFamily: 'var(--font-space)', fontSize: '11px', color: 'var(--cyan-primary)' }}>
                ASTRION 2026 • IIC VVITU OFFICIAL ENTRY CLEARANCE
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="desktop-only-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '0.3rem 0.65rem', borderRadius: '9999px' }}>
              <ShieldCheck style={{ width: '0.85rem', height: '0.85rem', color: '#38bdf8' }} />
              <span style={{ fontFamily: 'var(--font-space)', fontSize: '10.5px', color: 'var(--cyan-primary)', fontWeight: 600 }}>
                VERIFIED PASS
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                playUiBeep(900, 0.04);
                onClose();
              }}
              style={{
                width: '2.2rem',
                height: '2.2rem',
                borderRadius: '9999px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              aria-label="Close Registration Terminal"
            >
              <X style={{ width: '1.1rem', height: '1.1rem' }} />
            </button>
          </div>
        </div>

        {/* SCROLLABLE FORM BODY - HARDWARE ACCELERATED & SMOOTH */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            padding: 'clamp(1.25rem, 3vw, 2.25rem)',
            overflowY: 'auto',
            flex: 1,
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            willChange: 'scroll-position',
            transform: 'translateZ(0)'
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem'
            }}
          >
            {/* ============================================================ */}
            {/* STEP 1: PARTICIPATION MODE (SOLO vs SQUAD)                   */}
            {/* ============================================================ */}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-space)', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
                1. Choose Expedition Flight Mode
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>

                {/* Solo Button */}
                <button
                  type="button"
                  onClick={() => handleModeChange(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.1rem 1.25rem',
                    borderRadius: '1rem',
                    background: !formData.isSquad
                      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(8, 14, 30, 0.85) 100%)'
                      : 'rgba(15, 23, 42, 0.6)',
                    border: !formData.isSquad
                      ? '1.5px solid rgba(255, 255, 255, 0.85)'
                      : '1px solid rgba(51, 65, 85, 0.6)',
                    boxShadow: !formData.isSquad ? '0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: !formData.isSquad ? 'rgba(255, 255, 255, 0.15)' : 'rgba(30, 41, 59, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User style={{ width: '1.4rem', height: '1.4rem', color: !formData.isSquad ? '#ffffff' : 'var(--text-slate)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                      Solo Astronaut
                    </div>
                    <div style={{ fontFamily: 'var(--font-space)', fontSize: '11px', color: 'var(--text-slate)', marginTop: '0.15rem' }}>
                      Individual participant entry pass
                    </div>
                  </div>
                  {!formData.isSquad && <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem', color: '#ffffff' }} />}
                </button>

                {/* Squad Button */}
                <button
                  type="button"
                  onClick={() => handleModeChange(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.1rem 1.25rem',
                    borderRadius: '1rem',
                    background: formData.isSquad
                      ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.16) 0%, rgba(8, 14, 30, 0.8) 100%)'
                      : 'rgba(15, 23, 42, 0.6)',
                    border: formData.isSquad
                      ? '1.5px solid var(--amber-primary)'
                      : '1px solid rgba(51, 65, 85, 0.6)',
                    boxShadow: formData.isSquad ? '0 0 20px rgba(251, 191, 36, 0.25)' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', background: formData.isSquad ? 'rgba(251, 191, 36, 0.25)' : 'rgba(30, 41, 59, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Users style={{ width: '1.4rem', height: '1.4rem', color: formData.isSquad ? 'var(--amber-primary)' : 'var(--text-slate)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                      Squadron / Team
                    </div>
                    <div style={{ fontFamily: 'var(--font-space)', fontSize: '11px', color: 'var(--text-slate)', marginTop: '0.15rem' }}>
                      Team Lead registers crew members
                    </div>
                  </div>
                  {formData.isSquad && <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem', color: 'var(--amber-primary)' }} />}
                </button>

              </div>
            </div>

            {/* ============================================================ */}
            {/* STEP 2: TEAM LEAD / ASTRONAUT CREDENTIALS                    */}
            {/* ============================================================ */}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-space)', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
                2. Team Lead / Lead Astronaut Details
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>

                {/* Full Name */}
                <div>
                  <label className="form-field-label">Lead Astronaut / Team Lead Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="reference-input"
                    required
                  />
                </div>

                {/* Lead Email */}
                <div>
                  <label className="form-field-label">Lead Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="reference-input"
                    required
                  />
                </div>

                {/* Lead Mobile */}
                <div>
                  <label className="form-field-label">Lead Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Enter 10-digit mobile number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="reference-input"
                    required
                  />
                </div>

                {/* Student PIN */}
                <div>
                  <label className="form-field-label">Student PIN / Roll No *</label>
                  <input
                    type="text"
                    name="pin"
                    placeholder="Enter roll number / PIN (e.g. 22VV1A0501)"
                    value={formData.pin}
                    onChange={handleInputChange}
                    className="reference-input"
                    required
                  />
                </div>

                {/* College Dropdown */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-field-label">College / University *</label>
                  <select
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    className="reference-input"
                    style={{ cursor: 'pointer' }}
                  >
                    {INSTITUTIONS_LIST.map((inst, idx) => (
                      <option key={idx} value={inst} style={{ background: '#020617', color: '#ffffff' }}>
                        {inst}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom College Input if 'Other' selected */}
                {formData.college === 'Other Institution / University' && (
                  <div style={{ gridColumn: '1 / -1' }} className="animate-fadeIn">
                    <label className="form-field-label" style={{ color: 'var(--amber-primary)' }}>Enter College Name *</label>
                    <input
                      type="text"
                      name="customCollege"
                      placeholder="Type your college or university name"
                      value={formData.customCollege}
                      onChange={handleInputChange}
                      className="reference-input"
                      required
                    />
                  </div>
                )}

                {/* Department */}
                <div>
                  <label className="form-field-label">Department / Branch *</label>
                  <input
                    type="text"
                    name="department"
                    placeholder="Enter department (e.g. CSE, AI, ECE)"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="reference-input"
                    required
                  />
                </div>

                {/* Year of Study */}
                <div>
                  <label className="form-field-label">Year of Study *</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="reference-input"
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="1st Year" style={{ background: '#020617' }}>1st Year</option>
                    <option value="2nd Year" style={{ background: '#020617' }}>2nd Year</option>
                    <option value="3rd Year" style={{ background: '#020617' }}>3rd Year</option>
                    <option value="4th Year" style={{ background: '#020617' }}>4th Year</option>
                    <option value="PG / Research Scholar" style={{ background: '#020617' }}>PG / Research Scholar</option>
                  </select>
                </div>

              </div>
            </div>

            {/* ============================================================ */}
            {/* STEP 3: SQUAD CREDENTIALS & TEAMMATES (BELOW TEAM LEAD)      */}
            {/* ============================================================ */}
            {formData.isSquad && (
              <div
                className="animate-fadeIn"
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)',
                  border: '1.5px solid rgba(251, 191, 36, 0.4)',
                  borderRadius: '1.25rem',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(251, 191, 36, 0.2)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users style={{ width: '1.1rem', height: '1.1rem', color: 'var(--amber-primary)' }} />
                    <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.9rem', color: '#ffffff', fontWeight: 700 }}>
                      SQUADRON MANIFEST & TEAMMATES REGISTRATION
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', color: 'var(--amber-primary)', background: 'rgba(251, 191, 36, 0.15)', padding: '0.2rem 0.65rem', borderRadius: '9999px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                    {formData.teammates.length} Teammates Registered
                  </span>
                </div>

                <div>
                  <label className="form-field-label" style={{ color: 'var(--amber-primary)' }}>Squadron / Team Name *</label>
                  <input
                    type="text"
                    name="teamName"
                    placeholder="Enter team name (e.g. Nova Squadron)"
                    value={formData.teamName}
                    onChange={handleInputChange}
                    className="reference-input"
                    required={formData.isSquad}
                  />
                </div>

                {/* Dynamic Teammates Registration Cards */}
                <div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontFamily: 'var(--font-space)', fontSize: '12px', fontWeight: 600, color: '#f1f5f9', letterSpacing: '0.04em' }}>
                      Teammates in Squad (Name, Email, Mobile No)
                    </div>
                    <p style={{ fontFamily: 'var(--font-space)', fontSize: '11px', color: 'var(--text-slate)', margin: '0.2rem 0 0 0' }}>
                      As Team Lead, register your teammates below. Each member will receive access credentials with your team flight pass.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {formData.teammates.map((teammate, idx) => (
                      <div
                        key={idx}
                        className="animate-fadeIn"
                        style={{
                          background: 'rgba(2, 6, 23, 0.65)',
                          border: '1px solid rgba(251, 191, 36, 0.25)',
                          borderRadius: '0.85rem',
                          padding: '1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-orbitron)', fontSize: '12px', fontWeight: 700, color: 'var(--amber-primary)' }}>
                            <User style={{ width: '0.85rem', height: '0.85rem' }} />
                            <span>Teammate #{idx + 1}</span>
                          </div>
                          {formData.teammates.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveTeammate(idx)}
                              style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.35)',
                                color: '#f87171',
                                borderRadius: '6px',
                                padding: '0.2rem 0.55rem',
                                fontSize: '10.5px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                fontFamily: 'var(--font-space)',
                                transition: 'all 0.15s ease'
                              }}
                              title="Remove this teammate"
                            >
                              <Trash2 style={{ width: '0.75rem', height: '0.75rem' }} />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                          {/* Teammate Name */}
                          <div>
                            <label className="form-field-label" style={{ fontSize: '10.5px' }}>Name *</label>
                            <input
                              type="text"
                              placeholder="Enter teammate name"
                              value={teammate.name}
                              onChange={(e) => handleTeammateChange(idx, 'name', e.target.value)}
                              className="reference-input"
                              required={formData.isSquad}
                            />
                          </div>

                          {/* Teammate Email */}
                          <div>
                            <label className="form-field-label" style={{ fontSize: '10.5px' }}>Email *</label>
                            <input
                              type="email"
                              placeholder="Enter teammate email"
                              value={teammate.email}
                              onChange={(e) => handleTeammateChange(idx, 'email', e.target.value)}
                              className="reference-input"
                              required={formData.isSquad}
                            />
                          </div>

                          {/* Teammate Mobile */}
                          <div>
                            <label className="form-field-label" style={{ fontSize: '10.5px' }}>Mobile No *</label>
                            <input
                              type="tel"
                              placeholder="Enter teammate mobile number"
                              value={teammate.mobile}
                              onChange={(e) => handleTeammateChange(idx, 'mobile', e.target.value)}
                              className="reference-input"
                              required={formData.isSquad}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Teammate Button */}
                    {formData.teammates.length < 5 && (
                      <button
                        type="button"
                        onClick={handleAddTeammate}
                        style={{
                          alignSelf: 'flex-start',
                          background: 'rgba(251, 191, 36, 0.12)',
                          border: '1px dashed rgba(251, 191, 36, 0.5)',
                          color: 'var(--amber-primary)',
                          borderRadius: '0.65rem',
                          padding: '0.55rem 1rem',
                          fontSize: '11.5px',
                          fontFamily: 'var(--font-space)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          transition: 'all 0.2s ease',
                          marginTop: '0.25rem'
                        }}
                      >
                        <Plus style={{ width: '0.85rem', height: '0.85rem' }} />
                        <span>+ Add Another Teammate ({formData.teammates.length}/5)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* STEP 4: EVENTS SELECTION (CATEGORIZED, SPACIOUS CHIPS)       */}
            {/* ============================================================ */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <label style={{ fontFamily: 'var(--font-space)', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  3. Select Events / Missions ({formData.selectedEvents.length} Selected)
                </label>

                <span style={{ fontFamily: 'var(--font-space)', fontSize: '11px', color: 'var(--cyan-primary)', background: 'rgba(56, 189, 248, 0.12)', padding: '0.2rem 0.65rem', borderRadius: '9999px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                  {formData.selectedEvents.length} Authorized
                </span>
              </div>

              {/* TECHNICAL MISSIONS */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem', color: '#93c5fd', fontSize: '12px', fontFamily: 'var(--font-space)', fontWeight: 600 }}>
                  <Cpu style={{ width: '0.9rem', height: '0.9rem', color: 'var(--cyan-primary)' }} />
                  <span>Technical Missions</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  {technicalMissions.map((m) => {
                    const isSelected = formData.selectedEvents.includes(m.id);
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => handleEventToggle(m.id)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          padding: '0.85rem 1rem',
                          borderRadius: '0.85rem',
                          background: isSelected
                            ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)'
                            : 'rgba(15, 23, 42, 0.65)',
                          border: isSelected
                            ? '1.5px solid var(--cyan-primary)'
                            : '1px solid rgba(51, 65, 85, 0.5)',
                          boxShadow: isSelected ? '0 0 15px rgba(56, 189, 248, 0.25)' : 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.35rem' }}>
                          <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                            {m.title}
                          </span>
                          {isSelected && <Check style={{ width: '1rem', height: '1rem', color: 'var(--cyan-primary)' }} />}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '0.25rem' }}>
                          <span style={{ fontSize: '9px', color: 'var(--cyan-primary)', fontFamily: 'var(--font-space)', fontWeight: 600 }}>
                            {m.day || 'Day 1 - 23'} • Team: {m.teamSize}
                          </span>
                          <span style={{ fontSize: '9px', padding: '0.15rem 0.45rem', borderRadius: '4px', background: m.regType === 'pre-registration' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(52, 211, 153, 0.2)', color: m.regType === 'pre-registration' ? '#fbbf24' : '#34d399', fontWeight: 600 }}>
                            {m.regType === 'pre-registration' ? 'PRE-REG' : 'SPOT'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* ============================================================ */}
            {/* STEP 5: SUBMIT & GENERATE FLIGHT PASS                        */}
            {/* ============================================================ */}
            <div style={{ borderTop: '1px solid rgba(56, 189, 248, 0.18)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '11px', color: 'var(--text-slate)', fontFamily: 'var(--font-space)' }}>
                <CheckCircle2 style={{ width: '0.9rem', height: '0.9rem', color: '#34d399' }} />
                <span>Instant QR pass generation with zero entry fee</span>
              </div>

              <button
                type="submit"
                className="btn-pill-cyan"
                style={{
                  padding: '0.85rem 2rem',
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <Rocket style={{ width: '1.1rem', height: '1.1rem', transform: 'rotate(45deg)' }} />
                <span>CONFIRM & GENERATE FLIGHT PASS</span>
                <span>→</span>
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* ================================================================ */}
      {/* FULLSCREEN SPACE BREACH & COCKPIT CRASH TRANSITION SEQUENCE      */}
      {/* ================================================================ */}
      {isBreaching && (
        <SpaceBreachOverlay
          isActive={isBreaching}
          onComplete={handleBreachComplete}
        />
      )}

      {/* ================================================================ */}
      {/* AUTHENTIC AIRLINE/SPACECRAFT FLIGHT BOARDING PASS MODAL          */}
      {/* ================================================================ */}
      {showPassModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99995,
            background: 'rgba(2, 4, 10, 0.94)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            overflowY: 'auto'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '860px',
              position: 'relative'
            }}
            className="animate-fadeIn"
          >
            {/* Top Pass Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '9999px', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
                <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: '12px', color: '#34d399', fontWeight: 700, letterSpacing: '0.1em' }}>
                  GATEWAY CLEARANCE GRANTED // OFFICIAL PASS ISSUED
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  playUiBeep(900, 0.04);
                  setShowPassModal(false);
                  onClose();
                }}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#cbd5e1',
                  borderRadius: '9999px',
                  padding: '0.35rem 0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '11px',
                  fontFamily: 'var(--font-space)'
                }}
              >
                <X style={{ width: '0.85rem', height: '0.85rem' }} />
                <span>Close Terminal</span>
              </button>
            </div>

            {/* HIGH-PRECISION SCI-FI BOARDING PASS TICKET */}
            <div className="flight-pass-ticket-container">

              {/* LEFT: MAIN PASS BODY */}
              <div className="flight-pass-main-body">
                <div>
                  {/* Pass Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-interstellar)', fontSize: '1.65rem', fontWeight: 900, letterSpacing: '0.18em', color: '#ffffff' }}>
                        ASTRION
                      </div>
                      <div style={{ fontFamily: 'var(--font-space)', fontSize: '10px', color: 'var(--cyan-primary)', fontWeight: 600, letterSpacing: '0.06em' }}>
                        INNOVATE BEYOND BOUNDARIES // OFFICIAL FLIGHT PASS
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>CLEARANCE</div>
                      <div style={{ fontSize: '11px', color: '#34d399', fontWeight: 700, fontFamily: 'var(--font-space)' }}>AUTHORIZED ENTRY</div>
                    </div>
                  </div>

                  {/* Pass Details Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        LEAD ASTRONAUT / PARTICIPANT
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                        {formData.fullName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--cyan-primary)', fontFamily: 'var(--font-space)' }}>
                        PIN: {formData.pin}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        INSTITUTION / UNIVERSITY
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.2rem' }}>
                        {institutionDisplayName}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        DEPARTMENT & YEAR
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '0.2rem' }}>
                        {formData.department} • {formData.year}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        SQUAD / CREW CALL-SIGN
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9', marginTop: '0.2rem' }}>
                        Squad: {formData.isSquad ? (formData.teamName || 'Endurance Squadron') : 'Solo Flight'}
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Co-Astronauts / Teammates */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      CREW MEMBERS / TEAMMATES
                    </div>
                    {formData.isSquad && formData.teammates && formData.teammates.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.35rem' }}>
                        {formData.teammates.map((t, idx) => (
                          <div key={idx} style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ color: '#ffffff', fontWeight: 600 }}>• {t.name || `Teammate ${idx + 1}`}</span>
                            {t.email && <span style={{ color: '#94a3b8', fontSize: '11px' }}>({t.email})</span>}
                            {t.mobile && <span style={{ color: 'var(--cyan-primary)', fontSize: '11px', fontFamily: 'var(--font-space)' }}>📱 {t.mobile}</span>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                        Solo Explorer (None specified)
                      </div>
                    )}
                  </div>

                  {/* Section 6: Authorized Missions */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      AUTHORIZED MISSIONS (PRE-REGISTRATION CLEARANCE)
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.35rem' }}>
                      {selectedMissionsList.length === 0 ? (
                        <span style={{ fontStyle: 'italic', fontSize: '11px', color: '#94a3b8' }}>
                          General Entry Pass (Spot events available at venue)
                        </span>
                      ) : (
                        <>
                          {selectedMissionsList.slice(0, 3).map((m) => (
                            <span
                              key={m.id}
                              style={{
                                background: '#0f172a',
                                border: '1px solid rgba(56, 189, 248, 0.4)',
                                color: '#38bdf8',
                                fontSize: '10.5px',
                                fontWeight: 700,
                                padding: '0.25rem 0.65rem',
                                borderRadius: '6px',
                                letterSpacing: '0.04em',
                                display: 'inline-flex',
                                alignItems: 'center'
                              }}
                            >
                              {m.title} [PRE-REG]
                            </span>
                          ))}
                          {selectedMissionsList.length > 3 && (
                            <span style={{ fontSize: '11px', color: '#94a3b8', alignSelf: 'center' }}>
                              +{selectedMissionsList.length - 3} more
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Verification Guarantee */}
                <div style={{ color: '#34d399', fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.4rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span>✓ VERIFIED FOR VENUE ENTRY • DATES: 23 - 24 OCT 2026 • VENUE: VVIT CAMPUS</span>
                </div>
              </div>

              {/* CENTER: PERFORATION DIVIDER WITH NOTCH CUTOUTS */}
              <div className="flight-pass-perforation">
                <div className="flight-pass-notch-top" />
                <div className="flight-pass-notch-bottom" />
              </div>

              {/* RIGHT: TEAR-OFF BOARDING STUB */}
              <div className="flight-pass-stub-body">
                <div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    BOARDING PASS ID
                  </div>
                  <div style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.45rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '0.06em', margin: '0.2rem 0' }}>
                    {activeIdRef.current || astrionId}
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#94a3b8', letterSpacing: '0.05em' }}>
                    SCAN AT VENUE GATEWAY
                  </div>
                </div>

                {/* Scannable High-Contrast QR Code Card */}
                <div
                  style={{
                    background: '#ffffff',
                    padding: '0.55rem',
                    borderRadius: '12px',
                    border: '1.5px solid rgba(56, 189, 248, 0.5)',
                    boxShadow: '0 0 25px rgba(56, 189, 248, 0.25)',
                    width: '160px',
                    height: '160px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0.4rem 0'
                  }}
                >
                  {(activeQrRef.current || qrDataUrl) ? (
                    <img
                      src={activeQrRef.current || qrDataUrl}
                      alt="Pass Verification QR Code"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#0f172a', fontSize: '10px' }}>
                      <QrCode style={{ width: '2rem', height: '2rem', margin: '0 auto', color: '#0284c7' }} />
                      <div style={{ marginTop: '0.25rem', fontWeight: 700 }}>SYNCHRONIZING...</div>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="btn-pill-cyan"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    fontWeight: 700
                  }}
                >
                  <Download style={{ width: '0.9rem', height: '0.9rem' }} />
                  <span>{isDownloading ? 'SAVING PASS...' : isDownloaded ? 'SAVED ✓' : 'DOWNLOAD PASS (PNG)'}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>,
    document.body
  );
}
