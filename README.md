# Sistema Escola

Este é um sistema de gerenciamento escolar que permite gerenciar alunos, professores, disciplinas, salas e turmas. O projeto é dividido em duas partes: backend e frontend.

## Tecnologias Utilizadas

### Backend

-   Node.js
-   Express
-   Sequelize
-   PostgreSQL
-   dotenv
-   cors

### Frontend

-   React
-   React Router

## Instalação

### Backend

1. Clone o repositório:

    ```sh
    git clone https://github.com/matheuscardosoj/sistema-escola.git
    cd backend
    ```

2. Instale as dependências:

    ```sh
    npm install
    ```

3. Configure o arquivo `.env`:
   Copie o arquivo `.env.example` para `.env` e preencha as variáveis de ambiente com as informações do seu banco de dados e servidor.

4. Inicie o servidor:
    ```sh
    npm run dev
    ```

### Frontend

1. Navegue até o diretório `frontend`:

    ```sh
    cd ../frontend
    ```

2. Instale as dependências:

    ```sh
    npm install
    ```

3. Inicie o servidor de desenvolvimento:
    ```sh
    npm run dev
    ```

## Como Usar

1. Acesse o frontend no navegador:

    ```
    http://localhost:3000
    ```

2. Utilize a interface para gerenciar alunos, professores, disciplinas, salas e turmas.

## Estrutura de Arquivos

### Backend

-   `server.js`: Arquivo principal do servidor Express.
-   `src/config/sequelize.js`: Configuração do Sequelize.
-   `src/database/sequelize.js`: Instância do Sequelize.
-   `src/models/`: Modelos do Sequelize.
-   `src/controllers/`: Controladores para cada entidade.
-   `src/routes/`: Rotas da aplicação.

### Frontend

-   `src/index.jsx`: Ponto de entrada do React.
-   `src/pages/`: Páginas da aplicação.
-   `src/components/`: Componentes reutilizáveis.
-   `src/api/`: Funções para chamadas à API.

## Considerações Finais

Este projeto foi desenvolvido como método de avaliação para a disciplina Prática de Engenharia de Software, do curso de Engenharia de Software da Universidade de Rio Verde (Unirv).
