import { getTitles } from "@/services/imdb";
import { MovieCard } from "./MovieCard";
import { Pagination } from "../ui/Pagination";
import { headers } from "next/headers";
import { Suspense } from "react";
import { MovieCardSkeleton } from "./MovieCardSkeleton";

function TrendingMoviesSkeletonGrid({ limit }: { limit: number }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
      <div className="w-full flex flex-col md:flex-row items-center justify-between py-8">
        <div className="h-10 w-full md:w-1/2 bg-muted rounded-md animate-pulse" />
        <div className="h-5 w-24 bg-muted rounded animate-pulse mt-4 md:mt-0" />
      </div>
    </>
  );
}

async function TrendingMoviesList({ type, page, limit }: any) {
  let apiError = false;
  let filteredMovies: any[] = [];
  
  try {
    const apiLimit = Math.max(50, Math.ceil(((page + 1) * limit) / 50) * 50);

    const filterRes = await getTitles({
      titleType: type,
      sort_by: "SORT_BY_POPULARITY",
      minVoteCount: 10000,
      minAggregateRating: 8.0,
      limit: apiLimit
    });
    filteredMovies = filterRes.titles || [];
  } catch (error: any) {
    if (error?.message?.includes("429")) {
      console.warn("[TrendingMoviesSection] Rate limit (429) ao buscar filmes.");
    } else {
      console.warn("Erro ao buscar trending movies:", error?.message || error);
    }
    apiError = true;
  }

  // Filtro local
  if (type) {
    filteredMovies = filteredMovies.filter(movie => {
      let matches = true;
      if (movie.type && movie.type !== type) matches = false;
      return matches;
    });
  }

  // Paginação local garantida
  let totalPages = Math.ceil(filteredMovies.length / limit) || 1;
  const listMovies = filteredMovies.slice((page - 1) * limit, page * limit);

  // Override da query string parameter name for pagination
  const paginationQueryParam = "trendingPage";

  if (apiError) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
          <p className="text-xl text-red-500 font-medium">Ops! Muitas buscas simultâneas.</p>
          <p className="text-muted-foreground">Atingimos o limite de requisições da API. Por favor, aguarde alguns instantes e tente novamente.</p>
        </div>
        <div className="w-full flex flex-col md:flex-row items-center justify-between py-8">
          <Pagination currentPage={page} totalPages={Math.max(1, page - 1)} queryParam={paginationQueryParam} />
          <div className="text-sm text-muted-foreground font-medium mt-4 md:mt-0">
            Página {page} de {Math.max(1, page - 1)}
          </div>
        </div>
      </>
    );
  }

  if (listMovies.length > 0) {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listMovies.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        
        <div className="w-full flex flex-col md:flex-row items-center justify-between py-8">
          <Pagination currentPage={page} totalPages={totalPages} queryParam={paginationQueryParam} />
          <div className="text-sm text-muted-foreground font-medium mt-4 md:mt-0">
            Página {page} de {totalPages}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
        <p className="text-xl text-muted-foreground">
          Nenhuma tendência encontrada nesta página.
        </p>
      </div>
      
      <div className="w-full flex flex-col md:flex-row items-center justify-between mt-8 py-8">
        <Pagination currentPage={page} totalPages={totalPages} queryParam={paginationQueryParam} />
        <div className="text-sm text-muted-foreground font-medium mt-4 md:mt-0">
          Página {page} de {totalPages}
        </div>
      </div>
    </>
  );
}

export async function TrendingMoviesSection({
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
  
  const page = Number(params?.trendingPage) || 1;
  let limit = defaultLimit; 
  
  const type = (params?.type as string) || "movie";

  return (
    <section className="container mx-auto px-4 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Tendências
          </h2>
          <p className="text-muted-foreground">
            Os {type === "movie" ? "filmes" : type === "tvSeries" ? "séries" : "documentários"} mais votados e com as melhores avaliações
          </p>
        </div>
      </div>

      <Suspense 
        key={JSON.stringify({ type, page, limit })} 
        fallback={<TrendingMoviesSkeletonGrid limit={limit} />}
      >
        <TrendingMoviesList 
          type={type} 
          page={page} 
          limit={limit} 
        />
      </Suspense>
    </section>
  );
}
