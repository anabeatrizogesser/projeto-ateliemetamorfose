# Ateliê Metamorfose — Moda Modesta Autoral

E-commerce responsivo e acessível do **Ateliê Metamorfose**, com vestidos sob medida e atendimento pelo WhatsApp. Projeto da disciplina de Modern Web (HTML, CSS e JavaScript).

## Funcionalidades

- **HTML semântico e acessível:** uso de `header`, `nav`, `main`, `section`, `article` e `footer`; link para pular ao conteúdo principal; textos alternativos nas imagens; foco visível para quem navega pelo teclado.
- **Layout responsivo:** Flexbox e Media Queries; em telas pequenas, o menu é aberto por um botão "Menu" (`aria-expanded`).
- **Lista de atendimento (JavaScript):** cada clique em "Adicionar item" registra o vestido escolhido, atualiza o contador do cabeçalho, mostra uma confirmação no botão e inclui o item na lista. Itens repetidos aumentam a quantidade, e cada item pode ser removido.
- **Consumo de API pública (ViaCEP):** com `fetch()`, o CEP digitado é consultado em tempo real e o endereço de entrega é exibido na página, com tratamento para CEP inválido, CEP não encontrado e falha de conexão.
- **Envio pelo WhatsApp:** o WhatsApp só abre ao clicar em "Enviar pelo WhatsApp". A mensagem é montada com os itens escolhidos, as quantidades e o endereço de entrega.
- **Data e hora** atualizadas a cada segundo no rodapé.

## Tecnologias

- HTML5
- CSS3 (Flexbox e Media Queries)
- JavaScript (DOM, eventos, `fetch` e `async/await`)
- API pública [ViaCEP](https://viacep.com.br/)

## Estrutura do projeto

```
index.html
styles/
  styles.css
scripts/
  script.js
images/
README.md
```

## Como executar

1. Baixe ou clone este repositório e mantenha a estrutura de pastas.
2. Abra o `index.html` no navegador (ou use a extensão Live Server do VS Code).
3. Para trocar o número que recebe os pedidos, altere a constante `NUMERO_WHATSAPP` no início do `script.js`, no formato `55` + DDD + número (por exemplo, `5561999999999`).
4. A consulta de CEP precisa de conexão com a internet.

## Organização do JavaScript (Clean Code)

- **Constantes de configuração** no topo do arquivo (`NUMERO_WHATSAPP`, `URL_VIACEP`).
- **Estado centralizado** em um objeto (`estado`), com itens e endereço.
- **Funções pequenas, com uma única responsabilidade** e nomes claros: `adicionarItem`, `removerItem`, `buscarEnderecoPorCep`, `montarMensagem`, `montarLinkWhatsapp`, `finalizarAtendimento`.
- **Tratamento de erros** com `try/catch` na chamada da API.
- **Reflexão sobre o que aplicar e o que melhorar** em comentário no final do `script.js`.

## Melhorias futuras

- Dividir o JavaScript em módulos (carrinho, API e menu).
- Salvar a lista de atendimento no `localStorage`.
- Adicionar um formulário de medidas com visualização 3D estimada do corpo.
- Incluir cálculo de frete a partir do CEP.