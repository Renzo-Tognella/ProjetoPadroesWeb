export class AboutInteractions {
    constructor() {
        this.renzoCards = document.querySelectorAll('.renzo-flip-card');
    }

    init() {
        this.renzoCards.forEach(card => {
            card.addEventListener('click', () => {
                if (card.classList.contains('flipped')) {
                    card.classList.remove('flipped');
                    card.classList.add('unflipped');
                } else {
                    card.classList.remove('unflipped');
                    card.classList.add('flipped');
                }
            });

            // Adiciona suporte a teclado para acessibilidade
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (card.classList.contains('flipped')) {
                        card.classList.remove('flipped');
                        card.classList.add('unflipped');
                    } else {
                        card.classList.remove('unflipped');
                        card.classList.add('flipped');
                    }
                }
            });

            // Garante que o elemento seja focável
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }
        });
    }
}
