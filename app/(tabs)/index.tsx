// app/(tabs)/index.tsx

import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { getPopularMovies, searchMovies } from '@/src/api/tmdb';
import MovieCard from '@/src/components/MovieCard';
import SearchBar from '@/src/components/SearchBar';
import { Movie } from '@/src/types/Movie';

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  const fetchInitialMovies = async () => { setLoading(true); const popularMovies = await getPopularMovies(); setMovies(popularMovies); setLoading(false); };
  const handleSearch = async () => { if (!query) return fetchInitialMovies(); setLoading(true); const results = await searchMovies(query); setMovies(results); setLoading(false); };
  useEffect(() => { fetchInitialMovies(); }, []);
  const handleMoviePress = (movie: Movie) => { router.push({ pathname: "/details", params: { movie: JSON.stringify(movie) } }); };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

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