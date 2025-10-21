import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FormContact } from './FormContact';

const POPUP_DELAY = 5000; // 5 seconds
const SESSION_KEY = 'sotsvc_popup_dismissed';

export function FormPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if popup was already dismissed this session
    const dismissed = sessionStorage.getItem(SESSION_KEY);
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, POPUP_DELAY);

    // Listen for manual popup trigger event
    const handleShowPopup = () => {
      setIsDismissed(false);
      setIsVisible(true);
    };

    window.addEventListener('showContactPopup', handleShowPopup);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('showContactPopup', handleShowPopup);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem(SESSION_KEY, 'true');
  };

  // Don't render if dismissed
  if (isDismissed || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn"
        onClick={handleClose}
        aria-label="Close popup"
      />

      {/* Popup Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl pointer-events-auto animate-slideUp"
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-title"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close popup"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Form Content */}
          <div className="p-6">
            <h2 id="popup-title" className="text-2xl font-bold text-gray-900 mb-2">
              Get a Free Quote
            </h2>
            <p className="text-gray-600 mb-6">
              Let us know how we can help. We'll respond within 24 hours.
            </p>

            <FormContact formType="popup" className="p-0 shadow-none" />
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}} />
    </>
  );
}
