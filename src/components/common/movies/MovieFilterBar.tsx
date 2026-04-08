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
  CircularProgress
} from "@mui/material";
import { Search, FilterList, Close } from "@mui/icons-material";
import { useLenis } from "lenis/react";

export function MovieFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const lenis = useLenis();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [isTyping, setIsTyping] = useState(false);
  
  // Estados dos filtros
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
  }, [searchQuery, type, yearRange, genres, onlyAvailable]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleClear = () => {
    setType("movie");
    setYearRange([1985, 2026]);
    setGenres({ action: false, comedy: false, drama: false, scifi: false, horror: false });
    setOnlyAvailable(false);
    setSearchQuery("");
    
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="flex items-center gap-3">
      {/* Spinner */}
      {(isPending || isTyping) && (
        <CircularProgress size={20} className="text-sky-500" />
      )}

      {/* Input de Busca */}
      <form onSubmit={handleSearch} className="flex items-center">
        <TextField
          size="small"
          placeholder="Buscar por filmes, atores, etc..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <Search className="text-muted-foreground mr-2" fontSize="small" />,
              className: "bg-card text-foreground rounded-md w-[200px] sm:w-64 md:w-80",
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
            }
          }}
        />
      </form>

      {/* Botão Circular do Filtro */}
      <IconButton 
        color="primary" 
        onClick={() => setIsDrawerOpen(true)}
        sx={{ 
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <FilterList />
      </IconButton>

      {/* Tailwind Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-black border-l border-border z-[210] transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <Typography variant="h6" className="font-bold text-foreground">Filtros de Busca</Typography>
          <IconButton onClick={() => setIsDrawerOpen(false)} size="small" className="text-muted-foreground">
            <Close />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 flex flex-col gap-6">
            {/* Filtro: Tipo */}
            <FormControl fullWidth size="small">
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

          <div className="p-6 border-t border-border flex gap-3 bg-black">
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
