const CHAVES = {
  carrinho: "ae_carrinho",
  clientes: "ae_clientes",
  sessao: "ae_sessao",
  pedidos: "ae_pedidos",
  estoque: "ae_estoque",
  movimentos: "ae_movimentos",
  mensagens: "ae_mensagens"
};

function lerLS(chave, padrao) {
  const bruto = localStorage.getItem(chave);
  if (bruto === null) {
    return padrao;
  }
  try {
    return JSON.parse(bruto);
  } catch (erro) {
    return padrao;
  }
}

function salvarLS(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

function moeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function achar(id) {
  return PRODUTOS.find(function (p) {
    return p.id === Number(id);
  });
}

function nomeCategoria(id) {
  const cat = CATEGORIAS.find(function (c) {
    return c.id === id;
  });
  return cat ? cat.nome : id;
}

function estoqueDe(produto) {
  const salvo = lerLS(CHAVES.estoque, {});
  if (salvo[produto.id] === undefined) {
    return produto.estoque;
  }
  return salvo[produto.id];
}

function alterarEstoque(id, delta, motivo, pedidoId) {
  const salvo = lerLS(CHAVES.estoque, {});
  const produto = achar(id);
  const atual = salvo[id] === undefined ? produto.estoque : salvo[id];
  salvo[id] = atual + delta;
  salvarLS(CHAVES.estoque, salvo);
  const movimentos = lerLS(CHAVES.movimentos, []);
  movimentos.push({
    produto: id,
    tipo: delta < 0 ? "Saída" : "Entrada",
    quantidade: Math.abs(delta),
    motivo: motivo,
    pedido: pedidoId || null,
    data: new Date().toISOString()
  });
  salvarLS(CHAVES.movimentos, movimentos);
}

function lerCarrinho() {
  return lerLS(CHAVES.carrinho, []);
}

function totalItens() {
  let soma = 0;
  lerCarrinho().forEach(function (item) {
    soma += item.qtd;
  });
  return soma;
}

function adicionarAoCarrinho(id) {
  const produto = achar(id);
  const carrinho = lerCarrinho();
  const existente = carrinho.find(function (item) {
    return item.id === produto.id;
  });
  const naCesta = existente ? existente.qtd : 0;
  if (naCesta + 1 > estoqueDe(produto)) {
    avisar("Quantidade indisponível em estoque para " + produto.nome + ".", "warning");
    return;
  }
  if (existente) {
    existente.qtd += 1;
  } else {
    carrinho.push({ id: produto.id, qtd: 1 });
  }
  salvarLS(CHAVES.carrinho, carrinho);
  atualizarContador();
  avisar(produto.nome + " foi adicionado ao carrinho.", "success");
}

function atualizarContador() {
  document.querySelectorAll(".contador-carrinho").forEach(function (el) {
    const total = totalItens();
    el.textContent = total;
    el.hidden = total === 0;
  });
}

function avisar(mensagem, tipo) {
  let area = document.getElementById("areaAvisos");
  if (!area) {
    area = document.createElement("div");
    area.id = "areaAvisos";
    area.className = "area-avisos";
    area.setAttribute("aria-live", "polite");
    document.body.appendChild(area);
  }
  const aviso = document.createElement("div");
  aviso.className = "aviso aviso-" + tipo;
  aviso.textContent = mensagem;
  area.appendChild(aviso);
  setTimeout(function () {
    aviso.classList.add("saindo");
    setTimeout(function () {
      aviso.remove();
    }, 300);
  }, 2800);
}

function clienteLogado() {
  const email = lerLS(CHAVES.sessao, null);
  if (!email) {
    return null;
  }
  return lerLS(CHAVES.clientes, []).find(function (c) {
    return c.email === email;
  }) || null;
}

function sinalizarSessao() {
  const cliente = clienteLogado();
  const area = document.getElementById("navSessao");
  if (!area) {
    return;
  }
  if (cliente) {
    area.innerHTML = "";
    const nome = document.createElement("span");
    nome.className = "nav-ola";
    nome.textContent = "Olá, " + cliente.nome.split(" ")[0];
    const sair = document.createElement("a");
    sair.href = "index.html";
    sair.className = "nav-sair";
    sair.textContent = "Sair";
    sair.addEventListener("click", function () {
      localStorage.removeItem(CHAVES.sessao);
    });
    area.appendChild(nome);
    area.appendChild(sair);
  }
}

function hash(texto) {
  return btoa(unescape(encodeURIComponent(texto)));
}

function cardProduto(p) {
  const disponivel = estoqueDe(p);
  const coluna = document.createElement("div");
  coluna.className = "col";
  const selo = disponivel === 0
    ? '<span class="selo selo-esgotado">Esgotado</span>'
    : disponivel <= 4
      ? '<span class="selo selo-poucos">Últimas ' + disponivel + " unidades</span>"
      : "";
  coluna.innerHTML =
    '<article class="card cartao-produto h-100">' +
    '<a class="cartao-imagem" href="produto.html?id=' + p.id + '">' +
    '<img src="img/' + p.imagem + '.svg" class="card-img-top" alt="' + p.nome + '">' + selo + "</a>" +
    '<div class="card-body d-flex flex-column">' +
    '<small class="cartao-categoria">' + nomeCategoria(p.categoria) + "</small>" +
    '<h3 class="card-title h5">' + p.nome + "</h3>" +
    '<p class="card-text flex-grow-1">' + p.descricao.split(". ")[0].replace(/\.$/, "") + ".</p>" +
    '<p class="preco">' + moeda(p.preco) + "</p>" +
    '<div class="d-flex gap-2">' +
    '<a class="btn btn-outline-dark btn-sm flex-fill" href="produto.html?id=' + p.id + '">Detalhes</a>' +
    '<button type="button" class="btn btn-lima btn-sm flex-fill" data-add="' + p.id + '"' +
    (disponivel === 0 ? " disabled" : "") + ">" + (disponivel === 0 ? "Indisponível" : "Adicionar") + "</button>" +
    "</div></div></article>";
  return coluna;
}

function ligarBotoesAdicionar(raiz) {
  raiz.querySelectorAll("[data-add]").forEach(function (botao) {
    botao.addEventListener("click", function () {
      adicionarAoCarrinho(botao.dataset.add);
      if (document.body.dataset.pagina === "produto") {
        iniciarProduto();
      }
    });
  });
}

function iniciarHome() {
  const destaque = achar(8);
  const laterais = [achar(5), achar(6), achar(1)];
  const alvo = document.getElementById("destaquePrincipal");
  alvo.innerHTML =
    '<img src="img/hero.svg" alt="Scooter elétrico em destaque">' +
    '<div class="destaque-texto"><span class="etiqueta">Destaque da semana</span>' +
    "<h2>" + destaque.nome + "</h2>" +
    "<p>" + destaque.descricao + "</p>" +
    '<a class="btn btn-lima btn-lg" href="produto.html?id=' + destaque.id + '">Ver por ' + moeda(destaque.preco) + "</a></div>";
  const lista = document.getElementById("destaquesLaterais");
  laterais.forEach(function (p, indice) {
    const link = document.createElement("a");
    link.className = "destaque-lateral";
    link.href = "produto.html?id=" + p.id;
    link.innerHTML =
      '<span class="numero">' + (indice + 1) + "</span>" +
      '<img src="img/' + p.imagem + '.svg" alt="' + p.nome + '">' +
      "<div><strong>" + p.nome + "</strong><small>" + moeda(p.preco) + "</small></div>";
    lista.appendChild(link);
  });
  const novidades = document.getElementById("listaNovidades");
  NOVIDADES.forEach(function (n) {
    const item = document.createElement("li");
    item.innerHTML = "<time>" + n.data + "</time><div><strong>" + n.titulo + "</strong><p>" + n.texto + "</p></div>";
    novidades.appendChild(item);
  });
  const grade = document.getElementById("gradeCategorias");
  CATEGORIAS.filter(function (c) {
    return c.tipo === "veiculo";
  }).forEach(function (c) {
    const primeiro = PRODUTOS.find(function (p) {
      return p.categoria === c.id;
    });
    const link = document.createElement("a");
    link.className = "categoria-card";
    link.href = "catalogo.html?categoria=" + c.id;
    link.innerHTML = '<img src="img/' + primeiro.imagem + '.svg" alt="' + c.nome + '"><div><h3>' + c.nome + "</h3><p>" + c.descricao + "</p></div>";
    grade.appendChild(link);
  });
}

function iniciarCatalogo(tipo) {
  const lista = document.getElementById("listaProdutos");
  const busca = document.getElementById("filtroBusca");
  const categoria = document.getElementById("filtroCategoria");
  const ordem = document.getElementById("filtroOrdem");
  const contagem = document.getElementById("contagemResultados");
  const parametros = new URLSearchParams(location.search);

  CATEGORIAS.filter(function (c) {
    return c.tipo === tipo;
  }).forEach(function (c) {
    const opcao = document.createElement("option");
    opcao.value = c.id;
    opcao.textContent = c.nome;
    categoria.appendChild(opcao);
  });
  if (parametros.get("categoria")) {
    categoria.value = parametros.get("categoria");
  }

  function desenhar() {
    const termo = busca.value.trim().toLowerCase();
    let resultado = PRODUTOS.filter(function (p) {
      const categoriaDoProduto = CATEGORIAS.find(function (c) {
        return c.id === p.categoria;
      });
      if (categoriaDoProduto.tipo !== tipo) {
        return false;
      }
      if (categoria.value !== "todas" && p.categoria !== categoria.value) {
        return false;
      }
      return p.nome.toLowerCase().includes(termo) || p.descricao.toLowerCase().includes(termo);
    });
    if (ordem.value === "menor") {
      resultado.sort(function (a, b) {
        return a.preco - b.preco;
      });
    } else if (ordem.value === "maior") {
      resultado.sort(function (a, b) {
        return b.preco - a.preco;
      });
    } else {
      resultado.sort(function (a, b) {
        return a.nome.localeCompare(b.nome);
      });
    }
    lista.innerHTML = "";
    for (let i = 0; i < resultado.length; i++) {
      lista.appendChild(cardProduto(resultado[i]));
    }
    contagem.textContent = resultado.length + (resultado.length === 1 ? " produto encontrado" : " produtos encontrados");
    if (resultado.length === 0) {
      lista.innerHTML = '<div class="col-12"><div class="alert alert-secondary">Nenhum produto corresponde à sua busca.</div></div>';
    }
    ligarBotoesAdicionar(lista);
  }

  [busca, categoria, ordem].forEach(function (campo) {
    campo.addEventListener("input", desenhar);
  });
  desenhar();
}

function iniciarProduto() {
  const id = new URLSearchParams(location.search).get("id");
  const p = achar(id);
  const alvo = document.getElementById("detalheProduto");
  if (!p) {
    alvo.innerHTML = '<div class="alert alert-warning">Produto não encontrado. <a href="catalogo.html" class="alert-link">Voltar ao catálogo</a>.</div>';
    return;
  }
  document.title = p.nome + " | Autoeletric";
  const disponivel = estoqueDe(p);
  let linhas = "";
  Object.keys(p.specs).forEach(function (chave) {
    linhas += "<tr><th scope=\"row\">" + chave + "</th><td>" + p.specs[chave] + "</td></tr>";
  });
  const voltar = CATEGORIAS.find(function (c) {
    return c.id === p.categoria;
  }).tipo === "veiculo" ? "catalogo.html" : "acessorios.html";
  alvo.innerHTML =
    '<div class="row g-4 g-lg-5 align-items-start">' +
    '<div class="col-lg-6"><div class="detalhe-imagem"><img src="img/' + p.imagem + '.svg" alt="' + p.nome + '"></div></div>' +
    '<div class="col-lg-6">' +
    '<a class="voltar" href="' + voltar + '?categoria=' + p.categoria + '">&larr; ' + nomeCategoria(p.categoria) + "</a>" +
    "<h1>" + p.nome + "</h1>" +
    '<p class="lead">' + p.descricao + "</p>" +
    '<p class="preco preco-grande">' + moeda(p.preco) + "</p>" +
    '<p class="estoque ' + (disponivel === 0 ? "sem" : "com") + '">' +
    (disponivel === 0 ? "Esgotado no momento" : disponivel + " unidades disponíveis para retirada em Curitiba") + "</p>" +
    '<button type="button" class="btn btn-lima btn-lg" data-add="' + p.id + '"' + (disponivel === 0 ? " disabled" : "") + ">Adicionar ao carrinho</button>" +
    '<div class="table-responsive mt-4"><table class="table table-sm tabela-specs"><caption>Ficha técnica</caption><tbody>' + linhas + "</tbody></table></div>" +
    "</div></div>";
  ligarBotoesAdicionar(alvo);
}

function iniciarCarrinho() {
  const corpo = document.getElementById("itensCarrinho");
  const resumo = document.getElementById("resumoCarrinho");
  const vazio = document.getElementById("carrinhoVazio");
  const conteudo = document.getElementById("carrinhoConteudo");

  function desenhar() {
    const carrinho = lerCarrinho();
    corpo.innerHTML = "";
    if (carrinho.length === 0) {
      vazio.hidden = false;
      conteudo.hidden = true;
      return;
    }
    vazio.hidden = true;
    conteudo.hidden = false;
    let total = 0;
    carrinho.forEach(function (item) {
      const p = achar(item.id);
      const subtotal = p.preco * item.qtd;
      total += subtotal;
      const linha = document.createElement("tr");
      linha.innerHTML =
        '<td><div class="item-carrinho"><img src="img/' + p.imagem + '.svg" alt=""><div><strong>' + p.nome + "</strong><small>" + moeda(p.preco) + " cada</small></div></div></td>" +
        '<td><div class="input-group input-group-sm quantidade">' +
        '<button class="btn btn-outline-dark" type="button" data-menos="' + p.id + '" aria-label="Diminuir">&minus;</button>' +
        '<input class="form-control text-center" value="' + item.qtd + '" readonly aria-label="Quantidade">' +
        '<button class="btn btn-outline-dark" type="button" data-mais="' + p.id + '" aria-label="Aumentar">+</button></div></td>' +
        '<td class="text-end fw-bold">' + moeda(subtotal) + "</td>" +
        '<td class="text-end"><button class="btn btn-sm btn-link text-danger" type="button" data-remover="' + p.id + '">Remover</button></td>';
      corpo.appendChild(linha);
    });
    resumo.textContent = moeda(total);
    corpo.querySelectorAll("[data-mais]").forEach(function (b) {
      b.addEventListener("click", function () {
        mudarQtd(Number(b.dataset.mais), 1);
      });
    });
    corpo.querySelectorAll("[data-menos]").forEach(function (b) {
      b.addEventListener("click", function () {
        mudarQtd(Number(b.dataset.menos), -1);
      });
    });
    corpo.querySelectorAll("[data-remover]").forEach(function (b) {
      b.addEventListener("click", function () {
        mudarQtd(Number(b.dataset.remover), -999);
      });
    });
  }

  function mudarQtd(id, delta) {
    const carrinho = lerCarrinho();
    const item = carrinho.find(function (i) {
      return i.id === id;
    });
    const limite = estoqueDe(achar(id));
    item.qtd += delta;
    if (item.qtd > limite) {
      item.qtd = limite;
      avisar("Limite de estoque atingido.", "warning");
    }
    const restantes = carrinho.filter(function (i) {
      return i.qtd > 0;
    });
    salvarLS(CHAVES.carrinho, restantes);
    atualizarContador();
    desenhar();
  }

  document.getElementById("botaoFinalizar").addEventListener("click", function () {
    const cliente = clienteLogado();
    if (!cliente) {
      location.href = "login.html?next=carrinho.html";
      return;
    }
    const carrinho = lerCarrinho();
    let total = 0;
    let html = "";
    carrinho.forEach(function (item) {
      const p = achar(item.id);
      total += p.preco * item.qtd;
      html += "<li class=\"list-group-item d-flex justify-content-between\"><span>" + item.qtd + "× " + p.nome + "</span><strong>" + moeda(p.preco * item.qtd) + "</strong></li>";
    });
    document.getElementById("modalCliente").textContent = cliente.nome + " — CPF " + cliente.cpf;
    document.getElementById("modalItens").innerHTML = html;
    document.getElementById("modalTotal").textContent = moeda(total);
    bootstrap.Modal.getOrCreateInstance(document.getElementById("modalResumo")).show();
  });

  document.getElementById("formPagamento").addEventListener("submit", function (evento) {
    evento.preventDefault();
    const cliente = clienteLogado();
    const carrinho = lerCarrinho();
    const pedidos = lerLS(CHAVES.pedidos, []);
    const numero = 1000 + pedidos.length + 1;
    let total = 0;
    const itens = carrinho.map(function (item) {
      const p = achar(item.id);
      total += p.preco * item.qtd;
      return { id: p.id, nome: p.nome, qtd: item.qtd, preco: p.preco };
    });
    for (let i = 0; i < itens.length; i++) {
      if (itens[i].qtd > estoqueDe(achar(itens[i].id))) {
        avisar("Estoque insuficiente para " + itens[i].nome + ".", "warning");
        return;
      }
    }
    itens.forEach(function (item) {
      alterarEstoque(item.id, -item.qtd, "Venda", numero);
    });
    pedidos.push({
      numero: numero,
      email: cliente.email,
      itens: itens,
      total: total,
      pagamento: document.getElementById("formaPagamento").value,
      status: 0,
      criado: new Date().toISOString()
    });
    salvarLS(CHAVES.pedidos, pedidos);
    salvarLS(CHAVES.carrinho, []);
    location.href = "pedidos.html?novo=" + numero;
  });

  desenhar();
}

function iniciarCadastro() {
  const form = document.getElementById("formCadastro");
  const nascimento = document.getElementById("nascimento");
  const confirma = document.getElementById("confirmaSenha");
  const senha = document.getElementById("senha");

  const hoje = new Date();
  nascimento.max = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate()).toISOString().slice(0, 10);

  function validarIdade() {
    nascimento.setCustomValidity(nascimento.value && nascimento.value > nascimento.max ? "O cadastro é restrito a maiores de 18 anos." : "");
  }
  function validarSenhas() {
    confirma.setCustomValidity(confirma.value !== senha.value ? "As senhas não coincidem." : "");
  }
  nascimento.addEventListener("input", validarIdade);
  senha.addEventListener("input", validarSenhas);
  confirma.addEventListener("input", validarSenhas);

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    validarIdade();
    validarSenhas();
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      return;
    }
    const clientes = lerLS(CHAVES.clientes, []);
    const email = document.getElementById("email").value.trim().toLowerCase();
    const repetido = clientes.some(function (c) {
      return c.email === email;
    });
    if (repetido) {
      document.getElementById("alertaCadastro").innerHTML = '<div class="alert alert-danger">Este e-mail já está cadastrado. <a class="alert-link" href="login.html">Entrar</a></div>';
      return;
    }
    clientes.push({
      id: clientes.length + 1,
      nome: document.getElementById("nome").value.trim(),
      cpf: document.getElementById("cpf").value,
      email: email,
      telefone: document.getElementById("telefone").value,
      nascimento: nascimento.value,
      senha_hash: hash(senha.value),
      data_cadastro: new Date().toISOString()
    });
    salvarLS(CHAVES.clientes, clientes);
    salvarLS(CHAVES.sessao, email);
    const proxima = new URLSearchParams(location.search).get("next") || "pedidos.html";
    location.href = proxima;
  });
}

