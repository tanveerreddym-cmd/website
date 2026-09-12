import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks';

/**
 * CountUp — ReactBits-style animated counter
 */
export default function CountUp({ end, duration = 2200, suffix = '', className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [count, setCount] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setCount(Math.round(eased * end));
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [end, duration, inView]);

  return <span ref={ref} className={className}>{count}{suffix}</span>;
}
