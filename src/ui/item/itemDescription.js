import {
    updateLocalStorage,
    jsonData,
    getItemIndex,
} from '../context.js'

import { slotManagerInstance } from '../mainContainer.js';

function createItemDescCell(itemRow, menuItem, sectionId) {
    //Desc Cell
    const itemDescCell = document.createElement('div');
    itemDescCell.classList.add('itemDescCell');

    const itemDesc = createItemDesc(itemRow, menuItem, sectionId)
    itemDescCell.appendChild(itemDesc);
    
    return itemDescCell
}

//Handles Desc Edits
function createItemDesc(itemRow, menuItem, sectionId) {
    const itemDesc = document.createElement('p');
    itemDesc.classList.add('itemDesc');
    itemDesc.contentEditable = true;

    if (menuItem.Description) {
        const formattedDesc = menuItem.Description.replace(/\n/g, '<br>');
        itemDesc.innerHTML = formattedDesc;
    }

    let originalDesc = menuItem.Description || '';

    itemDesc.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.originalEvent || e).clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    });

    itemDesc.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
            document.execCommand('insertLineBreak');
            e.preventDefault();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            updateDesc(itemRow.id, itemDesc.innerHTML, sectionId);
            originalDesc = itemDesc.innerHTML;
            itemDesc.blur();
        } else if (e.key === 'Escape') {
            itemDesc.innerHTML = originalDesc;
            itemDesc.blur();
        }
    });

    itemDesc.addEventListener('blur', () => {
        const formattedDesc = originalDesc.replace(/\n/g, '<br>');

        itemDesc.innerHTML = formattedDesc;
        itemDesc.classList.remove('sectionClicked');
    });

    itemDesc.addEventListener('click', () => {
        itemDesc.classList.add('sectionClicked');
    })

    return itemDesc;
}

// Utility function to decode HTML entities and replace <br> with newline characters
function decodeAndReplace(html) {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value.replace(/<br>/g, '\n');
}

//Updates Desc
function updateDesc(itemId, itemDesc, sectionId) {
    const {itemIndex, sectionIndex} = getItemIndex(sectionId, itemId)

    // Decode HTML entities and replace <br> with newline characters
    const normalizedDesc = decodeAndReplace(itemDesc);

    jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].Description = normalizedDesc;

    updateLocalStorage(slotManagerInstance.currentSlot);
}

export {
    createItemDescCell,
    createItemDesc
}