const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Permite receber dados em JSON e entregar os arquivos do front-end.
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Banco de dados temporário: os dados ficam na memória.
let livros = [
    { id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis", ano: 1899, lido: true },
    { id: 2, titulo: "Capitães da Areia", autor: "Jorge Amado", ano: 1937, lido: false },
    { id: 3, titulo: "O Cortiço", autor: "Aluísio Azevedo", ano: 1890, lido: false }
];

let proximoId = 4;

// Valida os dados recebidos. No modo parcial, confere apenas os campos enviados.
function validar(dados, parcial = false) {
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
        return "O corpo da requisição deve ser um objeto JSON";
    }

    const { titulo, autor, ano, lido } = dados;

    if (!parcial || titulo !== undefined) {
        if (typeof titulo !== "string" || titulo.trim() === "") {
            return "O título é obrigatório e deve ser um texto";
        }
    }

    if (!parcial || autor !== undefined) {
        if (typeof autor !== "string" || autor.trim() === "") {
            return "O autor é obrigatório e deve ser um texto";
        }
    }

    if (!parcial || ano !== undefined) {
        if (!Number.isInteger(ano) || ano < 1) {
            return "O ano é obrigatório e deve ser um número inteiro";
        }
    }

    if (lido !== undefined && typeof lido !== "boolean") {
        return "O campo lido deve ser true ou false";
    }

    return null;
}

// GET /livros - lista todos os livros ou filtra por lido=true/false.
app.get("/livros", (req, res) => {
    let resultado = livros;

    if (req.query.lido !== undefined) {
        if (req.query.lido !== "true" && req.query.lido !== "false") {
            return res.status(400).json({
                erro: "O filtro lido deve ser true ou false"
            });
        }

        resultado = resultado.filter(livro => String(livro.lido) === req.query.lido);
    }

    res.json(resultado);
});

// GET /livros/:id - busca um livro pelo ID.
app.get("/livros/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
        return res.status(400).json({ erro: "O id deve ser um número" });
    }

    const livro = livros.find(l => l.id === id);

    if (!livro) {
        return res.status(404).json({ erro: "Livro não encontrado" });
    }

    res.json(livro);
});

// POST /livros - cadastra um livro novo.
app.post("/livros", (req, res) => {
    const erro = validar(req.body);

    if (erro) {
        return res.status(400).json({ erro });
    }

    const { titulo, autor, ano, lido = false } = req.body;
    const novo = {
        id: proximoId++,
        titulo: titulo.trim(),
        autor: autor.trim(),
        ano,
        lido
    };

    livros.push(novo);
    res.status(201).location(`/livros/${novo.id}`).json(novo);
});

// PUT /livros/:id - substitui todos os dados do livro.
app.put("/livros/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
        return res.status(400).json({ erro: "O id deve ser um número" });
    }

    const indice = livros.findIndex(l => l.id === id);

    if (indice === -1) {
        return res.status(404).json({ erro: "Livro não encontrado" });
    }

    const erro = validar(req.body);
    if (erro) {
        return res.status(400).json({ erro });
    }

    const { titulo, autor, ano, lido = false } = req.body;
    livros[indice] = { id, titulo: titulo.trim(), autor: autor.trim(), ano, lido };

    res.json(livros[indice]);
});

// PATCH /livros/:id - altera somente os campos enviados.
app.patch("/livros/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
        return res.status(400).json({ erro: "O id deve ser um número" });
    }

    const livro = livros.find(l => l.id === id);

    if (!livro) {
        return res.status(404).json({ erro: "Livro não encontrado" });
    }

    const erro = validar(req.body, true);
    if (erro) {
        return res.status(400).json({ erro });
    }

    const { titulo, autor, ano, lido } = req.body;

    if (titulo !== undefined) livro.titulo = titulo.trim();
    if (autor !== undefined) livro.autor = autor.trim();
    if (ano !== undefined) livro.ano = ano;
    if (lido !== undefined) livro.lido = lido;

    res.json(livro);
});

// DELETE /livros/:id - remove um livro.
app.delete("/livros/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
        return res.status(400).json({ erro: "O id deve ser um número" });
    }

    if (!livros.some(l => l.id === id)) {
        return res.status(404).json({ erro: "Livro não encontrado" });
    }

    livros = livros.filter(l => l.id !== id);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