function iniciarLogin() {
  const form = document.getElementById("formLogin");
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      return;
    }
    const email = document.getElementById("emailLogin").value.trim().toLowerCase();
    const senha = document.getElementById("senhaLogin").value;
    const cliente = lerLS(CHAVES.clientes, []).find(function (c) {
      return c.email === email && c.senha_hash === hash(senha);
    });
    if (!cliente) {
      document.getElementById("alertaLogin").innerHTML = '<div class="alert alert-danger">E-mail ou senha incorretos.</div>';
      return;
    }
    salvarLS(CHAVES.sessao, email);
    location.href = new URLSearchParams(location.search).get("next") || "pedidos.html";
  });
  const cadastro = document.getElementById("linkCadastro");
  const proxima = new URLSearchParams(location.search).get("next");
  if (proxima) {
    cadastro.href = "cadastro.html?next=" + proxima;
  }
}

function iniciarPedidos() {
  const alvo = document.getElementById("listaPedidos");
  const cliente = clienteLogado();
  if (!cliente) {
    alvo.innerHTML = '<div class="alert alert-info">Entre na sua conta para consultar seus pedidos. <a class="alert-link" href="login.html?next=pedidos.html">Entrar</a> ou <a class="alert-link" href="cadastro.html?next=pedidos.html">cadastre-se</a>.</div>';
    return;
  }
  const novo = new URLSearchParams(location.search).get("novo");
  if (novo) {
    document.getElementById("alertaNovo").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert">Pedido #' + novo + ' registrado! Retire na loja física em Curitiba após o status "Aguardando retirada".<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button></div>';
  }

  function desenhar() {
    const todos = lerLS(CHAVES.pedidos, []);
    const meus = todos.filter(function (p) {
      return p.email === cliente.email;
    }).reverse();
    alvo.innerHTML = "";
    if (meus.length === 0) {
      alvo.innerHTML = '<div class="alert alert-secondary">Você ainda não fez pedidos. <a class="alert-link" href="catalogo.html">Explore o catálogo</a>.</div>';
      return;
    }
    meus.forEach(function (pedido) {
      const cartao = document.createElement("article");
      cartao.className = "card pedido-card mb-3";
      let etapas = "";
      STATUS_PEDIDO.forEach(function (nome, i) {
        etapas += '<li class="' + (i < pedido.status ? "feito" : i === pedido.status ? "atual" : "") + '">' + nome + "</li>";
      });
      let itens = "";
      pedido.itens.forEach(function (item) {
        itens += "<li>" + item.qtd + "× " + item.nome + "</li>";
      });
      const final = pedido.status === STATUS_PEDIDO.length - 1;
      cartao.innerHTML =
        '<div class="card-body">' +
        '<div class="d-flex flex-wrap justify-content-between gap-2 mb-3"><h3 class="h5 mb-0">Pedido #' + pedido.numero + "</h3>" +
        '<span class="badge ' + (final ? "text-bg-dark" : "badge-lima") + '">' + STATUS_PEDIDO[pedido.status] + "</span></div>" +
        '<ol class="linha-status">' + etapas + "</ol>" +
        '<ul class="itens-pedido">' + itens + "</ul>" +
        '<div class="d-flex flex-wrap justify-content-between align-items-center gap-2">' +
        "<span>" + pedido.pagamento + " · " + new Date(pedido.criado).toLocaleDateString("pt-BR") + " · <strong>" + moeda(pedido.total) + "</strong></span>" +
        '<button type="button" class="btn btn-outline-dark btn-sm" data-avancar="' + pedido.numero + '"' + (final ? " disabled" : "") + ">" + (final ? "Concluído" : "Avançar status (simulação)") + "</button></div></div>";
      alvo.appendChild(cartao);
    });
    alvo.querySelectorAll("[data-avancar]").forEach(function (botao) {
      botao.addEventListener("click", function () {
        const lista = lerLS(CHAVES.pedidos, []);
        const pedido = lista.find(function (p) {
          return p.numero === Number(botao.dataset.avancar);
        });
        pedido.status += 1;
        salvarLS(CHAVES.pedidos, lista);
        desenhar();
      });
    });
  }
  desenhar();
}

