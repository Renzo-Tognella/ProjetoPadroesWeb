// Cronômetro acelerado para simular cegueira temporal
export class TimeBlindnessTimer {
  constructor(options = {}) {
    // Referências de elementos e estado interno
    this.displayEl = document.getElementById(options.displayId || 'timer-display');
    this.openBtn = document.getElementById(options.openBtnId || 'open-guess-modal');
    this.modalEl = document.getElementById(options.modalId || 'guess-modal');
    this.inputEl = document.getElementById(options.inputId || 'guess-input');
    this.submitBtn = document.getElementById(options.submitBtnId || 'submit-guess');
    this.closeBtn = document.getElementById(options.closeBtnId || 'close-guess');
    this.resultEl = document.getElementById(options.resultId || 'guess-result');
    this.factor = options.factor || 5;
    this.start = 0;
    this.timerId = null;
    this.pausedAt = null;
  }

  // Inicia contagem e atualiza a tela a cada 50ms
  init() {
    if (!this.displayEl) return;
    this.start = performance.now();
    this.timerId = setInterval(() => this.render(), 50);
    this.bindEvents();
  }

  // Liga eventos de UI (abrir/fechar modal e enviar palpite)
  bindEvents() {
    if (this.openBtn && this.modalEl) {
      this.openBtn.addEventListener('click', () => {
        this.pause();
        this.showModal();
      });
    }

    if (this.closeBtn && this.modalEl) {
      this.closeBtn.addEventListener('click', () => {
        this.hideModal();
      });
    }

    if (this.submitBtn) {
      this.submitBtn.addEventListener('click', () => {
        const guessSeconds = this.parseGuess(this.inputEl?.value || '');
        this.pause();
        const actualSeconds = this.getActualSeconds();
        const withinTenPercent = Math.abs(guessSeconds - actualSeconds) / actualSeconds <= 0.10;
        const estimatedReading = this.estimateReadingSeconds();
        const message = withinTenPercent
          ? 'Boa noção do tempo percorrido — sem forte cegueira temporal.'
          : 'Seu palpite ficou fora de ±10%. Indício de cegueira temporal.';

        const actualFormatted = this.formatSeconds(actualSeconds);
        const guessFormatted = this.formatSeconds(guessSeconds);
        const averageFormatted = this.formatSeconds(estimatedReading);

        this.renderResult({
          guessFormatted,
          actualFormatted,
          withinTenPercent,
          averageFormatted,
        });
        this.hideModal();
      });
    }
  }

  // Exibe o modal de palpite
  showModal() {
    if (!this.modalEl) return;
    this.modalEl.removeAttribute('hidden');
    this.inputEl?.focus();
  }

  // Oculta o modal de palpite
  hideModal() {
    if (!this.modalEl) return;
    this.modalEl.setAttribute('hidden', 'hidden');
  }

  // Pausa o cronômetro e congela a exibição
  pause() {
    if (this.pausedAt) return;
    this.pausedAt = performance.now();
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.render();
  }

  // Retorna tempo real desde o início até a pausa (ou agora)
  getActualSeconds() {
    const now = this.pausedAt ?? performance.now();
    return (now - this.start) / 1000;
  }

  // Retorna tempo exibido acelerado segundo o fator configurado
  getDisplayedMs() {
    const now = this.pausedAt ?? performance.now();
    const actualMs = (now - this.start);
    return actualMs * this.factor;
  }

  // Atualiza o texto do display com o tempo acelerado
  render() {
    const ms = this.getDisplayedMs();
    const text = this.formatMs(ms);
    if (this.displayEl) {
      this.displayEl.textContent = text;
    }
  }

  // Formata milissegundos para mm:ss.mmm
  formatMs(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const millis = Math.floor(ms % 1000);
    return `${this.pad(minutes)}:${this.pad(seconds)}.${millis.toString().padStart(3, '0')}`;
  }

  // Formata segundos (float) para mm:ss.mmm
  formatSeconds(secondsFloat) {
    const totalMs = Math.round(secondsFloat * 1000);
    return this.formatMs(totalMs);
  }

  // Adiciona zero à esquerda para manter 2 dígitos
  pad(n) {
    return n.toString().padStart(2, '0');
  }

  // Converte o palpite do usuário para segundos
  parseGuess(value) {
    const v = (value || '').trim();
    if (!v) return 0;
    // Aceita mm:ss ou valores decimais em segundos/minutos
    if (/^\d{1,2}:\d{1,2}$/.test(v)) {
      const [m, s] = v.split(':').map(Number);
      return m * 60 + s;
    }
    if (/^\d+(\.\d+)?$/.test(v)) {
      // Segundos ou minutos? Assume segundos se <= 180; senão trata como minutos
      const num = parseFloat(v);
      return num <= 180 ? num : num * 60;
    }
    // Caso não reconheça, retorna 0
    return 0;
  }

  // Estima tempo médio de leitura com base no conteúdo da página
  estimateReadingSeconds() {
    const container = document.querySelector('main');
    if (!container) return 180; // retorno padrão: 3 minutos
    const text = container.innerText || '';
    const words = (text.match(/\S+/g) || []).length;
    const wpm = 180; // velocidade média de leitura (palavras por minuto)
    const minutes = words / wpm;
    return minutes * 60;
  }

  // Renderiza o resultado com palpite, tempo real, status e tempo médio
  renderResult({ guessFormatted, actualFormatted, withinTenPercent, averageFormatted }) {
    if (!this.resultEl) return;

    const status = withinTenPercent ? 'Acertou dentro de ±10%' : 'Fora de ±10%';
    
    this.resultEl.innerHTML = `
      <p><strong>Seu palpite:</strong> ${guessFormatted}</p>
      <p><strong>Tempo real:</strong> ${actualFormatted}</p>
      <p><strong>Resultado:</strong> ${status}</p>
      <p><strong>Tempo médio estimado para ler a seção:</strong> ${averageFormatted}</p>
    `;
  }
}