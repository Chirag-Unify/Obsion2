import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex min-h-screen items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className={`relative ${maxWidth} w-full overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 to-white/50 dark:from-[#1a2634]/90 dark:to-[#1a2634]/50 shadow-2xl border border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)] backdrop-blur-xl transform`}
              >
                {/* Modal Header */}
                <div className="relative px-6 py-4 border-b border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)]">
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl font-bold text-[var(--oceanic-text)] dark:text-[var(--oceanic-text-dark)]"
                  >
                    {title}
                  </motion.h2>
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-1 rounded-full hover:bg-[var(--oceanic-blue)]/10 text-[var(--oceanic-text)]/60 dark:text-[var(--oceanic-text-dark)]/60 hover:text-[var(--oceanic-blue)] transition-colors duration-200"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Modal Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-6"
                >
                  {children}
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-gradient-to-br from-[var(--oceanic-blue)]/20 to-[var(--oceanic-green)]/20 blur-3xl rounded-full opacity-50" />
                  <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-[var(--oceanic-green)]/20 to-[var(--oceanic-blue)]/20 blur-3xl rounded-full opacity-50" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal; 