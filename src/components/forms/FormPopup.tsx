import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FormContact } from './FormContact';

export function FormPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleOpenForm = () => {
      setIsVisible(true);
    };

    window.addEventListener('openContactForm', handleOpenForm);

    return () => {
      window.removeEventListener('openContactForm', handleOpenForm);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn"
        onClick={handleClose}
      />

      {/* Popup Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl pointer-events-auto animate-slideUp">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close form"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Form Content */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Get a Free Quote
            </h2>
            <p className="text-gray-600 mb-6">
              Let us know how we can help. We'll respond within 24 hours.
            </p>
            <FormContact formType="popup" className="p-0 shadow-none" />
          </div>
        </div>
      </div>
    </>
  );
}
