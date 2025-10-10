import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MovieCard from '@/src/components/MovieCard';
import { Movie } from '@/src/types/Movie';

const mockMovie: Movie = {
  id: 550,
  title: 'Clube da Luta',
  overview: 'Um homem deprimido que sofre de insônia conhece um estranho vendedor de sabonetes...',
  poster_path: '/r3pPehX4ik8NdrPpbBMAQd4Ie9i.jpg',
  release_date: '1999-10-15',
  vote_average: 8.4,
};

it('renderiza o título do filme corretamente', () => {
  const { getByText } = render(<MovieCard movie={mockMovie} onPress={() => {}} />);
  expect(getByText('Clube da Luta')).toBeTruthy();
});

it('chama a função onPress quando pressionado', () => {
  const mockOnPress = jest.fn();
  const { getByText } = render(<MovieCard movie={mockMovie} onPress={mockOnPress} />);

  fireEvent.press(getByText('Clube da Luta'));
  expect(mockOnPress).toHaveBeenCalledTimes(1);
});