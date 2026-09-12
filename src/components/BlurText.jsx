import { useInView } from '../hooks';

/**
 * BlurText — ReactBits-style blur-in text reveal
 * Text starts blurred and fades/unblurs into view
 */
export default function BlurText({
  text = '',
  className = '',
  delay = 0,
  duration = 0.8,
  blur = 12,
  yOffset = 20,
  splitBy = 'word',
  stagger = 80,
  threshold = 0.2,
}) {
  const [ref, isInView] = useInView({ threshold });

  const units = splitBy === 'word' ? text.split(' ') : text.split('');

  return (
    <span ref={ref} className={`blur-text-root ${className}`} aria-label={text}>
      {units.map((unit, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            display: 'inline-block',
            whiteSpace: splitBy === 'word' ? 'pre' : (unit === ' ' ? 'pre' : 'normal'),
            transition: `filter ${duration}s cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1), opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
            transitionDelay: isInView ? `${delay + i * stagger}ms` : '0ms',
            filter: isInView ? 'blur(0px)' : `blur(${blur}px)`,
            transform: isInView ? 'translateY(0)' : `translateY(${yOffset}px)`,
            opacity: isInView ? 1 : 0,
          }}
        >
          {splitBy === 'word' && i < units.length - 1 ? unit + '\u00A0' : (unit === ' ' ? '\u00A0' : unit)}
        </span>
      ))}
    </span>
  );
}
