import {
    createAndAppend,  
    addTextContent,
    createElementWithClasses
} from '../../helpers.js';

import {
    getLocalStorageOptionSetItemsIDs,
    getUniqueRandomInt,
    groupOptionSets,
    updateLocalStorage,
    updateOptionSetItemsCounterLocalStorage,
    groupedOs,
    setColorOfRows,
    itemlessOs,
    updateItemlessLocalStorage
} from '../../context.js';

import {
    updatePreview
} from './optionAddNew.js';

import {
    createOption
} from './osBody.js';

import {
    deleteOption
} from './optionDelete.js';

function createOptionSetListButton(menuOs, optionRowsContainer) {
    const listButton = createElementWithClasses('button', 'sectionButton', 'optionSetListButton');
    const listButtonImg = createElementWithClasses('img', 'sectionButtonImg');
    listButtonImg.src = '../../assets/listIcon.svg';
    listButton.appendChild(listButtonImg);

    new OptionSetList(listButton, listButton, menuOs, optionRowsContainer);

    return listButton;
}

class OptionSetList {
    constructor(triggerElement, parentElement, menuOs, optionRowsContainer) {
        this.triggerElement = triggerElement;
        this.listElement = null;
        this.isVisible = false;
        this.parentElement = parentElement; 
        this.optionSet = menuOs;
        this.optionRowsContainer = optionRowsContainer;
        this.initialize();
    }

    initialize() {
        this.triggerElement.addEventListener('click', () => {    
            if (document.activeElement === this.textAreaGroupItems) {
                return;
            }
    
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
        this.textAreaGroupItems.value = this.getItems();

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
            e.stopPropagation();
            e.preventDefault();
        });

        this.submitButton.addEventListener('click', (e) => 
        {
            e.preventDefault();
            e.stopPropagation();
            this.handleSubmitButtonClick(e)
        });

        this.textAreaGroupItems.addEventListener('click', (e) => {
            e.stopPropagation(); 
        });

    }

    getItems() {
        if (this.optionSet.MenuItemOptionSetItems.length === 0) {
            return 'Empty;0.00';
        }
        return this.optionSet.MenuItemOptionSetItems.map(item => {
            return `${item.Name};${item.Price}`;
        }).join('\n');
    }

    handleSubmitButtonClick(event) {
        event.preventDefault();
        if (this.validateInput()) {
            this.processInput();
            this.hideList()
        } else {
            this.showErrorMessage();
        }
    }

    validateInput() {
        return this.validateItemsFormat(this.textAreaGroupItems.value) && 
               this.checkDuplicatedItems(this.textAreaGroupItems.value);
    }

    processInput() {
        const { itemsNotInJson, jsonItemsNotInText } = this.compareItems(this.textAreaGroupItems.value);

        if (itemsNotInJson && itemsNotInJson.length > 0) {
            this.createItems(itemsNotInJson, this.optionSet);
        }
        if (jsonItemsNotInText && jsonItemsNotInText.length > 0) {
            this.deleteItems(jsonItemsNotInText, this.optionSet, this.optionRowsContainer);
        }
        this.hideList();
    }
    
    validateItemsFormat(textBoxContent) {
        this.errorMessage.style.display = 'none';
        this.textAreaGroupItems.classList.remove('error');
        // Trim the input to remove leading and trailing whitespace
        const trimmedInput = textBoxContent.trim();
        // Split the trimmed input into lines and filter out empty lines
        const lines = trimmedInput.split('\n').filter(line => line.trim() !== '');
        // RegExp to validate the item format: "ItemName;price"
        const itemRegExp = new RegExp(/^.+;\d+(\.\d+)?$/);
        for (let line of lines) { 
          if (!itemRegExp.test(line)) {
            this.errorMessage.textContent = 'Invalid input';
            this.errorMessage.style.display = 'block';
            this.textAreaGroupItems.classList.add('error');
            return false;
          }
        }
        return true;
      }

      compareItems(textBoxContent) {
        const lines = textBoxContent.trim().split('\n').map(line => line.trim());
        const menuItemsFromJson = this.optionSet.MenuItemOptionSetItems.map(item => {
          const name = item.Name.trim();
          const price = item.Price.toString().trim();
          return `${name};${price}`;
        });
        const itemsNotInJson = lines.filter(line => {
          if (line === '') return false;
          const [itemName, itemPrice] = line.split(';').map(part => part.trim());
          const normalizedLine = `${itemName};${itemPrice}`;
          return !menuItemsFromJson.includes(normalizedLine);
        });
        const jsonItemsNotInText = menuItemsFromJson.filter(menuItem => {
            return !lines.includes(menuItem);
        });
         return { itemsNotInJson, jsonItemsNotInText };
    }

      checkDuplicatedItems(textBoxContent) {
        const trimmedInput = textBoxContent.trim();
        const lines = trimmedInput.split('\n').filter(line => line.trim() !== '');
        const itemsSeen = {};
        let duplicatedItem = '';
    
        for (let line of lines) {
            let [itemName, itemPrice] = line.split(';');
            let itemKey = `${itemName.toLowerCase().trim()};${itemPrice.trim()}`; 
            if (itemsSeen[itemKey]) {
                duplicatedItem = line;
                break;
            } else {
                itemsSeen[itemKey] = true;
            }
        }
    
        if (duplicatedItem) {
            this.textAreaGroupItems.style.display = 'none'; 
            this.errorMessage.textContent = `Duplicated item: "${duplicatedItem}", delete it manually and try again.`;
            this.errorMessage.style.display = 'block'; 
            this.errorMessage.style.width = '100%'; 
            this.errorMessage.style.height = '100px'; 
            this.errorMessage.style.overflow = 'hidden'; 
            this.errorMessage.classList.add('full-size-error'); 
            return false;
        } else {
            this.textAreaGroupItems.style.display = 'block'; 
            this.errorMessage.style.display = 'none'; 
            this.errorMessage.classList.remove('full-size-error');
        }
        return true;
    }

