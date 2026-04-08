import { getTitles } from "@/services/imdb";
import { Carousel, AllMoviesSection, ActorMoviesSection, DirectorMoviesSection } from "@/components/common";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Listagem carousel (Padrão)
  let topMovies: any[] = [];
  let defaultResponse = { titles: [] };
  let apiError = false;

  try {
    const response = await getTitles({
      titleType: "movie",
      sort_by: "SORT_BY_POPULARITY",
    });
    defaultResponse = response as any;
    topMovies = (defaultResponse.titles || []).slice(0, 10);
  } catch (error) {
    console.error("Erro ao buscar top movies:", error);
    apiError = true;
  }

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Seção do Carrossel Hero */}
      <section className="w-full">
        <Carousel items={topMovies} />
      </section>
      
      {/* Seção de Listagem de Todos os Filmes */}
      <AllMoviesSection searchParams={searchParams} />

      {/* Seção de Listagem de Filmes por Atores */}
      <ActorMoviesSection />

      {/* Seção de Listagem de Filmes por Diretores */}
      <DirectorMoviesSection />
    </div>
  );
}
