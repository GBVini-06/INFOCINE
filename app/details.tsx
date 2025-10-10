// app/details.tsx

import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, Linking, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Movie } from '@/src/types/Movie';
import { Ionicons } from '@expo/vector-icons';
import { getMovieTrailer, getWatchProviders, WatchProvider } from '@/src/api/tmdb';

const { width } = Dimensions.get('window');

// ... (a função getProviderSearchUrl continua a mesma)
const getProviderSearchUrl = (providerName: string, movieTitle: string): string => { const encodedMovieTitle = encodeURIComponent(movieTitle); const providerUrls: { [key: string]: string } = { 'Netflix': `https://www.netflix.com/search?q=${encodedMovieTitle}`, 'Disney Plus': `https://www.disneyplus.com/search`, 'Amazon Prime Video': `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodedMovieTitle}&ie=UTF8`, 'Max': `https://play.max.com/search`, 'Star Plus': `https://www.starplus.com/search`, 'Globoplay': `https://globoplay.globo.com/busca/?q=${encodedMovieTitle}`, }; return providerUrls[providerName] || `https://www.google.com/search?q=Assistir+${encodedMovieTitle}+no+${providerName}`; };


export default function DetailsScreen() {
  const { movie: movieString } = useLocalSearchParams<{ movie: string }>();
  
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loadingTrailer, setLoadingTrailer] = useState(true);
  const [providers, setProviders] = useState<WatchProvider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);

  if (!movieString) {
    return (
        <View style={styles.container}><Text style={styles.title}>Filme não encontrado.</Text></View>
    );
  }

  const movie: Movie = JSON.parse(movieString);

  useEffect(() => {
    // ... (useEffect continua o mesmo)
    const fetchData = async () => { setLoadingTrailer(true); setLoadingProviders(true); const trailer = await getMovieTrailer(movie.id); setTrailerKey(trailer); setLoadingTrailer(false); const providersData = await getWatchProviders(movie.id); if (providersData) { setProviders(providersData.providers); } setLoadingProviders(false); }; fetchData();
  }, [movie.id]);

  const handlePlayTrailer = () => { /* ... (continua o mesmo) */ if (trailerKey) { const youtubeUrl = `https://www.youtube.com/watch?v=${trailerKey}`; Linking.openURL(youtubeUrl).catch(() => Alert.alert("Erro", "Não foi possível abrir a URL do trailer.")); } };
  const handleProviderPress = (providerName: string, movieTitle: string) => { /* ... (continua o mesmo) */ const url = getProviderSearchUrl(providerName, movieTitle); Linking.openURL(url).catch(() => Alert.alert("Erro", "Não foi possível abrir o serviço de streaming.")); };

  // AQUI A MUDANÇA: Usamos o 'backdrop_path' para a imagem panorâmica
  const imageUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` 
    : (movie.poster_path ? `https://image.tmdb.org/t/p/w780${movie.poster_path}` : 'https://via.placeholder.com/500x750.png?text=Sem+Imagem');

  const releaseDate = movie.release_date ? new Date(movie.release_date).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'Não informada';

  return (
    <ScrollView style={styles.container}>
        <Stack.Screen options={{ title: movie.title }} />
        <Image source={{ uri: imageUrl }} style={styles.backdrop} />
        
        {/* O resto do JSX continua o mesmo... */}
        <View style={styles.contentContainer}>
            <Text style={styles.title}>{movie.title}</Text>
            <View style={styles.detailsRow}>
                <Text style={styles.detailText}>Lançamento: {releaseDate}</Text>
                <View style={styles.ratingBox}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{movie.vote_average.toFixed(1)}</Text>
                </View>
            </View>
            {loadingTrailer ? <ActivityIndicator color="#00ff00" style={styles.sectionSpacing}/> : trailerKey ? <TouchableOpacity style={styles.trailerButton} onPress={handlePlayTrailer}><Ionicons name="play" size={20} color="#fff" /><Text style={styles.trailerButtonText}>Assistir Trailer</Text></TouchableOpacity> : null}
            {!loadingProviders && providers.length > 0 && <View style={styles.sectionSpacing}><Text style={styles.sectionTitle}>Onde Assistir</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.providersContainer}>{providers.map(provider => <TouchableOpacity key={provider.provider_id} onPress={() => handleProviderPress(provider.provider_name, movie.title)}><Image source={{ uri: `https://image.tmdb.org/t/p/w200${provider.logo_path}` }} style={styles.providerLogo} /></TouchableOpacity>)}</ScrollView></View>}
            <View style={styles.sectionSpacing}>
              <Text style={styles.sectionTitle}>Sinopse</Text>
              <Text style={styles.overviewText}>{movie.overview || "Sinopse não disponível."}</Text>
            </View>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // MUDANÇA AQUI: Renomeamos 'poster' para 'backdrop' e ajustamos o estilo
  backdrop: {
    width: '100%',
    aspectRatio: 16 / 9, // Proporção de tela de cinema (widescreen)
    backgroundColor: '#000',
  },
  // O resto dos estilos continua o mesmo...
  container: { flex: 1, backgroundColor: '#121212' },
  contentContainer: { padding: 16 },
  title: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  detailText: { color: '#aaa', fontSize: 14 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12 },
  ratingText: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 6 },
  trailerButton: { backgroundColor: '#c00', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 8, marginTop: 24 },
  trailerButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  sectionSpacing: { marginTop: 24 },
  sectionTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  overviewText: { color: '#ddd', fontSize: 16, lineHeight: 24 },
  providersContainer: { paddingTop: 4 },
  providerLogo: { width: 64, height: 64, borderRadius: 16, marginRight: 12, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
});