import { useRef, useCallback } from 'react';

/**
 * TiltCard — ReactBits-style 3D tilt-on-hover card
 * Card tilts toward cursor position with lighting effect
 */
export default function TiltCard({
  children,
  className = '',
  maxTilt = 12,
  scale = 1.02,
  glare = true,
  glareOpacity = 0.15,
  perspective = 1000,
  style = {},
}) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);

  const handleMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (0.5 - y) * maxTilt * 2;
    const tiltY = (x - 0.5) * maxTilt * 2;
    el.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    if (glare && glareRef.current) {
      const angle = Math.atan2(y - 0.5, x - 0.5) * (180 / Math.PI) + 180;
      glareRef.current.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${glareOpacity}) 0%, transparent 80%)`;
      glareRef.current.style.opacity = '1';
    }
  }, [maxTilt, scale, perspective, glare, glareOpacity]);

  const handleLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = `perspective(${perspective}px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
    if (glareRef.current) glareRef.current.style.opacity = '0';
  }, [perspective]);

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transition: 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          style={{
            position: 'absolute', inset: 0,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            opacity: 0,
            transition: 'opacity 0.3s',
          }}
        />
      )}
    </div>
  );
}
