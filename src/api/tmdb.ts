// src/api/tmdb.ts

import axios from 'axios';
import { Movie } from '@/src/types/Movie';

// --- Adicionando novos tipos para os provedores de streaming ---
export interface WatchProvider {
    provider_id: number;
    provider_name: string;
    logo_path: string;
}

export interface WatchProvidersResponse {
    results: {
        BR?: { // O '?' indica que pode não haver dados para o Brasil
            flatrate?: WatchProvider[];
            link?: string;
        };
    };
}
// -----------------------------------------------------------------

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

const client = axios.create({
  baseURL: API_BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR',
  },
});

interface ApiResponse {
  results: Movie[];
}

interface Video {
    key: string;
    site: string;
    type: string;
}

interface VideoResponse {
    results: Video[];
}

/**
 * @description Busca os filmes mais populares do momento na API do TMDb.
 * @async
 * @returns {Promise<Movie[]>} Uma promessa que resolve para uma lista de filmes populares.
 */
export const getPopularMovies = async (): Promise<Movie[]> => {
  try {
    const response = await client.get<ApiResponse>('/movie/popular');
    return response.data.results;
  } catch (error) {
    console.error('Erro ao buscar filmes populares:', error);
    return [];
  }
};

/**
 * @description Pesquisa filmes com base em um termo de busca.
 * @async
 * @param {string} query - O termo de busca para pesquisar filmes.
 * @returns {Promise<Movie[]>} Uma promessa que resolve para uma lista de filmes encontrados.
 */
export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  try {
    const response = await client.get<ApiResponse>('/search/movie', {
      params: {
        query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Erro ao pesquisar filmes:', error);
    return [];
  }
};

/**
 * @description Busca o trailer oficial de um filme no YouTube.
 * @async
 * @param {number} movieId - O ID do filme.
 * @returns {Promise<string|null>} A chave (key) do vídeo do YouTube ou nulo se não for encontrado.
 */
export const getMovieTrailer = async (movieId: number): Promise<string | null> => {
    try {
        const response = await client.get<VideoResponse>(`/movie/${movieId}/videos`);
        const videos = response.data.results;
        const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        return trailer ? trailer.key : null;
    } catch (error) {
        console.error('Erro ao buscar trailer do filme:', error);
        return null;
    }
};

/**
 * @description Busca os provedores de streaming (onde assistir) para um filme no Brasil.
 * @async
 * @param {number} movieId - O ID do filme.
 * @returns {Promise<{ providers: WatchProvider[], link: string | undefined } | null>} Um objeto contendo a lista de provedores e o link geral, ou nulo se não houver.
 */
export const getWatchProviders = async (movieId: number): Promise<{ providers: WatchProvider[], link: string | undefined } | null> => {
    try {
        const response = await client.get<WatchProvidersResponse>(`/movie/${movieId}/watch/providers`);
        const brazilProviders = response.data.results.BR;
        
        if (brazilProviders && brazilProviders.flatrate) {
            return {
                providers: brazilProviders.flatrate,
                link: brazilProviders.link,
            };
        }
        return null;
    } catch (error) {
        console.error('Erro ao buscar provedores de streaming:', error);
        return null;
    }
};