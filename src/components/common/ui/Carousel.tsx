"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Info, Film, X } from "lucide-react";
import { Title } from "@/services/imdb";
import { TrailerDialog } from "../dialogs/TrailerDialog";

interface CarouselProps {
  items: Title[];
}

export function Carousel({ items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTrailerTitle, setSelectedTrailerTitle] = useState<string | null>(null);

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
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [items?.length, nextSlide]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden bg-muted/30 group">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-[60vh] md:h-[500px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <article key={item.id} className="w-full flex-shrink-0 relative">
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
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
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
                        ({item.rating.voteCount.toLocaleString()} avaliações)
                      </span>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground line-clamp-3 md:line-clamp-4 text-base">
                    {item.plot || "Descrição não disponível."}
                  </p>
                  
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button 
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-sky-500/20 hover:bg-sky-500 text-sky-500 hover:text-white font-semibold rounded-md backdrop-blur-sm border border-sky-500/30 transition-all cursor-pointer"
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
              idx === currentIndex ? "bg-white w-8" : "bg-muted-foreground/50 hover:bg-muted-foreground"
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
    </div>
  );
}
