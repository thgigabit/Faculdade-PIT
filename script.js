// script.js

// Função para carregar os produtos e exibi-los na página
function carregarProdutos() {
    fetch("http://localhost:5000/produtos")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Produtos carregados:", data); // Depuração

            const listaProdutos = document.getElementById("lista-produtos");
            const selectProduto = document.getElementById("produto-id");

            listaProdutos.innerHTML = "";
            selectProduto.innerHTML = "<option value=''>Selecione um produto</option>";

            data.forEach(produto => {
                const preco = parseFloat(produto.preco); // Converter para número
                const precoFormatado = isNaN(preco) ? "Preço indisponível" : `R$ ${preco.toFixed(2)}`;

                // Adicionar produto à lista
                const li = document.createElement("li");
                li.textContent = `${produto.nome} - ${precoFormatado}`;
                listaProdutos.appendChild(li);

                // Adicionar produto ao seletor de opções
                if (!isNaN(preco)) {
                    const option = document.createElement("option");
                    option.value = produto.id;
                    option.textContent = produto.nome;
                    selectProduto.appendChild(option);
                }
            });
        })
        .catch(error => {
            console.error("Erro ao carregar produtos:", error);
            alert("Erro ao carregar produtos. Detalhes: " + error.message);
        });
}

// Função para enviar o pedido para a API
function enviarPedido(event) {
    event.preventDefault(); // Impedir recarregamento da página ao enviar o formulário

    const clienteId = document.getElementById("cliente-id").value;
    const produtoId = document.getElementById("produto-id").value;

    if (!clienteId || !produtoId) {
        alert("Por favor, preencha todos os campos antes de enviar o pedido.");
        return;
    }

    // Requisição para buscar o preço do produto selecionado
    fetch(`http://localhost:5000/produtos/${produtoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar preço do produto: " + response.statusText);
            }
            return response.json();
        })
        .then(produto => {
            const pedido = {
                cliente_id: clienteId,
                total: produto.preco // Definir o total com base no preço do produto
            };

            // Enviar pedido para a API
            return fetch("http://localhost:5000/pedidos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pedido)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao criar pedido: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Pedido realizado com sucesso:", data); // Depuração
            alert("Pedido realizado com sucesso!");
        })
        .catch(error => {
            console.error("Erro ao realizar pedido:", error);
            alert("Erro ao realizar pedido. Tente novamente mais tarde.");
        });
}

// Adicionar eventos ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
    // Carregar produtos ao abrir a página
    carregarProdutos();

    // Associar evento de envio ao formulário
    const formPedido = document.getElementById("form-pedido");
    formPedido.addEventListener("submit", enviarPedido);
});
