import { getTitles } from "@/services/imdb";
import { Carousel } from "@/components/common/Carousel";
import { MovieCard } from "@/components/common/MovieCard";
import { Pagination } from "@/components/common/Pagination";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const limit = 4;
  const response = await getTitles({
    titleType: "movie",
    sort_by: "SORT_BY_POPULARITY",
  });

  const allMovies = response.titles || [];
  
  // Os 10 primeiros para o carrossel
  const topMovies = allMovies.slice(0, 10);
  
  // Paginação simulada no array de 50 itens retornado pela API
  const totalPages = Math.ceil(allMovies.length / limit) || 1;
  const listMovies = allMovies.slice((page - 1) * limit, page * limit);

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Seção do Carrossel Hero */}
      <section className="w-full">
        <Carousel items={topMovies} />
      </section>
      
      {/* Seção de Listagem de Filmes */}
      <section className="container mx-auto px-4 w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Todos os Filmes</h2>
          <span className="text-sm text-muted-foreground">Página {page}</span>
        </div>

        {listMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {listMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            
            <Pagination currentPage={page} totalPages={totalPages} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
            <p className="text-xl text-muted-foreground">Nenhum filme encontrado nesta página.</p>
          </div>
        )}
      </section>
    </div>
  );
}
