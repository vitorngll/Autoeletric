const moeda = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const ler = (c, p) => JSON.parse(localStorage.getItem(c)) ?? p;
const salvar = (c, v) => localStorage.setItem(c, JSON.stringify(v));

const estoqueProduto = p => {
  const est = ler("estoque", {});
  return Number.isInteger(est[p.id]) && est[p.id] >= 0 ? est[p.id] : p.estoque;
};

function atualizarContador() {
  const total = ler("carrinho", []).reduce((s, i) => s + i.qtd, 0);
  document.querySelectorAll(".qtd-carrinho").forEach(el => el.textContent = total);
}

function adicionarCarrinho(id) {
  const p = PRODUTOS.find(item => item.id === id);
  if (!p) return;
  const estoque = estoqueProduto(p);
  const carrinho = ler("carrinho", []);
  const item = carrinho.find(i => i.id === id);

  if (item) {
    if (item.qtd >= estoque) return alert("Estoque limite atingido.");
    item.qtd++;
  } else {
    if (estoque < 1) return alert("Produto esgotado.");
    carrinho.push({ id: p.id, nome: p.nome, preco: p.preco, qtd: 1 });
  }
  salvar("carrinho", carrinho);
  atualizarContador();
  alert(`${p.nome} adicionado!`);
}

function removerItem(id) {
  salvar("carrinho", ler("carrinho", []).filter(i => i.id !== id));
  atualizarContador();
  iniciarCarrinho();
}

function mostrarMenuUsuario() {
  const u = ler("usuarioLogado", null);
  const area = document.getElementById("areaUsuario");
  if (!area) return;
  area.innerHTML = u ? `Olá, ${u.nome.split(" ")[0]} | <a href="pedidos.html">Pedidos</a> | <a href="#" onclick="localStorage.removeItem('usuarioLogado');location.href='index.html'">Sair</a>` : `<a href="login.html">Entrar</a>`;
}

function iniciarHome() {
  const box = document.getElementById("destaques");
  if (!box) return;
  box.innerHTML = [PRODUTOS[7], PRODUTOS[0], PRODUTOS[4]].map(p => `
    <div class="card">
      <img src="${p.imagem}" alt="${p.nome}">
      <h3>${p.nome}</h3>
      <p class="preco">${moeda(p.preco)}</p>
      <a href="produto.html?id=${p.id}" class="btn">Ver</a>
    </div>
  `).join("");
}

function iniciarLista(tipo) {
  const box = document.getElementById("listaProdutos");
  const select = document.getElementById("filtroCategoria");
  const busca = document.getElementById("filtroBusca");
  if (!box) return;

  CATEGORIAS.filter(c => c.tipo === tipo).forEach(c => select.innerHTML += `<option value="${c.id}">${c.nome}</option>`);

  const renderizar = () => {
    const termo = busca.value.toLowerCase();
    const filtrados = PRODUTOS.filter(p => CATEGORIAS.find(c => c.id === p.categoria).tipo === tipo && (select.value === "todas" || p.categoria === select.value) && p.nome.toLowerCase().includes(termo));
    box.innerHTML = filtrados.length ? filtrados.map(p => `
      <div class="card">
        <img src="${p.imagem}" alt="${p.nome}">
        <h3>${p.nome}</h3>
        <p class="preco">${moeda(p.preco)}</p>
        <button class="btn" onclick="adicionarCarrinho(${p.id})">Adicionar</button>
      </div>
    `).join("") : "<p>Nenhum produto encontrado.</p>";
  };

  busca.addEventListener("input", renderizar);
  select.addEventListener("change", renderizar);
  renderizar();
}

function iniciarProduto() {
  const box = document.getElementById("detalheProduto");
  if (!box) return;
  const p = PRODUTOS.find(item => item.id === Number(new URLSearchParams(location.search).get("id")));
  if (!p) return box.innerHTML = "<p>Não encontrado.</p>";
  box.innerHTML = `<div><h1>${p.nome}</h1><p>${moeda(p.preco)}</p><button class="btn" onclick="adicionarCarrinho(${p.id})">Adicionar</button></div>`;
}

