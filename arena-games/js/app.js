class Produto {
    constructor(codigo, nome, categoria, preco, estoque, imagem) {
        this.codigo = codigo;
        this.nome = nome;
        this.categoria = categoria;
        this.preco = preco;
        this.estoque = estoque;
        this.imagem = imagem;
    }

    estaDisponivel() {
        return this.estoque > 0;
    }
}

class Carrinho {
    constructor() {
        this.itens = [];
    }

    adicionar(produto) {
        let itemExistente = null;
        for (let i = 0; i < this.itens.length; i++) {
            if (this.itens[i].produto.codigo === produto.codigo) {
                itemExistente = this.itens[i];
                break;
            }
        }

        if (itemExistente) {
            if (itemExistente.quantidade < itemExistente.produto.estoque) {
                itemExistente.quantidade++;
                return true;
            }
            return false;
        }

        this.itens.push({ produto: produto, quantidade: 1 });
        return true;
    }

    remover(codigo) {
        let novaLista = [];
        for (let i = 0; i < this.itens.length; i++) {
            if (this.itens[i].produto.codigo !== codigo) {
                novaLista.push(this.itens[i]);
            }
        }
        this.itens = novaLista;
    }

    alterarQuantidade(codigo, novaQuantidade) {
        for (let i = 0; i < this.itens.length; i++) {
            if (this.itens[i].produto.codigo === codigo) {
                if (novaQuantidade <= 0) {
                    this.remover(codigo);
                } else if (novaQuantidade <= this.itens[i].produto.estoque) {
                    this.itens[i].quantidade = novaQuantidade;
                }
                break;
            }
        }
    }

    calcularSubtotal() {
        let subtotal = 0;
        for (let i = 0; i < this.itens.length; i++) {
            subtotal += this.itens[i].produto.preco * this.itens[i].quantidade;
        }
        return subtotal;
    }

    calcularDesconto() {
        let subtotal = this.calcularSubtotal();
        if (subtotal >= 500) {
            return subtotal * 0.1;
        } else {
            return 0;
        }
    }

    calcularTotal() {
        return this.calcularSubtotal() - this.calcularDesconto();
    }

    quantidadeTotal() {
        let total = 0;
        for (let i = 0; i < this.itens.length; i++) {
            total += this.itens[i].quantidade;
        }
        return total;
    }

    estaVazio() {
        return this.itens.length === 0;
    }

    limpar() {
        this.itens = [];
    }
}

var produtos = [
    new Produto(1, "Headset Gamer RGB", "Periféricos", 249.90, 15, "img/headset.svg"),
    new Produto(2, "Mouse Gamer 16000 DPI", "Periféricos", 189.90, 20, "img/mouse.svg"),
    new Produto(3, "Teclado Mecânico RGB", "Periféricos", 349.90, 8, "img/teclado.svg"),
    new Produto(4, "PlayStation 5", "Consoles", 3999.90, 3, "img/ps5.svg"),
    new Produto(5, "Controle Xbox Series", "Acessórios", 399.90, 12, "img/controle.svg"),
    new Produto(6, "Monitor Gamer 144Hz", "Periféricos", 1899.90, 5, "img/monitor.svg"),
    new Produto(7, "Cadeira Gamer Pro", "Acessórios", 1299.90, 0, "img/cadeira.svg"),
    new Produto(8, "GTA VI", "Jogos", 299.90, 25, "img/gta6.svg")
];

const carrinho = new Carrinho();
let categoriaAtual = "Todos";
let buscaAtual = "";

function obterCategorias() {
    const categorias = ["Todos"];
    for (let i = 0; i < produtos.length; i++) {
        if (categorias.indexOf(produtos[i].categoria) === -1) {
            categorias.push(produtos[i].categoria);
        }
    }
    return categorias;
}

function filtrarProdutos() {
    let resultado = [];

    if (buscaAtual !== "") {
        let i = 0;
        while (i < produtos.length) {
            let nomeLower = produtos[i].nome.toLowerCase();
            let buscaLower = buscaAtual.toLowerCase();
            if (nomeLower.indexOf(buscaLower) !== -1) {
                resultado.push(produtos[i]);
            }
            i++;
        }
    } else {
        for (let i = 0; i < produtos.length; i++) {
            resultado.push(produtos[i]);
        }
    }

    if (categoriaAtual !== "Todos") {
        let filtrado = [];
        for (let i = 0; i < resultado.length; i++) {
            if (resultado[i].categoria === categoriaAtual) {
                filtrado.push(resultado[i]);
            }
        }
        resultado = filtrado;
    }

    return resultado;
}

