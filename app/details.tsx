/**
 * @file Tela de Detalhes do FIlme
 * @description Esta tela recebe os dados de um filme, busca informações adicionais (trailer, streaming, resenha) e exibe tudo em um layour
 */

// --- IMPORTAÇÕES ---

import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, Linking, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Movie } from '@/src/types/Movie';
import { Ionicons } from '@expo/vector-icons';
import { getMovieTrailer, getWatchProviders, WatchProvider, getMovieReviews, Review } from '@/src/api/tmdb';
import ReviewCard from '@/src/components/ReviewCard';

const { width } = Dimensions.get('window');

// Função para quando clicar no icone poder levar o filme para o seu serviço de streaming

const getProviderSearchUrl = (providerName: string, movieTitle: string): string => { 
    const encodedMovieTitle = encodeURIComponent(movieTitle); 
    const providerUrls: { [key: string]: string } = { 
        'Netflix': `https://www.netflix.com/search?q=${encodedMovieTitle}`, 
        'Disney Plus': `https://www.disneyplus.com/search`, 
        'Amazon Prime Video': `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodedMovieTitle}&ie=UTF8`, 
        'Max': `https://play.max.com/search`, 
        'Star Plus': `https://www.starplus.com/search`, 
        'Globoplay': `https://globoplay.globo.com/busca/?q=${encodedMovieTitle}`, 
    }; 
    return providerUrls[providerName] || `https://www.google.com/search?q=Assistir+${encodedMovieTitle}+no+${providerName}`; 
};

export default function DetailsScreen() {  
// --- RECEBENDO DADOS DA NAVEGAÇÃO
// O hook 'useLocalSearchParams' pega os parâmetros passados pela rota
// No caso, o objeto 'movie' foi enviado da HomeScreen
  const { movie: movieString } = useLocalSearchParams<{ movie: string }>();
  
// --- GERENCIAMENTO DE ESTAD0 PARA DADOS ADICIONAIS ---
// Cada peça de informação que buscamos na API tem seu próprio estado e controle
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loadingTrailer, setLoadingTrailer] = useState(true);
  const [providers, setProviders] = useState<WatchProvider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  if (!movieString) {
    return (
        <View style={styles.container}><Text style={styles.title}>Filme não encontrado.</Text></View>
    );
  }

// Convertemos a string do filme de volta para um objeto JSON
  const movie: Movie = JSON.parse(movieString);
// --- BUSCA DE DADOS ADICIONAIS (useEffect) ---
// Esse useEffect é disparado assim que a tela carrega ele chama todas as funções da API necessárias para popular a tela 
  useEffect(() => {
    const fetchData = async () => {
        setLoadingTrailer(true); 
        setLoadingProviders(true); 
        setLoadingReviews(true);
        
        const trailer = await getMovieTrailer(movie.id); 
        setTrailerKey(trailer); 
        setLoadingTrailer(false);
        
        const providersData = await getWatchProviders(movie.id); 
        if (providersData) { 
            setProviders(providersData.providers); 
        } 
        setLoadingProviders(false);
        
        const movieReviews = await getMovieReviews(movie.id);
        setReviews(movieReviews);
        setLoadingReviews(false);
    };
    fetchData();
  }, [movie.id]); // O array de dependências garante que a busca só aconteça uma vez

// --- FUNÇÕES DE INTERAÇÃO ---
// Abre o trailer no Youtube ou no navegador
  const handlePlayTrailer = () => {
      if (trailerKey) {
          const youtubeUrl = `https://www.youtube.com/watch?v=${trailerKey}`;
          Linking.openURL(youtubeUrl).catch(() => Alert.alert("Erro", "Não foi possível abrir a URL do trailer."));
      }
  };
// Abre a página de busca do serviço de streaming
  const handleProviderPress = (providerName: string, movieTitle: string) => {
      const url = getProviderSearchUrl(providerName, movieTitle);
      Linking.openURL(url).catch(() => Alert.alert("Erro", "Não foi possível abrir o serviço de streaming."));
  };
// Função para mostrar a imagem
  const imageUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : (movie.poster_path ? `https://image.tmdb.org/t/p/w780${movie.poster_path}` : 'https://via.placeholder.com/500x750.png?text=Sem+Imagem');
  const releaseDate = movie.release_date ? new Date(movie.release_date).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'Não informada';

// --- RENDERIZAÇÃO DA INTERFACE ---

  return (
    // ScrollView permite que a tela toda seja rolada
    <ScrollView style={styles.container}>
    {/* Configura o título do cabeçalho da tela com o nome do filme. */}
        <Stack.Screen options={{ title: movie.title }} />
        {/* A imagem de backdrop, panorâmica. */}
        <Image source={{ uri: imageUrl }} style={styles.backdrop} />
        
        <View style={styles.contentContainer}>
             {/* Seções renderizadas sequencialmente */}
            <Text style={styles.title}>{movie.title}</Text>
            <View style={styles.detailsRow}>
                <Text style={styles.detailText}>Lançamento: {releaseDate}</Text>
                <View style={styles.ratingBox}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{movie.vote_average.toFixed(1)}</Text>
                </View>
            </View>
          
          {/* Seção do Trailer: renderizada condicionalmente */}
            {loadingTrailer ? <ActivityIndicator color="#00ff00" style={styles.sectionSpacing}/> : trailerKey ? <TouchableOpacity style={styles.trailerButton} onPress={handlePlayTrailer}><Ionicons name="play" size={20} color="#fff" /><Text style={styles.trailerButtonText}>Assistir Trailer</Text></TouchableOpacity> : null}
            
            {/* Seção Onde Assistir: renderizada condicionalmente */}
            {!loadingProviders && providers.length > 0 && (
                <View style={styles.sectionSpacing}>
                    <Text style={styles.sectionTitle}>Onde Assistir</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.providersContainer}>
                        {providers.map(provider => (
                            <TouchableOpacity key={provider.provider_id} onPress={() => handleProviderPress(provider.provider_name, movie.title)}>
                                <Image source={{ uri: `https://image.tmdb.org/t/p/w200${provider.logo_path}` }} style={styles.providerLogo} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
            {/* Seção Sinopse */}
            <View style={styles.sectionSpacing}>
              <Text style={styles.sectionTitle}>Sinopse</Text>
              <Text style={styles.overviewText}>{movie.overview || "Sinopse não disponível."}</Text>
            </View>

            {/* Seção Resenhas: renderizada condicionalmente */}
            {!loadingReviews && reviews.length > 0 && (
                <View style={styles.sectionSpacing}>
                    <Text style={styles.sectionTitle}>Resenhas ({reviews.length})</Text>
                    {/* Usamos .map para criar um componente ReviewCard para cada resenha */}
                    {reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </View>
            )}
        </View>
    </ScrollView>
  );
}

// --- SEÇÃO DE ESTILOS ---

const styles = StyleSheet.create({
  backdrop: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' },
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