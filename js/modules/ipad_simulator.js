export class IpadSimulator {
  constructor() {
    // Índice do item atualmente visível na tela
    this.currentIndex = 0;
    
    // Array com todos os itens de hiperfoco disponíveis
    this.items = [];
    
    // Referências aos elementos DOM para manipulação
    this.navButtons = [];
    this.leftArrow = null;
    this.rightArrow = null;
  }

  // Método de inicialização - Configura todos os elementos e eventos do simulador
  init() {
    // Busca todos os itens de hiperfoco no DOM
    this.items = document.querySelectorAll('.hyperfocus-item');
    // Busca todos os botões de navegação (pontos na parte inferior)
    this.navButtons = document.querySelectorAll('.nav-button');
    // Busca as setas de navegação lateral
    this.leftArrow = document.querySelector('.nav-arrow-left');
    this.rightArrow = document.querySelector('.nav-arrow-right');

    // Configura os eventos de clique nos botões de navegação
    this.setupNavigation();
    // Define o estado inicial do simulador
    this.updateDisplay();
  }

  // Configuração dos eventos - Adiciona listeners para todos os elementos interativos
  setupNavigation() {
    // Adiciona evento de clique para cada botão de navegação (pontos)
    this.navButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        this.goToItem(index);
      });
    });

    // Evento para a seta esquerda - Navega para o item anterior
    if (this.leftArrow) {
      this.leftArrow.addEventListener('click', () => {
        this.previousItem();
      });
    }

    // Evento para a seta direita - Navega para o próximo item
    if (this.rightArrow) {
      this.rightArrow.addEventListener('click', () => {
        this.nextItem();
      });
    }

    // Navegação por teclado - Permite usar setas do teclado para navegar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.previousItem();
      } else if (e.key === 'ArrowRight') {
        this.nextItem();
      }
    });
  }

  // Navegação para item específico - Vai diretamente para o índice informado
  goToItem(index) {
    // Verifica se o índice é válido
    if (index >= 0 && index < this.items.length) {
      this.currentIndex = index;
      this.updateDisplay();
    }
  }

  // Navegação para item anterior - Move para o item à esquerda
  previousItem() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateDisplay();
    }
  }

  // Navegação para próximo item - Move para o item à direita
  nextItem() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
      this.updateDisplay();
    }
  }

  // Atualização da interface - Sincroniza o visual com o estado atual
  updateDisplay() {
    // Atualiza a visibilidade dos itens - Mostra apenas o item atual
    this.items.forEach((item, index) => {
      if (index === this.currentIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Atualiza o estado dos botões de navegação - Destaca o botão atual
    this.navButtons.forEach((button, index) => {
      if (index === this.currentIndex) {
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
      } else {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
      }
    });

    // Atualiza o estado das setas - Desabilita quando não há mais itens
    this.updateArrowStates();
  }

  // Controle das setas de navegação - Habilita/desabilita baseado na posição atual
  updateArrowStates() {
    // Seta esquerda - Desabilitada no primeiro item
    if (this.leftArrow) {
      this.leftArrow.disabled = this.currentIndex === 0;
    }

    // Seta direita - Desabilitada no último item
    if (this.rightArrow) {
      this.rightArrow.disabled = this.currentIndex === this.items.length - 1;
    }
  }
}