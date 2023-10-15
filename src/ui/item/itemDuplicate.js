import {
    jsonData,
    getItemIndex,
    updateItemCounterLocalStorage,
    updateLocalStorage,
    getLocalStorageItemIDs,
    setSectionDisplayOrder,
    getUniqueRandomInt,
} from '../context.js';

import { createItem } from './itemContainer.js'

import { showToolTip } from '../toolTip.js'

function itemDuplicateButton(itemRow, itemButtonsCell, sectionId, itemContainer, menuItem) {
    const duplicateButton = document.createElement('button');
    duplicateButton.classList.add('sectionButton')
    duplicateButton.classList.add('duplicateButton')
    itemButtonsCell.appendChild(duplicateButton);
    const duplicateButtonImg = document.createElement('img')
    duplicateButtonImg.classList.add('sectionButtonImg')
    duplicateButtonImg.src = '../../assets/duplicateIcon.svg'
    duplicateButton.appendChild(duplicateButtonImg)

    //show tooltip on mouseover
    duplicateButtonImg.addEventListener('mouseover', () => {
        if (itemRow.classList.contains('expanded')) {
            showToolTip(duplicateButton, "You must close this item before duplicating.");
        }
    });
    
    duplicateButton.addEventListener('click', () => {
        if (itemRow.classList.contains('expanded')) return;

        duplicateItem(itemRow, sectionId, itemRow.id, itemContainer, menuItem);
        setSectionDisplayOrder(jsonData);
    });
    
}

function duplicateItem(itemRow, sectionId, itemId, itemContainer) {
    const {itemIndex, sectionIndex} = getItemIndex(sectionId, itemId)
    
    if (itemIndex !== -1) {
        const originalItem = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex];
        const newItem = JSON.parse(JSON.stringify(originalItem));
        
        const itemIDs = getLocalStorageItemIDs();
        const newItemId = getUniqueRandomInt(itemIDs);

        newItem.MenuItemId = newItemId;
        newItem.PublicId = crypto.randomUUID();
        
        const newItemRow = createItem(newItem, sectionId, itemContainer);
        
        itemContainer.insertBefore(newItemRow, itemRow.nextSibling);
        
        jsonData.MenuSections[sectionIndex].MenuItems.splice(itemIndex+1, 0, newItem);
        jsonData.MenuSections[sectionIndex].MenuItems.forEach((obj, index) => {
            obj.DisplayOrder = index;
        });
        updateLocalStorage();
        updateItemCounterLocalStorage(newItemId, true);
    }
}

export { itemDuplicateButton }