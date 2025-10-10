// src/api/tmdb.ts

import axios from 'axios';
import { Movie } from '@/src/types/Movie';

// --- Tipos para Watch Providers ---
export interface WatchProvider { provider_id: number; provider_name: string; logo_path: string; }
export interface WatchProvidersResponse { results: { BR?: { flatrate?: WatchProvider[]; link?: string; }; }; }
// --- Tipos para Resenhas (Reviews) ---
export interface Review { id: string; author: string; content: string; }
export interface ReviewsResponse { results: Review[]; }

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';
const client = axios.create({ baseURL: API_BASE_URL, params: { api_key: API_KEY, language: 'pt-BR' } });
interface ApiResponse { results: Movie[]; }
interface Video { key: string; site: string; type: string; }
interface VideoResponse { results: Video[]; }

// ... (as funções getPopularMovies, searchMovies, getMovieTrailer e getWatchProviders continuam as mesmas)
export const getPopularMovies = async (): Promise<Movie[]> => { try { const response = await client.get<ApiResponse>('/movie/popular'); return response.data.results; } catch (error) { console.error('Erro ao buscar filmes populares:', error); return []; } };
export const searchMovies = async (query: string): Promise<Movie[]> => { if (!query) return []; try { const response = await client.get<ApiResponse>('/search/movie', { params: { query } }); return response.data.results; } catch (error) { console.error('Erro ao pesquisar filmes:', error); return []; } };
export const getMovieTrailer = async (movieId: number): Promise<string | null> => { try { const response = await client.get<VideoResponse>(`/movie/${movieId}/videos`); const trailer = response.data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube'); return trailer ? trailer.key : null; } catch (error) { console.error('Erro ao buscar trailer do filme:', error); return null; } };
export const getWatchProviders = async (movieId: number): Promise<{ providers: WatchProvider[], link: string | undefined } | null> => { try { const response = await client.get<WatchProvidersResponse>(`/movie/${movieId}/watch/providers`); const brazilProviders = response.data.results.BR; if (brazilProviders && brazilProviders.flatrate) { return { providers: brazilProviders.flatrate, link: brazilProviders.link }; } return null; } catch (error) { console.error('Erro ao buscar provedores de streaming:', error); return null; } };


/**
 * @description Busca as resenhas de um filme.
 * @async
 * @param {number} movieId - O ID do filme.
 * @returns {Promise<Review[]>} Uma promessa que resolve para uma lista de resenhas.
 */
export const getMovieReviews = async (movieId: number): Promise<Review[]> => {
    try {
        const response = await client.get<ReviewsResponse>(`/movie/${movieId}/reviews`);
        return response.data.results;
    } catch (error) {
        console.error('Erro ao buscar resenhas do filme:', error);
        return [];
    }
};