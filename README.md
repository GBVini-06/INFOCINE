# Projeto CineInfo (v2: Expo Router + TypeScript)

CineInfo é um aplicativo móvel construído com Expo (React Native) e TypeScript, que permite aos usuários pesquisar informações sobre filmes utilizando a API do The Movie Database (TMDb).

Esta versão utiliza a moderna estrutura do Expo Router para navegação baseada em arquivos e TypeScript para garantir a segurança dos tipos no código.

## Parâmetros Atendidos

-   ✅ **Documentação:** Completa, com instruções de setup, execução e testes.
-   ✅ **Testes Unitários:** Configurado com Jest para testar componentes e lógica da API.
-   ✅ **Expo + React Native:** A base do projeto, utilizando as ferramentas mais recentes do ecossistema Expo.
-   ✅ **Componentes Nativos:** A interface é construída 100% com componentes do React Native (`<View>`, `<Text>`, `<FlatList>`, etc.), sem uso de HTML.
-   ✅ **Rodar via Expo Go:** O projeto é iniciado com `npx expo start` e pode ser facilmente carregado em um dispositivo físico via QR Code com o app Expo Go.
-   ✅ **Uso de APIs:** O aplicativo consome dados em tempo real da API REST do TMDb. Este padrão de requisição (request) e resposta (response) é fundamental e conceitualmente idêntico ao de outras APIs, como a do Gemini.
-   ✅ **Relevante:** É um projeto prático e moderno que aborda os principais desafios do desenvolvimento mobile: navegação, busca de dados assíncrona, gerenciamento de estado e componentização de UI.

## Como Configurar e Rodar o Projeto

1.  **Clone o repositório e instale as dependências:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd cineinfo
    npm install
    ```

2.  **Configure a Chave de API:**
    -   Crie uma conta no [The Movie Database (TMDb)](https://www.themoviedb.org/) e gere uma chave de API (v3 auth).
    -   Na raiz do projeto, crie um arquivo chamado `.env`.
    -   Adicione sua chave ao arquivo da seguinte forma:
        ```
        EXPO_PUBLIC_API_KEY=SUA_CHAVE_DE_API_AQUI
        ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npx expo start
    ```

4.  **Rode no seu celular:**
    -   Abra o aplicativo Expo Go.
    -   Escaneie o QR Code exibido no terminal.

## Como Rodar os Testes

Para garantir a qualidade e o funcionamento correto dos componentes e da lógica, execute o comando:

```bash
npm test