"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, MapPin, Calendar, Ruler, Users, Loader2, Info } from "lucide-react";
import { PersonDetails, getPersonDetails } from "@/services/imdb";

interface ActorDialogProps {
  actorId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ActorDialog({ actorId, isOpen, onClose }: ActorDialogProps) {
  const [actorDetails, setActorDetails] = useState<PersonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && actorId) {
      setIsLoading(true);
      setActorDetails(null);
      getPersonDetails(actorId)
        .then(data => setActorDetails(data))
        .catch((err: any) => {
          if (err?.message?.includes("429")) {
            console.warn("[ActorDialog] Rate limit (429) ao buscar detalhes do ator.");
          } else {
            console.warn("Erro ao buscar detalhes do ator:", err?.message || err);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, actorId]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setActorDetails(null);
    }, 300);
  };

  if (!isOpen && !isClosing) return null;

  // Função para calcular a idade
  const calculateAge = (birthDateStr?: string, deathDateStr?: string) => {
    if (!birthDateStr) return null;
    const birthDate = new Date(birthDateStr);
    if (isNaN(birthDate.getTime())) return null;
    const endDate = deathDateStr ? new Date(deathDateStr) : new Date();
    let age = endDate.getFullYear() - birthDate.getFullYear();
    const m = endDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && endDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(actorDetails?.birthDate, actorDetails?.deathDate);

  // Formatar data
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Não encontrado";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Não encontrado";
    // Avoid hydration mismatch by using a fixed format string or checking if mounted
    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = d.toLocaleString('pt-BR', { month: 'long', timeZone: 'UTC' });
    const year = d.getUTCFullYear();
    return `${day} de ${month} de ${year}`;
  };

  if (!mounted) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 z-[10010] flex items-center justify-center bg-white/80 dark:bg-black/80 p-4 md:p-8 backdrop-blur-sm ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} 
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={actorDetails ? `Detalhes de ${actorDetails.displayName}` : "Detalhes do Ator"}
    >
      <div 
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl border border-border shadow-2xl ${isClosing ? 'animate-fade-out-down' : 'animate-fade-in-up'}`} 
        onClick={e => e.stopPropagation()}
        data-lenis-prevent
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm hover:bg-background transition-colors border border-border shadow-sm cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          </div>
        ) : actorDetails ? (
          <div className="flex flex-col md:flex-row" itemScope itemType="https://schema.org/Person">
            {/* Foto do Ator */}
            <div className="w-full md:w-[40%] relative aspect-[2/3] md:aspect-auto md:min-h-[500px] bg-muted shrink-0 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden">
              {actorDetails.primaryImage?.url ? (
                <>
                  <Image 
                    src={actorDetails.primaryImage.url} 
                    alt={actorDetails.displayName} 
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <meta itemProp="image" content={actorDetails.primaryImage.url} />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-muted">
                  <Users className="h-16 w-16 opacity-50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:hidden" />
            </div>

            {/* Informações */}
            <div className="w-full md:w-[60%] p-6 md:p-8 flex flex-col gap-6 relative">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2" itemProp="name">{actorDetails.displayName}</h2>
                {actorDetails.birthName && actorDetails.birthName !== actorDetails.displayName && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Nascido(a) como <span itemProp="alternateName">{actorDetails.birthName}</span>
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {actorDetails.primaryProfessions && actorDetails.primaryProfessions.length > 0 && (
                    <span className="flex items-center gap-1.5 bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full font-medium border border-blue-500/20" itemProp="jobTitle">
                      {actorDetails.primaryProfessions.join(", ")}
                    </span>
                  )}
                  {age !== null && !isNaN(age) && (
                    <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                      <Calendar className="h-4 w-4" />
                      {age} anos {actorDetails.deathDate && "(Falecido)"}
                    </span>
                  )}
                </div>
              </div>

              {/* Informações Pessoais */}
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3 bg-muted/30 p-3 rounded-lg border border-border/50">
                  <MapPin className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <div itemProp="birthPlace">
                    <span className="block text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Local de Nascimento</span>
                    <span className="text-sm font-medium">{actorDetails.birthLocation || "Não encontrado"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 bg-muted/30 p-3 rounded-lg border border-border/50">
                    <Calendar className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Nascimento</span>
                      <span className="text-sm font-medium"><span itemProp="birthDate" content={actorDetails.birthDate || ""}>{formatDate(actorDetails.birthDate)}</span></span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-muted/30 p-3 rounded-lg border border-border/50">
                    <Ruler className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <div itemProp="height" itemScope itemType="https://schema.org/QuantitativeValue">
                      <span className="block text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Altura</span>
                      <span className="text-sm font-medium">
                        {actorDetails.heightCm ? (
                          <>
                            <span itemProp="value">{actorDetails.heightCm}</span> <span itemProp="unitText">cm</span>
                          </>
                        ) : "Não encontrado"}
                      </span>
                    </div>
                  </div>

                  {actorDetails.deathDate && (
                    <div className="flex items-start gap-3 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                      <Calendar className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="block text-xs text-red-500/70 font-medium uppercase tracking-wider mb-0.5">Falecimento</span>
                        <span className="text-sm font-medium text-red-500"><span itemProp="deathDate" content={actorDetails.deathDate || ""}>{formatDate(actorDetails.deathDate)}</span></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Biografia */}
              {actorDetails.biography && (
                <div className="mt-2">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 border-b border-border pb-2">
                    <Info className="h-5 w-5 text-blue-500" />
                    Biografia
                  </h3>
                  <div 
                    itemProp="description"
                    className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto pr-2 custom-scrollbar"
                    data-lenis-prevent
                  >
                    {actorDetails.biography}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[40vh] p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Detalhes não encontrados</h3>
            <p className="text-muted-foreground">Não foi possível carregar as informações deste ator.</p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}