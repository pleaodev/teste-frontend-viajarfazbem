Este desafio tem como objetivo avaliar sua base em HTML, CSS, JavaScript e **Next.js**, além da sua capacidade de organizar uma interface, consumir uma API e estruturar uma pequena aplicação frontend.

## Objetivo do desafio

Desenvolver uma aplicação frontend para exibir uma listagem de **títulos** (filmes e séries) ou de **nomes** (atores, diretores etc.) a partir da API pública abaixo.

Utilize a **[IMDb API (imdbapi.dev)](https://imdbapi.dev/)** como referência principal:

- [Protótipo Figma](https://www.figma.com/design/UbSNhUe4uUxNxP6tBrbpGV/-Front-end--Teste-Produto?node-id=0-1&p=f&t=7Cz72ZqHajyNy9iU-0)
- [Documentação e especificação OpenAPI](https://imdbapi.dev/) — base da API: `https://api.imdbapi.dev`

Endpoints úteis para começar:

- `GET /titles` — listar títulos (com paginação conforme a API)
- `GET /search/titles` — buscar títulos por texto
- `GET /titles/{titleId}` — detalhes de um título
- `GET /chart/starmeter` — rankings para montar destaques de nomes conhecidos

Consulte o arquivo [imdbapi.swagger.yaml](https://imdbapi.dev/imdbapi.swagger.yaml) para parâmetros, modelos de resposta e demais rotas (créditos, imagens, episódios etc.).

## O que esperamos

Sua aplicação deve seguir a proposta visual do protótipo e demonstrar atenção à experiência de uso, organização do código e qualidade da implementação.

### Requisitos mínimos

- Aplicação desenvolvida com **[Next.js](https://nextjs.org/)** (App Router ou Pages Router)
- Página responsiva
- Consumo de dados da [IMDb API](https://imdbapi.dev/)
- Destaque inicial com itens em formato de carrossel (títulos ou nomes, conforme sua escolha)
- Listagem com paginação
- Tratamento básico de carregamento e erro

### Exemplo de títulos para busca ou exploração

Sugestão de filmes/séries conhecidos para testar buscas e montar o carrossel:

- Homem-Aranha (ou outro título do universo que preferir)
- Viúva Negra
- Vingadores
- Thor
- Pantera Negra
- Duna
- Homem de Ferro

(Ajuste os termos de busca conforme os resultados retornados pela API.)

## Liberdade de implementação

O desafio foi pensado para novos desenvolvedores, então queremos observar principalmente sua lógica, clareza e organização.

- O uso de **Next.js** é obrigatório; aproveite o ecossistema (roteamento, fetch, otimização de imagens etc.) quando fizer sentido
- Você pode utilizar bibliotecas complementares se fizer sentido para sua solução
- Funcionalidades extras serão consideradas um diferencial

## Diferenciais

Alguns exemplos de extras que podem enriquecer sua entrega:

- Busca por nome (título ou pessoa)
- Filtros (tipo, ano, gênero, quando disponível na API)
- Tela de detalhes do título ou da pessoa
- Animações e microinterações
- Testes
- Melhorias de acessibilidade

## Critérios de avaliação

Vamos considerar principalmente:

- Usabilidade
- Fidelidade ao layout proposto
- Organização e modularidade do código
- Clareza da solução
- Semântica e acessibilidade
- Performance
- Qualidade da documentação
- Funcionalidades extras, quando houver

## Entrega

Crie um repositório no GitHub com o seu projeto. Caso o repositório seja privado, compartilhe com `chelder.guimaraes@viajarfazbem.com` e `igor@grupocoobrastur`.

No `README` do projeto, explique:

- Como instalar e executar a aplicação
- A solução adotada
- As bibliotecas utilizadas
- Eventuais decisões técnicas ou adaptações feitas no desafio