function iniciarContato() {
  const form = document.getElementById("formContato");
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      return;
    }
    const mensagens = lerLS(CHAVES.mensagens, []);
    mensagens.push({
      nome: document.getElementById("contatoNome").value,
      email: document.getElementById("contatoEmail").value,
      assunto: document.getElementById("contatoAssunto").value,
      mensagem: document.getElementById("contatoMensagem").value,
      data: new Date().toISOString()
    });
    salvarLS(CHAVES.mensagens, mensagens);
    form.reset();
    form.classList.remove("was-validated");
    document.getElementById("alertaContato").innerHTML = '<div class="alert alert-success" role="alert">Mensagem enviada! Responderemos pelo e-mail informado.</div>';
  });
}

function iniciarRegulamentacao() {
  const botoes = document.querySelectorAll("[data-filtro-regra]");
  const linhas = document.querySelectorAll("#tabelaRegras tbody tr");
  botoes.forEach(function (botao) {
    botao.addEventListener("click", function () {
      botoes.forEach(function (b) {
        b.classList.remove("ativo");
      });
      botao.classList.add("ativo");
      linhas.forEach(function (linha) {
        const mostrar = botao.dataset.filtroRegra === "todos" || linha.dataset.tipo === botao.dataset.filtroRegra;
        linha.hidden = !mostrar;
      });
    });
  });
}

function iniciarMenuSimples() {
  const botao = document.getElementById("botaoMenu");
  const menu = document.getElementById("menuSimples");
  if (!botao) {
    return;
  }
  botao.addEventListener("click", function () {
    const aberto = menu.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", aberto);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const pagina = document.body.dataset.pagina;
  document.querySelectorAll(".ano-atual").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
  atualizarContador();
  sinalizarSessao();
  iniciarMenuSimples();
  const rotas = {
    home: iniciarHome,
    catalogo: function () {
      iniciarCatalogo("veiculo");
    },
    acessorios: function () {
      iniciarCatalogo("acessorio");
    },
    produto: iniciarProduto,
    carrinho: iniciarCarrinho,
    cadastro: iniciarCadastro,
    login: iniciarLogin,
    pedidos: iniciarPedidos,
    contato: iniciarContato,
    regulamentacao: iniciarRegulamentacao
  };
  if (rotas[pagina]) {
    rotas[pagina]();
  }
});
