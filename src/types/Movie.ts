// src/types/Movie.ts

/**
 * @interface Movie
 * @description Define a estrutura de um objeto de filme retornado pela API do TMDb.
 */
export interface Movie {
  /** O identificador numérico único do filme no TMDb. */
  id: number;
  /** O título original do filme. */
  title: string;
  /** A sinopse ou resumo do filme. */
  overview: string;
  /** O caminho parcial para a imagem do pôster do filme. Pode ser nulo. */
  poster_path: string | null;
  /** A data de lançamento do filme no formato AAAA-MM-DD. */
  release_date: string;
  /** A nota média de avaliação do filme, de 0 a 10. */
  vote_average: number;
}