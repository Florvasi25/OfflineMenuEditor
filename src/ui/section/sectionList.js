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
    getUniqueRandomInt,
    getSectionRow
} from '../context.js';

import {
    createAndAppend,  
    addTextContent
}  from '../helpers.js';

import { CreateItem } from '../item/itemAddNew.js';

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
        let sectionRow = getSectionRow(menuSection.MenuSectionId);
        if (!this.listInstance) {
            this.listInstance = new List(triggerButton, menuSection, sectionRow);
            this.listInstance.showList();
        } else {
            // If list already exists, simply toggle its visibility
            if (this.listInstance.listElement && this.listInstance.listElement.style.display === 'none') {
                this.listInstance.showList();
            } else {
                this.listInstance.hideList();
            }
        }
    });
}

class List {
    constructor(triggerElement, menuSection, sectionRow) {
        this.triggerElement = triggerElement; // Element that, when clicked, will trigger the list object
        this.menuSection = menuSection; // Content for the list
        this.sectionRow = sectionRow;
        this.listElement = null; // Will hold the DOM element once created
        this.textAreaGroupItems = null; // Will hold the textarea element
        this.cancelButton = null;
        this.submitButton = null;
        this.errorMessage = null;
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
            e.preventDefault();
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            if(this.validateItemsFormat(this.textAreaGroupItems.value) && this.checkDuplicatedItems(this.textAreaGroupItems.value)){
                const { itemsNotInJson , jsonItemsNotInText } = this.compareItems(this.textAreaGroupItems.value);
                const sectionIndex = getSectionIndex(this.menuSection.MenuSectionId);
                if(itemsNotInJson && itemsNotInJson.length > 0){
                    this.createItems(itemsNotInJson, sectionIndex);
                }
                if(jsonItemsNotInText && jsonItemsNotInText.length > 0){
                    this.deleteItems(jsonItemsNotInText, sectionIndex);
                }
                this.hideList();
            }else{
                this.errorMessage.style.display = 'block';
                this.textAreaGroupItems.classList.add('error');
            }
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
            this.errorMessage.style.display = 'block';
            this.textAreaGroupItems.classList.add('error');
            return false;
          }
        }
        return true;
      }

      checkDuplicatedItems(textBoxContent){
        this.errorMessage.style.display = 'none';
        this.textAreaGroupItems.classList.remove('error');

        const trimmedInput = textBoxContent.trim();
        const lines = trimmedInput.split('\n').filter(line => line.trim() !== '');
        const itemsSeen = {}; 

        for (let line of lines) {
            let [itemName, itemPrice] = line.split(';');
            let itemKey = `${itemName.toLowerCase().trim()};${itemPrice.trim()}`; 
            if (itemsSeen[itemKey]) {
                this.errorMessage.style.display = 'block';
                this.textAreaGroupItems.classList.add('error');
                return false;
            } else {
                itemsSeen[itemKey] = true;
            }
        }
        return true;    
      }
      compareItems(textBoxContent) {
        // Convert the text box content into an array of lines and trim each line
        const lines = textBoxContent.trim().split('\n').map(line => line.trim());
        // Create an array of strings in the format "Name;Price" from the JSON MenuItems
        const menuItemsFromJson = this.menuSection.MenuItems.map(item => {
          // Ensure the name and price are trimmed to avoid whitespace issues
          const name = item.Name.trim();
          const price = item.Price.toString().trim();
          return `${name};${price}`;
        });
        // Filter the lines that are not found in the menuItemsFromJson array
        const itemsNotInJson = lines.filter(line => {
          if (line === '') return false;
          // Split the line by semicolon and trim parts to handle extra whitespaces
          const [itemName, itemPrice] = line.split(';').map(part => part.trim());
          // Reconstruct the line in a normalized format
          const normalizedLine = `${itemName};${itemPrice}`;
          // Return true if the line (item;price) is not found in the JSON
          return !menuItemsFromJson.includes(normalizedLine);
        });
        const jsonItemsNotInText = menuItemsFromJson.filter(menuItem => {
            return !lines.includes(menuItem);
        });
         return { itemsNotInJson, jsonItemsNotInText };
    }

    createItems(items, sectionIndex) { 
        for(let i = 0; i < items.length; i++){
            const { itemName, itemPrice } = this.trimItems(items[i]);
            const itemIDs = getLocalStorageItemIDs();
            const newId = getUniqueRandomInt(itemIDs);

            const emptyItemJson = {
                MenuId: jsonData.MenuId,
                MenuItemId: newId,
                Name: itemName,
                Description: null,
                SpicinessRating: 0,
                Price: itemPrice,
                DisplayOrder: jsonData.MenuSections[sectionIndex].MenuItems.length,
                IsDeleted: false,
                Alcohol: false,
                CatalogItemId: null,
                Tags: [],
                PublicId: crypto.randomUUID(),
                IsAvailable: true,
                MenuItemOptionSets: [],
                TaxRate: null,
                TaxRateId: null,
                TaxValue: 0,
                TaxRateName: null,
                MenuSectionId: this.menuSection.MenuSectionId,
                ImageName: null,
                ImageUrl: null,
                CellAspectRatio: 4,
                CellLayoutType: 0,
                ActualPrice: itemPrice,
                DisableVouchers: false,
                ExcludeFromVoucherDiscounting: false,
                DailySpecialHours: [],
                PriceCanIncrease: false,
                MenuItemMetadata: [],
                ExternalImageUrl: null
            };
            if( this.sectionRow.className === "sectionRow draggable expanded") {
                var itemTable = this.sectionRow.nextElementSibling;
                var itemContainer = itemTable.querySelector('.itemContainer');
                CreateItem(itemContainer, emptyItemJson, sectionIndex, this.menuSection.MenuSectionId, newId)
            }else{
                jsonData.MenuSections[sectionIndex].MenuItems.push(emptyItemJson)
            }
            updateLocalStorage()
            updateItemCounterLocalStorage(newId, true);
        }
    }
    deleteItems(jsonItemsNotInText, sectionIndex){
        const itemsToDelete = jsonItemsNotInText.map(itemText => this.trimItems(itemText));
        const menuItems = jsonData.MenuSections[sectionIndex].MenuItems;

        let itemsToDeleteIds = [];
    
        // Filter the items that need to be deleted and store their ids
        const filteredItems = menuItems.filter(item => {
            const isToDelete = itemsToDelete.some(toDelete => 
                toDelete.itemName === item.Name && toDelete.itemPrice === item.Price
            );
            if (isToDelete) {
                itemsToDeleteIds.push(item.MenuItemId);
            }
            return !isToDelete;
        });
        jsonData.MenuSections[sectionIndex].MenuItems = filteredItems;
        jsonData.MenuSections[sectionIndex].MenuItems.forEach((item, index) => {
            item.DisplayOrder = index;
        });
        if( this.sectionRow.className === "sectionRow draggable expanded") {
            const itemRows = Array.from(document.getElementsByClassName('itemRow'));
            itemsToDeleteIds.forEach(MenuItemId => {
                const itemRowToDelete = itemRows.find((p) => p.id === MenuItemId.toString());
                if (itemRowToDelete) {
                    itemRowToDelete.remove();
                }
            });
        }
        updateLocalStorage();
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
    
    showList() {
        this.listElement = this.createListHtml();
        this.positionList();
        body.appendChild(this.listElement);
        
        this.listElement.style.display = 'block'; 
    
        document.addEventListener('click', this.handleOutsideClick.bind(this), true);
    }

    hideList() {
        if (this.listElement) {
            this.listElement.style.display = 'none';
        }
        document.removeEventListener('click', this.handleOutsideClick.bind(this), true);
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