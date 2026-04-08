import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[10000] bg-background flex flex-col items-center justify-center gap-6 w-full animate-fade-in">
      <Image 
        src="/images/brands/logo-viajar-faz-bem-portal.svg" 
        alt="ViajarFazBem Logo" 
        width={150} 
        height={41} 
        className="dark:brightness-0 dark:invert animate-pulse"
        priority
      />
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    </div>
  );
}