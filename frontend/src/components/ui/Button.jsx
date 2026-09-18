import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '../../lib/cn.js';

const VARIANTS = {
  primary: 'bg-ink-950 text-white hover:bg-ink-800',
  accent: 'bg-accent-600 text-white hover:bg-accent-700',
  secondary: 'border border-ink-200 bg-white text-ink-900 hover:border-ink-300 hover:bg-ink-50',
  ghost: 'text-ink-700 hover:bg-ink-100 hover:text-ink-900',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const SIZES = {
  sm: 'h-9 gap-1.5 px-3.5 text-sm',
  md: 'h-11 gap-2 px-5 text-sm',
  lg: 'h-12 gap-2 px-6 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  isLoading = false,
  fullWidth = false,
  to,
  href,
  type = 'button',
  disabled,
  children,
  ...props
}) {
  const classes = cn(
    'inline-flex shrink-0 items-center justify-center rounded-full font-medium transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-50',
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    fullWidth && 'w-full',
    className,
  );

  const content = (
    <>
      {isLoading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
      {children}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled || isLoading} {...props}>
      {content}
    </button>
  );
}
