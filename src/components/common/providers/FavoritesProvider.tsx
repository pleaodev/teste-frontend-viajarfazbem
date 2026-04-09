"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Title } from "@/services/imdb";

interface FavoritesContextType {
  favorites: Title[];
  toggleFavorite: (movie: Title) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Title[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("@viajarfazbem:favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("@viajarfazbem:favorites", JSON.stringify(favorites));
    }
  }, [favorites, mounted]);

  const toggleFavorite = (movie: Title) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === movie.id);
      if (exists) {
        return prev.filter((f) => f.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some((f) => f.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
