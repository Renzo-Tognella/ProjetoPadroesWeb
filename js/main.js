/**
 * main.js
 * 
 * Ponto de entrada da aplicação
 * Gerencia o roteamento e inicializa os módulos necessários
 */
import { loadMenu } from './components/menu.js';

// Inicializa o menu quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  loadMenu();
});