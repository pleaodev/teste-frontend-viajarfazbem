"use client";

import { useState } from "react";
import Image from "next/image";
import { IconButton, Divider } from "@mui/material";
import { 
  Menu, 
  ChevronRight, 
  HomeOutlined, 
  StarBorderOutlined, 
  NewReleasesOutlined, 
  TheatersOutlined, 
  InfoOutlined, 
  DescriptionOutlined, 
  EmailOutlined, 
  Instagram, 
  Facebook, 
  Twitter 
} from "@mui/icons-material";
import { Title } from "@/services/imdb";
import { MenuDrawer } from "../ui/MenuDrawer";
import { MovieListDrawer } from "./MovieListDrawer";

interface MobileMenuProps {
  topMovies: Title[];
  latestMovies: Title[];
  classicMovies: Title[];
}

export function MobileMenu({ topMovies, latestMovies, classicMovies }: MobileMenuProps) {
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  
  const [listDrawerState, setListDrawerState] = useState<{
    isOpen: boolean;
    title: string;
    items: Title[];
  }>({
    isOpen: false,
    title: "",
    items: []
  });

  const toggleMainMenu = () => setIsMainMenuOpen(!isMainMenuOpen);

  const openListDrawer = (title: string, items: Title[]) => {
    setListDrawerState({
      isOpen: true,
      title,
      items
    });
  };

  const closeListDrawer = () => {
    setListDrawerState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="md:hidden flex items-center">
      <IconButton 
        onClick={toggleMainMenu}
        sx={{ color: 'var(--foreground)' }}
        aria-label="Menu"
      >
        <Menu />
      </IconButton>

      {/* Menu Principal */}
      <MenuDrawer 
        isOpen={isMainMenuOpen} 
        onClose={toggleMainMenu} 
        position="left"
        title={
          <Image 
            src="/images/brands/logo-viajar-faz-bem-portal.svg" 
            alt="ViajarFazBem Logo" 
            width={100} 
            height={26} 
            style={{ width: "100px", height: "auto" }}
          />
        }
      >
        <div className="flex flex-col gap-3">
          <div 
            onClick={toggleMainMenu}
            className="py-3 px-5 rounded-md hover:bg-muted cursor-pointer transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <HomeOutlined className="text-muted-foreground" fontSize="small" />
              <span className="text-sm font-medium">Home</span>
            </div>
          </div>

          <div 
            onClick={() => openListDrawer("Top 10 Filmes", topMovies)}
            className="py-3 px-4 rounded-md hover:bg-muted cursor-pointer transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 px-1">
              <StarBorderOutlined className="text-muted-foreground" fontSize="small" />
              <span className="text-sm font-medium">Top 10 Filmes</span>
            </div>
            <ChevronRight className="text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>

          <div 
            onClick={() => openListDrawer("Lançamentos", latestMovies)}
            className="py-3 px-4 rounded-md hover:bg-muted cursor-pointer transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 px-1">
              <NewReleasesOutlined className="text-muted-foreground" fontSize="small" />
              <span className="text-sm font-medium">Lançamentos</span>
            </div>
            <ChevronRight className="text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>

          <div 
            onClick={() => openListDrawer("Clássicos", classicMovies)}
            className="py-3 px-4 rounded-md hover:bg-muted cursor-pointer transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 px-1">
              <TheatersOutlined className="text-muted-foreground" fontSize="small" />
              <span className="text-sm font-medium">Clássicos</span>
            </div>
            <ChevronRight className="text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>

          <Divider className="my-2 bg-border" />

          <div 
            onClick={toggleMainMenu}
            className="py-3 px-5 rounded-md hover:bg-muted cursor-pointer transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <InfoOutlined className="text-muted-foreground" fontSize="small" />
              <span className="text-sm font-medium">Sobre nós</span>
            </div>
          </div>

          <div 
            onClick={toggleMainMenu}
            className="py-3 px-5 rounded-md hover:bg-muted cursor-pointer transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <DescriptionOutlined className="text-muted-foreground" fontSize="small" />
              <span className="text-sm font-medium">Termos e Políticas</span>
            </div>
          </div>

          <div 
            onClick={toggleMainMenu}
            className="py-3 px-5 rounded-md hover:bg-muted cursor-pointer transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <EmailOutlined className="text-muted-foreground" fontSize="small" />
              <span className="text-sm font-medium">Contato</span>
            </div>
          </div>

          <Divider className="my-2 bg-border" />

          <div className="flex items-center justify-start gap-3 py-4 px-4">
            <IconButton size="large" sx={{ color: 'var(--foreground)' }} aria-label="Instagram">
              <Instagram />
            </IconButton>
            <IconButton size="large" sx={{ color: 'var(--foreground)' }} aria-label="Facebook">
              <Facebook />
            </IconButton>
            <IconButton size="large" sx={{ color: 'var(--foreground)' }} aria-label="X (Twitter)">
              <Twitter />
            </IconButton>
          </div>
        </div>
      </MenuDrawer>

      {/* Drawer Secundário de Listas */}
      <MovieListDrawer 
        isOpen={listDrawerState.isOpen}
        onClose={closeListDrawer}
        title={listDrawerState.title}
        items={listDrawerState.items}
      />
    </div>
  );
}