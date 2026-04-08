"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Title, TitleDetails, getTitleDetails } from "@/services/imdb";
import { MenuDrawer } from "../ui/MenuDrawer";
import { IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { MovieDetailsDialog } from "../dialogs/MovieDetailsDialog";
import { ActorDialog } from "../dialogs/ActorDialog";

interface MovieListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: Title[];
}

export function MovieListDrawer({ isOpen, onClose, title, items }: MovieListDrawerProps) {
  const [selectedMovie, setSelectedMovie] = useState<Title | null>(null);
  const [movieDetails, setMovieDetails] = useState<TitleDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isActorDialogOpen) handleCloseActor();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActorDialogOpen]);

  const handleMovieClick = async (movie: Title) => {
    setSelectedMovie(movie);
    setIsDetailsOpen(true);
    setMovieDetails(null);
    setIsLoadingDetails(true);

    try {
      const details = await getTitleDetails(movie.id, { info: "base_info,cast" });
      setMovieDetails(details);
    } catch (error: unknown) {
      console.warn("Erro ao buscar detalhes do filme no Drawer:", error instanceof Error ? error.message : error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setTimeout(() => {
      setSelectedMovie(null);
      setMovieDetails(null);
    }, 300);
  };

  return (
    <>
      <MenuDrawer 
      isOpen={isOpen} 
      onClose={onClose} 
      position="right"
      width="w-full sm:w-4/5 sm:max-w-[320px]"
      title={
        <div className="flex items-center gap-2">
          <IconButton 
            onClick={onClose} 
            sx={{ color: 'var(--foreground)', p: 0, mr: 1 }} 
            aria-label="Voltar"
          >
            <ArrowBack />
          </IconButton>
          <span className="font-medium text-foreground text-base">{title}</span>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pb-8">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Nenhum título encontrado</p>
        ) : (
          items.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleMovieClick(item)}
              className="flex items-center gap-3 rounded-md p-2 hover:bg-muted transition-colors cursor-pointer"
            >
              <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-muted">
                {item.primaryImage?.url ? (
                  <Image
                    src={item.primaryImage.url}
                    alt={item.primaryTitle}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="h-full w-full bg-muted-foreground/20 flex items-center justify-center text-xs text-center">
                    Sem img
                  </div>
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate" title={item.primaryTitle}>
                  {item.primaryTitle}
                </span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  {item.startYear && <span>{item.startYear}</span>}
                  {item.rating?.aggregateRating && (
                    <span className="flex items-center gap-1 text-yellow-500">
                      ★ {item.rating.aggregateRating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </MenuDrawer>

    {selectedMovie && (
      <MovieDetailsDialog
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        movie={selectedMovie}
        movieDetails={movieDetails}
        isLoading={isLoadingDetails}
        rating={selectedMovie.rating?.aggregateRating?.toFixed(1) || "N/A"}
        onOpenActor={handleOpenActor}
      />
    )}

    {selectedActorId && (
      <ActorDialog
        isOpen={isActorDialogOpen}
        onClose={handleCloseActor}
        actorId={selectedActorId}
      />
    )}
    </>
  );
}