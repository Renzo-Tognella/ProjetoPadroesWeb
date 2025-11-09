/**
 * sensory_processor.js
 * 
 * Lógica da Página Autismo
 * Implementa modo sensorial reduzido e filtros CSS para simular sobrecarga sensorial
 */
/**
 * sensory_processor.js
 * * Lógica da Página Autismo
 * Implementa modo sensorial reduzido e filtros CSS para simular sobrecarga sensorial
 */

document.addEventListener('DOMContentLoaded', () => {

  const toggleBtn = document.getElementById('toggleEffects');

  const body = document.body;

  if (toggleBtn) {
    
    toggleBtn.addEventListener('click', () => {
      
      body.classList.toggle('no-effects');

      if (body.classList.contains('no-effects')) {
        toggleBtn.textContent = 'Ativar Efeitos Visuais';
      } else {
        toggleBtn.textContent = 'Desativar Efeitos Visuais';
      }
    });
  }
});