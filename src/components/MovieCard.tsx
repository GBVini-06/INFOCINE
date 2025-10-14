/**
 * @file Componente reutilizavel para exibir o pôster de um filme
 * @description Este componente é usado na lista da tela principal. Ele recebe as informações de um fime e exibe seu pôster e título. Ele é projetado para ser flexível e se adaptar ao número de colunas da grade
 */

// --- IMPORTAÇÕES ---

import React from 'react';
import { Text, Image, TouchableOpacity, StyleSheet, View, Dimensions, Platform } from 'react-native';
import { Movie } from '@/src/types/Movie';

// Definimos a "forma" das propriedades que este componente espera receber
// Isso garante, com o TypeScript, que sempre passaremos os dados corretos

interface MovieCardProps {
  movie: Movie; // O objeto com os dados do filme
  onPress: () => void; // A função ser chamada quando o card for clicado
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  // Constrói a URL completa para a imagem do pôster 
  // Se o 'poster_path' não existir, usamos uma imagem placeholder
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750.png?text=Sem+Imagem';

  // Coloca a largura total da janela
  const { width: screenWidth } = Dimensions.get('window');

  // Calcular a largura do card com base no número de colunas e espaçamento
  const numColumns = Platform.OS === 'web' ? 5 : 2; // O mesmo numColumns que está no index.tsx
  const marginHorizontal = 10; // Margem horizontal de cada card (metade em cada lado)
  const totalMargin = (numColumns + 1) * marginHorizontal; // Margens entre cards e nas bordas
  const cardWidth = (screenWidth - totalMargin) / numColumns;


  return (
    // O container principal, que controla o tamanho e o espaçamento do card na grade
    <View style={styles.container}>
      {/* Tornamos o card clicável com o TouchableOpacity */}
      <TouchableOpacity onPress={onPress}>
      {/* O componente Image exibe o pôster */}
        <Image source={{ uri: imageUrl }} style={[styles.poster, { width: cardWidth }]} />
        {/* O Text exibe o título, com no máximo 2 linhas */}
        <Text style={[styles.title, { width: cardWidth }]} numberOfLines={2}>{movie.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- ESTILO DE COMPONENTE ---

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