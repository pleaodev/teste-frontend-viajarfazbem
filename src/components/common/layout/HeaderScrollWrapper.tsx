"use client";

import { useEffect, useState } from "react";

export function HeaderScrollWrapper({ children }: { children: React.ReactNode }) {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Aparece após rolar 120px
      setIsFloating(window.scrollY > 120);
    };
    
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Container pai para segurar o espaço do header */}
      <div className="relative z-40 w-full h-16">
        {/* Header Original - Fixo com position fixed para animar no topo */}
        <header 
          className={`fixed top-0 left-0 right-0 w-full border-b border-border bg-background transition-transform duration-500 ease-out ${
            isFloating ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            {children}
          </div>
        </header>
      </div>

      {/* Header Flutuante - Aparece com Slide Down */}
      <div
        className={`fixed left-0 right-0 z-50 flex justify-center transition-transform duration-500 ease-out ${
          isFloating
            ? "top-[5px] md:top-4 translate-y-0 pointer-events-auto"
            : "top-[5px] md:top-4 -translate-y-[150%] pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-[5px] md:px-4 pointer-events-none">
          <header className="w-full bg-background/80 backdrop-blur-md border border-border shadow-lg rounded-[7px] pointer-events-auto">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
              {children}
            </div>
          </header>
        </div>
      </div>
    </>
  );
}
