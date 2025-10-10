import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
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