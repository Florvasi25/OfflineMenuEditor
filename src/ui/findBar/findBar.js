
import {
    createAndAppend,
    addTextContent
} from '../helpers.js';

const Mark = require('mark.js');

export class FindBar {
    constructor() {
        this.markInstance = new Mark(document.querySelector('.sectionTable'));

        this.findBar = createAndAppend(document.body, 'div', 'find-bar');
        this.findInput = createAndAppend(this.findBar, 'input', 'find-input');
        this.findNextButton = createAndAppend(this.findBar, 'button', 'find-next-button');
        this.findPrevButton = createAndAppend(this.findBar, 'button', 'find-prev-button');
        this.closeButton = createAndAppend(this.findBar, 'button', 'find-close-button', 'closeButton');
        this.counter = createAndAppend(this.findBar, 'div', 'counter');
        this.counter.style.display = 'none';
        this.findNextButton.onclick = () => this.find(this.findInput.value, false);
        this.findPrevButton.onclick = () => this.find(this.findInput.value, true);


        // Configurar IDs (esto es principalmente para facilitar las pruebas y referencia, pero no es crítico para la funcionalidad)
        this.findBar.id = 'findBar';
        this.findInput.id = 'findInput';
        this.findNextButton.id = 'findNextButton';
        this.findPrevButton.id = 'findPrevButton';
        this.closeButton.id = 'findCloseButton';

        // Añadir texto a los botones
        addTextContent(this.findNextButton, '↓');
        addTextContent(this.findPrevButton, '↑');
        addTextContent(this.closeButton, 'X');

        // Evento para buscar y navegar al siguiente o anterior resultado
        this.findNextButton.onclick = () => this.find(this.findInput.value, false);
        this.findPrevButton.onclick = () => this.find(this.findInput.value, true);

        // Búsqueda inicial al presionar enter
        this.findInput.addEventListener('input', () => {
            const searchText = this.findInput.value.trim();
            if (searchText === '') {
                // Remove counter if find input is empty
                this.counter.style.display = 'none';
                // Clear existing highlights
                this.markInstance.unmark();
            } else {
                this.find(searchText);
            }
            // If there are no matches, set currentIndex to -1 and update the counter
            if (this.matches.length === 0) {
                this.currentIndex = -1;
                this.counter.textContent = `0/0`;
            }
        });


        this.findInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const searchText = this.findInput.value.trim();
                if (searchText !== '') {
                    if (event.shiftKey) {
                        this.navigate(false); // Navigate backwards
                    } else {
                        this.navigate(true); // Navigate forwards
                    }
                }
            }
        });

        // Cerrar la barra de búsqueda
        this.closeButton.onclick = () => this.hide();

        // Manejadores para ocultar la barra en ciertas acciones
        this.onKeyDown = this.onKeyDown.bind(this);
        document.addEventListener('keydown', this.onKeyDown);
        this.onOutsideClick = this.onOutsideClick.bind(this);
        document.addEventListener('click', this.onOutsideClick);

        // Preparar para la búsqueda
        this.matches = [];
        this.currentIndex = -1;

        // Ocultar inicialmente
        this.hide();
    }

    onKeyDown(event) {
        if (event.key === 'Escape') {
            this.hide();
        }
    }

    onOutsideClick(event) {
        if (!this.findBar.contains(event.target)) {
            this.hide();
        }
    }

    find(text, backward = false) {
        if (!text.trim()) {
            console.log("Please enter valid text to search.");
            return;
        }
    
        // Always reset the counter to "0/0" before starting a new search
        this.counter.textContent = '0/0';
        this.counter.style.display = 'block'; // Ensure the counter is visible even if there are no matches
    
        // Indicate if it's a new search
        const isNewSearch = text !== this.lastSearchText;
        this.lastSearchText = text; // Store the text of the last search
    
        this.markInstance.unmark({
            done: () => {
                this.markInstance.mark(text, {
                    separateWordSearch: false,
                    diacritics: true,
                    className: 'highlight',
                    done: (marks) => {
                        this.matches = Array.from(document.querySelectorAll('.highlight'));
                        if (this.matches.length > 0) {
                            this.currentIndex = 1; // Always start at the first occurrence
                            this.navigate(false); // Move to the first result for forward search
                        } else {
                            console.log("Text not found.");
                        }
                    }
                });
            }
        });
    }
    

    navigate(forward) {
        if (this.matches.length === 0) return;

        this.scrollToCurrentIndex();

        this.currentIndex = forward ?
            (this.currentIndex + 1) % this.matches.length :
            (this.currentIndex - 1 + this.matches.length) % this.matches.length;

        this.counter.textContent = `${this.currentIndex + 1}/${this.matches.length}`; // Update the counter

        this.scrollToCurrentIndex();
    }

    scrollToCurrentIndex() {
        this.matches.forEach(match => {
            match.classList.remove('current-highlight');
            match.classList.add('highlight');
        });

        const currentElement = this.matches[this.currentIndex];
        if (currentElement) {
            currentElement.classList.add('current-highlight');
            currentElement.classList.remove('highlight');

            currentElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }

    show() {
        this.findBar.style.display = 'block';

        this.findInput.focus();
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('click', this.onOutsideClick);
        this.findInput.addEventListener('keypress', this.enterKeyListener);
    }

    hide() {
        this.findBar.style.display = 'none';
        this.findInput.value = ''; // Clear the find input
        this.counter.style.display = 'none'; // Hide the counter

        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('click', this.onOutsideClick);
        this.findInput.removeEventListener('keypress', this.enterKeyListener);
        this.markInstance.unmark();
    }
}