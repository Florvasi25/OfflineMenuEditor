import {
    createAndAppend,  
    addTextContent,
    createElementWithClasses
} from '../../helpers.js';

function createOptionSetListButton(optionsBodyContainer) {
    const listButton = createElementWithClasses('button', 'sectionButton', 'optionSetListButton');
    const listButtonImg = createElementWithClasses('img', 'sectionButtonImg');
    listButtonImg.src = '../../assets/listIcon.svg';
    listButton.appendChild(listButtonImg);

    new OptionSetList(listButton, optionsBodyContainer);

    return listButton;
}

class OptionSetList {
    constructor(triggerElement, parentElement) {
        this.triggerElement = triggerElement;
        this.listElement = null;
        this.isVisible = false;
        this.parentElement = parentElement; //optionsBodyContainer

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

        this.listElement = createAndAppend(this.parentElement, 'div', 'list');
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

        this.submitButton.addEventListener('click', (e) => 
        {
            e.preventDefault();
            this.handleSubmitButtonClick(e)
        });
    }

    handleSubmitButtonClick(event) {
        event.preventDefault();
        if (this.validateInput()) {
            this.processInput();
        } else {
            this.showErrorMessage();
        }
    }

    validateInput() {
        console.log("ProcessInput");
        /*return this.validateItemsFormat(this.textAreaGroupItems.value) && 
               this.checkDuplicatedItems(this.textAreaGroupItems.value);*/
    }

    processInput() {
        console.log("ProcessInput");
        /*const { itemsNotInJson, jsonItemsNotInText } = this.compareItems(this.textAreaGroupItems.value);
        const optionSetIndex = getOptionSetIndex(this.menuSection.MenuSectionId);

        if (itemsNotInJson && itemsNotInJson.length > 0) {
            this.createItems(itemsNotInJson, optionSetIndex);
        }
        if (jsonItemsNotInText && jsonItemsNotInText.length > 0) {
            this.deleteItems(jsonItemsNotInText, optionSetIndex);
        }
        this.hideList();*/
    }

    showErrorMessage() {
        this.errorMessage.style.display = 'block';
        this.textAreaGroupItems.classList.add('error');
    }

    showList() {
        if (this.listElement) {

            this.listElement.style.display = 'block';
            this.listElement.classList.remove('hidden');
            this.isVisible = true;

            this.positionList();
            
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

    positionList() {
        const rect = this.triggerElement.getBoundingClientRect();
        // Assuming 'this.triggerElement' is inside the scrollable container.
        const containerScrollTop = this.triggerElement.offsetParent.scrollTop;
        const containerScrollLeft = this.triggerElement.offsetParent.scrollLeft;
    
        // Position the top of the modal just below the trigger element, considering the scroll position
        const topPosition = rect.top + rect.height + containerScrollTop;
    
        // Calculate the left position so the modal aligns with the right side of the trigger element
        // considering the scroll position
        const leftPosition = rect.right - this.listElement.offsetWidth + containerScrollLeft;
    
        // Ensure the modal doesn't go off the left side of the container
        const adjustedLeftPosition = Math.max(leftPosition, containerScrollLeft);
    
        this.listElement.style.position = 'fixed';
        this.listElement.style.top = `${topPosition}px`;
        this.listElement.style.left = `${adjustedLeftPosition}px`;
    }
    
    
}

export { createOptionSetListButton }