import { getTitles } from "@/services/imdb";
import { Carousel } from "@/components/common/Carousel";

export default async function Home() {
  const response = await getTitles({
    titleType: "movie",
    sort_by: "SORT_BY_POPULARITY",
    limit: 10,
  });

  const topMovies = response.titles?.slice(0, 10) || [];

  return (
    <div className="flex flex-col gap-12 pb-12 pt-8">
      <section className="container mx-auto px-4 w-full">
        <Carousel items={topMovies} />
      </section>
      
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6 text-center container mx-auto px-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Bem-vindo ao ViajarFazBem
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Comece a viajar em sua próxima aventura conosco. Encontre os melhores filmes e séries.
        </p>
      </div>
    </div>
  );
}
