/**
 * menu.js
 * 
 * Componente de menu de navegação reutilizável
 * Carrega e injeta o menu HTML em todas as páginas
 */

export async function loadMenu() {
  try {
    const response = await fetch('/components/menu.html');
    const menuHTML = await response.text();
    
    const menuContainer = document.getElementById('menu-container');
    if (menuContainer) {
      menuContainer.innerHTML = menuHTML;
      highlightCurrentPage();
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
