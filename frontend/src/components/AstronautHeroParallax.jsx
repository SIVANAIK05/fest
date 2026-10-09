import React, { useState, useEffect, useRef } from 'react';

export default function AstronautHeroParallax({ children }) {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [transparentAstronautSrc, setTransparentAstronautSrc] = useState(null);
  const containerRef = useRef(null);

  // 1. Parallax Scroll Tracker
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Mouse 3D Depth Tracker
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3. Client-Side Precise Alpha-Keying for Astronaut Cutout
  useEffect(() => {
    const img = new Image();
    img.src = '/images/astronaut_parallax.jpg';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Smoothly key out pure black background with soft edge feathering
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = (r + g + b) / 3;

          if (brightness < 12) {
            data[i + 3] = 0; // Pure transparent
          } else if (brightness < 32) {
            data[i + 3] = Math.round(((brightness - 12) / 20) * 255); // Soft feathered edge
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setTransparentAstronautSrc(canvas.toDataURL('image/png'));
      } catch (err) {
        // Fallback to direct asset with CSS mix-blend-mode
        setTransparentAstronautSrc('/images/astronaut_parallax.jpg');
      }
    };
    img.onerror = () => {
      setTransparentAstronautSrc('/images/astronaut_parallax.jpg');
    };
  }, []);

  // Parallax calculations
  const astronautScrollOffset = Math.min(scrollY * 0.72, 600); // Moves from bottom to up as user scrolls
  const astronautTilt = Math.min(scrollY * 0.015, 6); // Subtle dynamic tilt during ascent
  const bgScrollOffset = scrollY * 0.18; // Deep space background moves slower

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* ============================================================ */}
      {/* LAYER 1: DEEP SPACE GARGANTUA & CRAGGY HORIZON               */}
      {/* ============================================================ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(to bottom, rgba(2, 4, 9, 0.35) 0%, rgba(2, 4, 9, 0.15) 55%, rgba(2, 4, 9, 0.95) 100%), url('/images/hero_gargantua_bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: `calc(50% + ${mousePos.x * 6}px) calc(50% + ${mousePos.y * 4}px)`,
          transform: `translate3d(0, ${bgScrollOffset}px, 0) scale(1.04)`,
          transformOrigin: 'center center',
          transition: 'transform 0.08s linear',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* ============================================================ */}
      {/* LAYER 2: INTERSTELLAR COSMIC DUST & ATMOSPHERIC HAZE         */}
      {/* ============================================================ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 75% 25%, rgba(251, 191, 36, 0.08) 0%, transparent 60%)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* Floating micro stardust particles in foreground */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to top, rgba(2, 4, 9, 0.8) 0%, transparent 100%)',
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />

      {/* ============================================================ */}
      {/* LAYER 3: FOREGROUND REALISTIC ASTRONAUT (SCROLLS BOTTOM->UP) */}
      {/* ============================================================ */}
      <div
        style={{
          position: 'absolute',
          left: 'max(2vw, 24px)',
          bottom: '-15px',
          width: 'clamp(300px, 34vw, 520px)',
          height: 'auto',
          zIndex: 5,
          pointerEvents: 'none',
          transform: `translate3d(${mousePos.x * -12}px, calc(-${astronautScrollOffset}px + ${mousePos.y * -8}px), 0) rotate(${astronautTilt}deg)`,
          transition: 'transform 0.08s ease-out',
          filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.9))'
        }}
        className="astronaut-weightless-idle"
      >
        <img
          src={transparentAstronautSrc || '/images/astronaut_parallax.jpg'}
          alt="Interstellar Exploration Astronaut"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            // mix-blend-mode: screen guarantees seamless black removal if raw jpg is active
            mixBlendMode: transparentAstronautSrc?.startsWith('data:') ? 'normal' : 'screen',
            objectFit: 'contain'
          }}
        />

        {/* Dynamic Life-Support Tether Cable Line */}
        <div
          style={{
            position: 'absolute',
            bottom: '22%',
            left: '12%',
            width: '2px',
            height: '140px',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(148, 163, 184, 0.15), transparent)',
            transform: `rotate(${18 + scrollY * 0.02}deg)`,
            transformOrigin: 'top left',
            opacity: 0.7,
            filter: 'blur(0.5px)',
            transition: 'transform 0.15s ease-out'
          }}
        />

        {/* Visor Cosmic Reflection Glint */}
        <div
          style={{
            position: 'absolute',
            top: '16%',
            left: '42%',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(251, 191, 36, 0.3) 50%, transparent 80%)',
            opacity: 0.75,
            filter: 'blur(1px)',
            animation: 'visorReflectionPulse 4s ease-in-out infinite'
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* LAYER 4: HERO CONTENT & UI (TITLE, DATE, ENTER BUTTON)       */}
      {/* ============================================================ */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
        {children}
      </div>

    </div>
  );
}
