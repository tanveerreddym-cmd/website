import { useInView } from './hooks';

export function RevealItem({ children, delay = 0, direction = 'up', className = '', ...props }) {
  const [ref, isInView] = useInView({ threshold: 0.12 });
  const dirClass = direction === 'left' ? 'from-left' : direction === 'right' ? 'from-right' : direction === 'scale' ? 'scale-in' : '';

  return (
    <div
      ref={ref}
      className={`reveal-item ${dirClass} ${isInView ? 'revealed' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
}

export function RevealGroup({ children, stagger = 150, direction = 'up', className = '' }) {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              className={`reveal-item ${direction === 'left' ? 'from-left' : direction === 'scale' ? 'scale-in' : ''} ${isInView ? 'revealed' : ''}`}
              style={{ transitionDelay: `${i * stagger}ms` }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
