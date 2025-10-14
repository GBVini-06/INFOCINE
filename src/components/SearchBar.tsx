/**
 * @file Componente de barra de busca.
 * @description É um "componente controlado", o que significa que seu valor (o texto)
 * é gerenciado pelo componente pai (a HomeScreen).
 */

// --- IMPORTAÇÕES ---

import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface SearchBarProps {
  value: string;   // O texto atual da busca
  onChangeText: (text: string) => void;  // Função para atualizar o text
  onSubmit: () => void; // Função para limpar a busca
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onSubmit }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar filme..."
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { padding: 10, backgroundColor: '#1c1c1c' },
    input: { backgroundColor: '#333', color: 'white', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, fontSize: 16 },
});

export default SearchBar;