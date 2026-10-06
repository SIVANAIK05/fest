import React, { useEffect, useRef } from 'react';

export default function CosmicParticleField({ isWarping }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 150 });
  const scrollRef = useRef({
    lastY: 0,
    velocity: 0,
    targetVelocity: 0,
    direction: 1
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Track scroll velocity for relativistic warp trails
    let scrollTimeout;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - scrollRef.current.lastY;
      
      scrollRef.current.direction = deltaY >= 0 ? 1 : -1;
      const speed = Math.abs(deltaY);
      scrollRef.current.targetVelocity = Math.min(speed * 0.45, 35);
      scrollRef.current.lastY = currentY;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollRef.current.targetVelocity = 0;
      }, 90);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Multi-depth Interstellar Starfield (3 layers for 3D relativistic parallax)
    const particleCount = Math.min(Math.floor((width * height) / 9500), 160);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const depth = Math.random(); // 0 = distant background, 1 = close foreground
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        depth: depth,
        radius: depth > 0.8 ? Math.random() * 2.2 + 1.2 : Math.random() * 1.2 + 0.4,
        baseSpeed: (depth * 0.8 + 0.2),
        vx: (Math.random() - 0.5) * 0.2,
        vy: depth * 0.4 + 0.1,
        alpha: depth > 0.7 ? Math.random() * 0.8 + 0.3 : Math.random() * 0.4 + 0.15,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        color: depth > 0.7 
          ? (Math.random() > 0.4 ? '#38bdf8' : (Math.random() > 0.5 ? '#f59e0b' : '#ffffff')) 
          : '#93c5fd'
      });
    }

    // Shooting stars
    const shootingStars = [];
    const createShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * (height * 0.35),
        len: Math.random() * 120 + 70,
        speed: Math.random() * 16 + 12,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        alpha: 1
      });
    };

    let shootingStarTimer = 0;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate scroll velocity (spring physics)
      scrollRef.current.velocity += (scrollRef.current.targetVelocity - scrollRef.current.velocity) * 0.12;
      const currentScrollVel = scrollRef.current.velocity;
      const scrollDir = scrollRef.current.direction;

      // Random shooting stars occasionally
      shootingStarTimer++;
      if (shootingStarTimer % 220 === 0 && Math.random() > 0.3) {
        createShootingStar();
      }

      // Draw and update shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.alpha -= 0.018;

        if (star.alpha <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = star.x - Math.cos(star.angle) * star.len;
        const tailY = star.y - Math.sin(star.angle) * star.len;

        const grad = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${star.alpha})`);
        grad.addColorStop(0.3, `rgba(56, 189, 248, ${star.alpha * 0.9})`);
        grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      // Draw and update relativistic particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Twinkle
        p.alpha += p.twinkleSpeed * p.twinkleDir;
        if (p.alpha > 0.95) {
          p.alpha = 0.95;
          p.twinkleDir = -1;
        } else if (p.alpha < 0.15) {
          p.alpha = 0.15;
          p.twinkleDir = 1;
        }

        // Relativistic movement based on depth & scroll velocity
        const effectiveSpeed = p.baseSpeed * (1 + currentScrollVel * p.depth * 1.4);
        
        if (isWarping) {
          p.y += (p.vy + 18) * p.depth;
        } else {
          p.x += p.vx;
          p.y += effectiveSpeed * scrollDir;
        }

        // Screen wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse gravity interaction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRef.current.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouseRef.current.radius - dist) / mouseRef.current.radius;
          p.x -= Math.cos(angle) * force * 1.5;
          p.y -= Math.sin(angle) * force * 1.5;
        }

        // Draw particle: either circular star or relativistic warp streak
        const isStreaking = currentScrollVel > 1.2 || isWarping;
        const streakLength = isWarping 
          ? p.depth * 65 + 20 
          : (currentScrollVel * p.depth * 4.5);

        if (isStreaking && streakLength > 3) {
          // Relativistic warp streak trail
          ctx.save();
          ctx.beginPath();
          const startY = p.y;
          const endY = scrollDir > 0 ? p.y - streakLength : p.y + streakLength;

          const streakGrad = ctx.createLinearGradient(p.x, startY, p.x, endY);
          streakGrad.addColorStop(0, p.color);
          streakGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

          ctx.strokeStyle = streakGrad;
          ctx.lineWidth = Math.max(p.radius * 0.8, 1);
          ctx.lineCap = 'round';
          ctx.moveTo(p.x, startY);
          ctx.lineTo(p.x, endY);
          ctx.stroke();

          // Star head glow
          ctx.beginPath();
          ctx.arc(p.x, startY, p.radius * 0.9, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = Math.min(p.alpha + 0.3, 1);
          ctx.shadowBlur = p.radius * 5;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
        } else {
          // Normal glowing star
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = p.radius * 4;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
        }

        // Connect subtle constellation lines between close mid-depth stars when calm
        if (currentScrollVel < 3 && !isWarping) {
          for (let j = i + 1; j < Math.min(i + 8, particles.length); j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 60) {
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = '#38bdf8';
              ctx.globalAlpha = (1 - dist / 60) * 0.1;
              ctx.lineWidth = 0.5;
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isWarping]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        pointerEvents: 'none', 
        zIndex: 0, 
        opacity: 0.55 
      }}
    />
  );
}
