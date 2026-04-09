"use client";

import { useState, useEffect } from "react";
import { MovieCard } from "./MovieCard";
import { Pagination } from "../ui/Pagination";
import { useWatchHistory } from "../providers/WatchHistoryProvider";

export function ContinueWatchingSection() {
  const { watchHistory } = useWatchHistory();
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setLimit(1);
      } else if (width < 768) {
        setLimit(2);
      } else if (width < 1024) {
        setLimit(3);
      } else {
        setLimit(4);
      }
    };
    handleResize(); // Executa na montagem
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted || watchHistory.length === 0) {
    return null; // Só aparece se houver histórico
  }

  const totalPages = Math.max(1, Math.ceil(watchHistory.length / limit));
  const currentMovies = watchHistory.slice((page - 1) * limit, page * limit);

  return (
    <section className="container mx-auto px-4 w-full mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Continue assistindo
          </h2>
          <p className="text-muted-foreground">
            Retome de onde parou com seus títulos recentes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} variant="continue" />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="w-full flex flex-col md:flex-row items-center justify-between mt-8 py-4">
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={(newPage) => setPage(newPage)} 
          />
          <div className="text-sm text-muted-foreground font-medium mt-4 md:mt-0">
            Página {page} de {totalPages}
          </div>
        </div>
      )}
    </section>
  );
}