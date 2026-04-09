"use client";

import * as React from "react";
import { MoreVertical, Heart, TrendingUp, Clock, Users, MessageCircle, Settings } from "lucide-react";
import Link from "next/link";

export function MoreOptionsDropdown() {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
        aria-label="Mais opções"
        title="Mais opções"
      >
        <MoreVertical className="h-[1.2rem] w-[1.2rem] transition-all" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-background shadow-lg z-50 py-1">
          <Link
            href="/favorites"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-end gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors text-right"
          >
            <span>Favoritos</span>
            <Heart className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center justify-end gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors text-right"
          >
            <span>Tendências</span>
            <TrendingUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center justify-end gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors text-right"
          >
            <span>Em breve</span>
            <Clock className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center justify-end gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors text-right"
          >
            <span>Comunidade</span>
            <Users className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center justify-end gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors text-right"
          >
            <span>Social</span>
            <MessageCircle className="h-4 w-4" />
          </button>
          <div className="my-1 border-t border-border" />
          <button
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center justify-end gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors text-right"
          >
            <span>Configurações</span>
            <Settings className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
