"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Info, Film, Heart, PlayCircle } from "lucide-react";
import { Title, TitleDetails, getTitleDetails } from "@/services/imdb";
import { TrailerDialog } from "../dialogs/TrailerDialog";
import { MovieDetailsDialog } from "../dialogs/MovieDetailsDialog";
import { ActorDialog } from "../dialogs/ActorDialog";
import { useFavorites } from "../providers/FavoritesProvider";

interface CarouselProps {
  items: Title[];
}

export function Carousel({ items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTrailerTitle, setSelectedTrailerTitle] = useState<string | null>(null);

  const [selectedMovieForDetails, setSelectedMovieForDetails] = useState<Title | null>(null);
  const [movieDetails, setMovieDetails] = useState<TitleDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  
  // Dialog State de Atores
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null);
  const [isActorDialogOpen, setIsActorDialogOpen] = useState(false);

  const handleOpenActor = (actorId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedActorId(actorId);
    setIsActorDialogOpen(true);
  };

  const handleCloseActor = () => {
    setIsActorDialogOpen(false);
    setTimeout(() => setSelectedActorId(null), 300);
  };

  const handleOpenDetails = async (movie: Title) => {
    setSelectedMovieForDetails(movie);
    setIsDetailsOpen(true);
    setMovieDetails(null);
    setIsLoadingDetails(true);
    try {
      const details = await getTitleDetails(movie.id, { info: "base_info,cast" });
      setMovieDetails(details);
    } catch (error: any) {
      if (error?.message?.includes("429")) {
        console.warn("[Carousel] Rate limit (429) ao buscar detalhes do filme.");
      } else {
        console.warn("Erro ao buscar detalhes do filme:", error?.message || error);
      }
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setTimeout(() => {
      setSelectedMovieForDetails(null);
      setMovieDetails(null);
    }, 300);
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const closeTrailer = () => setSelectedTrailerTitle(null);

  // Autoplay
  useEffect(() => {
    if (!items || items.length === 0) return;
    if (isDetailsOpen || selectedTrailerTitle || isActorDialogOpen) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [items?.length, nextSlide, isDetailsOpen, selectedTrailerTitle, isActorDialogOpen]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden bg-muted/30 group">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-[60vh] md:h-[500px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <article 
            key={item.id} 
            itemScope 
            itemType="https://schema.org/Movie"
            className="w-full flex-shrink-0 relative"
          >
            <meta itemProp="name" content={item.primaryTitle} />
            {item.primaryImage?.url && <meta itemProp="image" content={item.primaryImage.url} />}
            {item.plot && <meta itemProp="description" content={item.plot} />}
            {item.startYear && <meta itemProp="datePublished" content={item.startYear.toString()} />}
            {item.rating?.aggregateRating && (
              <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating" className="hidden">
                <meta itemProp="ratingValue" content={item.rating.aggregateRating.toString()} />
                <meta itemProp="ratingCount" content={item.rating.voteCount?.toString() || "1"} />
              </div>
            )}
            {/* Background Image */}
            {item.primaryImage?.url && (
              <>
                <Image
                  src={item.primaryImage.url}
                  alt={item.primaryTitle}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent dark:via-background/60" />
                <div className="absolute inset-0 w-full md:w-3/4 lg:w-2/3 bg-gradient-to-r from-background/95 via-background/70 to-transparent dark:from-background/90 dark:via-background/40" />
              </>
            )}

            {/* Conteúdo */}
            <div className="absolute inset-0 flex flex-col justify-end pb-12">
              <div className="container mx-auto px-4">
                <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col gap-4">
                  {item.genres && item.genres.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {item.genres.map(genre => (
                        <span key={genre} className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-foreground bg-background/10 backdrop-blur-sm border border-foreground/20 rounded-sm">
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                    {item.primaryTitle}
                    {item.startYear && <span className="text-xl md:text-3xl font-light text-muted-foreground ml-3">({item.startYear})</span>}
                  </h2>
                  
                  <div className="flex items-center gap-2 text-yellow-500 font-medium">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-lg">{item.rating?.aggregateRating?.toFixed(1) || "N/A"}</span>
                    {item.rating?.voteCount && (
                      <span className="text-sm text-muted-foreground font-normal ml-2">
                        ({item.rating.voteCount.toLocaleString('pt-BR')} avaliações)
                      </span>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground line-clamp-3 md:line-clamp-4 text-base">
                    {item.plot || "Descrição não disponível."}
                  </p>
                  
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button 
                      onClick={() => handleOpenDetails(item)}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-background/60 hover:bg-white hover:text-black text-foreground/90 font-semibold rounded-md backdrop-blur-sm border border-foreground/20 transition-all cursor-pointer"
                      aria-label={`Ver mais detalhes sobre ${item.primaryTitle}`}
                    >
                      <Info className="w-5 h-5" aria-hidden="true" />
                      Ver Mais
                    </button>
                    <button 
                      onClick={() => setSelectedTrailerTitle(item.primaryTitle)}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-background/60 hover:bg-white hover:text-black text-foreground/90 font-semibold rounded-md backdrop-blur-sm border border-foreground/20 transition-all cursor-pointer"
                      aria-label={`Assistir trailer de ${item.primaryTitle}`}
                    >
                      <Film className="w-5 h-5" aria-hidden="true" />
                      Trailer
                    </button>
                    <Link 
                      href={`/player?title=${encodeURIComponent(item.primaryTitle)}`}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-md transition-all cursor-pointer shadow-[0_0_15px_rgba(2,132,199,0.5)]"
                      aria-label={`Assistir ${item.primaryTitle}`}
                    >
                      <PlayCircle className="w-5 h-5" aria-hidden="true" />
                      Assistir
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item);
                      }}
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md backdrop-blur-sm border border-foreground/20 transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer ${isFavorite(item.id) ? 'bg-black/40 hover:bg-black/60' : 'bg-background/60 hover:bg-white hover:text-black text-foreground/90'}`}
                      aria-label={isFavorite(item.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      aria-pressed={isFavorite(item.id)}
                    >
                      <Heart className={`h-5 w-5 transition-colors duration-300 ${isFavorite(item.id) ? 'fill-red-500 text-red-500' : 'fill-transparent'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Navegação */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-background/30 hover:bg-background/60 text-foreground backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-background/30 hover:bg-background/60 text-foreground backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
        aria-label="Próximo"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              idx === currentIndex ? "bg-sky-700 dark:bg-white w-8" : "bg-muted-foreground/50 hover:bg-muted-foreground"
            }`}
            aria-label={`Ir para slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Dialog do Trailer (Standalone) */}
      <TrailerDialog
        isOpen={!!selectedTrailerTitle}
        onClose={closeTrailer}
        title={selectedTrailerTitle || ""}
      />

      {/* Dialog de Detalhes do Filme */}
      {selectedMovieForDetails && (
        <MovieDetailsDialog
          isOpen={isDetailsOpen}
          onClose={closeDetails}
          movie={selectedMovieForDetails}
          movieDetails={movieDetails}
          isLoading={isLoadingDetails}
          rating={selectedMovieForDetails.rating?.aggregateRating?.toFixed(1) || "N/A"}
          onOpenActor={handleOpenActor}
        />
      )}

      {/* Dialog de Detalhes do Ator */}
      <ActorDialog 
        isOpen={isActorDialogOpen} 
        onClose={handleCloseActor} 
        actorId={selectedActorId} 
      />
    </div>
  );
}