function formatarPreco(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",");
}

function renderizarProdutos() {
    const container = document.getElementById("produtos-container");
    const produtosFiltrados = filtrarProdutos();

    container.innerHTML = "";

    if (produtosFiltrados.length === 0) {
        let msg = document.createElement("p");
        msg.className = "mensagem-vazia";
        msg.textContent = "Nenhum produto encontrado.";
        container.appendChild(msg);
        return;
    }

    for (let i = 0; i < produtosFiltrados.length; i++) {
        let produto = produtosFiltrados[i];
        let disponivel = produto.estaDisponivel();

        let card = document.createElement("div");
        card.className = "produto-card";
        if (!disponivel) {
            card.classList.add("indisponivel");
        }

        let imgDiv = document.createElement("div");
        imgDiv.className = "produto-imagem";
        let img = document.createElement("img");
        img.src = produto.imagem;
        img.alt = produto.nome;
        imgDiv.appendChild(img);

        let infoDiv = document.createElement("div");
        infoDiv.className = "produto-info";

        let nome = document.createElement("h3");
        nome.textContent = produto.nome;

        let categoria = document.createElement("span");
        categoria.className = "produto-categoria";
        categoria.textContent = produto.categoria;

        let preco = document.createElement("p");
        preco.className = "produto-preco";
        preco.textContent = formatarPreco(produto.preco);

        let estoque = document.createElement("p");
        estoque.className = "produto-estoque";
        if (disponivel) {
            estoque.textContent = "Em estoque: " + produto.estoque + " un.";
        } else {
            estoque.textContent = "Produto indisponível";
            estoque.classList.add("sem-estoque");
        }

        let botao = document.createElement("button");
        if (disponivel) {
            botao.textContent = "Adicionar ao carrinho";
            botao.className = "btn-adicionar";
            botao.setAttribute("data-codigo", produto.codigo);
        } else {
            botao.textContent = "Indisponível";
            botao.className = "btn-adicionar desativado";
            botao.disabled = true;
        }

        infoDiv.appendChild(nome);
        infoDiv.appendChild(categoria);
        infoDiv.appendChild(preco);
        infoDiv.appendChild(estoque);
        infoDiv.appendChild(botao);

        card.appendChild(imgDiv);
        card.appendChild(infoDiv);
        container.appendChild(card);
    }
}

function renderizarCategorias() {
    const container = document.getElementById("categorias-container");
    const categorias = obterCategorias();
    container.innerHTML = "";

    for (let i = 0; i < categorias.length; i++) {
        let botao = document.createElement("button");
        botao.textContent = categorias[i];
        botao.className = "btn-categoria";
        if (categorias[i] === categoriaAtual) {
            botao.classList.add("ativa");
        }
        botao.setAttribute("data-categoria", categorias[i]);
        container.appendChild(botao);
    }
}

function adicionarAoCarrinho(codigo) {
    let produto = null;
    for (let i = 0; i < produtos.length; i++) {
        if (produtos[i].codigo === codigo) {
            produto = produtos[i];
            break;
        }
    }

    if (produto === null) {
        return;
    }

    if (!produto.estaDisponivel()) {
        mostrarNotificacao("Este produto está indisponível.");
        return;
    }

    let adicionou = carrinho.adicionar(produto);
    if (adicionou) {
        atualizarContadorCarrinho();
        mostrarNotificacao(produto.nome + " adicionado ao carrinho!");
    } else {
        mostrarNotificacao("Estoque máximo atingido para " + produto.nome);
    }
}

