import {
    updateLocalStorage,
    jsonData,
    getItemIndex,
} from '../context.js'

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
    itemDesc.classList.add('sectionDesc');
    itemDesc.contentEditable = true;
    itemDesc.textContent = menuItem.Description;

    let originalDesc = menuItem.Description;

    itemDesc.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateDesc(itemRow.id, itemDesc.textContent, sectionId);
            originalDesc = itemDesc.textContent;
            itemDesc.blur();
        } else if (e.key === 'Escape') {
            itemDesc.textContent = originalDesc;
            itemDesc.blur();
        }
    });

    itemDesc.addEventListener('blur', () => {
        itemDesc.textContent = originalDesc;
        itemDesc.classList.remove('sectionClicked')
    });

    itemDesc.addEventListener('click', () => {
        itemDesc.classList.add('sectionClicked')
    })

    return itemDesc
}

//Updates Desc
function updateDesc(itemId, itemDesc, sectionId) {
    const {itemIndex, sectionIndex} = getItemIndex(sectionId, itemId)
    jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].Description = itemDesc;

    updateLocalStorage()
}

export {
    createItemDescCell,
    createItemDesc
}