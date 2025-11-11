// Lista de imagens disponíveis
let availableImages = [];

// Fallback de gradientes caso não haja imagens
const IMAGE_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
];

const AUTHORS = [
  'Ana Silva', 'Carlos Souza', 'Maria Santos', 'Pedro Oliveira',
  'Julia Costa', 'Lucas Ferreira', 'Beatriz Lima', 'Rafael Alves',
  'Amanda Rocha', 'Felipe Martins', 'Camila Dias', 'Bruno Carvalho',
  'Gabriela Torres', 'Thiago Mendes', 'Larissa Campos', 'Diego Pires'
];

const POST_TEMPLATES = [
  'Acabei de descobrir algo incrível! 🤯',
  'Não acredito que isso aconteceu comigo hoje...',
  'Vocês precisam ver isso! 👀',
  'Melhor dia da minha vida! ❤️',
  'Alguém mais está vendo isso? 😱',
  'Isso mudou completamente minha perspectiva...',
  'URGENTE: Vocês não vão acreditar! 🚨',
  'Finalmente consegui! Depois de tanto tempo...',
  'Por que ninguém me contou isso antes?',
  'Esse é o segredo que todos escondem de você!',
  'Você está fazendo errado! Veja o jeito certo...',
  'TOP 5 coisas que você PRECISA saber hoje!',
  'Isso vai mudar tudo que você sabe sobre...',
  'Médicos odeiam esse truque simples!',
  'Estou chocado com o que acabei de descobrir! 😮',
  'BREAKING: Isso está acontecendo AGORA! 🔴',
  'Você não vai acreditar no que aconteceu! 😲',
  'Isso é SURREAL! Preciso compartilhar...',
  'Melhor coisa que vi hoje! 🌟',
  'Não consigo parar de pensar nisso... 💭'
];

const NOTIFICATION_MESSAGES = [
  '❤️ Ana Silva curtiu seu post',
  '💬 3 novos comentários',
  '👥 Carlos Souza começou a te seguir',
  '🔔 Maria Santos mencionou você',
  '⭐ Seu post está bombando!',
  '📸 Nova história disponível',
  '🎉 Você ganhou um novo badge!',
  '💌 Nova mensagem de Julia Costa',
  '🔥 Post em alta nas tendências!'
];

const TRENDING_TOPICS = [
  { topic: '#AtrasadosENEM', posts: '1.2M posts' },
  { topic: '#Varmengo', posts: '856K posts' },
  { topic: '#Python', posts: '643K posts' },
  { topic: '#Joelma', posts: '521K posts' },
  { topic: '#Brasil', posts: '398K posts' },
  { topic: '#UTFPR', posts: '287K posts' }
];

let isSimulationActive = false;
let timeElapsed = 0;
let interactionCount = 0;
let notificationCount = 0;
let timerInterval = null;
let notificationInterval = null;
let postIdCounter = 0;

const startBtn = document.getElementById('start-simulation');
const resetBtn = document.getElementById('reset-simulation');
const timeCounter = document.getElementById('time-counter');
const interactionCounter = document.getElementById('interaction-counter');
const socialFeed = document.getElementById('social-feed');
const loadingIndicator = document.getElementById('loading-indicator');
const storiesContainer = document.getElementById('stories-container');
const suggestionsSidebar = document.getElementById('suggestions-sidebar');
const notificationContainer = document.getElementById('notification-container');
const promoBanner = document.getElementById('promo-banner');
const timeWarningModal = document.getElementById('time-warning-modal');
const notificationBadge = document.getElementById('notification-badge');

