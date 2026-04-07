export const API_BASE_URL = "https://api.imdbapi.dev";

export interface Title {
  id: string;
  primaryTitle: string;
  startYear?: number;
  primaryImage?: {
    url: string;
    width: number;
    height: number;
  };
  type?: string;
  rating?: {
    aggregateRating: number;
    voteCount: number;
  };
  plot?: string;
  genres?: string[];
}

export interface SearchResponse {
  titles: Title[];
}

export interface TitlesResponse {
  titles: Title[];
}

export interface TitleDetails extends Title {
  plot?: string;
  genres?: string[];
  runtimeMinutes?: number;
  releaseDate?: string;
}

export interface StarMeterEntry {
  id: string;
  name: string;
  rank: number;
  previousRank?: number;
  image?: {
    url: string;
  };
}

export interface StarMeterResponse {
  results: StarMeterEntry[];
}

// Helper genérico para fazer chamadas à API da IMDb
async function fetchImdb<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    // Cache do Next.js
  });

  if (!response.ok) {
    throw new Error(`Erro na API IMDb: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Lista títulos
export async function getTitles(params?: { 
  page?: number; 
  limit?: number; 
  genre?: string;
  titleType?: string;
  sort_by?: string;
  sort_order?: string;
  startYear?: number;
  endYear?: number;
}): Promise<TitlesResponse> {
  return fetchImdb<TitlesResponse>("/titles", params);
}

//Busca títulos por texto
export async function searchTitles(query: string, params?: { page?: number; limit?: number }): Promise<SearchResponse> {
  return fetchImdb<SearchResponse>("/search/titles", { q: query, ...params });
}

// Detalhes de um título específico
export async function getTitleDetails(titleId: string): Promise<TitleDetails> {
  return fetchImdb<TitleDetails>(`/titles/${titleId}`);
}

// Rankings para montar destaques de nomes conhecidos
export async function getStarMeter(): Promise<StarMeterResponse> {
  return fetchImdb<StarMeterResponse>("/chart/starmeter");
}
