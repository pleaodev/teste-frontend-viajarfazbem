"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Film, Info, Heart } from "lucide-react";
import { Title, TitleDetails, getTitleDetails } from "@/services/imdb";
import { ActorDialog } from "../dialogs/ActorDialog";
import { TrailerDialog } from "../dialogs/TrailerDialog";
import { MovieDetailsDialog } from "../dialogs/MovieDetailsDialog";
import { useFavorites } from "../providers/FavoritesProvider";

interface MovieCardProps {
  movie: Title;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [movieDetails, setMovieDetails] = useState<TitleDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [actorImgErrors, setActorImgErrors] = useState<Record<string, boolean>>({});
  
  // Dialog State de Atores
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null);
  const [isActorDialogOpen, setIsActorDialogOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(movie.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

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

  useEffect(() => {
    setImgError(false);
    setActorImgErrors({});
  }, [movie.id]);

  const rating = movie.rating?.aggregateRating?.toFixed(1) || "N/A";
  const image = (!imgError && movie.primaryImage?.url) ? movie.primaryImage.url : "/images/default/default-movie.jpg";

  const closeTrailer = () => setIsTrailerOpen(false);
  const closeDetails = () => setIsDetailsOpen(false);

  const handleTrailerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTrailerOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isActorDialogOpen) handleCloseActor();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActorDialogOpen]);

  useEffect(() => {
    let isMounted = true;

    const fetchActorsSilently = async () => {
      try {
        const details = await getTitleDetails(movie.id, { info: "base_info,cast" });
        if (isMounted) {
          setMovieDetails(details);
        }
      } catch (error: any) {
        if (error?.message?.includes("429")) {
          console.warn(`[MovieCard] Silent fetch omitido (Rate Limit 429) para: ${movie.primaryTitle}`);
        } else {
          console.warn(`[MovieCard] Silent fetch falhou para: ${movie.primaryTitle}`, error?.message || error);
        }
      }
    };

    fetchActorsSilently();

    return () => {
      isMounted = false;
    };
  }, [movie.id]);

  const handleOpenDetails = async () => {
    setIsDetailsOpen(true);
    if (!movieDetails) {
      setIsLoadingDetails(true);
      try {
        const details = await getTitleDetails(movie.id, { info: "base_info,cast" });
        setMovieDetails(details);
      } catch (error: any) {
        if (error?.message?.includes("429")) {
          console.warn("[MovieCard] Rate limit (429) ao buscar detalhes do filme.");
        } else {
          console.warn("Erro ao buscar detalhes do filme:", error?.message || error);
        }
      } finally {
        setIsLoadingDetails(false);
      }
    }
  };

  const topActors = movieDetails?.stars?.slice(0, 3) || [];

  return (
    <>
      <article 
      itemScope 
      itemType="https://schema.org/Movie"
      className="group relative flex flex-col h-full overflow-hidden rounded-xl bg-card border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg outline-none"
    >
        <meta itemProp="name" content={movie.primaryTitle} />
        <meta itemProp="image" content={image} />
        {movie.plot && <meta itemProp="description" content={movie.plot} />}
        {movie.startYear && <meta itemProp="datePublished" content={movie.startYear.toString()} />}
        {movie.rating?.aggregateRating && (
          <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating" className="hidden">
            <meta itemProp="ratingValue" content={movie.rating.aggregateRating.toString()} />
            <meta itemProp="ratingCount" content={movie.rating.voteCount?.toString() || "1"} />
          </div>
        )}
        
      {/* Imagem do Filme */}
      <div 
        className="relative aspect-[2/3] w-full shrink-0 overflow-hidden bg-muted rounded-t-xl z-0 cursor-pointer group/image"
        onClick={handleOpenDetails}
        role="button"
        tabIndex={0}
        aria-label={`Ver mais detalhes do filme ${movie.primaryTitle}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenDetails();
          }
        }}
      >
        <Image
          src={image}
          alt={movie.primaryTitle}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out scale-[1.01] group-hover/image:scale-105 will-change-transform [backface-visibility:hidden]"
          onError={() => setImgError(true)}
        />
        
        {/* Rating Flutuante */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-sm font-medium text-yellow-500 border-none shadow-sm z-10">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>{rating}</span>
        </div>

        {/* Botão Favoritar (Coração) */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 border-none ${favorite ? 'bg-black/60' : 'bg-black/40 hover:bg-black/60 text-white/90 hover:text-white'}`}
          aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          aria-pressed={favorite}
        >
          <Heart className={`h-4 w-4 transition-colors duration-300 ${favorite ? 'fill-red-500 text-red-500' : 'text-white scale-100'}`} />
        </button>

        {/* Avatares Flutuantes dos Atores */}
        {topActors.length > 0 && (
          <div className="absolute left-3 bottom-3 flex flex-col gap-2 rounded-full z-10" onClick={(e) => e.stopPropagation()}>
            {topActors.map((actor, index) => (
              <button 
                key={actor.id} 
                itemProp="actor" 
                itemScope 
                itemType="https://schema.org/Person"
                className="group/avatar relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-full"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={(e) => handleOpenActor(actor.id, e)}
                aria-label={`Ver detalhes do ator ${actor.displayName}`}
              >
                <meta itemProp="name" content={actor.displayName} />
                <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-transparent/90 overflow-hidden bg-muted shadow-sm cursor-pointer transition-transform duration-200 group-hover/avatar:scale-110">
                  {(!actorImgErrors[actor.id] && actor.primaryImage?.url) ? (
                    <Image 
                      src={actor.primaryImage.url} 
                      alt={actor.displayName} 
                      width={40} 
                      height={40} 
                      sizes="40px"
                      className="object-cover w-full h-full shadow-xx-xl border rounded-full bg-transparent/50"
                      onError={() => setActorImgErrors(prev => ({ ...prev, [actor.id]: true }))}
                    />
                  ) : (
                    <Image 
                      src="/images/default/default-peaple.jpg"
                      alt={actor.displayName} 
                      width={40} 
                      height={40} 
                      sizes="40px"
                      className="object-cover w-full h-full shadow-xx-xl border rounded-full bg-transparent/50"
                    />
                  )}
                </div>
                
                {/* Tooltip */}
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 bg-black/90 text-white text-xs font-medium whitespace-nowrap px-2.5 py-1.5 rounded-md pointer-events-none border border-white/10 backdrop-blur-md z-20 shadow-xl">
                  {actor.displayName}
                  {/* Seta do tooltip */}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-[4px] border-y-[4px] border-y-transparent border-r-[4px] border-r-black/90" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Gradiente inferior para melhor legibilidade */}
        <div className="absolute inset-x-0 bottom-0 h-[0%] dark:h-[60%] bg-gradient-to-t from-white via-white/0 to-transparent dark:from-[#0a0a0a] dark:via-[#0a0a0a]/80 pointer-events-none" />
      </div>

      {/* Conteúdo do Card */}
      <div 
        className="flex flex-1 flex-col p-5 cursor-pointer"
        onClick={handleOpenDetails}
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-sky-500 transition-colors" title={movie.primaryTitle}>
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
        <div className="mt-auto flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={handleOpenDetails}
            className="flex-1 flex h-[42px] px-4 items-center justify-center gap-2 rounded-md bg-sky-500/10 hover:bg-sky-500 text-sky-500 hover:text-white border border-sky-500/20 py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer"
            aria-label={`Ver mais detalhes do filme ${movie.primaryTitle}`}
          >
            <Info className="h-4 w-4" aria-hidden="true" />
            Ver Mais
          </button>
          <button 
            onClick={handleTrailerClick}
            className="flex h-[42px] px-4 items-center justify-center gap-2 rounded-md bg-muted/50 hover:bg-white hover:text-black text-foreground border border-border py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer flex-1 md:flex-none xl:flex-1"
            title="Assistir Trailer"
            aria-label={`Assistir trailer de ${movie.primaryTitle}`}
          >
            <Film className="h-4 w-4" aria-hidden="true" />
            <span className="md:hidden xl:inline">Trailer</span>
          </button>
        </div>
      </div>
    </article>

    {/* Dialog do Trailer */}
    <TrailerDialog
      isOpen={isTrailerOpen}
      onClose={closeTrailer}
      title={movie.primaryTitle}
    />

    {/* Dialog de Detalhes do Filme */}
    <MovieDetailsDialog
      isOpen={isDetailsOpen}
      onClose={closeDetails}
      movie={movie}
      movieDetails={movieDetails}
      isLoading={isLoadingDetails}
      rating={rating}
      onOpenActor={handleOpenActor}
    />

    {/* Dialog do Ator */}
    <ActorDialog 
      actorId={selectedActorId} 
      isOpen={isActorDialogOpen} 
      onClose={handleCloseActor} 
    />
    </>
  );
}
