import {
    jsonData,
    deleteItemlessOs,
    getRandomInt,
    updateLocalStorage,
    groupedOs,
    itemlessOs,
    addWarningMoM
} from "../../context.js";

import {
    createOsRow
} from '../../optionSet/osHeaderContainer.js'

import {
    createRemoveButton
} from './footerRemoveItem.js'

import { slotManagerInstance } from  "../../mainContainer.js";

import { showToolTipMO } from "../../toolTip.js";

function createAddButton(menuOs, menuItemId) {
    const addBtn = document.createElement('button');
    addBtn.className = 'addBtn';
    addBtn.textContent = '+';

    const foundItem = jsonData.MenuSections
        .flatMap(i => i.MenuItems)
        .find(i => i.MenuItemId == menuItemId);

    addBtn.addEventListener('click', (event) => {
        const masterOptionSetExists = foundItem.MenuItemOptionSets.some(optionSet => optionSet.IsMasterOptionSet === true);
    
        if (menuOs.IsMasterOptionSet == false) {                
            addOsOrMo(menuOs, foundItem, addBtn, menuItemId)
        } else {
            if (!masterOptionSetExists) {
                foundItem.Price = 0
                const itemRow = document.getElementById(foundItem.MenuItemId);
                if (itemRow) {
                    const itemPriceCell = itemRow.querySelector('.itemPriceCell');
                    if (itemPriceCell) {
                        itemPriceCell.style.display = 'none';
                    }
                }
                addOsOrMo(menuOs, foundItem, addBtn, menuItemId)
            } else {
                showToolTipMO(addBtn, 'Only one Master Option is allowed per Item')
            }
        }
    })
    
    return addBtn
}

function addOsOrMo(menuOs, foundItem, addBtn, menuItemId) {
    const targetParent = event.target.parentElement;
        
    if (foundItem.IsAvailable == false) {
        targetParent.style.backgroundColor = '#8bad97';
    } else {
        targetParent.style.backgroundColor = '#a2f5c0';
    }

    addBtn.style.display = 'none';
    
    let newOs = {};
    if (itemlessOs.includes(menuOs)) {
        newOs = menuOs;
        deleteItemlessOs(newOs);

        newOs.MenuItemOptionSetItems.forEach(option => {
            const newOptionId = getRandomInt();
            option.MenuItemOptionSetItemId = newOptionId
            option.NextMenuItemOptionSetId = null
        })
    } else {
        newOs = JSON.parse(JSON.stringify(menuOs));
        const newOptionSetId = getRandomInt();
        newOs.MenuItemOptionSetId = newOptionSetId;

        newOs.MenuItemOptionSetItems.forEach(option => {
            const newOptionId = getRandomInt();
            option.MenuItemOptionSetItemId = newOptionId
            option.NextMenuItemOptionSetId = null
        })
    }

    newOs.MenuItemId = foundItem.MenuItemId
    newOs.DisplayOrder = foundItem.MenuItemOptionSets.length

    if (menuOs.IsMasterOptionSet == true) {
        newOs.DisplayOrder = -1
        newOs.IsMasterOptionSet = true
        foundItem.MenuItemOptionSets.unshift(newOs)
    } else {
        newOs.DisplayOrder = foundItem.MenuItemOptionSets.length
        foundItem.MenuItemOptionSets.push(newOs)
    }

    const osContainerPreviewArray = Array.from(document.getElementsByClassName('osContainer'));
    const osContainerPreview = osContainerPreviewArray.find((p) => p.id == foundItem.MenuItemId);
    
    const newOptionRow = createOsRow(newOs, foundItem.MenuSectionId, foundItem.MenuItemId)
    
    if (newOs.IsMasterOptionSet) {
        const justMOContainer = osContainerPreview.querySelector('.justMOContainer');
        if (justMOContainer) {
            justMOContainer.appendChild(newOptionRow);
        }
    } else {
        const justOSContainer = osContainerPreview.querySelector('.justOSContainer');
        if (justOSContainer) {
            justOSContainer.appendChild(newOptionRow);
        } 
    }

    const removeBtn = createRemoveButton(menuOs, menuItemId);
    targetParent.appendChild(removeBtn);

    const filteredItemsCountArray = Array.from(document.getElementsByClassName('filteredItemsCount'));
    const filteredItemsCount = filteredItemsCountArray.find((p) => p.id == foundItem.MenuSectionId);
    
    if (filteredItemsCount) {
        const currentCount = parseInt(filteredItemsCount.textContent) || 0;
        filteredItemsCount.textContent = currentCount + 1;
    }
    
    addWarningMoM();
    updateLocalStorage(slotManagerInstance.currentSlot);

    if (!groupedOs[menuOs.groupOsId]) {
        groupedOs[menuOs.groupOsId] = [newOs];
    } else {
        groupedOs[menuOs.groupOsId].push(newOs)
    }
}

export { createAddButton }