async function loadAvailableImages() {
  const possibleImages = [
    'img/feed/brain.gif', 'img/feed/calabreso.gif',
    'img/feed/chad.gif', 'img/feed/gato_variado.gif',
    'img/feed/gato.gif', 'img/feed/onibus.gif',
    'img/feed/sr_incrivel.gif'
  ];

  for (const imagePath of possibleImages) {
    try {
      const response = await fetch(imagePath, { method: 'HEAD' });
      if (response.ok) {
        availableImages.push(imagePath);
      }
    } catch (error) {
      // Imagem não existe, continua
    }
  }

  console.log(`📸 ${availableImages.length} imagens carregadas da pasta img/feed/`);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomTime() {
  const rand = Math.random();
  if (rand < 0.5) {
    const mins = Math.floor(Math.random() * 59) + 1;
    return `${mins} min atrás`;
  } else {
    const hours = Math.floor(Math.random() * 23) + 1;
    return `${hours}h atrás`;
  }
}

function getRandomLikes() {
  return Math.floor(Math.random() * 999) + 1;
}

function getRandomComments() {
  return Math.floor(Math.random() * 150) + 1;
}

// Retorna uma imagem real ou gradiente
function getPostImage() {
  if (availableImages.length > 0 && Math.random() > 0.2) {
    return { type: 'image', value: getRandomItem(availableImages) };
  } else {
    return { type: 'gradient', value: getRandomItem(IMAGE_GRADIENTS) };
  }
}

function createPost() {
  const author = getRandomItem(AUTHORS);
  const content = getRandomItem(POST_TEMPLATES);
  const time = getRandomTime();
  const likes = getRandomLikes();
  const comments = getRandomComments();
  const hasImage = Math.random() > 0.3;
  const initials = author.split(' ').map(n => n[0]).join('');

  postIdCounter++;
  const postId = `post-${postIdCounter}`;

  const post = document.createElement('div');
  post.className = 'feed-post';
  post.dataset.postId = postId;

  let imageHTML = '';
  if (hasImage) {
    const media = getPostImage();
    if (media.type === 'image') {
      imageHTML = `<img src="${media.value}" alt="Post image" class="post-image-real" />`;
    } else {
      imageHTML = `<div class="post-image" style="background: ${media.value}">📸 Imagem</div>`;
    }
  }

  post.innerHTML = `
    <div class="post-header">
      <div class="post-avatar">${initials}</div>
      <div class="post-author">
        <p class="author-name">${author}</p>
        <p class="post-time">${time}</p>
      </div>
    </div>

    <div class="post-content">
      ${content}
    </div>

    ${imageHTML}

    <div class="post-actions">
      <div class="post-action like-btn" data-post-id="${postId}">
        ❤️ <span class="like-count">${likes}</span>
      </div>
      <div class="post-action comment-btn" data-post-id="${postId}">
        💬 <span class="comment-count">${comments}</span>
      </div>
      <div class="post-action share-btn" data-post-id="${postId}">
        🔄 Compartilhar
      </div>
    </div>
  `;

  return post;
}

function addPostsToFeed(count = 5) {
  for (let i = 0; i < count; i++) {
    const post = createPost();
    socialFeed.appendChild(post);
    addPostInteractionListeners(post);
  }
}

function addPostInteractionListeners(post) {
  const likeBtn = post.querySelector('.like-btn');
  const commentBtn = post.querySelector('.comment-btn');
  const shareBtn = post.querySelector('.share-btn');

  likeBtn.addEventListener('click', () => {
    likeBtn.classList.toggle('liked');
    const likeCount = likeBtn.querySelector('.like-count');
    const currentLikes = parseInt(likeCount.textContent);
    likeCount.textContent = likeBtn.classList.contains('liked')
      ? currentLikes + 1
      : currentLikes - 1;
    incrementInteraction();
  });

  commentBtn.addEventListener('click', () => {
    incrementInteraction();
    showNotification('💬 Comentário adicionado!');
  });

  shareBtn.addEventListener('click', () => {
    incrementInteraction();
    showNotification('🔄 Post compartilhado!');
  });
}

// Cria stories no topo do feed
function createStories() {
  const storiesWrapper = storiesContainer.querySelector('.stories-wrapper');
  storiesWrapper.innerHTML = '';

  for (let i = 0; i < 8; i++) {
    const author = getRandomItem(AUTHORS);
    const initials = author.split(' ').map(n => n[0]).join('');

    const story = document.createElement('div');
    story.className = 'story-item';
    story.innerHTML = `
      <div class="story-ring">
        <div class="story-avatar">${initials}</div>
      </div>
      <span class="story-name">${author.split(' ')[0]}</span>
    `;

    story.addEventListener('click', () => {
      incrementInteraction();
      showNotification('📖 Story visualizada!');
    });

    storiesWrapper.appendChild(story);
  }
}

// Cria sidebar de sugestões
function createSuggestions() {
  const suggestedAccounts = document.getElementById('suggested-accounts');
  suggestedAccounts.innerHTML = '';

  for (let i = 0; i < 5; i++) {
    const author = getRandomItem(AUTHORS);
    const initials = author.split(' ').map(n => n[0]).join('');

    const suggestion = document.createElement('div');
    suggestion.className = 'suggested-account';
    suggestion.innerHTML = `
      <div class="suggestion-avatar">${initials}</div>
      <div class="suggestion-info">
        <p class="suggestion-name">${author}</p>
        <p class="suggestion-meta">Sugerido para você</p>
      </div>
      <button class="btn-follow">Seguir</button>
    `;

    suggestion.querySelector('.btn-follow').addEventListener('click', (e) => {
      e.target.textContent = 'Seguindo';
      e.target.classList.add('following');
      incrementInteraction();
      showNotification(`✅ Você seguiu ${author}`);
    });

    suggestedAccounts.appendChild(suggestion);
  }
}

// Cria trending topics
function createTrendingTopics() {
  const trendingList = document.getElementById('trending-list');
  trendingList.innerHTML = '';

  TRENDING_TOPICS.forEach(item => {
    const trending = document.createElement('div');
    trending.className = 'trending-item';
    trending.innerHTML = `
      <p class="trending-topic">${item.topic}</p>
      <p class="trending-count">${item.posts}</p>
    `;

    trending.addEventListener('click', () => {
      incrementInteraction();
      showNotification(`🔥 Explorando ${item.topic}`);
    });

    trendingList.appendChild(trending);
  });
}

// Mostra notificação popup
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification-popup';
  notification.textContent = message;

  notificationContainer.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Gera notificações aleatórias
function generateRandomNotification() {
  if (!isSimulationActive) return;

  notificationCount++;
  updateNotificationBadge();

  const message = getRandomItem(NOTIFICATION_MESSAGES);
  showNotification(message);
}

// Atualiza badge de notificações
function updateNotificationBadge() {
  const badgeCount = document.getElementById('badge-count');
  badgeCount.textContent = notificationCount;
  notificationBadge.style.display = 'flex';

  notificationBadge.classList.add('pulse');
  setTimeout(() => notificationBadge.classList.remove('pulse'), 600);
}

// Mostra banner promocional
function showPromoBanner() {
  promoBanner.style.display = 'flex';

  const closeBtn = promoBanner.querySelector('.banner-close');
  closeBtn.addEventListener('click', () => {
    promoBanner.style.display = 'none';
  });

  setTimeout(() => {
    promoBanner.style.display = 'none';
  }, 10000);
}

// Mostra modal de aviso de tempo
function showTimeWarningModal() {
  const modalTimeSpent = document.getElementById('modal-time-spent');
  modalTimeSpent.textContent = timeElapsed;

  timeWarningModal.style.display = 'flex';

  document.getElementById('continue-scrolling').onclick = () => {
    timeWarningModal.style.display = 'none';
    incrementInteraction();
  };

  document.getElementById('close-modal').onclick = () => {
    timeWarningModal.style.display = 'none';
  };
}

async function startSimulation() {
  if (isSimulationActive) return;

  isSimulationActive = true;
  startBtn.disabled = true;
  startBtn.textContent = 'Simulação Ativa';

  await loadAvailableImages();

  socialFeed.innerHTML = '';
  addPostsToFeed(5);

  storiesContainer.style.display = 'block';
  suggestionsSidebar.style.display = 'block';
  notificationBadge.style.display = 'flex';

  createStories();
  createSuggestions();
  createTrendingTopics();

  startTimer();
  socialFeed.addEventListener('scroll', handleInfiniteScroll);

  notificationInterval = setInterval(() => {
    generateRandomNotification();
  }, Math.random() * 7000 + 8000);

  setTimeout(showPromoBanner, 10000);
  setTimeout(showTimeWarningModal, 30000);
}

function resetSimulation() {
  isSimulationActive = false;
  timeElapsed = 0;
  interactionCount = 0;
  notificationCount = 0;
  postIdCounter = 0;

  clearInterval(timerInterval);
  clearInterval(notificationInterval);
  timerInterval = null;
  notificationInterval = null;

  startBtn.disabled = false;
  startBtn.textContent = 'Iniciar Simulação';

  updateTimeDisplay();
  updateInteractionDisplay();

  socialFeed.innerHTML = `
    <div class="feed-placeholder">
      <p>Clique em "Iniciar Simulação" para começar</p>
    </div>
  `;

  storiesContainer.style.display = 'none';
  suggestionsSidebar.style.display = 'none';
  promoBanner.style.display = 'none';
  timeWarningModal.style.display = 'none';
  notificationBadge.style.display = 'none';
  notificationContainer.innerHTML = '';

  socialFeed.removeEventListener('scroll', handleInfiniteScroll);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeElapsed++;
    updateTimeDisplay();

    if (timeElapsed % 60 === 0 && timeElapsed > 0) {
      showTimeWarningModal();
    }
  }, 1000);
}