    createItems(items, menuOs) { 
        for(let i = 0; i < items.length; i++){
            const { itemName, itemPrice } = this.trimItems(items[i]);
            
            let emptyOptionJson = {
                CatalogItemId: null,
                MenuId: menuOs.MenuId,
                MenuItemOptionSetItemId: null,
                Name: itemName,
                Price: itemPrice,
                TaxRateId: null,
                TaxRate: null,
                TaxValue: 0,
                TaxRateName: null,
                IsAvailable: true,
                DisplayOrder: menuOs.MenuItemOptionSetItems.length,
                IsDeleted: false,
                Tags: [],
                NextMenuItemOptionSetId: null,
                PublicId: crypto.randomUUID(),
                ImageName: null,
                ImageUrl: null,
                CellAspectRatio: 0,
                CellLayoutType: 0,
                OptionSetItemMetadata: [],
                ExternalImageUrl: null,
            };
            const groupOsId = menuOs.groupOsId;
        
            if (groupedOs[groupOsId]) {
                groupedOs[groupOsId].forEach((os) => {
                    const optionIds = getLocalStorageOptionSetItemsIDs();
                    const newOptionId = getUniqueRandomInt(optionIds);
                    updateOptionSetItemsCounterLocalStorage(newOptionId, true);
        
                    const emptyOptionCopy = { ...emptyOptionJson };
                    emptyOptionCopy.MenuItemOptionSetItemId = newOptionId;
        
                    os.MenuItemOptionSetItems.push(emptyOptionCopy);
        
                    if (os.MenuItemOptionSetId === menuOs.MenuItemOptionSetId) {
                        const optionRow = createOption(
                            this.optionRowsContainer,
                            menuOs,
                            emptyOptionCopy
                        );
                        this.optionRowsContainer.appendChild(optionRow);
                    }
        
                    updatePreview(os, emptyOptionCopy);
                });
        
                groupOptionSets();
                updateLocalStorage();
        
            } else if (itemlessOs.includes(menuOs)){
                const optionIds = getLocalStorageOptionSetItemsIDs();
                const newOptionId = getUniqueRandomInt(optionIds);
                updateOptionSetItemsCounterLocalStorage(newOptionId, true);
        
                emptyOptionJson.MenuItemOptionSetItemId = newOptionId;
        
                menuOs.MenuItemOptionSetItems.push(
                    emptyOptionJson
                );
        
                const optionRow = createOption(
                    this.optionRowsContainer,
                    menuOs,
                    emptyOptionJson
                );
                this.optionRowsContainer.appendChild(optionRow);
        
                updateItemlessLocalStorage();
            } else {
                console.warn("Warn: No option set found");
            }
        
            setColorOfRows(this.optionRowsContainer);
        }
    }

    deleteItems(items, menuOs, optionRowsContainer){
        for(let i = 0; i < items.length; i++){
            const { itemName, itemPrice } = this.trimItems(items[i]);
            var menuOption = this.findOptionSetItem(menuOs, itemName, itemPrice );
            var optionRow = document.getElementById(menuOption.MenuItemOptionSetItemId.toString());
            if(optionRow && optionRowsContainer.contains(optionRow)) {
                deleteOption(menuOs, menuOption, optionRow, optionRowsContainer);
            }
        }

    }
    findOptionSetItem(menuOs, itemName, itemPrice ){
        const osItems = menuOs.MenuItemOptionSetItems;
        for(let i = 0; i < osItems.length; i++){
            if(osItems[i].Name == itemName && osItems[i].Price == itemPrice){
                return osItems[i];
            }
        }
    }
    trimItems(item){
        let parts = item.split(';');
        let trimmedItemName = parts[0].trim();
        let trimmedItemPrice = parts[1].trim();
        
        return {
          itemName: trimmedItemName,
          itemPrice: +trimmedItemPrice
        };
        
    }
      
    showErrorMessage() {
        this.errorMessage.style.display = 'block';
        this.textAreaGroupItems.classList.add('error');
    }

    showList() {
        if (this.listElement) {
            this.listElement.style.display = 'block';
            this.listElement.classList.remove('hidden');
            this.clearErrorMessage();
            this.textAreaGroupItems.value = this.getItems();
            this.isVisible = true;
        }
        
    }

    hideList() {
        if (this.listElement) {
            this.listElement.style.display = 'none';
            this.listElement.classList.add('hidden');
            this.clearErrorMessage();
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
  
    clearErrorMessage(){
        if (this.errorMessage) {
            this.errorMessage.style.display = 'none';
            this.errorMessage.textContent = ''; 
            this.errorMessage.classList.remove('full-size-error'); 
            this.textAreaGroupItems.classList.remove('error'); 
            this.textAreaGroupItems.style.display = 'block';
        }
    }
}

export { createOptionSetListButton }