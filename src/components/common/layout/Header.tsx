import Image from "next/image";
import { ThemeToggle } from "../ui/ThemeToggle";
import { FlyoutMenu } from "./FlyoutMenu";
import { getTitles, Title } from "@/services/imdb";
import { HeaderScrollWrapper } from "./HeaderScrollWrapper";

export async function Header() {
  let topMovies: Title[] = [];
  let latestMovies: Title[] = [];
  let classicMovies: Title[] = [];

  try {
    const currentYear = new Date().getFullYear();
    const [moviesRes, latestMoviesRes, classicMoviesRes] = await Promise.all([
      getTitles({ titleType: "movie", sort_by: "SORT_BY_USER_RATING", sort_order: "DESC" }),
      getTitles({ titleType: "movie", startYear: currentYear, sort_by: "SORT_BY_POPULARITY" }),
      getTitles({ titleType: "movie", endYear: 1995, sort_by: "SORT_BY_POPULARITY" })
    ]);
    
    topMovies = moviesRes.titles?.slice(0, 10) || [];
    latestMovies = latestMoviesRes.titles?.slice(0, 10) || [];
    classicMovies = classicMoviesRes.titles?.filter(t => t.type === "movie").slice(0, 10) || [];
    if (classicMovies.length < 10) {
      classicMovies = classicMoviesRes.titles?.slice(0, 10) || [];
    }
  } catch (error: any) {
    if (error?.message?.includes("429")) {
      console.warn("[Header] Rate limit (429) ao buscar dados para o menu.");
    } else {
      console.warn("Erro ao buscar dados para o menu:", error?.message || error);
    }
  }

  return (
    <HeaderScrollWrapper>
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
        <FlyoutMenu label="Clássicos" items={classicMovies} />
      </nav>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <span className="text-sm font-medium cursor-pointer">Login</span>
      </div>
    </HeaderScrollWrapper>
  );
}
