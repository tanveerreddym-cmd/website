import { useRef, useCallback } from 'react';

/**
 * SpotlightCard — ReactBits-style mouse-following spotlight effect
 * A card with a radial gradient light that follows the cursor
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(60, 224, 230, 0.12)',
  spotlightSize = 280,
  borderColor = 'rgba(255,255,255,0.08)',
  hoverBorderColor = 'rgba(60, 224, 230, 0.3)',
  style = {},
}) {
  const cardRef = useRef(null);

  const handleMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--spotlight-x', `${x}px`);
    el.style.setProperty('--spotlight-y', `${y}px`);
    el.style.setProperty('--border-c', hoverBorderColor);
  }, [hoverBorderColor]);

  const handleLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--border-c', borderColor);
  }, [borderColor]);

  return (
    <div
      ref={cardRef}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid var(--border-c, ${borderColor})`,
        borderRadius: '14px',
        transition: 'border-color 0.4s, box-shadow 0.4s',
        '--border-c': borderColor,
        ...style,
      }}
    >
      {/* Spotlight gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(${spotlightSize}px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${spotlightColor}, transparent 70%)`,
          opacity: 1,
          transition: 'opacity 0.3s',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
