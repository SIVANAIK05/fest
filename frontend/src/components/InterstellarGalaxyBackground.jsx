import React, { useEffect, useRef, useState } from 'react';

/**
 * INTERSTELLAR GALAXY BACKGROUND (ACTIVE EVERYWHERE EXCEPT HERO)
 * 
 * - Cosmic spiral galaxy arms & relativistic accretion filaments
 * - Interstellar dust particles reacting to mouse and touch gravity
 * - Gravitational lensing shockwave ripples on click / touch
 * - Scroll-driven relativistic warp streaks
 * - Smooth fade-in past hero, 0% CPU/GPU overhead when viewing hero
 */
export default function InterstellarGalaxyBackground() {
  const canvasRef = useRef(null);
  const [opacity, setOpacity] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    isInteracting: false,
    radius: 180
  });

  const scrollRef = useRef({
    lastY: 0,
    velocity: 0,
    direction: 1
  });

  const shockwavesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
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

    // Mouse & Touch Gravity Tracker
    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      mouseRef.current.x = clientX;
      mouseRef.current.y = clientY;
      mouseRef.current.isInteracting = true;
    };

    const handlePointerLeave = () => {
      mouseRef.current.isInteracting = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    // Gravitational Shockwave Ripple on Click/Tap
    const handlePointerDown = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      shockwavesRef.current.push({
        x: clientX,
        y: clientY,
        radius: 10,
        maxRadius: Math.min(width, height) * 0.45,
        alpha: 0.65,
        speed: 8
      });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('touchend', handlePointerLeave);
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });

    // Scroll Velocity Tracker
    let scrollTimeout;
    const handleScroll = () => {
      const heroEl = document.getElementById('home');
      const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;

      const currentY = window.scrollY;
      const deltaY = currentY - scrollRef.current.lastY;

      scrollRef.current.direction = deltaY >= 0 ? 1 : -1;
      const speed = Math.abs(deltaY);
      scrollRef.current.velocity = Math.min(speed * 0.35, 30);
      scrollRef.current.lastY = currentY;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollRef.current.velocity = 0;
      }, 100);

      // Hero Separation: 100% disabled in Hero, fades in smoothly past Hero
      if (currentY > heroHeight * 0.45) {
        setIsVisible(true);
        const fade = Math.min((currentY - heroHeight * 0.45) / 250, 1);
        setOpacity(fade);
      } else {
        setOpacity(0);
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Generate Cosmic Spiral Galaxy Particles
    const particleCount = Math.min(Math.floor((width * height) / 8000), 180);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      // Logarithmic spiral distribution
      const armIndex = i % 4;
      const armAngle = (armIndex / 4) * Math.PI * 2;
      const distance = Math.pow(Math.random(), 0.8) * Math.min(width, height) * 0.65;
      const spiralTwist = distance * 0.003;

      const angle = armAngle + spiralTwist + (Math.random() - 0.5) * 0.45;
      const x = width / 2 + Math.cos(angle) * distance;
      const y = height / 2 + Math.sin(angle) * distance;

      const colorType = Math.random();
      let color = '#38bdf8'; // Cyan
      if (colorType > 0.65) color = '#fbbf24'; // Accretion Amber
      else if (colorType > 0.45) color = '#818cf8'; // Violet
      else if (colorType > 0.3) color = '#ffffff'; // Starlight white

      particles.push({
        baseX: x,
        baseY: y,
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        orbitAngle: angle,
        orbitDistance: distance,
        orbitSpeed: (0.0008 + (1 - distance / (width * 0.8)) * 0.0012) * (armIndex % 2 === 0 ? 1 : 1),
        radius: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.65 + 0.25,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        color: color
      });
    }

    // 60FPS Render Loop
    const render = () => {
      animId = requestAnimationFrame(render);

      if (!canvas) return;

      // When scrolled all the way up into Hero, skip heavy canvas draw
      if (scrollRef.current.lastY <= (document.getElementById('home')?.offsetHeight || 800) * 0.4) {
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const scrollVel = scrollRef.current.velocity;
      const scrollDir = scrollRef.current.direction;
      const centerX = width * 0.65; // Galaxy core aligned slightly right of center
      const centerY = height * 0.45;

      // 1. Draw Subtle Relativistic Accretion Nebulae Glows (Deep cosmic backdrop)
      const nebulaGrad = ctx.createRadialGradient(centerX, centerY, 40, centerX, centerY, Math.min(width, height) * 0.7);
      nebulaGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
      nebulaGrad.addColorStop(0.35, 'rgba(251, 191, 36, 0.05)');
      nebulaGrad.addColorStop(0.65, 'rgba(129, 140, 248, 0.03)');
      nebulaGrad.addColorStop(1, 'rgba(2, 4, 9, 0)');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Animate and Draw Gravitational Shockwaves
      for (let w = shockwavesRef.current.length - 1; w >= 0; w--) {
        const sw = shockwavesRef.current[w];
        sw.radius += sw.speed;
        sw.alpha -= 0.016;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(w, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${sw.alpha * 0.8})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 15;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius * 0.85, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(251, 191, 36, ${sw.alpha * 0.4})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // 3. Update & Draw Spiral Galaxy Particles with Relativistic Physics
      const m = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Cosmic rotation around galactic center
        p.orbitAngle += p.orbitSpeed;
        const targetX = centerX + Math.cos(p.orbitAngle) * p.orbitDistance;
        const targetY = centerY + Math.sin(p.orbitAngle) * (p.orbitDistance * 0.65); // Tilted perspective

        // Natural micro-drift
        p.baseX += (targetX - p.baseX) * 0.05 + p.vx;
        p.baseY += (targetY - p.baseY) * 0.05 + p.vy;

        p.x += (p.baseX - p.x) * 0.1;
        p.y += (p.baseY - p.y) * 0.1;

        // Twinkle pulse
        p.alpha += p.twinkleSpeed * p.twinkleDir;
        if (p.alpha > 0.85) {
          p.alpha = 0.85;
          p.twinkleDir = -1;
        } else if (p.alpha < 0.18) {
          p.alpha = 0.18;
          p.twinkleDir = 1;
        }

        // Interactive Mouse/Touch Gravity Well
        if (m.isInteracting) {
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < m.radius && dist > 5) {
            const pullForce = (m.radius - dist) / m.radius;
            // Gravitational attraction towards cursor
            p.x += (dx / dist) * pullForce * 4.5;
            p.y += (dy / dist) * pullForce * 4.5;
          }
        }

        // Shockwave displacement
        for (let w = 0; w < shockwavesRef.current.length; w++) {
          const sw = shockwavesRef.current[w];
          const distToWave = Math.hypot(p.x - sw.x, p.y - sw.y);
          if (Math.abs(distToWave - sw.radius) < 30) {
            const angleFromCenter = Math.atan2(p.y - sw.y, p.x - sw.x);
            p.x += Math.cos(angleFromCenter) * 3;
            p.y += Math.sin(angleFromCenter) * 3;
          }
        }

        // Relativistic Scroll Streaks
        const isStreaking = scrollVel > 1.4;
        const streakLength = scrollVel * 3.8;

        if (isStreaking && streakLength > 4) {
          ctx.save();
          ctx.beginPath();
          const startY = p.y;
          const endY = scrollDir > 0 ? p.y - streakLength : p.y + streakLength;

          const grad = ctx.createLinearGradient(p.x, startY, p.x, endY);
          grad.addColorStop(0, p.color);
          grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = Math.max(p.radius * 0.9, 1);
          ctx.lineCap = 'round';
          ctx.moveTo(p.x, startY);
          ctx.lineTo(p.x, endY);
          ctx.stroke();

          // Star head
          ctx.beginPath();
          ctx.arc(p.x, startY, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = Math.min(p.alpha + 0.25, 1);
          ctx.fill();
          ctx.restore();
        } else {
          // Ambient Glowing Particle
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.radius * 5;
          ctx.fill();
          ctx.restore();
        }

        // Micro Constellation Linkage between nearby galaxy particles
        if (scrollVel < 2) {
          for (let j = i + 1; j < Math.min(i + 5, particles.length); j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 45) {
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = '#38bdf8';
              ctx.globalAlpha = (1 - dist / 45) * 0.12;
              ctx.lineWidth = 0.6;
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('touchend', handlePointerLeave);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1, // Behind page content, above base black
        pointerEvents: 'none',
        opacity: opacity,
        transition: 'opacity 0.5s ease-out',
        display: isVisible || opacity > 0 ? 'block' : 'none'
      }}
      aria-hidden="true"
    />
  );
}
