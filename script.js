// ===================================================================
// Raiar CEP — interatividade do site
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- menu mobile ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav-principal');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const aberto = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!aberto));
      nav.classList.toggle('open', !aberto);
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
      });
    });
  }

  /* ---------- alto contraste ---------- */
  const btnContraste = document.getElementById('btn-contraste');
  if (btnContraste) {
    btnContraste.addEventListener('click', () => {
      const ativo = document.body.classList.toggle('alto-contraste');
      btnContraste.setAttribute('aria-pressed', String(ativo));
    });
  }

  /* ---------- ajuste de fonte ---------- */
  const root = document.documentElement;
  let escalaFonte = 1;
  const MIN_FONTE = 0.85;
  const MAX_FONTE = 1.3;

  function aplicarEscalaFonte() {
    root.style.setProperty('--font-scale', escalaFonte.toFixed(2));
  }

  const btnFonteMais = document.getElementById('btn-fonte-mais');
  const btnFonteMenos = document.getElementById('btn-fonte-menos');

  if (btnFonteMais) {
    btnFonteMais.addEventListener('click', () => {
      escalaFonte = Math.min(MAX_FONTE, escalaFonte + 0.1);
      aplicarEscalaFonte();
    });
  }
  if (btnFonteMenos) {
    btnFonteMenos.addEventListener('click', () => {
      escalaFonte = Math.max(MIN_FONTE, escalaFonte - 0.1);
      aplicarEscalaFonte();
    });
  }

  /* ---------- disco de Newton ---------- */
  const btnGirarDisco = document.getElementById('btn-girar-disco');
  const disco = document.getElementById('newton-disc');

  if (btnGirarDisco && disco) {
    btnGirarDisco.addEventListener('click', () => {
      const girando = disco.classList.toggle('spinning');
      btnGirarDisco.textContent = girando ? 'Parar o disco' : 'Girar o disco';
    });
  }

  /* ---------- simulador de eficiência ---------- */
  const rangeInclinacao = document.getElementById('range-inclinacao');
  const valorInclinacao = document.getElementById('valor-inclinacao');
  const rangeSol = document.getElementById('range-sol');
  const valorSol = document.getElementById('valor-sol');
  const selectCor = document.getElementById('select-cor');
  const btnSimular = document.getElementById('btn-simular');
  const statusSimulacao = document.getElementById('status-simulacao');

  const simColetor = document.getElementById('sim-coletor');
  const gaugeArc = document.getElementById('gauge-arc');
  const gaugeNeedle = document.getElementById('gauge-needle');
  const valorEficiencia = document.getElementById('valor-eficiencia');
  const valorTemp = document.getElementById('valor-temp');

  const ARCO_TOTAL = 283; // comprimento aproximado do arco do gauge

  function inclinacaoIdeal(intensidadeSol) {
    // quanto mais baixa a intensidade (sol mais baixo no céu), maior a inclinação ideal
    return 20 + (100 - intensidadeSol) * 0.5;
  }

  function atualizarVisual() {
    const inclinacao = Number(rangeInclinacao.value);
    const sol = Number(rangeSol.value);

    valorInclinacao.textContent = inclinacao;
    valorSol.textContent = sol;

    if (simColetor) {
      simColetor.setAttribute('transform', `translate(90,85) rotate(${-inclinacao * 0.4})`);
    }
  }

  function calcularEficiencia() {
    const inclinacao = Number(rangeInclinacao.value);
    const sol = Number(rangeSol.value);
    const absorcao = Number(selectCor.value);

    const ideal = inclinacaoIdeal(sol);
    const desvio = Math.abs(inclinacao - ideal);
    const fatorAngulo = Math.max(0, 1 - desvio / 90);

    const eficiencia = Math.round(fatorAngulo * (sol / 100) * absorcao * 100);
    return Math.min(100, Math.max(0, eficiencia));
  }

  function simular() {
    const eficiencia = calcularEficiencia();
    const ganhoTemp = (eficiencia * 0.06).toFixed(1);

    valorEficiencia.textContent = eficiencia;
    valorTemp.textContent = ganhoTemp;

    const offset = ARCO_TOTAL - (ARCO_TOTAL * eficiencia) / 100;
    gaugeArc.style.strokeDashoffset = String(offset);

    const angulo = -90 + (eficiencia / 100) * 180;
    gaugeNeedle.style.transform = `rotate(${angulo}deg)`;

    let mensagem;
    if (eficiencia >= 75) {
      mensagem = 'Ótima configuração! O coletor está captando quase todo o sol disponível.';
    } else if (eficiencia >= 40) {
      mensagem = 'Configuração razoável — ajuste a inclinação para se aproximar do ângulo ideal do sol.';
    } else {
      mensagem = 'Eficiência baixa. Tente uma inclinação mais próxima da posição do sol e uma superfície mais escura.';
    }
    statusSimulacao.textContent = mensagem;
  }

  [rangeInclinacao, rangeSol].forEach(input => {
    if (input) input.addEventListener('input', atualizarVisual);
  });

  if (btnSimular) {
    btnSimular.addEventListener('click', simular);
  }

  if (rangeInclinacao && rangeSol) {
    atualizarVisual();
  }

  /* ---------- formulário de contato ---------- */
  const formulario = document.getElementById('formulario-contato');
  const mensagemEnvio = document.getElementById('mensagem-envio');

  if (formulario) {
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();

      const nome = document.getElementById('campo-nome').value.trim();
      const email = document.getElementById('campo-email').value.trim();
      const mensagem = document.getElementById('campo-mensagem').value.trim();

      if (!nome || !email || !mensagem) {
        mensagemEnvio.textContent = 'Preencha todos os campos antes de enviar.';
        return;
      }

      mensagemEnvio.textContent = `Obrigado, ${nome}! Sua mensagem foi registrada (envio simulado neste site estático).`;
      formulario.reset();
    });
  }

});
