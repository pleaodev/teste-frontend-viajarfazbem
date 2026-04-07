import Image from "next/image";
import { Star } from "lucide-react";
import { Title } from "@/services/imdb";

interface MovieCardProps {
  movie: Title;
}

export function MovieCard({ movie }: MovieCardProps) {
  const rating = movie.rating?.aggregateRating?.toFixed(1) || "N/A";
  const image = movie.primaryImage?.url || "/images/placeholder.jpg"; // Substitua se houver um placeholder

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Imagem do Filme */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        {movie.primaryImage?.url ? (
          <Image
            src={movie.primaryImage.url}
            alt={movie.primaryTitle}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            Sem Imagem
          </div>
        )}
        
        {/* Rating Flutuante */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-sm font-medium text-yellow-500 border border-white/10 shadow-sm">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>{rating}</span>
        </div>

        {/* Gradiente inferior para melhor legibilidade */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Conteúdo do Card */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-blue-500 transition-colors" title={movie.primaryTitle}>
            {movie.primaryTitle}
          </h3>
          {movie.startYear && (
            <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {movie.startYear}
            </span>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
          {movie.plot || "Descrição não disponível para este título."}
        </p>

        {/* Botão Ver Mais */}
        <button className="mt-auto w-full rounded-md bg-blue-600/10 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-600/20 py-2.5 text-sm font-semibold transition-all duration-300">
          Ver Mais
        </button>
      </div>
    </div>
  );
}
