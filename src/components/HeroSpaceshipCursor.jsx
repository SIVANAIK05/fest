import React, { useEffect, useRef, useState } from 'react';

export default function HeroSpaceshipCursor({ containerRef = null }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  // Position, rotation, velocity refs for 60/120fps physics loop
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const velRef = useRef({ vx: 0, vy: 0, speed: 0 });
  const angleRef = useRef(0);
  const rollRef = useRef(0);
  const pitchRef = useRef(0);
  const flameScaleRef = useRef(1);

  const shipElRef = useRef(null);
  const flameElRef = useRef(null);
  const particlesRef = useRef([]);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const isInsideRef = useRef(false);

  const isGlobal = !containerRef;

  useEffect(() => {
    // Disable custom spaceship cursor on touch-only devices
    if (typeof window !== 'undefined') {
      const isTouchOnly = window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches;
      if (isTouchOnly) return;
    }

    const container = containerRef?.current;
    if (containerRef && !container) return;

    // Track mouse coordinates (relative to container if provided, otherwise viewport)
    const handleMouseMove = (e) => {
      let mouseX = e.clientX;
      let mouseY = e.clientY;

      if (container) {
        const rect = container.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      }

      targetRef.current = { x: mouseX, y: mouseY };

      if (!isInsideRef.current) {
        isInsideRef.current = true;
        setIsVisible(true);
        posRef.current = { x: mouseX, y: mouseY };
      }

      // Check if hovering clickable interactive element across the DOM
      const isClickable = e.target?.closest?.(
        'button, a, input, select, textarea, [role="button"], .clickable, .btn-pill-cyan, .event-hud-wrapper, .hero-title-letter, .filter-chip, [tabindex="0"], label'
      );
      setIsHoveringClickable(!!isClickable);
    };

    const handleMouseEnter = (e) => {
      let mouseX = e.clientX;
      let mouseY = e.clientY;

      if (container) {
        const rect = container.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      }

      targetRef.current = { x: mouseX, y: mouseY };
      posRef.current = { x: mouseX, y: mouseY };
      isInsideRef.current = true;
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      isInsideRef.current = false;
      setIsVisible(false);
    };

    const handleMouseDown = () => {
      setIsBoosting(true);
      // Spawn explosive burst of cyan plasma particles on click anywhere
      for (let i = 0; i < 14; i++) {
        const pAngle = Math.random() * Math.PI * 2;
        const pSpeed = Math.random() * 4.5 + 2.5;
        particlesRef.current.push({
          x: posRef.current.x,
          y: posRef.current.y,
          vx: Math.cos(pAngle) * pSpeed,
          vy: Math.sin(pAngle) * pSpeed,
          alpha: 1,
          size: Math.random() * 2.2 + 1.2,
          color: Math.random() > 0.35 ? '#38bdf8' : '#ffffff'
        });
      }
    };

    const handleMouseUp = () => {
      setIsBoosting(false);
    };

    const handleScroll = () => {
      if (targetRef.current.x > 0 && targetRef.current.y > 0) {
        const el = document.elementFromPoint(targetRef.current.x, targetRef.current.y);
        const isClickable = el?.closest?.(
          'button, a, input, select, textarea, [role="button"], .clickable, .btn-pill-cyan, .event-hud-wrapper, .hero-title-letter, .filter-chip, [tabindex="0"], label'
        );
        setIsHoveringClickable(!!isClickable);
      }
    };

    // Canvas resize
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      if (!canvas) return;
      if (container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();

    if (container) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('mousedown', handleMouseDown);
    } else {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });
      document.documentElement.addEventListener('mouseenter', handleMouseEnter);
      document.documentElement.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('blur', handleMouseLeave);
    }

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', resizeCanvas);

    // Ultra-Fast & Silky-Smooth Kinematics Loop
    let lastTime = performance.now();

    const animate = (time) => {
      const dtMs = time - lastTime;
      lastTime = time;
      // Normalize dt to 60fps (dtFactor ~ 1.0 at 60fps, 0.5 at 120fps)
      const dtFactor = Math.min(Math.max(dtMs / 16.667, 0.2), 3.0);

      const dx = targetRef.current.x - posRef.current.x;
      const dy = targetRef.current.y - posRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // ADAPTIVE HIGH-SPEED LERP
      // Snappy when moving fast, silky deceleration when slowing down
      const baseLerp = 0.32;
      const speedBoostLerp = Math.min(0.20, dist * 0.0015);
      const lerpAmount = Math.min(0.55, (baseLerp + speedBoostLerp) * dtFactor);

      if (dist < 0.25) {
        posRef.current.x = targetRef.current.x;
        posRef.current.y = targetRef.current.y;
      } else {
        posRef.current.x += dx * lerpAmount;
        posRef.current.y += dy * lerpAmount;
      }

      const currentSpeed = dist;
      velRef.current = { vx: dx, vy: dy, speed: currentSpeed };

      // DIRECTIONAL HEADING ROTATION (Fast & Jitter-Free)
      if (currentSpeed > 2.2) {
        // Compute target angle (SVG nose points North / 0 deg)
        let targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

        // Shortest arc calculation (-180 to +180)
        let diff = (targetAngle - angleRef.current) % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        // Snappy heading rotation with smooth slerp
        const turnSpeed = Math.min(0.35 * dtFactor, 0.85);
        angleRef.current += diff * turnSpeed;

        // 3D AERODYNAMIC BANKING ROLL (-32 to +32 deg)
        const targetRoll = Math.max(-32, Math.min(32, dx * 0.85));
        rollRef.current += (targetRoll - rollRef.current) * (0.22 * dtFactor);

        // Subtle 3D forward pitch
        const targetPitch = Math.min(18, currentSpeed * 0.4);
        pitchRef.current += (targetPitch - pitchRef.current) * (0.2 * dtFactor);
      } else {
        // Smooth return to upright orientation when hovering
        const idleWobble = Math.sin(time * 0.0025) * 3;
        let diff = (idleWobble - angleRef.current) % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        angleRef.current += diff * (0.08 * dtFactor);

        rollRef.current += (0 - rollRef.current) * (0.15 * dtFactor);
        pitchRef.current += (0 - pitchRef.current) * (0.15 * dtFactor);
      }

      // DYNAMIC ENGINE FLAME SCALE
      const targetFlame = isBoosting
        ? 2.2
        : Math.min(2.0, 0.85 + currentSpeed * 0.06);
      flameScaleRef.current += (targetFlame - flameScaleRef.current) * (0.3 * dtFactor);

      // DIRECT GPU HARDWARE TRANSFORM
      if (shipElRef.current) {
        const x = posRef.current.x.toFixed(2);
        const y = posRef.current.y.toFixed(2);
        const rot = angleRef.current.toFixed(2);
        const roll = rollRef.current.toFixed(2);
        const pitch = pitchRef.current.toFixed(2);
        const scale = (isBoosting ? 1.15 : isHoveringClickable ? 1.08 : 1.0).toFixed(2);

        shipElRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -30%) rotate(${rot}deg) rotateY(${roll}deg) rotateX(${pitch}deg) scale(${scale})`;
      }

      // Update engine flame element directly
      if (flameElRef.current) {
        const fScale = flameScaleRef.current.toFixed(2);
        flameElRef.current.style.transform = `scaleY(${fScale})`;
      }

      // REAL-TIME PARTICLES ENGINE TRAIL
      if (canvas && (isInsideRef.current || particlesRef.current.length > 0)) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Spawn thruster particles
        if (isInsideRef.current && (currentSpeed > 1.8 || isBoosting)) {
          const spawnCount = isBoosting ? 3 : currentSpeed > 7 ? 2 : 1;
          const rad = (angleRef.current - 90) * (Math.PI / 180);
          const tailDist = 15;
          const tailX = posRef.current.x - Math.cos(rad) * tailDist;
          const tailY = posRef.current.y - Math.sin(rad) * tailDist;

          for (let i = 0; i < spawnCount; i++) {
            const spread = (Math.random() - 0.5) * 3;
            particlesRef.current.push({
              x: tailX + Math.sin(rad) * spread,
              y: tailY - Math.cos(rad) * spread,
              vx: -Math.cos(rad) * (Math.random() * 2 + 1.2) + (Math.random() - 0.5) * 1.2,
              vy: -Math.sin(rad) * (Math.random() * 2 + 1.2) + (Math.random() - 0.5) * 1.2,
              alpha: Math.random() * 0.5 + 0.5,
              size: Math.random() * 1.6 + 0.8,
              color: Math.random() > 0.35 ? '#38bdf8' : '#ffffff'
            });
          }
        }

        // Render and advance particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx * dtFactor;
          p.y += p.vy * dtFactor;
          p.alpha -= (0.03 * dtFactor);
          p.size *= Math.pow(0.96, dtFactor);

          if (p.alpha <= 0 || p.size < 0.25) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#38bdf8';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('mousedown', handleMouseDown);
      } else {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
        document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
        document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('blur', handleMouseLeave);
      }
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', resizeCanvas);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef, isBoosting, isHoveringClickable]);

  return (
    <>
      {/* BACKGROUND PARTICLE EXHAUST CANVAS */}
      <canvas
        ref={canvasRef}
        style={{
          position: isGlobal ? 'fixed' : 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: isGlobal ? 9998 : 40,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.25s ease'
        }}
      />

      {/* AEROSPACE SPACESHIP CURSOR VESSEL */}
      <div
        ref={shipElRef}
        style={{
          position: isGlobal ? 'fixed' : 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: isGlobal ? 9999 : 50,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s ease',
          filter: isBoosting
            ? 'drop-shadow(0 0 25px rgba(56, 189, 248, 0.95)) drop-shadow(0 0 10px #ffffff)'
            : isHoveringClickable
              ? 'drop-shadow(0 0 18px rgba(56, 189, 248, 0.8))'
              : 'drop-shadow(0 4px 14px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 12px rgba(56, 189, 248, 0.35))',
          willChange: 'transform'
        }}
      >
        {/* PRECISION TARGETING HUD WHEN HOVERING INTERACTIVE BUTTONS & CARDS */}
        {isHoveringClickable && (
          <>
            {/* Outer Rotating Tactical Reticle Ring */}
            <div
              style={{
                position: 'absolute',
                top: '30%',
                left: '50%',
                width: '46px',
                height: '46px',
                transform: 'translate(-50%, -50%)',
                border: '1.5px dashed rgba(56, 189, 248, 0.85)',
                borderRadius: '9999px',
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.5), inset 0 0 10px rgba(56, 189, 248, 0.2)',
                animation: 'spinSlow 5s linear infinite',
                pointerEvents: 'none'
              }}
            />
            {/* Inner Precision Crosshair Laser Pulse */}
            <div
              style={{
                position: 'absolute',
                top: '30%',
                left: '50%',
                width: '16px',
                height: '16px',
                transform: 'translate(-50%, -50%)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                borderRadius: '9999px',
                pointerEvents: 'none'
              }}
            />
          </>
        )}

        {/* VECTOR HIGH-PRECISION DELTA SPACECRAFT */}
        <svg
          viewBox="0 0 120 180"
          width="26"
          height="39"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            {/* Matte Titanium Hull */}
            <linearGradient id="cursorHull" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="25%" stopColor="#334155" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="75%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Wing Composite Armor */}
            <linearGradient id="cursorWing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="45%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Tinted Cockpit Glass */}
            <linearGradient id="cursorCanopy" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="35%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* High-Velocity Thruster Plasma */}
            <linearGradient id="cursorPlasma" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#38bdf8" />
              <stop offset="65%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            {/* Boost Flame */}
            <linearGradient id="cursorBoostPlasma" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="20%" stopColor="#67e8f9" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="85%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* DELTA WINGS */}
          <polygon
            points="60,18 108,124 92,135 60,120 28,135 12,124"
            fill="url(#cursorWing)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.2"
          />

          {/* Wing Leading Edges & Trim */}
          <line x1="60" y1="18" x2="108" y2="124" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="60" y1="18" x2="12" y2="124" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Wing RCS Pods */}
          <rect x="18" y="112" width="6" height="12" rx="1" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.8" />
          <rect x="96" y="112" width="6" height="12" rx="1" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.8" />

          {/* MAIN FUSELAGE / ARMOR */}
          <path
            d="M 60,6 C 66,22 74,65 72,126 L 48,126 C 46,65 54,22 60,6 Z"
            fill="url(#cursorHull)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.2"
          />

          {/* Heat-Shield Nosecone */}
          <path
            d="M 60,6 C 62,12 64,22 64,26 L 56,26 C 56,22 58,12 60,6 Z"
            fill="#090d16"
            stroke="#64748b"
            strokeWidth="1"
          />

          {/* COCKPIT CANOPY */}
          <path
            d="M 60,34 C 64,42 65,60 64,70 L 56,70 C 55,60 56,42 60,34 Z"
            fill="url(#cursorCanopy)"
            opacity="0.95"
          />
          <path d="M 58,38 Q 61,46 60,56" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.9" />

          {/* STABILIZER FINS */}
          <polygon points="40,88 35,125 43,125" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
          <polygon points="80,88 85,125 77,125" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />

          {/* TWIN ENGINE NOZZLES */}
          <rect x="50" y="126" width="7" height="6" rx="1.5" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
          <rect x="63" y="126" width="7" height="6" rx="1.5" fill="#0f172a" stroke="#64748b" strokeWidth="1" />

          {/* DYNAMIC REACTIVE ENGINE THRUSTER JETS (anchored at nozzles) */}
          <g ref={flameElRef} style={{ transformOrigin: '60px 132px' }}>
            {isBoosting ? (
              /* HYPER BOOST THRUSTER JETS */
              <g>
                <polygon points="50,132 53.5,215 57,132" fill="url(#cursorBoostPlasma)" opacity="0.95" />
                <polygon points="63,132 66.5,215 70,132" fill="url(#cursorBoostPlasma)" opacity="0.95" />
                <ellipse cx="60" cy="135" rx="16" ry="6" fill="#ffffff" opacity="0.95" />
                <ellipse cx="60" cy="142" rx="22" ry="10" fill="#38bdf8" opacity="0.75" />
              </g>
            ) : (
              /* NORMAL ION CRUISE / FLAME */
              <g>
                <polygon points="51,132 53.5,160 56,132" fill="url(#cursorPlasma)" opacity="0.9" />
                <polygon points="64,132 66.5,160 69,132" fill="url(#cursorPlasma)" opacity="0.9" />
                <circle cx="53.5" cy="133" r="2.5" fill="#ffffff" opacity="0.95" />
                <circle cx="66.5" cy="133" r="2.5" fill="#ffffff" opacity="0.95" />
              </g>
            )}
          </g>
        </svg>
      </div>
    </>
  );
}
