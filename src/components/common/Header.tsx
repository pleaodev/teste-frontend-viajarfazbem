import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
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
        <nav className="flex items-center gap-6">
          <span className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer">
            Home
          </span>
          <span className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer">
            Filmes
          </span>
          <span className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer">
            Séries
          </span>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-sm font-medium cursor-pointer">Login</span>
        </div>
      </div>
    </header>
  );
}
