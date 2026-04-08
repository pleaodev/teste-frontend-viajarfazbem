"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { batchGetTitles, Title, StarMeterEntry } from "@/services/imdb";
import { MovieCard } from "./MovieCard";
import { Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Select, MenuItem, FormControl } from "@mui/material";
import { useLenis } from "lenis/react";
import { Pagination } from "../ui/Pagination";

const DIRECTORS_LIST: StarMeterEntry[] = [
  { id: "nm0634240", displayName: "Christopher Nolan", primaryImage: { url: "https://m.media-amazon.com/images/M/MV5BNjE3NDQyOTYyMV5BMl5BanBnXkFtZTcwODcyODU2Mw@@._V1_.jpg" } },
  { id: "nm0000217", displayName: "Martin Scorsese", primaryImage: { url: "https://m.media-amazon.com/images/M/MV5BMTcyNDA4Nzk3N15BMl5BanBnXkFtZTcwNDYzMjMxMw@@._V1_.jpg" } },
  { id: "nm0000233", displayName: "Quentin Tarantino", primaryImage: { url: "https://m.media-amazon.com/images/M/MV5BMTgyMjI3ODA3Nl5BMl5BanBnXkFtZTcwNzY2MDYxOQ@@._V1_.jpg" } },
  { id: "nm0000116", displayName: "James Cameron", primaryImage: { url: "https://m.media-amazon.com/images/M/MV5BMjI0MjMzOTg2MF5BMl5BanBnXkFtZTcwMTM3NjQxMw@@._V1_.jpg" } },
  { id: "nm0000631", displayName: "Ridley Scott", primaryImage: { url: "https://m.media-amazon.com/images/M/MV5BNDM1OWUyZDktZGJmYS00MjQxLWI1OTItY2M4MWViM2NmOWM0XkEyXkFqcGc@._V1_.jpg" } },
  { id: "nm0000399", displayName: "David Fincher", primaryImage: { url: "https://m.media-amazon.com/images/M/MV5BMTc1NDkwMTQ2MF5BMl5BanBnXkFtZTcwMzY0ODkyMg@@._V1_.jpg" } },
  { id: "nm0000033", displayName: "Alfred Hitchcock", primaryImage: { url: "https://m.media-amazon.com/images/M/MV5BMjNjZDM0NGUtZmE0Yy00MTI3LThkNTYtODVlZTUzM2M4Yjk5XkEyXkFqcGc@._V1_.jpg" } },
  { id: "nm0898288", displayName: "Denis Villeneuve", primaryImage: { url: "https://m.media-amazon.com/images/M/MV5BMzU2MDk5MDI2MF5BMl5BanBnXkFtZTcwNDkwMjMzNA@@._V1_.jpg" } },
  { id: "nm0868219", displayName: "Guillermo del Toro", primaryImage: { url: "https://m.media-amazon.com/images/M/MV5BOTUzNTYwNjE0N15BMl5BanBnXkFtZTcwMjc0ODM1Mw@@._V1_.jpg" } },
  { id: "nm0000318", displayName: "Tim Burton", primaryImage: { url: "https://m.media-amazon.com/images/M/MV5BZmFhZTljMTgtMTVmMS00NWFhLWE2ZDEtYjM5YWYwZmI0NWI1XkEyXkFqcGc@._V1_.jpg" } },
  { id: "nm0594503", displayName: "Hayao Miyazaki", primaryImage: { url: "https://m.media-amazon.com/images/M/MV5BMjcyNjk2OTkwNF5BMl5BanBnXkFtZTcwOTk0MTQ3Mg@@._V1_.jpg" } }
].sort((a, b) => a.displayName.localeCompare(b.displayName));