function iniciarCarrinho() {
  const box = document.getElementById("areaCarrinho");
  if (!box) return;
  const carrinho = ler("carrinho", []);
  if (!carrinho.length) return box.innerHTML = `
    <div class="carrinho-vazio">
      <h2>Seu carrinho está vazio</h2>
      <p>Adicione produtos para continuar sua compra.</p>
      <a class="btn" href="veiculo.html">Ver produtos</a>
    </div>
  `;

  const total = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
  const quantidade = carrinho.reduce((s, i) => s + i.qtd, 0);

  box.innerHTML = `
    <div class="carrinho-layout">
      <section class="carrinho-itens">
        <h2>Produtos selecionados</h2>
        ${carrinho.map(i => `
          <article class="carrinho-item">
            <div class="carrinho-produto">
              <h3>${i.nome}</h3>
              <p>${i.qtd} × ${moeda(i.preco)}</p>
            </div>
            <div class="carrinho-acoes">
              <strong>${moeda(i.preco * i.qtd)}</strong>
              <button class="btn btn-escuro" onclick="removerItem(${i.id})">Remover</button>
            </div>
          </article>
        `).join("")}
      </section>

      <aside class="resumo-carrinho">
        <h2>Resumo da compra</h2>
        <p>${quantidade} item(ns) no carrinho</p>
        <p class="carrinho-total"><span>Total</span><strong>${moeda(total)}</strong></p>
        <p class="carrinho-retirada">Retirada presencial na loja física em Curitiba.</p>
        <button class="btn" onclick="finalizarPedido()">Finalizar compra</button>
      </aside>
    </div>
  `;
}

function finalizarPedido() {
  const u = ler("usuarioLogado", null);
  if (!u) return location.href = "login.html";
  const carrinho = ler("carrinho", []);
  if (!carrinho.length) return;
  const pedidos = ler("pedidos", []);
  pedidos.push({ numero: 1001 + pedidos.length, email: u.email, total: carrinho.reduce((s, i) => s + i.preco * i.qtd, 0) });
  salvar("pedidos", pedidos);
  salvar("carrinho", []);
  location.href = "pedidos.html";
}

function autenticar(e, tipo) {
  e.preventDefault();
  const email = document.getElementById(tipo === 'login' ? 'emailLogin' : 'email').value.trim().toLowerCase();
  const senha = document.getElementById(tipo === 'login' ? 'senhaLogin' : 'senha').value;
  let clientes = ler("clientes", []);

  if (tipo === 'cadastro') {
    if (clientes.some(c => c.email === email)) return alert("Já cadastrado.");
    const novo = { nome: document.getElementById('nome').value, email, senha };
    clientes.push(novo);
    salvar("clientes", clientes);
    salvar("usuarioLogado", novo);
  } else {
    const usuario = clientes.find(c => c.email === email && c.senha === senha);
    if (!usuario) return alert("Dados incorretos.");
    salvar("usuarioLogado", usuario);
  }
  location.href = "index.html";
}

function iniciarPedidos() {
  const box = document.getElementById("listaPedidos");
  if (!box) return;
  const u = ler("usuarioLogado", null);
  if (!u) return box.innerHTML = "Faça login.";
  box.innerHTML = ler("pedidos", []).filter(p => p.email === u.email).map(p => `<div>Pedido #${p.numero} - ${moeda(p.total)}</div>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarContador();
  mostrarMenuUsuario();
  ({ home: iniciarHome, catalogo: () => iniciarLista("veiculo"), acessorios: () => iniciarLista("acessorio"), produto: iniciarProduto, carrinho: iniciarCarrinho, pedidos: iniciarPedidos })[document.body.dataset.pagina]?.();
});