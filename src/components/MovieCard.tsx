// src/components/MovieCard.tsx

import React from 'react';
import { Text, Image, TouchableOpacity, StyleSheet, View, Dimensions, Platform } from 'react-native';
import { Movie } from '@/src/types/Movie';

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750.png?text=Sem+Imagem';

  // Obter a largura total da janela
  const { width: screenWidth } = Dimensions.get('window');

  // Calcular a largura do card com base no número de colunas e espaçamento
  const numColumns = Platform.OS === 'web' ? 5 : 2; // O mesmo numColumns que está no index.tsx
  const marginHorizontal = 10; // Margem horizontal de cada card (metade em cada lado)
  const totalMargin = (numColumns + 1) * marginHorizontal; // Margens entre cards e nas bordas
  const cardWidth = (screenWidth - totalMargin) / numColumns;


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Image source={{ uri: imageUrl }} style={[styles.poster, { width: cardWidth }]} />
        <Text style={[styles.title, { width: cardWidth }]} numberOfLines={2}>{movie.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        // Removemos o width percentual daqui, ele será calculado dinamicamente
        margin: 10, // Margem para separar os cards
    },
    poster: {
        // Width será sobrescrito pelo estilo inline
        aspectRatio: 2 / 3, // Força a proporção correta de um pôster (nunca vai distorcer)
        borderRadius: 10,
        backgroundColor: '#333',
        resizeMode: 'cover', // Garante que a imagem preencha o espaço sem sobrar
    },
    title: {
        // Width será sobrescrito pelo estilo inline
        color: 'white',
        marginTop: 8,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default MovieCard;