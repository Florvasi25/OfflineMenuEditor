import {
    updateSectionLocalStorage,
    jsonData,
    getItemIndex,
} from './context.js'

function createItemNameCell(itemRow, menuItem, sectionId) {
    //Name Cell
    const itemNameCell = document.createElement('td');
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

    let originalName = menuItem.Name;

    itemName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateName(itemRow.id, itemName.textContent, sectionId);
            originalName = itemName.textContent;
            itemName.blur();
        } else if (e.key === 'Escape') {
            itemName.textContent = originalName;
            itemName.blur();
        }
    });

    itemName.addEventListener('blur', () => {
        itemName.textContent = originalName;
        itemName.classList.remove('sectionClicked')
    });

    itemName.addEventListener('click', () => {
        itemName.classList.add('sectionClicked')
    })

    return itemName
}

//Updates Name
function updateName(itemId, itemName, sectionId) {

    const {itemIndex, sectionIndex} = getItemIndex(sectionId, itemId)
    jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].Name = itemName;

    updateSectionLocalStorage()
}

export {
    createItemNameCell,
    createItemName
}