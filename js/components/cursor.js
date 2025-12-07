export class ErraticFocus {
  constructor() {
    this.cursor = document.getElementById('focus-cursor');
    if (!this.cursor) return;

    // Posição real do mouse
    this.mouseX = 0;
    this.mouseY = 0;

    // Posição do nosso cursor falso
    this.cursorX = 0;
    this.cursorY = 0;
    // Velocidade de "seguimento" (0.1 é lento/preguiçoso, 0.9 é rápido)
    this.speed = 0.1;

    this.init();
  }

  init() {
    if (!this.cursor) return;

    // Atualiza posição do alvo quando mouse move
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Inicia loop de animação
    this.animate();
  }

  animate() {
    if (!this.cursor) return;

    // Ruído aleatório: adiciona um pequeno desvio imprevisível
    const noiseX = (Math.random() - 0.5) * 55; // Desvio de até 55px
    const noiseY = (Math.random() - 0.5) * 55;

    // Posição Atual += (Posição Alvo - Posição Atual) * Velocidade
    this.cursorX += (this.mouseX - this.cursorX + noiseX) * this.speed;
    this.cursorY += (this.mouseY - this.cursorY + noiseY) * this.speed;

    // Aplica ao elemento
    this.cursor.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px)`;

    requestAnimationFrame(() => this.animate());
  }
}