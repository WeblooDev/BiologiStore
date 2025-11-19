import {useState, useEffect, useRef} from 'react';

/**
 * Simple drawer component without external dependencies
 */
export function Drawer({
  open,
  onClose,
  heading,
  children,
  openFrom = 'right',
}: {
  open: boolean;
  onClose: () => void;
  heading?: string;
  children: React.ReactNode;
  openFrom?: 'right' | 'left';
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      // Trigger animation after render
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before hiding
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = '';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ease-in-out ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`fixed inset-y-0 ${
          openFrom === 'right' ? 'right-0' : 'left-0'
        } w-full max-w-md bg-white shadow-2xl transform transition-all duration-300 ease-out ${
          isAnimating
            ? 'translate-x-0 opacity-100'
            : openFrom === 'right'
              ? 'translate-x-full opacity-0'
              : '-translate-x-full opacity-0'
        } flex flex-col`}
      >
        {/* Header */}
        {heading && (
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">{heading}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/**
 * Hook to manage drawer state
 */
export function useDrawer(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return {
    isOpen,
    openDrawer: () => setIsOpen(true),
    closeDrawer: () => setIsOpen(false),
  };
}
