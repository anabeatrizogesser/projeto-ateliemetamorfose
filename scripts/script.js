/* ==========================================================
   Ateliê Metamorfose — script.js
   Organização: configuração → estado → funções → eventos
========================================================== */

// ----- Configuração -----
const NUMERO_WHATSAPP = "5562999999999"; 
const URL_VIACEP = "https://viacep.com.br/ws";

// ----- Estado da aplicação -----
const estado = {
  itens: [],      // [{ nome, preco, quantidade }]
  endereco: ""    // texto retornado pela API de CEP
};

// ----- Elementos da página -----
const el = {};

function carregarElementos() {
  el.contador = document.getElementById("cart-count");
  el.aviso = document.getElementById("aviso");
  el.lista = document.getElementById("lista-itens");
  el.formCep = document.getElementById("form-cep");
  el.campoCep = document.getElementById("cep");
  el.endereco = document.getElementById("endereco");
  el.btnFinalizar = document.getElementById("btn-finalizar");
  el.menuToggle = document.getElementById("menu-toggle");
  el.menu = document.getElementById("menu-principal");
  el.dataHora = document.getElementById("data-hora");
}

/* ===== 1. Itens do atendimento (carrinho) ===== */

function adicionarItem(nome, preco) {
  const existente = estado.itens.find((item) => item.nome === nome);
  if (existente) {
    existente.quantidade++;
  } else {
    estado.itens.push({ nome, preco, quantidade: 1 });
  }
  atualizarTela();
  mostrarAviso(`"${nome}" foi adicionado ao seu atendimento.`);
}

function removerItem(nome) {
  estado.itens = estado.itens.filter((item) => item.nome !== nome);
  atualizarTela();
}

function contarItens() {
  return estado.itens.reduce((total, item) => total + item.quantidade, 0);
}

function atualizarTela() {
  el.contador.textContent = contarItens();
  el.lista.innerHTML = "";

  estado.itens.forEach((item) => {
    const linha = document.createElement("li");
    linha.textContent = `${item.nome} × ${item.quantidade} — ${item.preco} `;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "btn-remove";
    botao.dataset.nome = item.nome;
    botao.textContent = "Remover";
    botao.setAttribute("aria-label", `Remover ${item.nome}`);

    linha.appendChild(botao);
    el.lista.appendChild(linha);
  });
}

function mostrarAviso(mensagem) {
  el.aviso.textContent = mensagem;
}

/* ===== 2. Consumo da API pública ViaCEP ===== */

async function buscarEnderecoPorCep(cep) {
  const resposta = await fetch(`${URL_VIACEP}/${cep}/json/`);
  if (!resposta.ok) throw new Error("Falha na consulta do CEP");

  const dados = await resposta.json();
  if (dados.erro) return null; // CEP não encontrado

  const rua = dados.logradouro ? `${dados.logradouro}, ` : "";
  return `${rua}${dados.bairro} — ${dados.localidade}/${dados.uf}`;
}

async function tratarBuscaDeCep(evento) {
  evento.preventDefault();
  const cep = el.campoCep.value.replace(/\D/g, ""); // só números

  if (cep.length !== 8) {
    el.endereco.textContent = "Digite um CEP com 8 números.";
    return;
  }

  el.endereco.textContent = "Buscando endereço...";
  try {
    const endereco = await buscarEnderecoPorCep(cep);
    estado.endereco = endereco || "";
    el.endereco.textContent = endereco
      ? `Entrega em: ${endereco}`
      : "CEP não encontrado. Confira os números.";
  } catch (erro) {
    el.endereco.textContent = "Não foi possível consultar o CEP agora. Tente novamente.";
  }
}

/* ===== 3. Envio do pedido pelo WhatsApp ===== */

// Texto do pedido: itens escolhidos e, se houver, o endereço de entrega
function montarMensagem() {
  const linhas = ["Olá! Gostaria de agendar um atendimento para:"];
  estado.itens.forEach((item) => {
    linhas.push(`- ${item.nome} × ${item.quantidade} (${item.preco})`);
  });
  if (estado.endereco) linhas.push(`Entrega em: ${estado.endereco}`);
  return linhas.join("\n");
}

// Monta o link do WhatsApp com o número configurado e o texto da mensagem
function montarLinkWhatsapp(texto) {
  return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`;
}

function finalizarAtendimento() {
  if (estado.itens.length === 0) {
    mostrarAviso("Escolha ao menos um vestido para enviar o atendimento.");
    return;
  }

  const url = montarLinkWhatsapp(montarMensagem());
  const janela = window.open(url, "_blank");

  if (janela) {
    janela.opener = null; // segurança: a nova aba não controla esta página
  } else {
    window.location.href = url; // se o navegador bloquear o pop-up, abre na mesma aba
  }
}

/* ===== 4. Menu mobile ===== */

function alternarMenu() {
  const aberto = el.menu.classList.toggle("aberto");
  el.menuToggle.setAttribute("aria-expanded", String(aberto));
}

/* ===== 5. Data e hora no rodapé ===== */

function atualizarDataHora() {
  const agora = new Date();
  const data = agora.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const hora = agora.toLocaleTimeString("pt-BR");
  el.dataHora.textContent = `Acesso em: ${data} às ${hora}`;
}

/* ===== Inicialização ===== */

function configurarEventos() {
  // Os botões "Comprar" registram o item e abrem o WhatsApp no número configurado
    // Os botões dos produtos só adicionam o item; o WhatsApp abre no botão final
  document.querySelectorAll(".btn-card").forEach((botao) => {
    const textoOriginal = botao.textContent;

    botao.addEventListener("click", () => {
      const card = botao.closest(".product-card");
      const nome = card.querySelector(".product-title").textContent;
      const preco = card.querySelector(".product-price").textContent;

      adicionarItem(nome, preco);

      // Confirmação visível no próprio botão (a lista fica mais abaixo na página)
      botao.textContent = "Adicionado ✓";
      setTimeout(() => (botao.textContent = textoOriginal), 1500);
    });
  });

  el.lista.addEventListener("click", (evento) => {
    if (evento.target.matches(".btn-remove")) removerItem(evento.target.dataset.nome);
  });

  el.formCep.addEventListener("submit", tratarBuscaDeCep);
  el.btnFinalizar.addEventListener("click", finalizarAtendimento);
  el.menuToggle.addEventListener("click", alternarMenu);
}

document.addEventListener("DOMContentLoaded", () => {
  carregarElementos();
  configurarEventos();
  atualizarDataHora();
  setInterval(atualizarDataHora, 1000);
});

/* ==========================================================
   REFLEXÃO — CLEAN CODE
   Apliquei: nomes claros (adicionarItem, buscarEnderecoPorCep),
   funções pequenas com uma única responsabilidade, constantes de
   configuração no topo, estado centralizado em um objeto e
   tratamento de erro (try/catch) na chamada da API.
   Posso melhorar: separar o JS em módulos (carrinho, api, menu),
   salvar o carrinho no localStorage e adicionar testes.
========================================================== */