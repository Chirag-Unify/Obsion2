import React from 'react';
import { motion } from 'framer-motion';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  multiline?: boolean;
  icon?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  multiline,
  icon,
  className = '',
  ...props
}) => {
  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-4"
    >
      <label className="block text-sm font-medium text-[var(--oceanic-text)]/60 dark:text-[var(--oceanic-text-dark)]/60 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--oceanic-text)]/40 dark:text-[var(--oceanic-text-dark)]/40">
            {icon}
          </div>
        )}
        <InputComponent
          {...props}
          className={`
            w-full rounded-xl
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            bg-white/60 dark:bg-[#1a2634]/60
            border border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)]
            text-[var(--oceanic-text)] dark:text-[var(--oceanic-text-dark)]
            placeholder-[var(--oceanic-text)]/40 dark:placeholder-[var(--oceanic-text-dark)]/40
            shadow-sm backdrop-blur-xl
            focus:outline-none focus:ring-2 focus:ring-[var(--oceanic-blue)]/30
            hover:border-[var(--oceanic-blue)]/50
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500/30' : ''}
            ${multiline ? 'min-h-[100px] resize-y' : ''}
            ${className}
          `}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-5 left-0 text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default FormInput; 