const DIRECTOR_MOVIES_MAP: Record<string, string[]> = {
  "nm0634240": ["tt1375666", "tt0468569", "tt0816692", "tt15398776", "tt6723592"], // Christopher Nolan
  "nm0000217": ["tt0099685", "tt0993846", "tt0075314", "tt0074486", "tt1130884"], // Martin Scorsese
  "nm0000233": ["tt0110912", "tt0266697", "tt1853728", "tt0361748", "tt7131622"], // Quentin Tarantino
  "nm0000116": ["tt0120338", "tt0499549", "tt0103064", "tt0090605", "tt0088247"], // James Cameron
  "nm0000631": ["tt0172495", "tt0078748", "tt0083658", "tt3659388", "tt1179086"], // Ridley Scott
  "nm0000399": ["tt0137523", "tt0114369", "tt2267998", "tt1285016", "tt0443706"], // David Fincher
  "nm0000033": ["tt0054215", "tt0047437", "tt0051739", "tt0053125", "tt0056869"], // Alfred Hitchcock
  "nm0898288": ["tt1160419", "tt2543164", "tt3397884", "tt2872732", "tt1856101"], // Denis Villeneuve
  "nm0868219": ["tt0457430", "tt5580390", "tt0167190", "tt1663662", "tt0187738"], // Guillermo del Toro
  "nm0000318": ["tt0099487", "tt0096895", "tt0121164", "tt0094712", "tt0502257"], // Tim Burton
  "nm0594503": ["tt0245429", "tt0096283", "tt0119698", "tt0347149", "tt0876563"]  // Hayao Miyazaki
};

