import { ScreenSimulator } from './modules/screen_simulator.js';
import { TimeBlindnessTimer } from './modules/time_blindness_timer.js';
import { NotificationFlood } from './modules/notification_flood.js';
import { ChecklistProgress } from './modules/checklist_progress.js';
import { ErraticFocus } from './components/cursor.js';
import { loadMenu } from './components/menu.js';

async function initializeMenu() {
  await loadMenu();
}

// Função de inicialização do simulador - Configura o simulador de iPad se presente
function initializeSimulator() {
  // Verifica se existe um simulador na página atual
  const simulatorElement = document.querySelector('.screen-simulator');

  if (simulatorElement) {
    // Cria uma nova instância do simulador
    const simulator = new ScreenSimulator();

    // Inicializa o simulador com todos os eventos e funcionalidades
    simulator.init();
  }
}

// Função para ajustar o layout dinamicamente com base nos elementos fixos
function adjustLayoutPadding() {
  const header = document.querySelector('header'); // Ou o container do menu
  const videoCard = document.querySelector('.video-card');
  const homeGrid = document.querySelector('.home-grid');

  if (!header || !videoCard || !homeGrid) return;

  // Se estiver em modo mobile/tablet vertical (onde o videoCard vira fixed)
  if (window.innerWidth <= 1024) {
    const videoHeight = videoCard.offsetHeight;

    videoCard.style.top = '0px';

    header.style.marginTop = `${videoHeight}px`;
    header.style.position = '';
    header.style.top = '';
    header.style.width = '';
    homeGrid.style.paddingTop = '';
  } else {
    // Reset para desktop
    videoCard.style.top = '';
    header.style.marginTop = '';
    homeGrid.style.paddingTop = '';
  }
}

// Função principal de inicialização - Coordena a inicialização de todos os componentes
async function initializeApp() {
  try {
    // Inicializa o menu de navegação global
    await initializeMenu();

    // Inicializa o cursor personalizado
    initializeCustomCursor();

    // Ajusta layout inicial e configura listener de resize
    setTimeout(() => {
      adjustLayoutPadding();
      window.addEventListener('resize', adjustLayoutPadding);
    }, 100);

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

  // Inicializa interações da página Sobre se houver cards
  if (document.querySelector('.renzo-flip-card')) {
    const { AboutInteractions } = await import('./modules/about_interactions.js');
    const aboutInteractions = new AboutInteractions();
    aboutInteractions.init();
  }
}

function initializeCustomCursor() {
  new ErraticFocus();
}


// Event listener que aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', initializeApp);