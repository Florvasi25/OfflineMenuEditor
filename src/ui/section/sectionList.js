import {
    jsonData,
    getSectionIndex,
    updateCounterLocalStorage,
    updateLocalStorage,
    setSectionDisplayOrder,
    updateItemCounterLocalStorage,
    updateOptionSetCounterLocalStorage,
    updateOptionSetItemsCounterLocalStorage,
    getLocalStorageItemIDs,
    getLocalStorageOptionSetItemsIDs,
    getLocalStorageOptionSetIDs,
    getLocalStorageSectionIDs,
    getUniqueRandomInt
} from '../context.js';

import {
    createAndAppend,  
    addTextContent
}  from '../helpers.js';

function sectionListButton(sectionButtonsCell, menuSection) {
    const listButton = document.createElement('button');
    listButton.classList.add('sectionButton')
    listButton.classList.add('listButton')
    sectionButtonsCell.appendChild(listButton);
    const listButtonImg = document.createElement('img')
    listButtonImg.classList.add('listButtonImg')
    listButtonImg.src = '../../assets/listIcon.svg'
    listButton.appendChild(listButtonImg)
    
    createList(listButton, menuSection);
}

function createList(triggerButton, menuSection){
    triggerButton.addEventListener('click', function(event) {
        //'this' refers to triggerButton. listInstance property is being used as a way to associate 
        //a specific instance of the List class with a specific button, 
        //so that the code can determine whether it needs to create a new list or show/hide an existing one.
        if (!this.listInstance) {
            this.listInstance = new List(triggerButton, menuSection);
            this.listInstance.showList();
        } else {
            // If list already exists, simply toggle its visibility
            if (this.listInstance.listElement && this.listInstance.listElement.style.display === 'block') {
                this.listInstance.hideList();
            } else {
                this.listInstance.showList();
            }
        }
    });
}

class List {
    constructor(triggerElement, menuSection) {
        this.triggerElement = triggerElement; // Element that, when clicked, will trigger the list object
        this.menuSection = menuSection; // Content for the list
        this.listElement = null; // Will hold the DOM element once created
        this.cancelButton = null;
        this.submitButton = null;
        
    }
    // Create the list HTML structure
    createListHtml() {
        const list = createAndAppend(body, 'div', 'list');
        const arrow = createAndAppend(list, 'div', 'arrow');
        const listTitle = createAndAppend(list, 'h3', 'list-title');
        addTextContent(listTitle, 'Modify group of items');
        
        const listContent = createAndAppend(list, 'div', 'list-content');
        const itemForm = createAndAppend(listContent, 'form');
        itemForm.setAttribute('action', '#');
        
        const formBody = createAndAppend(itemForm, 'div', 'form-body');
        const formGroup = createAndAppend(formBody, 'div', 'form-group');
        const textAreaGroupItems = createAndAppend(formGroup, 'textarea', 'form-control');
        textAreaGroupItems.setAttribute('rows', '6');
        textAreaGroupItems.setAttribute('cols', '30');
        textAreaGroupItems.style.resize = 'both';
        textAreaGroupItems.value = this.getItems();

        const formActions = createAndAppend(itemForm, 'div', 'form-actions');
        const row = createAndAppend(formActions, 'div', 'row');
        this.submitButton = createAndAppend(row, 'button',  'submit-button-list');
        addTextContent(this.submitButton, 'Submit');
        this.cancelButton = createAndAppend(row, 'button', 'cancel-button-list');
        addTextContent(this.cancelButton, 'Cancel');

        this.cancelButton.addEventListener('click', () => {
            this.hideList();
        });

        return list;
    }
    getItems() {
        if (this.menuSection.MenuItems.length === 0) {
            return 'Empty;0.00';
        }
        return this.menuSection.MenuItems.map(item => {
            return `${item.Name};${item.Price}`;
        }).join('\n');
    }
    showList() {
        if (!this.listElement) {
            this.listElement = this.createListHtml();
        }
        this.positionList();
        this.listElement.classList.remove('hidden');

        document.addEventListener('click', this.handleOutsideClick.bind(this));
    }

    hideList() {
        if (this.listElement) {
            this.listElement.classList.add('hidden');
        }

        document.removeEventListener('click', this.handleOutsideClick.bind(this));
    }

    positionList() {
        const rect = this.triggerElement.getBoundingClientRect();
        this.listElement.style.position = 'absolute';
        this.listElement.style.top = (rect.bottom + window.scrollY) + 'px';
        this.listElement.style.left = (rect.left + window.scrollX) + 'px';
    }

    //if the user clicks outside the list, it will close.
    handleOutsideClick(event) {
        if (!this.listElement.contains(event.target) && !this.triggerElement.contains(event.target)) {
            this.hideList();
        }
    }
}


export { sectionListButton }