function renderizarCarrinho() {
    const container = document.getElementById("carrinho-itens");
    const resumo = document.getElementById("carrinho-resumo");
    container.innerHTML = "";

    if (carrinho.estaVazio()) {
        let msg = document.createElement("p");
        msg.className = "carrinho-vazio";
        msg.textContent = "Seu carrinho está vazio.";
        container.appendChild(msg);
        resumo.style.display = "none";
        return;
    }

    resumo.style.display = "block";

    for (let i = 0; i < carrinho.itens.length; i++) {
        let item = carrinho.itens[i];

        let div = document.createElement("div");
        div.className = "carrinho-item";

        let infoDiv = document.createElement("div");
        infoDiv.className = "item-info";

        let nome = document.createElement("span");
        nome.className = "item-nome";
        nome.textContent = item.produto.nome;

        let precoUnitario = document.createElement("span");
        precoUnitario.className = "item-preco-unitario";
        precoUnitario.textContent = formatarPreco(item.produto.preco) + " cada";

        infoDiv.appendChild(nome);
        infoDiv.appendChild(precoUnitario);

        let qtdDiv = document.createElement("div");
        qtdDiv.className = "item-quantidade";

        let btnMenos = document.createElement("button");
        btnMenos.textContent = "−";
        btnMenos.className = "btn-qtd";
        btnMenos.setAttribute("data-codigo", item.produto.codigo);
        btnMenos.setAttribute("data-acao", "diminuir");

        let qtdSpan = document.createElement("span");
        qtdSpan.className = "qtd-valor";
        qtdSpan.textContent = item.quantidade;

        let btnMais = document.createElement("button");
        btnMais.textContent = "+";
        btnMais.className = "btn-qtd";
        btnMais.setAttribute("data-codigo", item.produto.codigo);
        btnMais.setAttribute("data-acao", "aumentar");

        qtdDiv.appendChild(btnMenos);
        qtdDiv.appendChild(qtdSpan);
        qtdDiv.appendChild(btnMais);

        let subtotal = document.createElement("span");
        subtotal.className = "item-subtotal";
        subtotal.textContent = formatarPreco(item.produto.preco * item.quantidade);

        let btnRemover = document.createElement("button");
        btnRemover.textContent = "Remover";
        btnRemover.className = "btn-remover";
        btnRemover.setAttribute("data-codigo", item.produto.codigo);

        div.appendChild(infoDiv);
        div.appendChild(qtdDiv);
        div.appendChild(subtotal);
        div.appendChild(btnRemover);

        container.appendChild(div);
    }

    let subtotalValor = carrinho.calcularSubtotal();
    let descontoValor = carrinho.calcularDesconto();
    let totalValor = carrinho.calcularTotal();
    let qtdTotal = carrinho.quantidadeTotal();

    document.getElementById("resumo-qtd").textContent = qtdTotal;
    document.getElementById("resumo-subtotal").textContent = formatarPreco(subtotalValor);
    document.getElementById("resumo-desconto").textContent = formatarPreco(descontoValor);
    document.getElementById("resumo-total").textContent = formatarPreco(totalValor);

    let descontoInfo = document.getElementById("desconto-info");
    if (subtotalValor >= 500) {
        descontoInfo.textContent = "Desconto de 10% aplicado!";
        descontoInfo.className = "desconto-info aplicado";
    } else {
        let falta = 500 - subtotalValor;
        descontoInfo.textContent = "Faltam " + formatarPreco(falta) + " para ganhar 10% de desconto";
        descontoInfo.className = "desconto-info";
    }
}

const atualizarContadorCarrinho = () => {
    let contador = document.getElementById("carrinho-contador");
    let qtd = carrinho.quantidadeTotal();
    contador.textContent = qtd;
    if (qtd > 0) {
        contador.style.display = "inline-block";
    } else {
        contador.style.display = "none";
    }
};

function mostrarNotificacao(mensagem) {
    let notificacao = document.getElementById("notificacao");
    notificacao.textContent = mensagem;
    notificacao.classList.add("mostrar");
    setTimeout(function() {
        notificacao.classList.remove("mostrar");
    }, 2500);
}

function mostrarSecao(secaoId) {
    let secoes = ["secao-produtos", "secao-carrinho", "secao-resumo-final", "secao-compra-sucesso"];
    for (let i = 0; i < secoes.length; i++) {
        let el = document.getElementById(secoes[i]);
        if (secoes[i] === secaoId) {
            el.style.display = secaoId === "secao-compra-sucesso" ? "flex" : "block";
        } else {
            el.style.display = "none";
        }
    }
}

