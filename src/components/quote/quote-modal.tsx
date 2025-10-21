// This file now just redirects to the GoHighLevel form
import { useEffect } from 'react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  useEffect(() => {
    if (isOpen) {
      window.open('https://api.leadconnectorhq.com/widget/form/pEHnV0t5Pk0YXdZaeypm', '_blank');
      onClose();
    }
  }, [isOpen, onClose]);

  return null;
}