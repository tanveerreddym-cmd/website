import { useMemo } from 'react';
import { useInView } from '../hooks';

/**
 * SplitText — ReactBits-style character/word stagger animation
 * Splits text into individual characters and animates them into view
 */
export default function SplitText({
  text = '',
  className = '',
  delay = 0,
  duration = 0.6,
  ease = 'cubic-bezier(0.16, 1, 0.3, 1)',
  splitBy = 'char', // 'char' | 'word'
  stagger = 30, // ms between each unit
  from = { y: 40, opacity: 0, rotateX: 90 },
  to = { y: 0, opacity: 1, rotateX: 0 },
  threshold = 0.2,
}) {
  const [ref, isInView] = useInView({ threshold });

  const units = useMemo(() => {
    if (splitBy === 'word') return text.trim().split(/\s+/).filter(Boolean);
    return text.match(/\S+|\s+/g) || [];
  }, [text, splitBy]);

  const unitStyle = (index) => ({
    display: 'inline-block',
    transition: `transform ${duration}s ${ease}, opacity ${duration}s ${ease}`,
    transitionDelay: isInView ? `${delay + index * stagger}ms` : '0ms',
    transform: isInView
      ? `translateY(${to.y}px) rotateX(${to.rotateX}deg)`
      : `translateY(${from.y}px) rotateX(${from.rotateX}deg)`,
    opacity: isInView ? to.opacity : from.opacity,
    transformOrigin: 'center bottom',
    perspective: '800px',
  });

  let animationIndex = 0;

  return (
    <span ref={ref} className={`split-text-root ${className}`}>
      <span className="sr-only">{text}</span>
      {splitBy === 'word'
        ? units.map((word, index) => (
          <span
            key={word + index}
            className="split-text-unit"
            aria-hidden="true"
            style={unitStyle(index)}
          >
            {word}{index < units.length - 1 ? '\u00A0' : null}
          </span>
        ))
        : units.map((token, tokenIndex) => {
          if (/^\s+$/.test(token)) return token;
          const wordStart = animationIndex;
          const characters = [...token];
          animationIndex += characters.length;
          return (
            <span key={token + tokenIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }} aria-hidden="true">
              {characters.map((character, characterIndex) => (
                <span
                  key={character + characterIndex}
                  className="split-text-unit"
                  style={unitStyle(wordStart + characterIndex)}
                >
                  {character}
                </span>
              ))}
            </span>
          );
        })}
    </span>
  );
}
