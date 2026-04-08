"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface TrailerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export function TrailerDialog({ isOpen, onClose, title }: TrailerDialogProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} 
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Trailer de ${title}`}
    >
      <div className={`relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl ${isClosing ? 'animate-fade-out-down' : 'animate-fade-in-up'}`} onClick={e => e.stopPropagation()}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors border border-white/20 cursor-pointer"
          aria-label="Fechar trailer"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(title + " trailer")}&autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}