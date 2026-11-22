const API = "/livros";
const lista = document.getElementById("lista");
const mensagem = document.getElementById("mensagem");
const filtro = document.getElementById("filtro");

// Protege textos digitados pelo usuário antes de inseri-los no HTML.
function escapar(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

async function carregar() {
    try {
        const query = filtro.value ? `?lido=${filtro.value}` : "";
        const resposta = await fetch(`${API}${query}`);

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os livros.");
        }

        const livros = await resposta.json();

        if (livros.length === 0) {
            lista.innerHTML = '<li class="vazio">Nenhum livro encontrado.</li>';
            return;
        }

        lista.innerHTML = livros.map(l => `
            <li class="${l.lido ? "lido" : ""}">
                <input
                    type="checkbox"
                    ${l.lido ? "checked" : ""}
                    aria-label="Marcar ${escapar(l.titulo)} como lido"
                    onchange="alternarLido(${l.id}, this.checked)"
                >
                <div class="info">
                    <strong>${escapar(l.titulo)}</strong>
                    <small>${escapar(l.autor)}, ${l.ano}</small>
                </div>
                <button class="excluir" onclick="excluir(${l.id})">Excluir</button>
            </li>
        `).join("");
    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}

async function alternarLido(id, lido) {
    try {
        const resposta = await fetch(`${API}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lido })
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível atualizar o livro.");
        }

        await carregar();
    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}

async function excluir(id) {
    try {
        const resposta = await fetch(`${API}/${id}`, { method: "DELETE" });

        if (!resposta.ok) {
            throw new Error("Não foi possível excluir o livro.");
        }

        mensagem.textContent = "Livro excluído com sucesso.";
        mensagem.className = "sucesso";
        await carregar();
    } catch (erro) {
        mensagem.textContent = erro.message;
        mensagem.className = "";
    }
}

document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = {
        titulo: document.getElementById("titulo").value,
        autor: document.getElementById("autor").value,
        ano: parseInt(document.getElementById("ano").value, 10)
    };

    try {
        const resposta = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            mensagem.textContent = erro.erro;
            mensagem.className = "";
            return;
        }

        mensagem.textContent = "Livro cadastrado com sucesso!";
        mensagem.className = "sucesso";
        e.target.reset();
        filtro.value = "";
        await carregar();
    } catch (erro) {
        mensagem.textContent = "Não foi possível conectar à API. Confira se o servidor está ligado.";
        mensagem.className = "";
    }
});

filtro.addEventListener("change", carregar);

// Disponibiliza as funções usadas nos eventos dos itens da lista.
window.alternarLido = alternarLido;
window.excluir = excluir;

carregar();
