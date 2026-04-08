"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { getStarMeter, getPersonFilmography, Title, StarMeterEntry } from "@/services/imdb";
import { MovieCard } from "./MovieCard";
import { Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Select, MenuItem, FormControl } from "@mui/material";

import { Pagination } from "../ui/Pagination";

export function ActorMoviesSection() {
  const [actors, setActors] = useState<StarMeterEntry[]>([]);
  const [selectedActor, setSelectedActor] = useState<StarMeterEntry | null>(null);
  const [actorMovies, setActorMovies] = useState<Title[]>([]);
  const [isLoadingActors, setIsLoadingActors] = useState(true);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  
  // Novos estados para filtro e paginação
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const [moviePage, setMoviePage] = useState(1);
  const [actorImgErrors, setActorImgErrors] = useState<Record<string, boolean>>({});
  const moviesPerPage = 4;
  const scrollRef = useRef<HTMLDivElement>(null);

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const res = await getStarMeter();
        // Busca 100 atores para garantir opções nas letras
        const topActors = (res.names || []).slice(0, 100);
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
    setMoviePage(1); // reseta a página ao mudar de ator
    
    try {
      const res = await getPersonFilmography(actor.id);
      
      const validMovies = (res.credits || [])
        .filter(credit => 
          (credit.category === "actor" || credit.category === "actress") && 
          credit.title?.type === "movie"
        )
        .map(credit => credit.title);
        
      // Remove duplicatas
      const uniqueMoviesMap = new Map<string, Title>();
      validMovies.forEach(movie => {
        if (!uniqueMoviesMap.has(movie.id)) {
          uniqueMoviesMap.set(movie.id, movie);
        }
      });
        
      setActorMovies(Array.from(uniqueMoviesMap.values()));
    } catch (error) {
      console.error("Falha ao buscar filmes do ator:", error);
    } finally {
      setIsLoadingMovies(false);
    }
  };

  const filteredActors = useMemo(() => {
    if (!selectedLetter) return actors; // Mantém ordem original (mais famosos)
    return actors
      .filter(a => a.displayName.toUpperCase().startsWith(selectedLetter))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [actors, selectedLetter]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Paginação dos filmes
  const totalMovies = actorMovies.length;
  const totalPages = Math.max(1, Math.ceil(totalMovies / moviesPerPage));
  const currentMovies = actorMovies.slice(
    (moviePage - 1) * moviesPerPage,
    moviePage * moviesPerPage
  );

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
    <section className="container mx-auto px-4 w-full mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Filmes por Atores</h2>
          <p className="text-muted-foreground">Selecione um ator para ver títulos relacionados a ele</p>
        </div>

        <div className="flex items-center gap-4">
          <FormControl size="small" className="min-w-[150px] bg-background/50 rounded-md">
            <Select
              value={selectedLetter}
              onChange={(e) => setSelectedLetter(e.target.value)}
              displayEmpty
              className="text-foreground border-border"
              MenuProps={{ 
                slotProps: {
                  paper: {
                    style: {
                      maxHeight: 250,
                    },
                  },
                },
              }}
            >
              <MenuItem value="">Mais Famosos</MenuItem>
              {letters.map(letter => (
                <MenuItem key={letter} value={letter}>Atores ({letter})</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Actors Carousel */}
      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur border border-border shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
          aria-label="Rolar para esquerda"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-6 pt-2 px-2 snap-x snap-mandatory scrollbar-hide scroll-smooth" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            .scrollbar-hide::-webkit-scrollbar { display: none; }
          `}} />
          
          {filteredActors.map(actor => (
            <div 
              key={actor.id} 
              className={`flex flex-col items-center gap-3 cursor-pointer shrink-0 snap-start transition-all duration-300 hover:scale-105 ${selectedActor?.id === actor.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
              onClick={() => handleActorClick(actor)}
            >
              <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 transition-colors duration-300 ${selectedActor?.id === actor.id ? 'border-primary shadow-lg shadow-primary/20' : 'border-transparent'}`}>
                {(!actorImgErrors[actor.id] && actor.primaryImage?.url) ? (
                  <Image 
                    src={actor.primaryImage.url} 
                    alt={actor.displayName} 
                    width={128} 
                    height={128} 
                    className="object-cover w-full h-full bg-muted"
                    onError={() => setActorImgErrors(prev => ({ ...prev, [actor.id]: true }))}
                  />
                ) : (
                  <Image 
                    src="/images/default/default-peaple.jpg"
                    alt={actor.displayName} 
                    width={128} 
                    height={128} 
                    className="object-cover w-full h-full bg-muted"
                  />
                )}
              </div>
              <span className={`text-sm font-medium text-center max-w-[100px] md:max-w-[120px] truncate transition-colors duration-300 ${selectedActor?.id === actor.id ? 'text-primary' : 'text-foreground'}`}>
                {actor.displayName}
              </span>
            </div>
          ))}
          {filteredActors.length === 0 && (
             <div className="w-full py-12 text-center text-muted-foreground">
               Nenhum ator encontrado para a letra "{selectedLetter}".
             </div>
          )}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur border border-border shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
          aria-label="Rolar para direita"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Actor Movies List */}
      {selectedActor && (
        <div className="mt-4 pt-4 animate-in fade-in duration-500 slide-in-from-bottom-4">
          {isLoadingMovies ? (
            <div className="w-full flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : actorMovies.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="w-full flex flex-col md:flex-row items-center justify-between py-8">
                  <Pagination 
                    currentPage={moviePage} 
                    totalPages={totalPages} 
                    onPageChange={setMoviePage} 
                  />
                  <div className="text-sm text-muted-foreground font-medium mt-4 md:mt-0">
                    Página {moviePage} de {totalPages}
                  </div>
                </div>
              )}
            </>
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
