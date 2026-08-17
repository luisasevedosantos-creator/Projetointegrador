// =========================================================
// Sol & Água — script.js
// =========================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Menu mobile ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav-principal');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Alto contraste ---------- */
  const btnContraste = document.getElementById('btn-contraste');
  if (btnContraste) {
    const salvo = localStorage.getItem('sol-agua-contraste') === '1';
    if (salvo) {
      document.body.classList.add('alto-contraste');
      btnContraste.setAttribute('aria-pressed', 'true');
    }
    btnContraste.addEventListener('click', () => {
      const ativo = document.body.classList.toggle('alto-contraste');
      btnContraste.setAttribute('aria-pressed', String(ativo));
      localStorage.setItem('sol-agua-contraste', ativo ? '1' : '0');
    });
  }

  /* ---------- Tamanho da fonte ---------- */
  const root = document.documentElement;
  const MIN_SCALE = 0.85;
  const MAX_SCALE = 1.35;
  const STEP = 0.1;

  function aplicarEscala(scale) {
    const val = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
    root.style.setProperty('--font-scale', val.toFixed(2));
    localStorage.setItem('sol-agua-escala', val.toFixed(2));
    return val;
  }

  let escalaAtual = parseFloat(localStorage.getItem('sol-agua-escala')) || 1;
  aplicarEscala(escalaAtual);

  const btnMais = document.getElementById('btn-fonte-mais');
  const btnMenos = document.getElementById('btn-fonte-menos');
  if (btnMais) btnMais.addEventListener('click', () => { escalaAtual = aplicarEscala(escalaAtual + STEP); });
  if (btnMenos) btnMenos.addEventListener('click', () => { escalaAtual = aplicarEscala(escalaAtual - STEP); });

  /* ---------- Disco de Newton ---------- */
  const disco = document.getElementById('newton-disc');
  const btnGirar = document.getElementById('btn-girar-disco');
  if (disco && btnGirar) {
    btnGirar.addEventListener('click', () => {
      const girando = disco.classList.toggle('spinning');
      btnGirar.textContent = girando ? 'Parar o disco' : 'Girar o disco';
    });
  }

  /* ---------- Simulador de eficiência ---------- */
  const rangeInclinacao = document.getElementById('range-inclinacao');
  const rangeSol = document.getElementById('range-sol');
  const selectCor = document.getElementById('select-cor');
  const btnSimular = document.getElementById('btn-simular');

  const valorInclinacao = document.getElementById('valor-inclinacao');
  const valorSol = document.getElementById('valor-sol');
  const valorEficiencia = document.getElementById('valor-eficiencia');
  const valorTemp = document.getElementById('valor-temp');
  const statusSimulacao = document.getElementById('status-simulacao');

  const simColetor = document.getElementById('sim-coletor');
  const simRaios = document.getElementById('sim-raios');
  const gaugeArc = document.getElementById('gauge-arc');
  const gaugeNeedle = document.getElementById('gauge-needle');

  const ARC_LENGTH = 283; // comprimento aproximado do arco (raio 90 * PI)

  // Inclinação ideal de referência: quanto mais perto de ~35°, melhor
  // capta a luz numa piscina em clima temperado/tropical.
  function calcularEficiencia() {
    const inclinacao = Number(rangeInclinacao.value);
    const sol = Number(rangeSol.value) / 100;
    const absorcao = Number(selectCor.value);

    const inclinacaoIdeal = 35;
    const fatorInclinacao = 1 - Math.min(1, Math.abs(inclinacao - inclinacaoIdeal) / 90);

    const eficiencia = Math.round(fatorInclinacao * sol * absorcao * 100);
    return Math.max(0, Math.min(100, eficiencia));
  }

  function atualizarVisual() {
    const inclinacao = Number(rangeInclinacao.value);
    const sol = Number(rangeSol.value);

    valorInclinacao.textContent = inclinacao;
    valorSol.textContent = sol;

    // inclina o coletor visualmente (0° = deitado, 90° = quase de pé)
    if (simColetor) {
      simColetor.setAttribute('transform', `translate(90,85) rotate(${-inclinacao * 0.5})`);
    }
    // intensidade dos raios de sol reflete a % de sol disponível
    if (simRaios) {
      simRaios.style.opacity = String(0.25 + (sol / 100) * 0.75);
    }

    const eficiencia = calcularEficiencia();
    valorEficiencia.textContent = eficiencia;

    const offset = ARC_LENGTH - (ARC_LENGTH * eficiencia) / 100;
    if (gaugeArc) gaugeArc.style.strokeDashoffset = String(offset);

    // agulha vai de -90° (0%) a +90° (100%)
    const anguloAgulha = -90 + (eficiencia / 100) * 180;
    if (gaugeNeedle) gaugeNeedle.style.transform = `rotate(${anguloAgulha}deg)`;
  }

  [rangeInclinacao, rangeSol, selectCor].forEach(el => {
    if (el) el.addEventListener('input', atualizarVisual);
  });

  if (btnSimular) {
    btnSimular.addEventListener('click', () => {
      const eficiencia = calcularEficiencia();
      // ganho de temperatura estimado: até ~6°C numa hora com 100% de eficiência
      const ganho = (eficiencia / 100 * 6).toFixed(1);
      valorTemp.textContent = ganho;
      statusSimulacao.textContent =
        `Simulando 1h de sol: com ${eficiencia}% de eficiência, a água ganharia aproximadamente ${ganho}°C.`;
    });
  }

  atualizarVisual();

  /* ---------- Formulário de contato ---------- */
  const form = document.getElementById('formulario-contato');
  const mensagemEnvio = document.getElementById('mensagem-envio');

  if (form) {
    form.addEventListener('submit', (evento) => {
      evento.preventDefault();

      const nome = document.getElementById('campo-nome').value.trim();
      const email = document.getElementById('campo-email').value.trim();
      const mensagem = document.getElementById('campo-mensagem').value.trim();
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!nome || !emailValido || !mensagem) {
        mensagemEnvio.textContent = 'Preencha nome, um e-mail válido e uma mensagem antes de enviar.';
        mensagemEnvio.style.color = '#D64545';
        return;
      }

      // Este é um protótipo estático (sem back-end): apenas confirma o envio.
      mensagemEnvio.textContent = `Obrigado, ${nome}! Sua mensagem foi registrada (protótipo sem back-end — ligue um serviço de e-mail/formulário para receber de verdade).`;
      mensagemEnvio.style.color = '';
      form.reset();
    });
  }
});
