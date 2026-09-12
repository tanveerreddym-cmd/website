/**
 * GradientText — ReactBits-style animated gradient text
 * Text with flowing gradient animation
 */
export default function GradientText({
  children,
  className = '',
  colors = ['#3CE0E6', '#2B62D9', '#4A7EE8', '#3CE0E6'],
  speed = 4,
  animate = true,
}) {
  const gradient = colors.join(', ');

  return (
    <span
      className={`gradient-text ${className}`}
      style={{
        background: `linear-gradient(90deg, ${gradient})`,
        backgroundSize: animate ? '300% 100%' : '100% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: animate ? `gradientShift ${speed}s ease infinite` : 'none',
        display: 'inline-block',
      }}
    >
      {children}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </span>
  );
}
