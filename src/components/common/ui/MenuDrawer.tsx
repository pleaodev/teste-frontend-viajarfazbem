"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  position?: "left" | "right";
  width?: string;
}

export function MenuDrawer({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  position = "left", 
  width = "w-4/5 max-w-[320px]" 
}: MenuDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const positionClasses = position === "left" 
    ? (isOpen ? "translate-x-0" : "-translate-x-full")
    : (isOpen ? "translate-x-0" : "translate-x-full");

  const placementClass = position === "left" ? "left-0 border-r" : "right-0 border-l";

  if (!mounted) return null;

  return createPortal(
    <div className="relative z-[9999]">
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 backdrop-blur-sm ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Content */}
      <div 
        className={`fixed top-0 ${placementClass} h-[100dvh] ${width} bg-background border-border transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${positionClasses}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          {title ? (
            typeof title === "string" ? <span className="font-medium text-foreground">{title}</span> : title
          ) : <div />}
          <IconButton onClick={onClose} sx={{ color: 'var(--foreground)' }} aria-label="Fechar menu">
            <Close />
          </IconButton>
        </div>
        
        {/* Usamos data-lenis-prevent aqui para scroll natural no mobile */}
        <div className="flex-1 overflow-y-auto p-4" data-lenis-prevent>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}