function mostrarCarrinho() {
    mostrarSecao("secao-carrinho");
    renderizarCarrinho();
}

function mostrarProdutos() {
    mostrarSecao("secao-produtos");
}

function finalizarCompra() {
    if (carrinho.estaVazio()) {
        mostrarNotificacao("Adicione produtos ao carrinho antes de finalizar!");
        return;
    }

    let resumoContainer = document.getElementById("resumo-final-itens");
    resumoContainer.innerHTML = "";

    for (let i = 0; i < carrinho.itens.length; i++) {
        let item = carrinho.itens[i];
        let div = document.createElement("div");
        div.className = "resumo-item";

        let nomeSpan = document.createElement("span");
        nomeSpan.textContent = item.produto.nome + " (x" + item.quantidade + ")";

        let valorSpan = document.createElement("span");
        valorSpan.textContent = formatarPreco(item.produto.preco * item.quantidade);

        div.appendChild(nomeSpan);
        div.appendChild(valorSpan);
        resumoContainer.appendChild(div);
    }

    document.getElementById("final-subtotal").textContent = formatarPreco(carrinho.calcularSubtotal());
    document.getElementById("final-desconto").textContent = formatarPreco(carrinho.calcularDesconto());
    document.getElementById("final-total").textContent = formatarPreco(carrinho.calcularTotal());

    mostrarSecao("secao-resumo-final");
}

function confirmarCompra() {
    carrinho.limpar();
    atualizarContadorCarrinho();
    mostrarSecao("secao-compra-sucesso");

    setTimeout(function() {
        mostrarProdutos();
    }, 3000);
}

function pesquisar() {
    let campo = document.getElementById("campo-busca");
    buscaAtual = campo.value;
    renderizarProdutos();
}

document.addEventListener("DOMContentLoaded", function() {
    renderizarCategorias();
    renderizarProdutos();
    atualizarContadorCarrinho();

    document.getElementById("campo-busca").addEventListener("input", function() {
        pesquisar();
    });

    document.getElementById("btn-carrinho").addEventListener("click", function() {
        mostrarCarrinho();
    });

    document.getElementById("btn-voltar").addEventListener("click", function() {
        mostrarProdutos();
    });

    document.getElementById("btn-finalizar").addEventListener("click", function() {
        finalizarCompra();
    });

    document.getElementById("btn-confirmar").addEventListener("click", function() {
        confirmarCompra();
    });

    document.getElementById("btn-cancelar").addEventListener("click", function() {
        mostrarCarrinho();
    });

    document.getElementById("produtos-container").addEventListener("click", function(e) {
        if (e.target.classList.contains("btn-adicionar") && !e.target.disabled) {
            let codigo = Number(e.target.getAttribute("data-codigo"));
            adicionarAoCarrinho(codigo);
        }
    });

    document.getElementById("categorias-container").addEventListener("click", function(e) {
        if (e.target.classList.contains("btn-categoria")) {
            categoriaAtual = e.target.getAttribute("data-categoria");
            renderizarCategorias();
            renderizarProdutos();
        }
    });

    document.getElementById("carrinho-itens").addEventListener("click", function(e) {
        let target = e.target;

        if (target.classList.contains("btn-qtd")) {
            let codigo = Number(target.getAttribute("data-codigo"));
            let acao = target.getAttribute("data-acao");
            let itemAtual = null;

            for (let i = 0; i < carrinho.itens.length; i++) {
                if (carrinho.itens[i].produto.codigo === codigo) {
                    itemAtual = carrinho.itens[i];
                    break;
                }
            }

            if (itemAtual) {
                if (acao === "aumentar") {
                    carrinho.alterarQuantidade(codigo, itemAtual.quantidade + 1);
                } else if (acao === "diminuir") {
                    carrinho.alterarQuantidade(codigo, itemAtual.quantidade - 1);
                }
                renderizarCarrinho();
                atualizarContadorCarrinho();
            }
        }

        if (target.classList.contains("btn-remover")) {
            let codigo = Number(target.getAttribute("data-codigo"));
            carrinho.remover(codigo);
            renderizarCarrinho();
            atualizarContadorCarrinho();
        }
    });
});
