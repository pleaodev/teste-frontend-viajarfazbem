# Teste Frontend - Viajar Faz Bem

IMPORTANTE: Tomei a liberdade para modificar o layout, porque isso é apenas um teste e preciso mostrar mais a minha capacidade criativa, se fosse um projeto real, com design definido, eu seguiria exatamente o guideline e o levantamento de requisitos aprovados. O save dos vídeo favoritos e lista dos filmes que "Continuar assistindo", estão sendo armazenados em localstorage, mas de forma nenhuma eu faria isso em um projeto real, armazenaria com segurança no banco de dados.

Essa API possui muitas limitações de requisições, então fiz uma implementação simplificada para performance.

---

Subi o projeto para produção em meu servidor local, você pode acessar em
[https://teste.pedro-sperandio.com.br](https://teste.pedro-sperandio.com.br)

## Bibliotecas e tecnologias utilizadas

- **[Next.js (v16.2)](https://nextjs.org/)**: Framework React com App Router.
- **[React (v19)](https://react.dev/)**: Biblioteca principal para construção de interfaces.
- **[Tailwind CSS (v4)](https://tailwindcss.com/)**: Estilização utilitária ágil e responsiva.
- **[Material UI (MUI v9) & Emotion](https://mui.com/)**: Utilizado para componentes de interface complexos (como Selects, Drawers, etc).
- **[Lenis](https://lenis.studiofreight.com/)**: Biblioteca para *smooth scrolling* super leve, garantindo uma navegação fluida.
- **[Next-Themes](https://github.com/pacocoursey/next-themes)**: Gerenciamento perfeito de dark/light mode integrado com Tailwind e MUI.
- **[Lucide React](https://lucide.dev/)**: Biblioteca de ícones modernos e consistentes.

---

## Como instalar e executar a aplicação

### Pré-requisitos
- **Node.js** (versão 18.17 ou superior recomendada)
- Gerenciador de pacotes: `npm`, `yarn`, `pnpm` ou `bun`.

### Passos para execução local

1. Clone o repositório:
```bash
git clone https://github.com/pleaodev/teste-frontend-viajarfazbem.git
cd teste-frontend-viajarfazbem
```

2. Instale as dependências:
```bash
npm install
# ou yarn install / pnpm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou yarn dev / pnpm dev
```

4. Abra o navegador e acesse [http://localhost:3000](http://localhost:3000).

---

## A solução adotada

A arquitetura do projeto foi desenhada focando em **modularização, acessibilidade (a11y) e performance**:

- **Componentização Modular:** Dividi a interface em componentes pequenos, reutilizáveis e com responsabilidade única. Lógicas complexas foram extraídas para custom hooks, e componentes genéricos (como botões e modais) ficam isolados em `src/components/common/ui`.
- **Renderização Híbrida:** Utilizei o App Router do Next.js para mesclar Server Components (o que permite a otimização de SEO e performance inicial) com Client Components (para interatividade avançada).
- **Gerenciamento de Estado de Busca e Filtros:** A lista principal de filmes gerencia paginação e filtros primários via parâmetros de URL (`searchParams`), permitindo que as URLs sejam compartilhadas e que o histórico de navegação funcione naturalmente.

---

## Destaques: SEO, Semântica e Responsividade

### Otimização para Motores de Busca (SEO)
- **Renderização no Servidor (SSR/RSC):** Utilizei o App Router do Next.js, o conteúdo inicial e as listagens principais são renderizadas no servidor. O HTML já chega pronto ao navegador, garantindo que os *crawlers* dos motores de busca consigam ler e indexar o conteúdo das páginas com facilidade.
- **Carregamento Otimizado:** Usei o componente `next/image` para garantir que as capas de filmes e avatares sejam carregados de forma otimizada (WebP, lazy loading, com dimensionamento correto), o que impacta positivamente nas métricas de Core Web Vitals do Google.

### Semântica de Código
- **HTML5 Semântico:** Em vez de utilizar apenas `<div>` genéricas, desenvolvi utilizando tags semânticas corretas como `<header>`, `<main>`, `<section>`, `<article>`, `<nav>` e `<footer>`. Isso não apenas melhora o SEO, mas é fundamental para a acessibilidade e a interpretação da estrutura da página.
- **Código Limpo (Clean Code):** Variáveis, funções e componentes possuem nomes descritivos em inglês, tornando o código autodocumentado. A arquitetura de pastas separa de forma clara componentes comuns (UI) de componentes específicos de domínio.

### Responsividade
- A aplicação foi desenvolvida dentro da exigência de ser responsiva, utilizando as classes utilitárias do Tailwind CSS.
- **Layout Adaptativo:** O layout se ajusta fluidamente desde telas pequenas de celulares até grandes monitores desktop, alterando o número de colunas nas grades de filmes e adaptando a navegação (como o uso do Drawer em telas menores) para oferecer a melhor experiência independente do dispositivo.

---

## Decisões técnicas e adaptações feitas

Durante o desenvolvimento, algumas decisões de arquitetura e adaptações precisaram ser feitas para lidar com desafios técnicos específicos:

### 1. Renderização de Dialogs e Prevenção de Cortes (Z-Index e createPortal)
Componentes com `transform` CSS (como drawers animados) criam novos contextos de empilhamento, o que cortava modais fixos (como os de Detalhes de Filme ou Trailer). 
**Solução:** Os modais foram adaptados para usar `createPortal` do `react-dom`, renderizando-os diretamente no `document.body`. Além disso, foi estabelecida uma hierarquia de `z-index` (Drawer: `9999`, Dialogs: `10000+`) para garantir a sobreposição correta.

### 2. Integração do Smooth Scroll (Lenis) com Overlays do MUI
O comportamento padrão do Material UI ao abrir um Select ou Menu é travar o scroll da página (`overflow: hidden`), o que quebrava o scroll suave do Lenis e causava *layout shifts* (sumiço da barra de rolagem).
**Solução:** Desativei o bloqueio de scroll nativo do MUI (`disableScrollLock: true`) e mantive o Lenis ativo. Para permitir a rolagem apenas dentro do menu do MUI, interceptei eventos globais de `wheel`/`touchmove` os permitindo apenas se gerados dentro do contêiner do overlay.

### 3. Sincronização Dinâmica de Temas (Tailwind + MUI)
Para que os componentes do Material UI respeitassem a alternância de temas feita pelo Next-Themes (que controla o Tailwind), criei um *Wrapper* dinâmico que escuta a propriedade `resolvedTheme` e injeta a paleta correspondente (Light ou Dark) no `ThemeProvider` do MUI em tempo real.

### 4. Filtragem Local Independente
Criei uma prop `isLocal` no `MovieFilterBar`. Isso permite instanciar barras de filtros de forma independente (ex: seção de filmes de um ator ou diretor) que filtram os itens apenas localmente no componente, sem sujar a URL global da aplicação.

### 5. Avatares nos Cards de Filmes (Trade-off de Performance vs UX)
Decidi manter a exibição dos avatares dos 3 principais atores/diretores diretamente no card do filme para enriquecer visualmente a interface. Mesmo que isso exija requisições extras na API após a montagem do componente, o valor de UX gerado justificou esse *trade-off* e não causou problemas de performance ou erros 429 (Too Many Requests), que é uma limitação excessiva dessa API.

### 6. Animação Sincronizada do Header Fixo
Para evitar bugs de re-renderização ao fazer o header flutuante aparecer/desaparecer no scroll, criei o uso de `position: fixed` tanto para o header estático quanto para o flutuante. A transição é feita puramente com CSS transforms (`-translate-y-full`), onde o estático sobe ao mesmo tempo que o flutuante desce.

### 7. Acessibilidade (a11y) e Estilização Adaptativa
Mantive o uso de tags semânticas e atributos ARIA. Elementos sobrepostos em imagens, como o botão "Fechar" dos modais, receberam uma estilização com `backdrop-blur` e cor de fundo semi-transparente que se adapta ao tema, garantindo que sejam sempre legíveis, independentemente de estarem sobre uma imagem clara ou escura.
