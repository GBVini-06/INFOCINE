/**
 * @file Componente para exibir uma única resenha de usuário
 * @description Possui lógica interna para controlar a expansão de textos longos ("Ver mais...")
 */

// --- IMPORTAÇÕES ---

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Review } from '@/src/api/tmdb';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  // --- ESTADO INTERNO DO COMPONENTE ---
  // "isExpanded" controla se o texto completo da resenha está visível ou não
  // Cada card de resenha tem seu próprio estado independente
  const [isExpanded, setIsExpanded] = useState(false);
  const maxChars = 250; // Limite de caracteres para o resumo da resenha

  // Função para alternar o estado de expansão
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };


// ---- LÓGICA DE RENDERIZAÇÃO CONDICIONAL ----
// Se o estado for 'expanded' mostra o conteúdo completo
// Senão, mostra apenas as primeiras 250 letras 

  const content = isExpanded ? review.content : `${review.content.substring(0, maxChars)}...`;

  return (
    <View style={styles.container}>
      <Text style={styles.author}>{review.author}</Text>
      <Text style={styles.content}>{content}</Text>
      {/* O botão "Ver mais/menos" só aparece se o texto original for maior que o limite. */}
      {review.content.length > maxChars && (
        <TouchableOpacity onPress={toggleExpanded}>
          <Text style={styles.toggleText}>{isExpanded ? 'Ver menos' : 'Ver mais'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  author: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  content: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
  },
  toggleText: {
    color: '#00ff00', // Cor de destaque
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default ReviewCard;