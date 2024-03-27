import {
    jsonData,
    getItemIndex,
    updateLocalStorage,
    setSectionDisplayOrder,
    getRandomInt,
    groupedOs,
    setOptionSetIdForSection,
    setOptionSetItemsIdForSection,
    closeOsModalContainer,
    removePublicId
} from '../context.js';

import { createItem } from './itemContainer.js'

import { showToolTip } from '../toolTip.js'

import { changeItemClockIcon } from '../clock/itemClock.js'

import { slotManagerInstance } from '../mainContainer.js';

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
            showToolTip(duplicateButton, "You must close this Item before duplicating");
        }
    });
    
    duplicateButton.addEventListener('click', () => {
        if (itemRow.classList.contains('expanded')) return;

        closeOsModalContainer()

        duplicateItem(itemRow, sectionId, itemRow.id, itemContainer, menuItem);
        setSectionDisplayOrder(jsonData);
    });
}

function duplicateItem(itemRow, sectionId, itemId, itemContainer) {
    const {itemIndex, sectionIndex} = getItemIndex(sectionId, itemId)
    
    if (itemIndex !== -1) {
        const originalItem = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex];
        const newItem = JSON.parse(JSON.stringify(originalItem));
        const item = newIDs(newItem, sectionId);
        console.log(item);
        const newItemRow = createItem(item, sectionId, itemContainer);
        
        itemContainer.insertBefore(newItemRow, itemRow.nextSibling);
        
        jsonData.MenuSections[sectionIndex].MenuItems.splice(itemIndex+1, 0, item);
        jsonData.MenuSections[sectionIndex].MenuItems.forEach((obj, index) => {
            obj.DisplayOrder = index;
        });

        item.MenuItemOptionSets.forEach((menuOs) => {
            if (!groupedOs[menuOs.groupOsId]) {
                groupedOs[menuOs.groupOsId] = [menuOs];
            } else {
                groupedOs[menuOs.groupOsId].push(menuOs)
            }
        })

        changeItemClockIcon(newItemRow, newItemRow.id);
        updateLocalStorage(slotManagerInstance.currentSlot);
    }
}

function newIDs(newItem, sectionId){
    const newItemId = getRandomInt();
    newItem.MenuItemId = newItemId;
    if(newItem.PublicId) { delete newItem.PublicId;}
    if( newItem.MenuItemOptionSets && newItem.MenuItemOptionSets.length > 0)
    {
        removePublicId(newItem.MenuItemOptionSets);
        let map = setOptionSetIdForSection(sectionId);
        setOptionSetItemsIdForSection(sectionId, map);
    }
    return newItem;
}

export { itemDuplicateButton }