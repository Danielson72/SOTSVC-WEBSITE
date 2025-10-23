// This file now triggers the local FormPopup
import { useEffect } from 'react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent('openContactForm'));
      onClose();
    }
  }, [isOpen, onClose]);

  return null;
}