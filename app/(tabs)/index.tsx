/**
 * @file Tela principal do aplicativo
 * @description Exibe a lista de filmes populares e permite a busca
 * É o exemplo central de gerenciamento de estado e ciclo de vida de componentes
 */

// ----- IMPORTAÇÕES -------

import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { getPopularMovies, searchMovies } from '@/src/api/tmdb';
import MovieCard from '@/src/components/MovieCard';
import SearchBar from '@/src/components/SearchBar';
import { Movie } from '@/src/types/Movie';

export default function HomeScreen() {
 // ---- GERENCIAMENTO DE ESTADO ----
 // "movies" guarda a lista de filmes que será exibida. Inicia como um array vazio
  const [movies, setMovies] = useState<Movie[]>([]);
  // "query" guarda o texto que o usuário digita na busca
  const [query, setQuery] = useState('');
  // "loading" controla se o indicador de carregamento (spinner) deve aparecer
  const [loading, setLoading] = useState(true);
  
  const router = useRouter(); 

// ----- BUSCA DE DADOS -----

// Esta função busca os filmes populares. Usamos o useCallback para otimização
  const fetchInitialMovies = async () => { setLoading(true); const popularMovies = await getPopularMovies(); setMovies(popularMovies); setLoading(false); };

// Esta função é chamada para fazer a busca de acordo com o texto digitado  
  const handleSearch = async () => { if (!query) return fetchInitialMovies(); setLoading(true); const results = await searchMovies(query); setMovies(results); setLoading(false); };

// O hook useEffect é usado para disparar efeitos colaterais
// Esse useEffect busca os filmes populares UMA VEZ, quando o componente é montado
  useEffect(() => { fetchInitialMovies(); }, []);
  const handleMoviePress = (movie: Movie) => { router.push({ pathname: "/details", params: { movie: JSON.stringify(movie) } }); };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  // --- RENDERIZAÇÃO DE INTERFACE (JSX) ---

  // Usamos o FlatList para renderizar a lista, pois é otimizada para listas longas

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <SearchBar value={query} onChangeText={setQuery} onSubmit={handleSearch} />
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={Platform.OS === 'web' ? 3 : 2}
          // Adicionamos um espaçamento entre as colunas
          columnWrapperStyle={{ justifyContent: 'space-around' }}
          renderItem={({ item }) => (
            // Reutilizamos o componente MovieCard para cada item da lista
            <MovieCard movie={item} onPress={() => handleMoviePress(item)} />
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum filme encontrado.</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#121212',
        alignItems: 'center',
    },
    contentWrapper: {
      flex: 1,
      width: '100%',
      maxWidth: '100%',
    },
    emptyText: { 
      color: 'white', 
      marginTop: 50,
      textAlign: 'center'
    }
});