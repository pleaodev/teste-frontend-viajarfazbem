"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTransition, useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingAction, setLoadingAction] = useState<number | string | null>(null);

  const createPageUrl = (pageNumber: number) => {
    if (onPageChange) return "#";
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", pageNumber.toString());
    return `/?${params.toString()}`;
  };

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, pageNumber: number, actionId: number | string) => {
    e.preventDefault();
    if (isPending) return;
    
    if (onPageChange) {
      onPageChange(pageNumber);
      return;
    }

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

  const PageItem = ({ 
    href, onClick, className, children, ariaLabel, title, ariaCurrent, disabled 
  }: any) => {
    if (disabled) {
      return (
        <button disabled className={className} aria-label={ariaLabel} title={title}>
          {children}
        </button>
      );
    }
    
    if (onPageChange) {
      return (
        <button onClick={onClick} className={className} aria-label={ariaLabel} title={title} aria-current={ariaCurrent}>
          {children}
        </button>
      );
    }

    return (
      <Link href={href} onClick={onClick} scroll={false} className={className} aria-label={ariaLabel} title={title} aria-current={ariaCurrent}>
        {children}
      </Link>
    );
  };

  return (
    <div className="flex items-center">
      <nav aria-label="Pagination" className={`isolate inline-flex gap-2 transition-opacity duration-200 ${isPending ? 'pointer-events-none' : ''}`}>
        {/* Botão Primeiro */}
        <PageItem
          href={createPageUrl(1)}
          onClick={(e: any) => handleNavigate(e, 1, 'first')}
          disabled={currentPage <= 1}
          className={`relative inline-flex items-center rounded-full justify-center !w-[40px] h-[40px] !p-0 shadow-sm focus:outline-offset-0 ${currentPage <= 1 ? 'text-muted-foreground/50 ring-1 ring-inset ring-border/50 cursor-not-allowed' : 'text-muted-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 transition-colors'}`}
          ariaLabel="Primeira Página"
          title="Primeiro"
        >
          <span className="sr-only">Primeiro</span>
          {isPending && loadingAction === 'first' ? <Loader2 className="h-5 w-5 animate-spin" /> : <ChevronsLeft className="h-5 w-5" aria-hidden="true" />}
        </PageItem>

        {/* Botão Anterior */}
        <PageItem
          href={createPageUrl(currentPage - 1)}
          onClick={(e: any) => handleNavigate(e, currentPage - 1, 'prev')}
          disabled={currentPage <= 1}
          className={`relative inline-flex items-center rounded-full justify-center !w-[40px] h-[40px] !p-0 shadow-sm focus:outline-offset-0 ${currentPage <= 1 ? 'text-muted-foreground/50 ring-1 ring-inset ring-border/50 cursor-not-allowed' : 'text-muted-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 transition-colors'}`}
          ariaLabel="Página Anterior"
          title="Anterior"
        >
          <span className="sr-only">Anterior</span>
          {isPending && loadingAction === 'prev' ? <Loader2 className="h-5 w-5 animate-spin" /> : <ChevronLeft className="h-5 w-5" aria-hidden="true" />}
        </PageItem>

        {/* Números das Páginas */}
        {pages.map((page) => {
          const isCurrent = page === currentPage;
          return (
            <PageItem
              key={page}
              href={createPageUrl(page)}
              onClick={(e: any) => handleNavigate(e, page, page)}
              ariaCurrent={isCurrent ? "page" : undefined}
              className={`relative inline-flex items-center justify-center rounded-full text-sm font-semibold focus:z-20 focus:outline-offset-0 transition-colors ring-1 ring-inset h-[40px] !w-[40px] !p-0 shadow-sm ${
                isCurrent
                  ? "z-10 bg-sky-500 text-white ring-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  : "text-foreground ring-border hover:bg-muted"
              }`}
            >
              {isPending && loadingAction === page ? <Loader2 className="h-4 w-4 animate-spin" /> : page}
            </PageItem>
          );
        })}

        {/* Botão Próximo */}
        <PageItem
          href={createPageUrl(currentPage + 1)}
          onClick={(e: any) => handleNavigate(e, currentPage + 1, 'next')}
          disabled={currentPage >= totalPages}
          className={`relative inline-flex items-center rounded-full justify-center !w-[40px] h-[40px] !p-0 shadow-sm focus:outline-offset-0 ${currentPage >= totalPages ? 'text-muted-foreground/50 ring-1 ring-inset ring-border/50 cursor-not-allowed' : 'text-muted-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 transition-colors'}`}
          ariaLabel="Próxima Página"
          title="Próximo"
        >
          <span className="sr-only">Próximo</span>
          {isPending && loadingAction === 'next' ? <Loader2 className="h-5 w-5 animate-spin" /> : <ChevronRight className="h-5 w-5" aria-hidden="true" />}
        </PageItem>

        {/* Botão Última */}
        <PageItem
          href={createPageUrl(totalPages)}
          onClick={(e: any) => handleNavigate(e, totalPages, 'last')}
          disabled={currentPage >= totalPages}
          className={`relative inline-flex items-center rounded-full justify-center !w-[40px] h-[40px] !p-0 shadow-sm focus:outline-offset-0 ${currentPage >= totalPages ? 'text-muted-foreground/50 ring-1 ring-inset ring-border/50 cursor-not-allowed' : 'text-muted-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 transition-colors'}`}
          ariaLabel="Última Página"
          title="Última"
        >
          <span className="sr-only">Última</span>
          {isPending && loadingAction === 'last' ? <Loader2 className="h-5 w-5 animate-spin" /> : <ChevronsRight className="h-5 w-5" aria-hidden="true" />}
        </PageItem>
      </nav>
    </div>
  );
}
