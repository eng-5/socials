export default function Button({
  children, variant = 'primary', size = 'md',
  className = '', icon: Icon, iconPosition = 'left',
  disabled = false, onClick, type = 'button', ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:   'bg-gradient-to-r from-primary to-primary-dim text-on-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02]',
    secondary: 'bg-surface-container-highest border border-outline-variant/20 text-on-surface hover:bg-surface-bright hover:border-outline-variant/40',
    ghost:     'text-on-surface-variant hover:text-on-surface hover:bg-white/5',
    danger:    'bg-error-container/30 border border-error/30 text-error hover:bg-error/20',
    glass:     'glass-card border border-outline-variant/15 text-on-surface hover:border-primary/30 hover:bg-primary/5',
    outline:   'border border-primary/40 text-primary hover:bg-primary/10',
  };

  const sizes = {
    sm:   'px-3 py-1.5 text-xs',
    md:   'px-5 py-2.5 text-sm',
    lg:   'px-7 py-3.5 text-base',
    xl:   'px-8 py-4 text-base',
    icon: 'p-2.5',
  };

  const iconSize = size === 'sm' ? 13 : size === 'lg' || size === 'xl' ? 18 : 15;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left'  && <Icon size={iconSize} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={iconSize} />}
    </button>
  );
}
