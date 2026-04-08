"use client";

import { useFavorites } from "@/components/common/providers/FavoritesProvider";
import { MovieCard } from "@/components/common/movies/MovieCard";
import { Heart, Film } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 mt-0">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            Meus Favoritos
          </h1>
          <p className="text-muted-foreground mt-2">
            Explore a coleção dos filmes que você mais gostou.
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl bg-muted/20">
          <Film className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-2xl font-semibold mb-2">Nenhum favorito ainda</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Você ainda não adicionou nenhum filme à sua lista de favoritos. Navegue pelos filmes e clique no coração para adicionar!
          </p>
          <Link 
            href="/"
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-md font-medium transition-colors"
          >
            Explorar Filmes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {favorites.map((movie) => (
            <div key={movie.id} className="w-full">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}