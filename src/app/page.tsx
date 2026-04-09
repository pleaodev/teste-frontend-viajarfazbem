import { getTitles } from "@/services/imdb";
import { Carousel, AllMoviesSection, ActorMoviesSection, DirectorMoviesSection, TrendingMoviesSection } from "@/components/common";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const type = (params?.type as string) || "movie";

  // Listagem carousel (Padrão)
  let topMovies: any[] = [];
  let defaultResponse = { titles: [] };
  let apiError = false;

  try {
    const response = await getTitles({
      titleType: type,
      sort_by: "SORT_BY_POPULARITY",
    });
    defaultResponse = response as any;
    
    // Filtro adicional no cliente (fallback), caso a API retorne algo inesperado ou caso type seja ignorado pela API
    let validTitles = (defaultResponse.titles || []).filter((title: any) => title.type === type || !title.type);
    
    // Se não houver nenhum dado para mostrar no filtro selecionado, o carousel fará fallback e listará filmes
    if (validTitles.length === 0 && type !== "movie") {
      const fallbackResponse = await getTitles({
        titleType: "movie",
        sort_by: "SORT_BY_POPULARITY",
      });
      const fallbackData = fallbackResponse as any;
      validTitles = (fallbackData.titles || []).filter((title: any) => title.type === "movie" || !title.type);
    }
    
    topMovies = validTitles.slice(0, 10);
  } catch (error: any) {
    if (error?.message?.includes("429")) {
      console.warn("[Home] Rate limit (429) ao buscar top movies.");
    } else {
      console.warn("Erro ao buscar top movies:", error?.message || error);
    }
    apiError = true;
  }

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Seção do Carrossel Hero */}
      <section className="w-full relative">
        {/* Filtro Global sobre o Carrossel */}
        <div className="absolute top-6 md:top-8 inset-x-0 z-20 pointer-events-none">
          <div className="container mx-auto px-4">
            <div className="inline-flex items-center gap-4 md:gap-6 pointer-events-auto dark:drop-shadow-md">
              <Link 
                href="/?type=movie" 
                className={`text-sm md:text-base font-semibold transition-colors ${type === 'movie' ? 'text-foreground dark:text-white' : 'text-gray-400 hover:text-foreground dark:text-gray-400 dark:hover:text-gray-300'}`}
              >
                Filmes
              </Link>
              <Link 
                href="/?type=tvSeries" 
                className={`text-sm md:text-base font-semibold transition-colors ${type === 'tvSeries' ? 'text-foreground dark:text-white' : 'text-gray-400 hover:text-foreground dark:text-gray-400 dark:hover:text-gray-300'}`}
              >
                Séries
              </Link>
              <Link 
                href="/?type=documentary" 
                className={`text-sm md:text-base font-semibold transition-colors ${type === 'documentary' ? 'text-foreground dark:text-white' : 'text-gray-400 hover:text-foreground dark:text-gray-400 dark:hover:text-gray-300'}`}
              >
                Documentários
              </Link>
            </div>
          </div>
        </div>

        <Carousel items={topMovies} />
      </section>
      
      {/* Seção de Tendências */}
      <TrendingMoviesSection searchParams={searchParams} />

      {/* Seção de Listagem de Todos os Filmes */}
      <AllMoviesSection searchParams={searchParams} />

      {/* Seção de Listagem de Filmes por Atores */}
      <ActorMoviesSection type={type} />

      {/* Seção de Listagem de Filmes por Diretores */}
      <DirectorMoviesSection type={type} />
    </div>
  );
}
