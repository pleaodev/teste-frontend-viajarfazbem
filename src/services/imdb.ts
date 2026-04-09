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

const clientCache = new Map<string, any>();
const inFlightRequests = new Map<string, Promise<any>>();

class RequestQueue {
  private queue: (() => void)[] = [];
  private activeCount = 0;
  private maxConcurrent = 3; // Limitando a 3 requisições simultâneas para evitar 429

  async enqueue<T>(task: () => Promise<T>): Promise<T> {
    if (this.activeCount >= this.maxConcurrent) {
      await new Promise<void>(resolve => this.queue.push(resolve));
    }
    
    this.activeCount++;
    try {
      return await task();
    } finally {
      this.activeCount--;
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        if (next) next();
      }
    }
  }
}

const requestQueue = new RequestQueue();

async function fetchImdb<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const urlString = url.toString();

  if (typeof window !== 'undefined') {
    if (clientCache.has(urlString)) {
      return clientCache.get(urlString);
    }
    if (inFlightRequests.has(urlString)) {
      return inFlightRequests.get(urlString);
    }
  }

  const fetchPromise = requestQueue.enqueue(async () => {
    const response = await fetch(urlString, {
      next: { revalidate: 3600 } 
    });

    if (!response.ok) {
      throw new Error(`Erro na API IMDb: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (typeof window !== 'undefined') {
      clientCache.set(urlString, data);
    }
    return data;
  });

  if (typeof window !== 'undefined') {
    inFlightRequests.set(urlString, fetchPromise);
    try {
      await fetchPromise;
    } finally {
      inFlightRequests.delete(urlString);
    }
  }

  return fetchPromise;
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
  
  const urlString = url.toString();

  if (typeof window !== 'undefined') {
    if (clientCache.has(urlString)) {
      return clientCache.get(urlString);
    }
    if (inFlightRequests.has(urlString)) {
      return inFlightRequests.get(urlString);
    }
  }

  const fetchPromise = requestQueue.enqueue(async () => {
    const response = await fetch(urlString, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Erro na API IMDb: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (typeof window !== 'undefined') {
      clientCache.set(urlString, data);
    }
    return data;
  });

  if (typeof window !== 'undefined') {
    inFlightRequests.set(urlString, fetchPromise);
    try {
      await fetchPromise;
    } finally {
      inFlightRequests.delete(urlString);
    }
  }

  return fetchPromise;
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
