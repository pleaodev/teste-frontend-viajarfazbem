"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTransition, useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingAction, setLoadingAction] = useState<number | string | null>(null);

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", pageNumber.toString());
    return `/?${params.toString()}`;
  };

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, pageNumber: number, actionId: number | string) => {
    e.preventDefault();
    if (isPending) return;
    setLoadingAction(actionId);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", pageNumber.toString());
    startTransition(() => {
      router.push(`/?${params.toString()}`, { scroll: false });
    });
  };

  const getVisiblePages = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calcula o início e o fim da janela de 4 páginas
    let start = currentPage - 1;
    let end = start + 3;

    // Ajustes de limites
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
    <div className="flex flex-col items-center justify-center py-8 mt-4 gap-4">
      <nav aria-label="Pagination" className={`isolate inline-flex -space-x-px rounded-md shadow-sm transition-opacity duration-200 ${isPending ? 'pointer-events-none' : ''}`}>
        {/* Botão Primeiro */}
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(1)}
            onClick={(e) => handleNavigate(e, 1, 'first')}
            scroll={false}
            className="relative inline-flex items-center rounded-l-md text-muted-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0 transition-colors h-[40px] justify-center !w-[40px] !p-0"
            aria-label="Primeira Página"
            title="Primeiro"
          >
            <span className="sr-only">Primeiro</span>
            {isPending && loadingAction === 'first' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
            )}
          </Link>
        ) : (
          <button
            disabled
            className="relative inline-flex items-center rounded-l-md text-muted-foreground/50 ring-1 ring-inset ring-border/50 cursor-not-allowed focus:outline-offset-0 h-[40px] justify-center !w-[40px] !p-0"
            aria-label="Primeira Página"
            title="Primeiro"
          >
            <span className="sr-only">Primeiro</span>
            <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
          </button>
        )}

        {/* Botão Anterior */}
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            onClick={(e) => handleNavigate(e, currentPage - 1, 'prev')}
            scroll={false}
            className="relative inline-flex items-center text-muted-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0 transition-colors h-[40px] justify-center !w-[40px] !p-0"
            aria-label="Página Anterior"
          >
            <span className="sr-only">Anterior</span>
            {isPending && loadingAction === 'prev' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            )}
          </Link>
        ) : (
          <button
            disabled
            className="relative inline-flex items-center text-muted-foreground/50 ring-1 ring-inset ring-border/50 cursor-not-allowed focus:outline-offset-0 h-[40px] justify-center !w-[40px] !p-0"
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
              href={createPageUrl(page)}
              onClick={(e) => handleNavigate(e, page, page)}
              scroll={false}
              aria-current={isCurrent ? "page" : undefined}
              className={`relative inline-flex items-center justify-center text-sm font-semibold focus:z-20 focus:outline-offset-0 transition-colors ring-1 ring-inset h-[40px] !w-[40px] !p-0 ${
                isCurrent
                  ? "z-10 bg-sky-500 text-white ring-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  : "text-foreground ring-border hover:bg-muted"
              }`}
            >
              {isPending && loadingAction === page ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                page
              )}
            </Link>
          );
        })}

        {/* Botão Próximo */}
        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            onClick={(e) => handleNavigate(e, currentPage + 1, 'next')}
            scroll={false}
            className="relative inline-flex items-center text-muted-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0 transition-colors h-[40px] justify-center !w-[40px] !p-0"
            aria-label="Próxima Página"
          >
            <span className="sr-only">Próximo</span>
            {isPending && loadingAction === 'next' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            )}
          </Link>
        ) : (
          <button
            disabled
            className="relative inline-flex items-center text-muted-foreground/50 ring-1 ring-inset ring-border/50 cursor-not-allowed focus:outline-offset-0 h-[40px] justify-center !w-[40px] !p-0"
            aria-label="Próxima Página"
          >
            <span className="sr-only">Próximo</span>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        )}

        {/* Botão Última */}
        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(totalPages)}
            onClick={(e) => handleNavigate(e, totalPages, 'last')}
            scroll={false}
            className="relative inline-flex items-center rounded-r-md text-muted-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0 transition-colors h-[40px] justify-center !w-[40px] !p-0"
            aria-label="Última Página"
            title="Última"
          >
            <span className="sr-only">Última</span>
            {isPending && loadingAction === 'last' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ChevronsRight className="h-5 w-5" aria-hidden="true" />
            )}
          </Link>
        ) : (
          <button
            disabled
            className="relative inline-flex items-center rounded-r-md text-muted-foreground/50 ring-1 ring-inset ring-border/50 cursor-not-allowed focus:outline-offset-0 h-[40px] justify-center !w-[40px] !p-0"
            aria-label="Última Página"
            title="Última"
          >
            <span className="sr-only">Última</span>
            <ChevronsRight className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </nav>
    </div>
  );
}
