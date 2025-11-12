import { IpadSimulator } from './modules/ipad_simulator.js';
import { TimeBlindnessTimer } from './modules/time_blindness_timer.js';
import { NotificationFlood } from './modules/notification_flood.js';
import { ChecklistProgress } from './modules/checklist_progress.js';

async function initializeMenu() {
  try {
    // Busca o container onde o menu será inserido
    const menuContainer = document.getElementById('menu-container');
    
    // Verifica se o container existe na página
    if (!menuContainer) {
      console.warn('Menu container não encontrado');
      return;
    }

    // Faz a requisição para buscar o HTML do menu
    const response = await fetch('/components/menu.html');
    
    // Verifica se a requisição foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro ao carregar menu: ${response.status}`);
    }

    // Obtém o conteúdo HTML do menu
    const menuHTML = await response.text();
    
    // Insere o HTML do menu no container
    menuContainer.innerHTML = menuHTML;

    // Configura o comportamento do menu após inserção
    setupMenuBehavior();
    
  } catch (error) {
    // Log de erro caso o carregamento falhe
    console.error('Erro ao inicializar menu:', error);
  }
}

// Configuração do comportamento do menu - Adiciona interatividade aos elementos
function setupMenuBehavior() {
  // Busca o botão de toggle do menu mobile
  const menuToggle = document.querySelector('.menu-toggle');
  
  // Busca a lista de navegação
  const navList = document.querySelector('.nav-list');

  // Adiciona evento de clique no botão de toggle se existir
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      // Alterna a classe 'active' para mostrar/esconder o menu
      navList.classList.toggle('active');
      
      // Atualiza o atributo aria-expanded para acessibilidade
      const isExpanded = navList.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  // Fecha o menu ao clicar em um link (útil em dispositivos móveis)
  const navLinks = document.querySelectorAll('.nav-list a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navList) {
        navList.classList.remove('active');
      }
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// Função de inicialização do simulador - Configura o simulador de iPad se presente
function initializeSimulator() {
  // Verifica se existe um simulador na página atual
  const simulatorElement = document.querySelector('.ipad-simulator');
  
  if (simulatorElement) {
    // Cria uma nova instância do simulador
    const simulator = new IpadSimulator();
    
    // Inicializa o simulador com todos os eventos e funcionalidades
    simulator.init();
  }
}

// Função principal de inicialização - Coordena a inicialização de todos os componentes
async function initializeApp() {
  try {
    // Inicializa o menu de navegação global
    await initializeMenu();
    
    // Inicializa o simulador de iPad (se presente na página)
    initializeSimulator();

    // Inicializa o cronômetro de cegueira temporal se a seção existir
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
      const timer = new TimeBlindnessTimer({
        displayId: 'timer-display',
        openBtnId: 'open-guess-modal',
        modalId: 'guess-modal',
        inputId: 'guess-input',
        submitBtnId: 'submit-guess',
        closeBtnId: 'close-guess',
        resultId: 'guess-result',
        factor: 10,
      });
      timer.init();
    }

    // Inicializa o flood de notificações se o container existir
    const notifContainer = document.getElementById('notif-stream');
    if (notifContainer) {
      const flood = new NotificationFlood({
        containerId: 'notif-stream',
        minIntervalMs: 500,
        batchSize: 3,
        maxOnScreen: 9,
        triggerEveryScrolls: 70,
      });
      flood.init();
    }

    // Inicializa o checklist de progresso se existir
    const checklistForm = document.getElementById('daily-checklist');
    if (checklistForm) {
      const checklist = new ChecklistProgress();
      checklist.init();
    }
  } catch (error) {
    // Log de erro caso a inicialização falhe
    console.error('Erro na inicialização da aplicação:', error);
  }
}

// Event listener que aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', initializeApp);