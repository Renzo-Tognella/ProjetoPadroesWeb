export class NotificationFlood {
  constructor(options = {}) {
    // Elementos e parâmetros de controle
    this.container = document.getElementById(options.containerId || 'notif-stream');
    this.enabled = !!this.container;
    this.lastY = window.scrollY;
    this.cooldown = false;
    this.minIntervalMs = options.minIntervalMs || 400;
    this.batchSize = options.batchSize || 2;
    this.maxOnScreen = options.maxOnScreen || 12;
    this.triggerEvery = options.triggerEveryScrolls || 5;
    this.scrollCount = 0;
    // Mensagens de exemplo
    this.samples = options.samples || [
      { logo: 'LI', text: 'Novo comentário no seu post: “ótimos pontos!”', time: 'agora' },
      { logo: 'RD', text: 'Seu amigo compartilhou um artigo que você pode gostar.', time: '1 min' },
      { logo: 'TW', text: 'Você tem 3 novas notificações.', time: '2 min' },
      { logo: 'YT', text: 'Novo vídeo que combina com seu histórico.', time: '5 min' },
      { logo: 'IG', text: 'Fulano adicionou um story agora.', time: '7 min' }
    ];
    this.sampleIndex = 0;
  }

  init() {
    if (!this.enabled) return;
    // Inicia listener de scroll
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
  }

  onScroll() {
    const y = window.scrollY;
    const goingDown = y > this.lastY; // Detecta rolagem descendente
    this.lastY = y;

    if (!goingDown) return;

    this.scrollCount++; // Conta eventos de rolagem

    if (this.scrollCount % this.triggerEvery !== 0) return; // Dispara a cada X rolagens

    if (this.cooldown) return; // Proteção de intervalo mínimo

    this.cooldown = true;
    this.spawnBatch(this.batchSize); // Gera lote de notificações

    setTimeout(() => { this.cooldown = false; }, this.minIntervalMs);
  }

  spawnBatch(n) {
    // Cria N notificações
    for (let i = 0; i < n; i++) this.spawnOne();
  }

  spawnOne() {
    if (!this.container) return;
    // Limita quantidade simultânea na tela
    if (this.container.children.length > this.maxOnScreen) {
      this.container.removeChild(this.container.lastElementChild);
    }
    // Monta o cartão de notificação
    const data = this.samples[this.sampleIndex % this.samples.length];
    const card = document.createElement('div');
    this.sampleIndex++;
    card.className = 'notif-card';
    card.innerHTML = `
      <div class="notif-logo">${data.logo}</div>
      <div class="notif-text">${data.text}</div>
      <div class="notif-time">${data.time}</div>
    `;
    // Remove ao fim da animação de subida
    card.addEventListener('animationend', () => {
      if (card.parentElement === this.container) {
        this.container.removeChild(card);
      }
    });
    this.container.appendChild(card);
  }
}