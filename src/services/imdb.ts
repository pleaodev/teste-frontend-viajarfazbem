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

export interface CastMember {
  id: string;
  displayName: string;
  primaryImage?: { url: string };
  primaryProfessions?: string[];
}

export interface TitleDetails extends Title {
  plot?: string;
  genres?: string[];
  runtimeMinutes?: number;
  releaseDate?: string;
  stars?: CastMember[];
  directors?: CastMember[];
  writers?: CastMember[];
}

export interface StarMeterEntry {
  id: string;
  displayName: string;
  primaryImage?: {
    url: string;
  };
}

export interface StarMeterResponse {
  names: StarMeterEntry[];
}

export interface FilmographyCredit {
  title: Title;
  category: string;
  characters?: string[];
}

export interface FilmographyResponse {
  credits: FilmographyCredit[];
  totalCount?: number;
  nextPageToken?: string;
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
    next: { revalidate: 3600 } 
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
  minVoteCount?: number;
  minAggregateRating?: number;
}): Promise<TitlesResponse> {
  return fetchImdb<TitlesResponse>("/titles", params);
}

// Busca múltiplos títulos por ID
export async function batchGetTitles(titleIds: string[]): Promise<TitlesResponse> {
  const url = new URL(`${API_BASE_URL}/titles:batchGet`);
  titleIds.forEach(id => url.searchParams.append("title_ids", id));
  
  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error(`Erro na API IMDb: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

//Busca títulos por texto
export async function searchTitles(query: string, params?: { page?: number; limit?: number }): Promise<SearchResponse> {
  return fetchImdb<SearchResponse>("/search/titles", { query: query, ...params });
}

// Detalhes de um título específico
export async function getTitleDetails(titleId: string, params?: { info?: string }): Promise<TitleDetails> {
  return fetchImdb<TitleDetails>(`/titles/${titleId}`, params);
}

// Rankings para montar destaques de nomes conhecidos
export async function getStarMeter(): Promise<StarMeterResponse> {
  return fetchImdb<StarMeterResponse>("/chart/starmeter");
}

export interface PersonDetails {
  id: string;
  displayName: string;
  alternativeNames?: string[];
  primaryImage?: {
    url: string;
    width?: number;
    height?: number;
  };
  primaryProfessions?: string[];
  biography?: string;
  heightCm?: number;
  birthName?: string;
  birthDate?: string;
  birthLocation?: string;
  deathDate?: string;
  deathLocation?: string;
}

// Detalhes de uma pessoa
export async function getPersonDetails(personId: string): Promise<PersonDetails> {
  return fetchImdb<PersonDetails>(`/names/${personId}`);
}

// Filmografia de uma pessoa
export async function getPersonFilmography(personId: string, params?: { limit?: number; pageToken?: string }): Promise<FilmographyResponse> {
  return fetchImdb<FilmographyResponse>(`/names/${personId}/filmography`, params);
}
