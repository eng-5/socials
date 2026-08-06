export default function Card({
  children, className = '', glass = false,
  hover = true, padding = true, ...props
}) {
  const bg         = glass ? 'glass-panel' : 'bg-surface-container/60 backdrop-blur-sm';
  const hoverClass = hover ? 'hover:border-outline-variant/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20' : '';
  const pad        = padding ? 'p-6' : '';

  return (
    <div
      className={`rounded-3xl border border-outline-variant/10 transition-all duration-300 relative overflow-hidden ${bg} ${hoverClass} ${pad} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
