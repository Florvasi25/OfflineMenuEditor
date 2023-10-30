import {
    jsonData,
    getItemIndex,
    updateItemCounterLocalStorage,
    updateLocalStorage,
    updateOptionSetCounterLocalStorage,
    updateOptionSetItemsCounterLocalStorage,
    getLocalStorageItemIDs,
    getLocalStorageOptionSetIDs,
    getLocalStorageOptionSetItemsIDs,
    setSectionDisplayOrder,
    getUniqueRandomInt,
} from '../context.js';

import { createItem } from './itemContainer.js'

import { 
    showToolTip,
    removeToolTip
} from '../toolTip.js'

import { changeItemClockIcon } from '../clock/itemClock.js'

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

    // Add an event listener to the sectionRow to watch for class changes
    itemRow.addEventListener('transitionend', () => {
        if (itemRow.classList.contains('folded')) {
            // Remove the tooltip if the section is folded
            removeToolTip(duplicateButton);
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
        const item = newIDs(newItem);
        const newItemRow = createItem(item, sectionId, itemContainer);
        
        itemContainer.insertBefore(newItemRow, itemRow.nextSibling);
        
        jsonData.MenuSections[sectionIndex].MenuItems.splice(itemIndex+1, 0, item);
        jsonData.MenuSections[sectionIndex].MenuItems.forEach((obj, index) => {
            obj.DisplayOrder = index;
        });
        changeItemClockIcon(newItemRow, newItemRow.id);
        updateLocalStorage();
    }
}

function newIDs(newItem){
    const itemIds = getLocalStorageItemIDs();
    const newItemId = getUniqueRandomInt(itemIds);
    newItem.MenuItemId = newItemId;
    newItem.PublicId = crypto.randomUUID();

    if (newItem.MenuItemOptionSets) {
        newItem.MenuItemOptionSets.forEach(optionSet => {
            if (optionSet) {
                const optionSetIds = getLocalStorageOptionSetIDs();
                const newOptionSetId = getUniqueRandomInt(optionSetIds);
                optionSet.MenuItemOptionSetId = newOptionSetId;
                optionSet.MenuItemId = newItemId;
                updateOptionSetCounterLocalStorage(newOptionSetId, true);

                if (optionSet.MenuItemOptionSetItems) {
                    optionSet.MenuItemOptionSetItems.forEach(optionSetItem => {
                        if (optionSetItem) {
                            const optionSetItemsIds = getLocalStorageOptionSetItemsIDs();
                            const newOptionSetItemId = getUniqueRandomInt(optionSetItemsIds);
                            optionSetItem.MenuItemOptionSetItemId = newOptionSetItemId; 
                            updateOptionSetItemsCounterLocalStorage(newOptionSetItemId, true);
                        }
                    });
                }
            }
        });
    }

    updateItemCounterLocalStorage(newItemId, true);
    return newItem;
}

export { itemDuplicateButton }