function updateTimeDisplay() {
  timeCounter.textContent = formatTime(timeElapsed);
}

function incrementInteraction() {
  interactionCount++;
  updateInteractionDisplay();
}

function updateInteractionDisplay() {
  interactionCounter.textContent = interactionCount;
}

function handleInfiniteScroll() {
  const scrollTop = socialFeed.scrollTop;
  const scrollHeight = socialFeed.scrollHeight;
  const clientHeight = socialFeed.clientHeight;

  if (scrollTop + clientHeight >= scrollHeight * 0.9) {
    loadMorePosts();
  }
}

function loadMorePosts() {
  socialFeed.removeEventListener('scroll', handleInfiniteScroll);
  loadingIndicator.style.display = 'block';

  const delay = Math.random() * 1000 + 500;

  setTimeout(() => {
    addPostsToFeed(3);
    loadingIndicator.style.display = 'none';
    socialFeed.addEventListener('scroll', handleInfiniteScroll);

    if (Math.random() > 0.5) {
      generateRandomNotification();
    }
  }, delay);
}

function init() {
  startBtn.addEventListener('click', startSimulation);
  resetBtn.addEventListener('click', resetSimulation);

  updateTimeDisplay();
  updateInteractionDisplay();

  console.log('🎯 Simulador de Algoritmos inicializado');
  console.log('📁 Para usar imagens reais, coloque-as em: img/feed/');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
