"use client";

import Image from "next/image";
import { Title } from "@/services/imdb";
import { MenuDrawer } from "../ui/MenuDrawer";
import { IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

interface MovieListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: Title[];
}

export function MovieListDrawer({ isOpen, onClose, title, items }: MovieListDrawerProps) {
  return (
    <MenuDrawer 
      isOpen={isOpen} 
      onClose={onClose} 
      position="right"
      width="w-full sm:w-4/5 sm:max-w-[320px]"
      title={
        <div className="flex items-center gap-2">
          <IconButton 
            onClick={onClose} 
            sx={{ color: 'var(--foreground)', p: 0, mr: 1 }} 
            aria-label="Voltar"
          >
            <ArrowBack />
          </IconButton>
          <span className="font-medium text-foreground text-base">{title}</span>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pb-8">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Nenhum título encontrado</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-md p-2 hover:bg-muted transition-colors cursor-pointer">
              <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-muted">
                {item.primaryImage?.url ? (
                  <Image
                    src={item.primaryImage.url}
                    alt={item.primaryTitle}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="h-full w-full bg-muted-foreground/20 flex items-center justify-center text-xs text-center">
                    Sem img
                  </div>
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate" title={item.primaryTitle}>
                  {item.primaryTitle}
                </span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  {item.startYear && <span>{item.startYear}</span>}
                  {item.rating?.aggregateRating && (
                    <span className="flex items-center gap-1 text-yellow-500">
                      ★ {item.rating.aggregateRating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </MenuDrawer>
  );
}