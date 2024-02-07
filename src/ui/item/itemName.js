import {
    updateLocalStorage,
    jsonData,
    getItemIndex,
} from '../context.js'

import { slotManagerInstance } from '../mainContainer.js';

function createItemNameCell(itemRow, menuItem, sectionId) {
    //Name Cell
    const itemNameCell = document.createElement('div');
    itemNameCell.classList.add('itemNameCell');

    const itemName = createItemName(itemRow, menuItem, sectionId)
    itemNameCell.appendChild(itemName);
    
    return itemNameCell
}

//Handles Name Edits
function createItemName(itemRow, menuItem, sectionId) {
    const itemName = document.createElement('p');
    itemName.classList.add('itemName');
    itemName.contentEditable = true;
    itemName.textContent = menuItem.Name;
    if (itemName.textContent == "Empty") {
        itemName.style.color = "#a9a9a9";
    }

    let originalName = menuItem.Name;

    itemName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (itemName.textContent == "" || itemName.textContent == null) {
                itemName.textContent = "Empty"
                itemName.style.color = "#a9a9a9";
            }
            updateName(itemRow.id, itemName.textContent, sectionId);
            originalName = itemName.textContent;
            itemName.blur();
        } else if (e.key === 'Escape') {
            if (itemName.textContent == "" || itemName.textContent == null) {
                itemName.textContent = "Empty"
                itemName.style.color = "#a9a9a9";
            } else {
                itemName.textContent = originalName;
            }
            itemName.blur();
        }
    });

    itemName.addEventListener('blur', () => {
        itemName.textContent = originalName;
        if (itemName.textContent == "Empty") {
            itemName.style.color = "#a9a9a9";
        }
        itemName.classList.remove('sectionClicked')
    });

    itemName.addEventListener('click', () => {
        if (itemName.textContent == "Empty") {
            itemName.textContent = ""
        }
        itemName.style.color = "#000000";
        itemName.classList.add('sectionClicked')
    })

    return itemName
}

//Updates Name
function updateName(itemId, itemName, sectionId) {
    const {itemIndex, sectionIndex} = getItemIndex(sectionId, itemId)
    jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].Name = itemName;

    updateLocalStorage(slotManagerInstance.currentSlot);
}

export { createItemNameCell }