export function DirectorMoviesSection() {
  const lenis = useLenis();
  const [directors, setDirectors] = useState<StarMeterEntry[]>([]);
  const [selectedDirector, setSelectedDirector] = useState<StarMeterEntry | null>(null);
  const [directorMovies, setDirectorMovies] = useState<Title[]>([]);
  const [isLoadingDirectors, setIsLoadingDirectors] = useState(true);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  
  // Novos estados para filtro e paginação
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const [moviePage, setMoviePage] = useState(1);
  const [directorImgErrors, setDirectorImgErrors] = useState<Record<string, boolean>>({});
  const moviesPerPage = 4;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Lock scroll when the menu is open
  useEffect(() => {
    if (!isSelectOpen) return;
    const preventScroll = (e: WheelEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.MuiPaper-root')) return;
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    window.addEventListener('wheel', preventScroll, { passive: false, capture: true });
    window.addEventListener('touchmove', preventScroll, { passive: false, capture: true });
    return () => {
      window.removeEventListener('wheel', preventScroll, { capture: true });
      window.removeEventListener('touchmove', preventScroll, { capture: true });
    };
  }, [isSelectOpen]);

  const sectionRef = useRef<HTMLElement>(null);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasIntersected) return;

    // Simulando carregamento para manter padrão de interface
    const fetchDirectors = async () => {
      try {
        // Usa a lista estática
        setDirectors(DIRECTORS_LIST);
      } catch (error) {
        console.error("Falha ao carregar diretores:", error);
      } finally {
        setIsLoadingDirectors(false);
      }
    };
    fetchDirectors();
  }, [hasIntersected]);

  const handleDirectorClick = async (director: StarMeterEntry) => {
    if (selectedDirector?.id === director.id) return;
    
    setSelectedDirector(director);
    setIsLoadingMovies(true);
    setDirectorMovies([]);
    setMoviePage(1); // reseta a página ao mudar de diretor
    
    try {
      const movieIds = DIRECTOR_MOVIES_MAP[director.id];
      if (movieIds && movieIds.length > 0) {
        const res = await batchGetTitles(movieIds);
        const validMovies = res.titles || [];
          
        setDirectorMovies(validMovies);
      } else {
        setDirectorMovies([]);
      }
    } catch (error: any) {
      if (error?.message?.includes("429")) {
        console.warn("[DirectorMoviesSection] Rate limit (429) ao buscar filmes do diretor.");
      } else {
        console.warn("Falha ao buscar filmes do diretor:", error?.message || error);
      }
    } finally {
      setIsLoadingMovies(false);
    }
  };

  const filteredDirectors = useMemo(() => {
    if (!selectedLetter) return directors; // Mantém ordem original
    return directors
      .filter(d => d.displayName.toUpperCase().startsWith(selectedLetter))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [directors, selectedLetter]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Paginação dos filmes
  const totalMovies = directorMovies.length;
  const totalPages = Math.max(1, Math.ceil(totalMovies / moviesPerPage));
  const currentMovies = directorMovies.slice(
    (moviePage - 1) * moviesPerPage,
    moviePage * moviesPerPage
  );

  if (!hasIntersected || isLoadingDirectors) {
    return (
      <section ref={sectionRef} className="container mx-auto px-4 w-full mb-4 min-h-[300px] flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  if (directors.length === 0) {
    return <section ref={sectionRef} className="container mx-auto px-4 w-full mb-4 min-h-[300px]" />;
  }

  return (
    <section ref={sectionRef} className="container mx-auto px-4 w-full mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Filmes por Diretores</h2>
          <p className="text-muted-foreground">Selecione um diretor para ver títulos relacionados a ele</p>
        </div>

        <div className="flex items-center gap-4">
          <FormControl size="small" className="min-w-[150px] bg-background/50 rounded-md">
            <Select
              value={selectedLetter}
              onChange={(e) => setSelectedLetter(e.target.value)}
              onOpen={() => setIsSelectOpen(true)}
              onClose={() => setIsSelectOpen(false)}
              displayEmpty
              className="text-foreground border-border"
              MenuProps={{ 
                disableScrollLock: true,
                slotProps: {
                  paper: {
                    style: {
                      maxHeight: 250,
                    },
                    "data-lenis-prevent": true,
                  } as any,
                },
              }}
            >
              <MenuItem value="">Mais Famosos</MenuItem>
              {letters.map(letter => (
                <MenuItem key={letter} value={letter}>Diretores ({letter})</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Directors Carousel */}
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
          
          {filteredDirectors.map(director => (
            <div 
              key={director.id} 
              className={`flex flex-col items-center gap-3 cursor-pointer shrink-0 snap-start transition-all duration-300 hover:scale-105 ${selectedDirector?.id === director.id ? 'opacity-100' : 'opacity-100 dark:opacity-60 dark:hover:opacity-100'}`}
              onClick={() => handleDirectorClick(director)}
            >
              <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 transition-colors duration-300 ${selectedDirector?.id === director.id ? 'border-sky-700 dark:border-transparent shadow-lg shadow-sky-700/20 dark:shadow-none' : 'border-transparent'}`}>
                {(!directorImgErrors[director.id] && director.primaryImage?.url) ? (
                  <Image 
                    src={director.primaryImage.url} 
                    alt={director.displayName} 
                    width={128} 
                    height={128} 
                    sizes="(max-width: 768px) 96px, 128px"
                    className="object-cover w-full h-full bg-muted"
                    onError={() => setDirectorImgErrors(prev => ({ ...prev, [director.id]: true }))}
                  />
                ) : (
                  <Image 
                    src="/images/default/default-peaple.jpg"
                    alt={director.displayName} 
                    width={128} 
                    height={128} 
                    sizes="(max-width: 768px) 96px, 128px"
                    className="object-cover w-full h-full bg-muted"
                  />
                )}
              </div>
              <span className={`text-sm font-medium text-center max-w-[100px] md:max-w-[120px] truncate transition-colors duration-300 ${selectedDirector?.id === director.id ? 'text-sky-700 dark:text-primary' : 'text-foreground'}`}>
                {director.displayName}
              </span>
            </div>
          ))}
          {filteredDirectors.length === 0 && (
             <div className="w-full py-12 text-center text-muted-foreground">
               Nenhum diretor encontrado para a letra "{selectedLetter}".
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

      {/* Director Movies List */}
      {selectedDirector && (
        <div className="mt-4 pt-4 animate-in fade-in duration-500 slide-in-from-bottom-4">
          {isLoadingMovies ? (
            <div className="w-full flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : directorMovies.length > 0 ? (
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
              <p className="text-muted-foreground text-lg">Nenhum título encontrado para este diretor na busca.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
