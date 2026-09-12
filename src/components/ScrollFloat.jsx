import { useRef, useEffect, useState } from 'react';

/**
 * ScrollFloat — ReactBits-style scroll-driven floating text
 * Text floats up and unblurs as user scrolls it into view
 */
export default function ScrollFloat({
  children,
  className = '',
  yStart = 60,
  rotateStart = 8,
  blurStart = 8,
  scaleStart = 0.92,
  duration = 0.9,
  threshold = 0.15,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`scroll-float ${className}`}
      style={{
        transition: `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1), filter ${duration}s cubic-bezier(0.16, 1, 0.3, 1), opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
        transform: visible
          ? 'translateY(0) rotate(0deg) scale(1)'
          : `translateY(${yStart}px) rotate(${rotateStart}deg) scale(${scaleStart})`,
        filter: visible ? 'blur(0px)' : `blur(${blurStart}px)`,
        opacity: visible ? 1 : 0,
        willChange: 'transform, filter, opacity',
      }}
    >
      {children}
    </div>
  );
}
