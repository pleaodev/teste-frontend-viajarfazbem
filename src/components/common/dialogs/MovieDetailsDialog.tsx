"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Loader2, Star, Calendar, Clock, Info, Users, Clapperboard } from "lucide-react";
import { Title, TitleDetails } from "@/services/imdb";

interface MovieDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Title;
  movieDetails: TitleDetails | null;
  isLoading: boolean;
  rating: string;
  onOpenActor: (actorId: string, e?: React.MouseEvent) => void;
}

export function MovieDetailsDialog({ 
  isOpen, 
  onClose, 
  movie, 
  movieDetails, 
  isLoading, 
  rating, 
  onOpenActor 
}: MovieDetailsDialogProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (!isOpen && !isClosing) return null;
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-black/80 p-4 md:p-8 backdrop-blur-sm ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} 
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes de ${movie.primaryTitle}`}
    >
      <div className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl border border-border shadow-2xl ${isClosing ? 'animate-fade-out-down' : 'animate-fade-in-up'}`} onClick={e => e.stopPropagation()} data-lenis-prevent>
        {/* Botão Fechar */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 dark:bg-black/50 text-foreground dark:text-white hover:bg-black/20 dark:hover:bg-white/20 transition-colors border border-black/10 dark:border-white/20 cursor-pointer"
          aria-label="Fechar detalhes"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Imagem do Filme */}
            <div className="w-full md:w-[40%] relative aspect-[2/3] md:aspect-auto md:min-h-[600px] bg-muted shrink-0">
              {movie.primaryImage?.url ? (
                <Image 
                  src={movie.primaryImage.url} 
                  alt={movie.primaryTitle} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-muted">
                  <Clapperboard className="h-16 w-16 opacity-50" />
                </div>
              )}
              {/* Degradê para transição suave na versão mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:hidden" />
            </div>

            {/* Informações */}
            <div className="w-full md:w-[60%] p-6 md:p-8 flex flex-col gap-6 relative">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{movie.primaryTitle}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {movie.startYear && (
                    <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                      <Calendar className="h-4 w-4" />
                      {movie.startYear}
                    </span>
                  )}
                  {movieDetails?.runtimeMinutes && (
                    <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                      <Clock className="h-4 w-4" />
                      {Math.floor(movieDetails.runtimeMinutes / 60)}h {movieDetails.runtimeMinutes % 60}m
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-md font-semibold">
                    <Star className="h-4 w-4 fill-current" />
                    {rating}
                  </span>
                </div>
              </div>

              {/* Gêneros */}
              {movieDetails?.genres && movieDetails.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movieDetails.genres.map(genre => (
                    <span key={genre} className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 border border-blue-600/20 text-sm font-medium">
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Sinopse */}
              {movieDetails?.plot && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 border-b border-border pb-2">
                    <Info className="h-5 w-5 text-blue-500" />
                    Sinopse
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {movieDetails.plot}
                  </p>
                </div>
              )}

              {/* Atores / Elenco */}
              {movieDetails?.stars && movieDetails.stars.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-border pb-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Elenco Principal
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {movieDetails.stars.map(star => (
                      <button 
                        key={star.id} 
                        className="flex w-full text-left items-center gap-3 bg-muted/30 p-2 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                        onClick={(e) => onOpenActor(star.id, e)}
                        aria-label={`Ver detalhes de ${star.displayName}`}
                      >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0">
                          {star.primaryImage?.url ? (
                            <Image 
                              src={star.primaryImage.url} 
                              alt={star.displayName} 
                              fill 
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-muted-foreground bg-muted">
                              <Users className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-sm truncate">{star.displayName}</span>
                          {star.primaryProfessions && (
                            <span className="text-xs text-muted-foreground truncate">
                              {star.primaryProfessions.join(", ")}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}