import { useRef, useCallback } from 'react';

/**
 * MagneticButton — ReactBits-style magnetic hover effect
 * Button subtly moves toward cursor on hover
 */
export default function MagneticButton({ children, className = '', strength = 0.3, style = {}, ...props }) {
  const btnRef = useRef(null);

  const handleMove = useCallback((e) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }, [strength]);

  const handleLeave = useCallback(() => {
    if (btnRef.current) btnRef.current.style.transform = 'translate(0, 0)';
  }, []);

  return (
    <div
      ref={btnRef}
      className={`magnetic-btn ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ display: 'inline-flex', transition: 'transform 0.35s cubic-bezier(0.03, 0.98, 0.52, 0.99)', ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
