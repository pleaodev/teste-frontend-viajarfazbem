import { getTitles, searchTitles } from "@/services/imdb";
import { MovieCard, MovieFilterBar } from "@/components/common";
import { Pagination } from "@/components/common";
import { headers } from "next/headers";

export async function AllMoviesSection({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /mobile|android|iphone|phone/i.test(userAgent);
  const isTablet = /ipad|tablet/i.test(userAgent) && !isMobile;
  
  let defaultLimit = 4;
  if (isMobile) defaultLimit = 1;
  else if (isTablet) defaultLimit = 3;
  
  const page = Number(params?.page) || 1;

  let limit = Number(params?.limit) || defaultLimit;
  if (isMobile) {
    limit = 1;
  } else if (isTablet) {
    limit = 3;
  }
  
  // Filtros
  const q = params?.q as string | undefined;
  const type = (params?.type as string) || "movie";
  const startYear = params?.startYear ? Number(params.startYear) : undefined;
  const endYear = params?.endYear ? Number(params.endYear) : undefined;
  const genre = params?.genre as string | undefined;

  let apiError = false;
  let filteredMovies: any[] = [];
  
  try {
    const apiLimit = Math.max(50, Math.ceil((page * limit) / 50) * 50);

    if (q) {
      const searchRes = await searchTitles(q, { limit: apiLimit });
      filteredMovies = searchRes.titles || [];
    } else {
      const filterRes = await getTitles({
        titleType: type,
        sort_by: "SORT_BY_POPULARITY",
        startYear: startYear,
        endYear: endYear,
        genre: genre,
        limit: apiLimit
      });
      filteredMovies = filterRes.titles || [];
    }
  } catch (error: any) {
    if (error?.message?.includes("429")) {
      console.warn("[AllMoviesSection] Rate limit (429) ao buscar filmes.");
    } else {
      console.warn("Erro ao buscar filtered movies:", error?.message || error);
    }
    apiError = true;
  }

  // Filtro local para garantir resultados corretos
  let rawApiCount = filteredMovies.length;
  if (type || startYear || endYear || genre) {
    filteredMovies = filteredMovies.filter(movie => {
      let matches = true;
      if (type && movie.type && movie.type !== type) matches = false;
      if (startYear && movie.startYear && movie.startYear < startYear) matches = false;
      if (endYear && movie.startYear && movie.startYear > endYear) matches = false;
      if (genre && movie.genres) {
        const selectedGenres = genre.split(",");
        if (!selectedGenres.some(g => movie.genres?.includes(g))) matches = false;
      }
      return matches;
    });
  }

  // Paginação local garantida
  let totalPages = Math.ceil(filteredMovies.length / limit) || 1;
  const listMovies = filteredMovies.slice((page - 1) * limit, page * limit);
  
  // Se a API retornou o lote cheio, pode haver mais filmes no servidor.
  const apiLimitCalculated = Math.max(50, Math.ceil((page * limit) / 50) * 50);
  if (rawApiCount >= apiLimitCalculated && page >= totalPages && listMovies.length > 0) {
    totalPages = page + 1;
  }

  return (
    <section className="container mx-auto px-4 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Todos os Filmes</h2>
          <p className="text-muted-foreground">Explore nossa coleção completa de títulos e encontre seus favoritos</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <MovieFilterBar defaultLimit={defaultLimit.toString()} />
        </div>
      </div>

      {apiError ? (
        <>
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
            <p className="text-xl text-red-500 font-medium">Ops! Muitas buscas simultâneas.</p>
            <p className="text-muted-foreground">Atingimos o limite de requisições da API. Por favor, aguarde alguns instantes e tente novamente.</p>
          </div>
          {/* Mantém a paginação visível mesmo em caso de erro, permitindo que o usuário volte para uma página válida */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between py-8">
            <Pagination currentPage={page} totalPages={Math.max(1, page - 1)} />
            <div className="text-sm text-muted-foreground font-medium mt-4 md:mt-0">
              Página {page} de {Math.max(1, page - 1)}
            </div>
          </div>
        </>
      ) : listMovies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listMovies.map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          
          <div className="w-full flex flex-col md:flex-row items-center justify-between py-8">
            <Pagination currentPage={page} totalPages={totalPages} />
            <div className="text-sm text-muted-foreground font-medium mt-4 md:mt-0">
              Página {page} de {totalPages}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
            <p className="text-xl text-muted-foreground">Nenhum filme encontrado nesta página.</p>
          </div>
          
          {/* Mantém a paginação visível mesmo sem resultados, permitindo que o usuário volte */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between mt-8 py-8">
            <Pagination currentPage={page} totalPages={totalPages} />
            <div className="text-sm text-muted-foreground font-medium mt-4 md:mt-0">
              Página {page} de {totalPages}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
