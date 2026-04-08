"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { 
  TextField, 
  IconButton, 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Switch, 
  Button,
  Slider,
  CircularProgress,
  LinearProgress,
  InputAdornment
} from "@mui/material";
import { Search, FilterList, Close } from "@mui/icons-material";
import { useLenis } from "lenis/react";

export function MovieFilterBar({ defaultLimit = "4" }: { defaultLimit?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const lenis = useLenis();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [isTyping, setIsTyping] = useState(false);
  
  // Estados dos filtros
  const [limit, setLimit] = useState(searchParams.get("limit") || defaultLimit);
  const [type, setType] = useState(searchParams.get("type") || "movie");
  const [yearRange, setYearRange] = useState<number[]>([
    Number(searchParams.get("startYear")) || 1985, 
    Number(searchParams.get("endYear")) || 2026
  ]);
  
  // Gênero dos filmes filtrados
  const initialGenres = searchParams.get("genre")?.split(",") || [];
  const [genres, setGenres] = useState({
    action: initialGenres.includes("Action"),
    comedy: initialGenres.includes("Comedy"),
    drama: initialGenres.includes("Drama"),
    scifi: initialGenres.includes("Sci-Fi"),
    horror: initialGenres.includes("Horror"),
  });
  
  const [onlyAvailable, setOnlyAvailable] = useState(searchParams.get("available") === "true");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // Ajusta o número de filmes por página de acordo com a tela
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isMobileSmall = width < 640;
      const isMobileLarge = width >= 640 && width < 768;
      const isTablet = width >= 768 && width < 1024;
      
      setLimit(prev => {
        if (isMobileSmall) return "1";
        if (isMobileLarge) return "2";
        if (isTablet) return "3";
        if (prev === "1" || prev === "2" || prev === "3") return "4";
        return prev;
      });
    };

    handleResize(); // Executa na montagem
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // trava o scrollbar se o menu estiver aberto
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

  const handleGenreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGenres({
      ...genres,
      [event.target.name]: event.target.checked,
    });
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");

    if (type) params.set("type", type);
    else params.delete("type");

    const width = window.innerWidth;
    if (width < 640) {
      params.set("limit", "1");
    } else if (width < 768) {
      params.set("limit", "2");
    } else if (width < 1024) {
      params.set("limit", "3");
    } else {
      if (limit && limit !== defaultLimit) params.set("limit", limit);
      else params.delete("limit");
    }

    params.set("startYear", yearRange[0].toString());
    params.set("endYear", yearRange[1].toString());

    // Map
    const selectedGenres = [];
    if (genres.action) selectedGenres.push("Action");
    if (genres.comedy) selectedGenres.push("Comedy");
    if (genres.drama) selectedGenres.push("Drama");
    if (genres.scifi) selectedGenres.push("Sci-Fi");
    if (genres.horror) selectedGenres.push("Horror");
    
    if (selectedGenres.length > 0) {
      params.set("genre", selectedGenres.join(","));
    } else {
      params.delete("genre");
    }

    if (onlyAvailable) params.set("available", "true");
    else params.delete("available");

    // Reset para 1
    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentQ = params.get("q") || "";
    const currentLimit = params.get("limit") || defaultLimit;
    const currentType = params.get("type") || "movie";
    const currentStart = Number(params.get("startYear")) || 1985;
    const currentEnd = Number(params.get("endYear")) || 2026;
    
    const initialGenresParam = params.get("genre")?.split(",") || [];
    const currentGenres = {
      action: initialGenresParam.includes("Action"),
      comedy: initialGenresParam.includes("Comedy"),
      drama: initialGenresParam.includes("Drama"),
      scifi: initialGenresParam.includes("Sci-Fi"),
      horror: initialGenresParam.includes("Horror"),
    };
    
    const currentAvailable = params.get("available") === "true";

    const hasChanged = 
      searchQuery !== currentQ ||
      limit !== currentLimit ||
      type !== currentType ||
      yearRange[0] !== currentStart ||
      yearRange[1] !== currentEnd ||
      JSON.stringify(genres) !== JSON.stringify(currentGenres) ||
      onlyAvailable !== currentAvailable;

    if (hasChanged) {
      setIsTyping(true);
    }

    const delayDebounceFn = setTimeout(() => {
      setIsTyping(false);
      if (hasChanged) {
        applyFilters();
      }
    }, 1200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, limit, type, yearRange, genres, onlyAvailable]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleClear = () => {
    const width = window.innerWidth;
    let expectedLimit = "4";
    if (width < 640) expectedLimit = "1";
    else if (width < 768) expectedLimit = "2";
    else if (width < 1024) expectedLimit = "3";
    
    setLimit(expectedLimit);
    setType("movie");
    setYearRange([1985, 2026]);
    setGenres({ action: false, comedy: false, drama: false, scifi: false, horror: false });
    setOnlyAvailable(false);
    setSearchQuery("");
    
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="flex items-center gap-3 w-full md:w-auto">
      {/* Input de Busca */}
      <form onSubmit={handleSearch} className="flex items-center flex-1 md:flex-none min-w-0">
        <TextField
          size="small"
          fullWidth
          placeholder="Buscar por filmes, atores, etc..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="text-muted-foreground shrink-0" fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (isTyping || isPending) ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} className="text-sky-500" />
                </InputAdornment>
              ) : null,
              className: "bg-card text-foreground rounded-md w-full sm:w-64 md:w-56 lg:w-80 h-[42px]",
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--border)",
              },
              "&:hover fieldset": {
                borderColor: "var(--muted-foreground)",
              },
            }
          }}
        />
      </form>

      {/* Select limit */}
      <FormControl size="small" className="inline-flex min-w-[70px] shrink-0">
        <Select
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          onOpen={() => setIsSelectOpen(true)}
          onClose={() => setIsSelectOpen(false)}
          displayEmpty
          className="bg-card text-foreground rounded-md h-[42px]"
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--border)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--muted-foreground)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0ea5e9", // text-sky-500
            }
          }}
          MenuProps={{ 
            disableScrollLock: true,
            slotProps: {
              paper: {
                "data-lenis-prevent": true,
              } as any,
            },
          }}
        >
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
          <MenuItem value="3">3</MenuItem>
          <MenuItem value="4">4</MenuItem>
          <MenuItem value="8">8</MenuItem>
          <MenuItem value="12">12</MenuItem>
          <MenuItem value="20">20</MenuItem>
        </Select>
      </FormControl>

      {/* Botão Circular do Filtro */}
      <IconButton 
        onClick={() => setIsDrawerOpen(true)}
        className="shrink-0"
        sx={{ 
          width: '42px',
          height: '42px',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--muted)',
          '&:hover': {
            backgroundColor: 'var(--border)',
          }
        }}
      >
        <FilterList />
      </IconButton>

      {/* Tailwind Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background border-l border-border z-[210] transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Loading Indicator */}
        <Box sx={{ width: '100%', height: '2px', position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
          {(isPending || isTyping) && (
            <LinearProgress 
              sx={{ 
                backgroundColor: 'rgba(14, 165, 233, 0.2)', // sky-500 opacity
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#0ea5e9', // sky-500
                }
              }} 
            />
          )}
        </Box>

        <div className="flex items-center justify-between px-6 py-5 border-b border-border mt-1">
          <div className="flex items-center gap-2">
            <FilterList className="text-sky-500" />
            <Typography variant="h6" className="font-bold text-foreground">Filtros de Busca</Typography>
          </div>
          <IconButton onClick={() => setIsDrawerOpen(false)} size="small" className="text-muted-foreground">
            <Close />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 flex flex-col gap-6">
            {/* Filtro: Tipo */}
            <FormControl fullWidth>
              <InputLabel id="type-select-label">Tipo de Título</InputLabel>
              <Select
                labelId="type-select-label"
                value={type}
                label="Tipo de Título"
                onChange={(e) => setType(e.target.value)}
                onOpen={() => setIsSelectOpen(true)}
                onClose={() => setIsSelectOpen(false)}
                MenuProps={{ 
                  disableScrollLock: true,
                  slotProps: {
                    paper: {
                      "data-lenis-prevent": true,
                    } as any,
                  },
                }}
              >
                <MenuItem value="movie">Filmes</MenuItem>
                <MenuItem value="tvSeries">Séries</MenuItem>
                <MenuItem value="short">Curtas</MenuItem>
                <MenuItem value="documentary">Documentários</MenuItem>
              </Select>
            </FormControl>

            {/* Filtro: Ano */}
            <Box sx={{ px: 1 }}>
              <Typography gutterBottom className="text-sm text-muted-foreground mb-4">
                Ano de Lançamento ({yearRange[0]} - {yearRange[1]})
              </Typography>
              <Slider
                value={yearRange}
                onChange={(_, newValue) => setYearRange(newValue as number[])}
                valueLabelDisplay="auto"
                min={1985}
                max={2026}
                className="w-full"
              />
            </Box>

            {/* Filtro: Gêneros */}
            <Box>
              <Typography gutterBottom className="text-sm text-muted-foreground mb-2">
                Gêneros
              </Typography>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={genres.action} onChange={handleGenreChange} name="action" />} label="Ação" />
                <FormControlLabel control={<Checkbox checked={genres.comedy} onChange={handleGenreChange} name="comedy" />} label="Comédia" />
                <FormControlLabel control={<Checkbox checked={genres.drama} onChange={handleGenreChange} name="drama" />} label="Drama" />
                <FormControlLabel control={<Checkbox checked={genres.scifi} onChange={handleGenreChange} name="scifi" />} label="Ficção Científica" />
                <FormControlLabel control={<Checkbox checked={genres.horror} onChange={handleGenreChange} name="horror" />} label="Terror" />
              </FormGroup>
            </Box>

            {/* Filtro: Switches Extras */}
            <Box className="mt-2 p-4 bg-muted/30 rounded-lg border border-border/50">
              <FormControlLabel
                control={
                  <Switch 
                    checked={onlyAvailable} 
                    onChange={(e) => setOnlyAvailable(e.target.checked)} 
                  />
                }
                label="Mostrar apenas títulos lançados"
              />
            </Box>
          </div>

          <div className="p-6 border-t border-border flex gap-3 bg-background">
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={handleClear}
            >
              Padrão
            </Button>
          </div>
        </div>
      </div>
  );
}
