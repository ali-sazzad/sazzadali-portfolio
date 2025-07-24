import React from 'react';

// Simple utility function to combine class names
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Badge variant styles
const badgeVariants = {
  default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
  secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
  outline: 'text-foreground',
} as const;

type BadgeVariant = keyof typeof badgeVariants;

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: BadgeVariant;
}

function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const baseClasses =
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  const variantClasses = badgeVariants[variant] || badgeVariants.default;

  return <div className={cn(baseClasses, variantClasses, className)} {...props} />;
}

export { Badge };
