/**
 * @file Este é o arquivo de layout raiz
 * @description Ele funciona como o "gerente geral" da navegação do aplicativo
 * Usamos um Stack Navigator aqui para definir a estrutura principal
 * Tudo que estiver dentro dele pode navegar para outras telas
 */

// --- IMPORTAÇÕES ---

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      {/* Componente para controlar a cor dos ícones da barra de status (hora, bateria, etc.) */}
      <StatusBar style="light" />

      {/* Stack é o nosso navegador principal, que empilha as telas. */}
      <Stack>
        {/* A primeira tela do Stack é o nosso conjunto de abas (tabs).
            Ocultamos o cabeçalho dela para que o próprio navegador de abas controle seu cabeçalho. */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* A segunda tela é a de detalhes.
            Ela não é um modal, mas uma tela normal que será empilhada sobre a home. */}
        <Stack.Screen 
          name="details" 
          options={{
            headerShown: true, // Mostramos um cabeçalho com o nome do filme
            headerStyle: { backgroundColor: '#1c1c1c' },
            headerTintColor: '#fff',
            animation: 'slide_from_right', // Animação de transição
          }} 
        />
      </Stack>
    </>
  );
}