# Biblioteca Pessoal — API REST de Livros

Projeto da atividade guiada de Desenvolvimento Web 2, feito com Node.js e Express.

## 1. Requisitos

- Node.js instalado no computador.
- Visual Studio Code (ou outro editor).

O Thunder Client é opcional. A página do projeto permite cadastrar, listar, marcar como lido e excluir livros sem instalar essa extensão.

## 2. Abrir e instalar

1. Extraia o arquivo ZIP.
2. Abra a pasta `livros-api` no VS Code.
3. Abra o terminal do VS Code.
4. Execute:

```bash
npm install
```

## 3. Iniciar o servidor

No terminal, execute:

```bash
npm start
```

Acesse no navegador:

- Página do sistema: http://localhost:3000
- Lista em JSON: http://localhost:3000/livros
- Somente lidos: http://localhost:3000/livros?lido=true
- Não lidos: http://localhost:3000/livros?lido=false
- Livro de ID 2: http://localhost:3000/livros/2

Para parar o servidor, volte ao terminal e pressione `Ctrl + C`.

## 4. Rotas da API

| Método | Endereço | Ação |
|---|---|---|
| GET | `/livros` | Lista todos |
| GET | `/livros?lido=true` | Lista os lidos |
| GET | `/livros?lido=false` | Lista os não lidos |
| GET | `/livros/:id` | Busca por ID |
| POST | `/livros` | Cadastra |
| PUT | `/livros/:id` | Substitui todos os campos |
| PATCH | `/livros/:id` | Atualiza somente os campos enviados |
| DELETE | `/livros/:id` | Exclui |

## 5. Testar POST, PUT e PATCH sem Thunder Client

Você pode usar a própria página para POST e PATCH (marcar/desmarcar como lido).
Para testar todas as rotas manualmente, pode usar `curl` no terminal.

Exemplo de cadastro (com o servidor ligado):

```bash
curl -X POST http://localhost:3000/livros -H "Content-Type: application/json" -d "{\"titulo\":\"Vidas Secas\",\"autor\":\"Graciliano Ramos\",\"ano\":1938}"
```

Exemplo de atualização parcial:

```bash
curl -X PATCH http://localhost:3000/livros/2 -H "Content-Type: application/json" -d "{\"lido\":true}"
```

Exemplo de substituição completa:

```bash
curl -X PUT http://localhost:3000/livros/3 -H "Content-Type: application/json" -d "{\"titulo\":\"O Cortiço\",\"autor\":\"Aluísio Azevedo\",\"ano\":1890,\"lido\":true}"
```

Exemplo de exclusão:

```bash
curl -X DELETE http://localhost:3000/livros/1
```

No Windows, esses comandos podem ser executados no PowerShell ou no terminal Git Bash. Se houver dificuldade com as aspas, use a página para as operações disponíveis ou uma ferramenta gratuita de requisições.

## 6. Observação importante

Nesta primeira parte, os livros ficam em um array na memória, como pede a atividade. Portanto, os novos cadastros e alterações são perdidos quando o servidor é reiniciado. O banco de dados SQLite será introduzido na próxima parte do projeto.
