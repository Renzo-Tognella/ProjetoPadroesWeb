/**
 * checklist_progress.js
 * 
 * Módulo para gerenciar o checklist interativo de navegação consciente
 * Calcula progresso em tempo real e persiste dados no localStorage
 */

export class ChecklistProgress {
  constructor() {
    this.form = document.getElementById('daily-checklist');
    this.progressText = document.getElementById('progress-text');
    this.progressFill = document.getElementById('progress-fill');
    this.checkboxes = [];
    this.totalItems = 0;
    this.storageKey = 'checklistProgress';
  }

  /**
   * Inicializa o módulo
   */
  init() {
    if (!this.form || !this.progressText || !this.progressFill) {
      console.warn('Elementos do checklist não encontrados na página');
      return;
    }

    // Coleta todos os checkboxes
    this.checkboxes = Array.from(this.form.querySelectorAll('input[type="checkbox"]'));
    this.totalItems = this.checkboxes.length;

    // Carrega progresso salvo
    this.loadProgress();

    // Adiciona event listeners
    this.checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => this.updateProgress());
    });

    // Atualiza display inicial
    this.updateProgress();
  }

  /**
   * Atualiza o progresso visual e salva estado
   */
  updateProgress() {
    const checkedCount = this.checkboxes.filter((cb) => cb.checked).length;
    const percentage = Math.round((checkedCount / this.totalItems) * 100);

    // Atualiza texto
    this.progressText.textContent = `${checkedCount}/${this.totalItems}`;

    // Atualiza barra
    this.progressFill.style.width = `${percentage}%`;
    this.progressFill.textContent = `${percentage}%`;

    // Salva estado
    this.saveProgress();
  }

  /**
   * Salva o estado no localStorage
   */
  saveProgress() {
    const state = {};
    this.checkboxes.forEach((checkbox) => {
      state[checkbox.name] = checkbox.checked;
    });
    
    // Adiciona timestamp para validação diária
    state.timestamp = new Date().toDateString();
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  }

  /**
   * Carrega o estado do localStorage
   */
  loadProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      
      if (!saved) {
        return;
      }

      const state = JSON.parse(saved);
      const today = new Date().toDateString();

      // Reseta se for um novo dia
      if (state.timestamp !== today) {
        localStorage.removeItem(this.storageKey);
        return;
      }

      // Restaura checkboxes
      this.checkboxes.forEach((checkbox) => {
        if (state[checkbox.name] !== undefined) {
          checkbox.checked = state[checkbox.name];
        }
      });
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    }
  }
}
