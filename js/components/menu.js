/**
 * menu.js
 * 
 * Componente de menu de navegação reutilizável
 * Carrega e injeta o menu HTML em todas as páginas
 */

export async function loadMenu() {
  try {
    const response = await fetch('components/menu.html');
    const menuHTML = await response.text();

    const menuContainer = document.getElementById('menu-container');
    if (menuContainer) {
      menuContainer.innerHTML = menuHTML;
      highlightCurrentPage();
      setupMenuBehavior();
    }
  } catch (error) {
    console.error('Erro ao carregar o menu:', error);
  }
}

/**
 * Destaca o item do menu correspondente à página atual
 */
function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const menuLinks = document.querySelectorAll('.menu a');

  menuLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;

    if (currentPath === linkPath || (currentPath === '/' && linkPath === '/index.html')) {
      link.classList.add('active');
    }
  });
}

function setupMenuBehavior() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');

  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      navList.classList.toggle('active');
      const isExpanded = navList.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  const navLinks = document.querySelectorAll('.nav-list a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navList) navList.classList.remove('active');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}
