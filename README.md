# Raiar CEP — Piscina Térmica

Site do Projeto Integrador: aquecimento solar automatizado e acessível para a piscina térmica do CEP.

## Estrutura

- `index.html` — todas as seções do site (início, o desafio, óptica, automação, simulador, acessibilidade, impacto, equipe/contato).
- `style.css` — tema visual "marigold & petróleo" (sol + água), responsividade e modo de alto contraste.
- `script.js` — menu mobile, disco de Newton animado (com botão para girar/parar), simulador de eficiência do coletor, alto contraste, ajuste de fonte e formulário de contato.

## Sobre as imagens

Todos os diagramas (coletor solar, disco de Newton, fluxograma de sensores e atuadores) foram desenhados
diretamente em **SVG dentro do `index.html`**. Não é necessário anexar nenhuma foto ou imagem externa: os
desenhos ficam nítidos em qualquer tela, carregam rápido e cada um tem `<title>`/`<desc>` para leitores de
tela.

Se quiser trocar algum SVG por uma foto real, crie uma pasta `assets/` e troque o bloco `<svg>...</svg>`
correspondente por uma tag `<img>` apontando para o arquivo, com um `alt` descritivo.

## Como usar

Abra `index.html` em qualquer navegador — não depende de servidor ou de instalação de nada.

## Como publicar (GitHub Pages)

1. Suba os quatro arquivos (`index.html`, `style.css`, `script.js`, `README.md`) para a raiz do repositório.
2. Em *Settings → Pages*, selecione a branch `main` e a pasta raiz (`/`).
3. O site ficará disponível em `https://<usuario>.github.io/<repositorio>/`.
