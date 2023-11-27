import {
    createAndAppend,  
    addTextContent,
    createElementWithClasses
} from '../../helpers.js';

function createOptionSetListButton() {
    const listButton = createElementWithClasses('button', 'sectionButton', 'optionSetListButton');
    const listButtonImg = createElementWithClasses('img', 'sectionButtonImg');
    listButtonImg.src = '../../assets/listIcon.svg';
    listButton.appendChild(listButtonImg);

    new OptionSetList(listButton);

    return listButton;
}

class OptionSetList {
    constructor(triggerElement) {
        this.triggerElement = triggerElement;
        this.listElement = null;
        this.isVisible = false;

        this.initialize();
    }

    initialize() {
        this.triggerElement.addEventListener('click', () => {
            if (!this.listElement) {
                this.createList();
                this.showList();
            } else {
                this.toggleListVisibility();
            }
        });
    }

    createList() {
        const rect = this.triggerElement.getBoundingClientRect();
        const top = rect.bottom + window.scrollY; 
        const right = window.innerWidth - rect.right; 

        this.listElement = createAndAppend(document.body, 'div', 'list');
        
        this.listElement.style.top = `${top}px`;
        this.listElement.style.right = `${right}px`;

        const arrow = createAndAppend(this.listElement, 'div', 'arrow');
        const listTitle = createAndAppend(this.listElement, 'h3', 'list-title');
        addTextContent(listTitle, 'Modify group of items');
        
        const listContent = createAndAppend(this.listElement, 'div', 'list-content');
        const itemForm = createAndAppend(listContent, 'form');
        itemForm.setAttribute('action', '#');
        
        const formBody = createAndAppend(itemForm, 'div', 'form-body');
        const formGroup = createAndAppend(formBody, 'div', 'form-group');
        const textAreaGroupItems = createAndAppend(formGroup, 'textarea', 'form-control');
        textAreaGroupItems.setAttribute('rows', '6');
        textAreaGroupItems.setAttribute('cols', '30');
        textAreaGroupItems.setAttribute('spellcheck', 'false');
        textAreaGroupItems.style.resize = 'both';
        this.textAreaGroupItems = textAreaGroupItems;
        //this.textAreaGroupItems.value = this.getItems();

        const formActions = createAndAppend(itemForm, 'div', 'form-actions');
        const row = createAndAppend(formActions, 'div', 'row');
        this.submitButton = createAndAppend(row, 'button',  'submit-button-list');
        addTextContent(this.submitButton, 'Submit');
        this.cancelButton = createAndAppend(row, 'button', 'cancel-button-list');
        addTextContent(this.cancelButton, 'Cancel');
        this.errorMessage = createAndAppend(formGroup, 'div', 'error-message');
        addTextContent(this.errorMessage, 'Input is not valid.');
        this.errorMessage.style.display = 'none';

        this.cancelButton.addEventListener('click', (e) => {
            this.hideList();
            e.preventDefault();
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
        });
    }

    showList() {
        if (this.listElement) {
            this.listElement.style.display = 'block';
            this.listElement.classList.remove('hidden');
            this.isVisible = true;
        }
    }

    hideList() {
        if (this.listElement) {
            this.listElement.style.display = 'none';
            this.listElement.classList.add('hidden');
            this.isVisible = false;
        }
    }

    toggleListVisibility() {
        if (this.isVisible) {
            this.hideList();
        } else {
            this.showList();
        }
    }
}

export { createOptionSetListButton }