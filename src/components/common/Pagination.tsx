import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  // Função para gerar os botões visíveis (máximo de 4 botões)
  const getVisiblePages = () => {
    // Se o total de páginas for 4 ou menos, mostra todas
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calcula o início e o fim da janela de 4 páginas
    let start = currentPage - 1; // Tenta colocar a página atual na segunda posição
    let end = start + 3; // +3 porque já temos o 'start', totalizando 4 páginas

    // Ajustes de limites (não pode passar de 1 nem de totalPages)
    if (start < 1) {
      start = 1;
      end = 4;
    } else if (end > totalPages) {
      end = totalPages;
      start = totalPages - 3;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pages = getVisiblePages();

  return (
    <div className="flex items-center justify-center py-8 mt-4">
      <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
        {/* Botão Anterior */}
        {currentPage > 1 ? (
          <Link
            href={`/?page=${currentPage - 1}`}
            scroll={false}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-muted-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0 transition-colors"
            aria-label="Página Anterior"
          >
            <span className="sr-only">Anterior</span>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
        ) : (
          <button
            disabled
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-muted-foreground/50 ring-1 ring-inset ring-border/50 cursor-not-allowed focus:outline-offset-0"
            aria-label="Página Anterior"
          >
            <span className="sr-only">Anterior</span>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
        )}

        {/* Números das Páginas */}
        {pages.map((page) => {
          const isCurrent = page === currentPage;
          return (
            <Link
              key={page}
              href={`/?page=${page}`}
              scroll={false}
              aria-current={isCurrent ? "page" : undefined}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 transition-colors ring-1 ring-inset ${
                isCurrent
                  ? "z-10 bg-blue-600 text-white ring-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  : "text-foreground ring-border hover:bg-muted"
              }`}
            >
              {page}
            </Link>
          );
        })}

        {/* Botão Próximo */}
        {currentPage < totalPages ? (
          <Link
            href={`/?page=${currentPage + 1}`}
            scroll={false}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-muted-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0 transition-colors"
            aria-label="Próxima Página"
          >
            <span className="sr-only">Próximo</span>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        ) : (
          <button
            disabled
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-muted-foreground/50 ring-1 ring-inset ring-border/50 cursor-not-allowed focus:outline-offset-0"
            aria-label="Próxima Página"
          >
            <span className="sr-only">Próximo</span>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </nav>
    </div>
  );
}
