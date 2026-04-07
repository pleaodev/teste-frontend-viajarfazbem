"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getStarMeter, searchTitles, Title, StarMeterEntry } from "@/services/imdb";
import { MovieCard } from "./MovieCard";
import { Loader2 } from "lucide-react";

export function ActorMoviesSection() {
  const [actors, setActors] = useState<StarMeterEntry[]>([]);
  const [selectedActor, setSelectedActor] = useState<StarMeterEntry | null>(null);
  const [actorMovies, setActorMovies] = useState<Title[]>([]);
  const [isLoadingActors, setIsLoadingActors] = useState(true);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const res = await getStarMeter();
        // Limita a 15 atores para o carrossel não ficar gigante
        const topActors = (res.names || []).slice(0, 15);
        setActors(topActors);
      } catch (error) {
        console.error("Falha ao buscar atores:", error);
      } finally {
        setIsLoadingActors(false);
      }
    };
    fetchActors();
  }, []);

  const handleActorClick = async (actor: StarMeterEntry) => {
    if (selectedActor?.id === actor.id) return;
    
    setSelectedActor(actor);
    setIsLoadingMovies(true);
    setActorMovies([]);
    
    try {
      // Busca títulos relacionados ao ator e filtra apenas os que possuem imagem
      const res = await searchTitles(actor.displayName, { limit: 20 });
      const validMovies = (res.titles || [])
        .filter(movie => movie.primaryImage?.url)
        .slice(0, 8);
        
      setActorMovies(validMovies);
    } catch (error) {
      console.error("Falha ao buscar filmes do ator:", error);
    } finally {
      setIsLoadingMovies(false);
    }
  };

  if (isLoadingActors) {
    return (
      <div className="w-full flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (actors.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 w-full mt-12 mb-8">
      <div className="flex flex-col mb-8 gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Filmes por Atores</h2>
        <p className="text-muted-foreground">Selecione um ator para ver títulos relacionados a ele</p>
      </div>

      {/* Actors Carousel */}
      <div 
        className="flex overflow-x-auto gap-6 pb-6 pt-2 px-2 snap-x snap-mandatory scrollbar-hide" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}} />
        
        {actors.map(actor => (
          <div 
            key={actor.id} 
            className={`flex flex-col items-center gap-3 cursor-pointer shrink-0 snap-start transition-all duration-300 hover:scale-105 ${selectedActor?.id === actor.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            onClick={() => handleActorClick(actor)}
          >
            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 transition-colors duration-300 ${selectedActor?.id === actor.id ? 'border-primary shadow-lg shadow-primary/20' : 'border-transparent'}`}>
              {actor.primaryImage?.url ? (
                <Image 
                  src={actor.primaryImage.url} 
                  alt={actor.displayName} 
                  width={128} 
                  height={128} 
                  className="object-cover w-full h-full bg-muted"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground font-bold text-2xl">
                  {actor.displayName.charAt(0)}
                </div>
              )}
            </div>
            <span className={`text-sm font-medium text-center max-w-[100px] md:max-w-[120px] truncate transition-colors duration-300 ${selectedActor?.id === actor.id ? 'text-primary' : 'text-foreground'}`}>
              {actor.displayName}
            </span>
          </div>
        ))}
      </div>

      {/* Actor Movies List */}
      {selectedActor && (
        <div className="mt-4 pt-4 animate-in fade-in duration-500 slide-in-from-bottom-4">
          {isLoadingMovies ? (
            <div className="w-full flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : actorMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {actorMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-border/50 rounded-xl bg-card/30">
              <p className="text-muted-foreground text-lg">Nenhum título encontrado para este ator na busca.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
