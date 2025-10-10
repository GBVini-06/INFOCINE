// src/components/ReviewCard.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Review } from '@/src/api/tmdb';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxChars = 250; // Limite de caracteres para o resumo

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const content = isExpanded ? review.content : `${review.content.substring(0, maxChars)}...`;

  return (
    <View style={styles.container}>
      <Text style={styles.author}>{review.author}</Text>
      <Text style={styles.content}>{content}</Text>
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