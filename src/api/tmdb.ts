/**
 * @file Central de comunicação com a API do The Movvie Database (TMDb)
 * @description Este arquivo é responsável por todas as chamadas de rede
 * Ele configura o 'axios' e exporta funções para cada tipo de busca
 */

// --- IMPORTAÇÕES ---

import axios from 'axios';
import { Movie } from '@/src/types/Movie';

// Exportações feitas para pegar os serviços de streaming que o filme está, o trailer do filme e as resenhas e comentários

export interface WatchProvider { provider_id: number; provider_name: string; logo_path: string; }
export interface WatchProvidersResponse { results: { BR?: { flatrate?: WatchProvider[]; link?: string; }; }; }

export interface Review { id: string; author: string; content: string; }
export interface ReviewsResponse { results: Review[]; }

// Chave da API, guardada de forma segura em um arquivo .env
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

// Criamos uma instância do axios com configurações padrões
// Isso evita repetir a URL base a chave da API em todas as chamadas

const client = axios.create({ baseURL: API_BASE_URL, params: { api_key: API_KEY, language: 'pt-BR' } }); // Pedimos os resultados em português

// Definições das interfaces

interface ApiResponse { results: Movie[]; }
interface Video { key: string; site: string; type: string; }
interface VideoResponse { results: Video[]; }

/**
 * @description Busca os filmes mais populares do momento na API do TMDb
 * É uma função assíncrona, pois depende de uma resposta da rede
 * @returns Uma lista de filmes
 */

export const getPopularMovies = async (): Promise<Movie[]> => { try { const response = await client.get<ApiResponse>('/movie/popular'); return response.data.results; } catch (error) { console.error('Erro ao buscar filmes populares:', error); return []; } };

/**
 * @description Pesquisa filmes com base em um termo de busca
 * @param query O texto que o usuário digitou
 * @returns Uma lista de filmes que correspondem à busca
 */

export const searchMovies = async (query: string): Promise<Movie[]> => { if (!query) return []; try { const response = await client.get<ApiResponse>('/search/movie', { params: { query } }); return response.data.results; } catch (error) { console.error('Erro ao pesquisar filmes:', error); return []; } };

// Função para buscar o trailer do filme no youtube, ao clicar no botão levar para o link do trailer hospedado no Youtube
export const getMovieTrailer = async (movieId: number): Promise<string | null> => { try { const response = await client.get<VideoResponse>(`/movie/${movieId}/videos`); const trailer = response.data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube'); return trailer ? trailer.key : null; } catch (error) { console.error('Erro ao buscar trailer do filme:', error); return null; } };

// Função para mostrar os provedores dos filmes, basicamente mostrar em qual serviço de streaming o filme está e levando você até ele 
export const getWatchProviders = async (movieId: number): Promise<{ providers: WatchProvider[], link: string | undefined } | null> => { try { const response = await client.get<WatchProvidersResponse>(`/movie/${movieId}/watch/providers`); const brazilProviders = response.data.results.BR; if (brazilProviders && brazilProviders.flatrate) { return { providers: brazilProviders.flatrate, link: brazilProviders.link }; } return null; } catch (error) { console.error('Erro ao buscar provedores de streaming:', error); return null; } };


// Função para pegar as resenhas e comentários pelo próprio database e mostrar
export const getMovieReviews = async (movieId: number): Promise<Review[]> => {
    try {
        const response = await client.get<ReviewsResponse>(`/movie/${movieId}/reviews`);
        return response.data.results;
    } catch (error) {
        console.error('Erro ao buscar resenhas do filme:', error);
        return [];
    }
};