import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  fullWidth,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-[var(--oceanic-blue)] to-[var(--oceanic-green)] text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-[var(--oceanic-blue)]/10 text-[var(--oceanic-blue)] hover:bg-[var(--oceanic-blue)]/20',
    outline: 'border-2 border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)] hover:border-[var(--oceanic-blue)] text-[var(--oceanic-text)] dark:text-[var(--oceanic-text-dark)]',
    ghost: 'hover:bg-[var(--oceanic-blue)]/10 text-[var(--oceanic-text)]/60 dark:text-[var(--oceanic-text-dark)]/60',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: variant === 'primary' ? 1.02 : 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="mr-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button; 