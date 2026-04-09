"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Title } from "@/services/imdb";

interface WatchHistoryContextType {
  watchHistory: Title[];
  addToHistory: (movie: Title) => void;
  clearHistory: () => void;
}

const WatchHistoryContext = createContext<WatchHistoryContextType | undefined>(undefined);

export function WatchHistoryProvider({ children }: { children: ReactNode }) {
  const [watchHistory, setWatchHistory] = useState<Title[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("@viajarfazbem:watchHistory");
    if (saved) {
      try {
        setWatchHistory(JSON.parse(saved));
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("@viajarfazbem:watchHistory", JSON.stringify(watchHistory));
    }
  }, [watchHistory, mounted]);

  const addToHistory = (movie: Title) => {
    setWatchHistory((prev) => {
      // Remove se já existir para colocar no topo
      const filtered = prev.filter((f) => f.id !== movie.id);
      return [movie, ...filtered];
    });
  };

  const clearHistory = () => {
    setWatchHistory([]);
  };

  return (
    <WatchHistoryContext.Provider value={{ watchHistory, addToHistory, clearHistory }}>
      {children}
    </WatchHistoryContext.Provider>
  );
}

export function useWatchHistory() {
  const context = useContext(WatchHistoryContext);
  if (context === undefined) {
    throw new Error("useWatchHistory must be used within a WatchHistoryProvider");
  }
  return context;
}