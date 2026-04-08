import Image from "next/image";
import { Title } from "@/services/imdb";

interface FlyoutMenuProps {
  label: string;
  items: Title[];
}

export function FlyoutMenu({ label, items }: FlyoutMenuProps) {
  return (
    <div className="relative group">
      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground cursor-pointer py-2">
        {label}
      </span>
      <div className="absolute left-1/2 -translate-x-1/2 top-full w-[600px] pt-4 z-50 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out">
        <div className="rounded-lg border border-border bg-background p-4 shadow-lg">
          <div className="mb-4 pb-2 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">
              {label === "Top 10 Filmes" 
                ? "Top 10 filmes mais bem avaliados" 
                : label === "Lançamentos" 
                  ? "Lançamentos deste ano"
                  : "Clássicos do Cinema"}
            </h3>
          </div>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Nenhum título encontrado</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {items.map((item) => (
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
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
