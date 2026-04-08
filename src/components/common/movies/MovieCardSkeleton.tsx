"use client";

import { Info, Film } from "lucide-react";

export function MovieCardSkeleton() {
  return (
    <article className="group relative flex flex-col h-[726px] overflow-hidden rounded-xl bg-card border border-border/50 animate-pulse">
      {/* Imagem do Filme Skeleton */}
      <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden bg-muted rounded-t-xl z-0" />

      {/* Conteúdo do Card */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="h-5 bg-muted rounded w-12" />
        </div>
        
        <div className="space-y-2 mt-2 mb-4 flex-1">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-4/6" />
        </div>

        {/* Botões */}
        <div className="mt-auto flex items-center gap-2">
          <div className="flex-1 h-[42px] rounded-md bg-muted" />
          <div className="flex h-[42px] w-[42px] xl:flex-1 md:flex-none rounded-md bg-muted" />
        </div>
      </div>
    </article>
  );
}
