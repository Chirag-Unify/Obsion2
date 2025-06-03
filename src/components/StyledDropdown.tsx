import React from 'react';
import { motion } from 'framer-motion';

interface StyledDropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: React.ReactNode;
}

const StyledDropdown: React.FC<StyledDropdownProps> = ({ label, icon, className = '', ...props }) => {
  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-[var(--oceanic-text)]/60 dark:text-[var(--oceanic-text-dark)]/60 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <motion.select
          whileTap={{ scale: 0.98 }}
          className={`
            w-full appearance-none rounded-xl px-4 py-2.5 pr-10
            bg-white/60 dark:bg-[#1a2634]/60
            border border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)]
            text-[var(--oceanic-text)] dark:text-[var(--oceanic-text-dark)]
            shadow-sm backdrop-blur-xl
            focus:outline-none focus:ring-2 focus:ring-[var(--oceanic-blue)]/30
            hover:border-[var(--oceanic-blue)]/50
            transition-all duration-200
            font-medium
            ${className}
          `}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {icon || (
            <svg
              className="w-5 h-5 text-[var(--oceanic-text)]/40 dark:text-[var(--oceanic-text-dark)]/40"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default StyledDropdown; 