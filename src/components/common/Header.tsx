import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { FlyoutMenu } from "./FlyoutMenu";
import { getTitles, Title } from "@/services/imdb";

export async function Header() {
  let topMovies: Title[] = [];
  let latestMovies: Title[] = [];

  try {
    const currentYear = new Date().getFullYear();
    const [moviesRes, latestMoviesRes] = await Promise.all([
      getTitles({ titleType: "movie", sort_by: "SORT_BY_USER_RATING", sort_order: "DESC" }),
      getTitles({ titleType: "movie", startYear: currentYear, sort_by: "SORT_BY_POPULARITY" })
    ]);
    topMovies = moviesRes.titles?.slice(0, 10) || [];
    latestMovies = latestMoviesRes.titles?.slice(0, 10) || [];
  } catch (error) {
    console.error("Erro ao buscar dados para o menu:", error);
  }

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Image 
            src="/images/brands/logo-viajar-faz-bem-portal.svg" 
            alt="ViajarFazBem Logo" 
            width={120} 
            height={32} 
            priority
          />
        </div>
        <nav className="flex items-center gap-8 relative">
          <span className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer py-2">
            Home
          </span>
          <FlyoutMenu label="Top 10 Filmes" items={topMovies} />
          <FlyoutMenu label="Lançamentos" items={latestMovies} />
          <FlyoutMenu label="Clássicos" items={topMovies} />
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-sm font-medium cursor-pointer">Login</span>
        </div>
      </div>
    </header>
  );
}
