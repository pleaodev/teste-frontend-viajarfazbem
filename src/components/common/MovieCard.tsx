"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Film, Info, X, Clock, Calendar, Users, Clapperboard, Loader2 } from "lucide-react";
import { Title, TitleDetails, getTitleDetails } from "@/services/imdb";

interface MovieCardProps {
  movie: Title;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isTrailerClosing, setIsTrailerClosing] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDetailsClosing, setIsDetailsClosing] = useState(false);
  const [movieDetails, setMovieDetails] = useState<TitleDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const rating = movie.rating?.aggregateRating?.toFixed(1) || "N/A";
  const image = movie.primaryImage?.url || "/images/placeholder.jpg";

  const closeTrailer = () => {
    setIsTrailerClosing(true);
    setTimeout(() => {
      setIsTrailerOpen(false);
      setIsTrailerClosing(false);
    }, 300);
  };

  const closeDetails = () => {
    setIsDetailsClosing(true);
    setTimeout(() => {
      setIsDetailsOpen(false);
      setIsDetailsClosing(false);
    }, 300);
  };

  const handleOpenDetails = async () => {
    setIsDetailsOpen(true);
    if (!movieDetails) {
      setIsLoadingDetails(true);
      try {
        const details = await getTitleDetails(movie.id, { info: "base_info,cast" });
        setMovieDetails(details);
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
      } finally {
        setIsLoadingDetails(false);
      }
    }
  };

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Imagem do Filme */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        {movie.primaryImage?.url ? (
          <Image
            src={movie.primaryImage.url}
            alt={movie.primaryTitle}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            Sem Imagem
          </div>
        )}
        
        {/* Rating Flutuante */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-sm font-medium text-yellow-500 border border-white/10 shadow-sm">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>{rating}</span>
        </div>

        {/* Gradiente inferior para melhor legibilidade */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Conteúdo do Card */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-blue-500 transition-colors" title={movie.primaryTitle}>
            {movie.primaryTitle}
          </h3>
          {movie.startYear && (
            <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {movie.startYear}
            </span>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
          {movie.plot || "Descrição não disponível para este título."}
        </p>

        {/* Botões */}
        <div className="mt-auto flex items-center gap-2">
          <button 
            onClick={handleOpenDetails}
            className="flex-1 flex items-center justify-center gap-2 rounded-md bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-600/20 py-2.5 text-sm font-semibold transition-all duration-300"
          >
            <Info className="h-4 w-4" />
            Ver Mais
          </button>
          <button 
            onClick={() => setIsTrailerOpen(true)}
            className="flex-1 flex h-[42px] px-4 items-center justify-center gap-2 rounded-md bg-muted/50 hover:bg-white hover:text-black text-foreground border border-border py-2.5 text-sm font-semibold transition-all duration-300"
            title="Assistir Trailer"
          >
            <Film className="h-4 w-4" />
            Trailer
          </button>
        </div>
      </div>
    </div>

    {/* Dialog do Trailer */}
    {isTrailerOpen && (
      <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm ${isTrailerClosing ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={closeTrailer}>
        <div className={`relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl ${isTrailerClosing ? 'animate-fade-out-down' : 'animate-fade-in-up'}`} onClick={e => e.stopPropagation()}>
          {/* Botão Fechar */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              closeTrailer();
            }}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-red-600 transition-colors border border-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Vídeo do YouTube (Busca automática pelo título do filme) */}
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(movie.primaryTitle + " trailer")}&autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    )}

    {/* Dialog de Detalhes do Filme */}
    {isDetailsOpen && (
      <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 md:p-8 backdrop-blur-sm ${isDetailsClosing ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={closeDetails}>
        <div className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl border border-border shadow-2xl ${isDetailsClosing ? 'animate-fade-out-down' : 'animate-fade-in-up'}`} onClick={e => e.stopPropagation()}>
          {/* Botão Fechar */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              closeDetails();
            }}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-red-600 transition-colors border border-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {isLoadingDetails ? (
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
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-muted">
                    <Clapperboard className="h-16 w-16 opacity-50" />
                  </div>
                )}
                {/* Degradê para transição suave na versão mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent md:hidden" />
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
                      <span key={genre} className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-500 text-xs font-medium border border-blue-600/20">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* Sinopse */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 border-b border-border pb-2">
                    <Info className="h-5 w-5 text-blue-500" />
                    Sinopse
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {movieDetails?.plot || movie.plot || "Nenhuma sinopse disponível para este título."}
                  </p>
                </div>

                {/* Elenco */}
                {movieDetails?.stars && movieDetails.stars.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-border pb-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      Elenco Principal
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {movieDetails.stars.map(star => (
                        <div key={star.id} className="flex items-center gap-3 bg-muted/30 p-2 rounded-lg border border-border/50">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0">
                            {star.primaryImage?.url ? (
                              <Image 
                                src={star.primaryImage.url} 
                                alt={star.displayName} 
                                fill 
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  );
}
