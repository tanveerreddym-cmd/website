import { useEffect, useRef, useCallback } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: -1000, y: -1000 });

  const initParticles = useCallback((w, h) => {
    const count = Math.min(Math.floor((w * h) / 8000), 120);
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);
      initParticles(w, h);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener('mousemove', handleMouse, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const pts = particles.current;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(60, 224, 230, 0.35)';
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(60, 224, 230, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Mouse interaction
        const dmx = p.x - mx;
        const dmy = p.y - my;
        const dMouse = Math.sqrt(dmx * dmx + dmy * dmy);
        if (dMouse < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(60, 224, 230, ${0.2 * (1 - dMouse / 150)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Gentle repel
          const force = (150 - dMouse) / 150 * 0.02;
          p.vx += (dmx / dMouse) * force;
          p.vy += (dmy / dMouse) * force;
        }

        // Dampen velocity
        p.vx *= 0.999;
        p.vy *= 0.999;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    // Check reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches) {
      animRef.current = requestAnimationFrame(draw);
    } else {
      // Draw once
      draw();
      cancelAnimationFrame(animRef.current);
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouse);
    };
  }, [initParticles]);

  return <canvas ref={canvasRef} />;
}
