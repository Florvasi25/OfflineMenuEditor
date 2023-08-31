import { 
    jsonData,
    getSectionIndex, 
} from './context.js'

function createItemContainer(ItemsContainer, sectionRow) {
    const itemsContainer = document.createElement('table');
    itemsContainer.classList.add('itemsContainer');
    createItemRows(itemsContainer, sectionRow);
    sectionRow.parentNode.insertBefore(itemsContainer, sectionRow.nextSibling);
}

function createItemRows(itemsContainer, sectionRow) {
    const sectionIndex = getSectionIndex(sectionRow.id);
    const menuItems = jsonData.MenuSections[sectionIndex].MenuItems;
    
    menuItems.forEach(menuItem => {
        const itemRow = createItem(menuItem)
        itemsContainer.appendChild(itemRow);
    });
}

function createItem(menuItem) {
    const itemRow = document.createElement('tr');
    itemRow.textContent = menuItem.Name;

    return itemRow
}

export {
    createItemContainer
}