import Image from "next/image";
export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background mt-auto py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:grid md:grid-cols-3 gap-8">
          <div>
            <Image 
              src="/images/brands/logo-viajar-faz-bem-portal.svg" 
              alt="ViajarFazBem Logo" 
              width={150} 
              height={41} 
              style={{ width: "150", height: "41" }}
              priority
            />
            <p className="text-base md:text-sm text-muted-foreground mt-5">
              Sua plataforma para viajar nos melhores filmes e séries.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h3 className="font-semibold mb-4 text-base md:text-sm">Links Úteis</h3>
              <ul className="space-y-2 text-base md:text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer">Sobre Nós</li>
                <li className="hover:text-foreground cursor-pointer">Contato</li>
                <li className="hover:text-foreground cursor-pointer">Termos de Uso</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-base md:text-sm">Redes Sociais</h3>
              <ul className="space-y-2 text-base md:text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer">Instagram</li>
                <li className="hover:text-foreground cursor-pointer">Facebook</li>
                <li className="hover:text-foreground cursor-pointer">Twitter</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ViajarFazBem. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
