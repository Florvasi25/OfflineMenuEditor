import { 
    jsonData,
    getItemIndex, 
} from '../context.js'

function createOsContainer(itemRow, sectionRow, itemId) {
    // itemTd.setAttribute('colspan', 7)
    const osContainer = document.createElement('tr');
    osContainer.classList.add('osContainer');
    itemRow.parentNode.insertBefore(osContainer, itemRow.nextSibling);
    createOsRows(osContainer, sectionRow, itemId);
}

function createOsRows(osContainer, sectionId, itemId) {
    const {itemIndex, sectionIndex} = getItemIndex(sectionId, itemId)
    const menuOsItems = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets;
    
    menuOsItems.forEach(menuOs => {
        const osRow = createOs(menuOs)
        osContainer.appendChild(osRow);
    });
}

function createOs(menuOs) {
    const osRow = document.createElement('tr');
    osRow.classList.add('osRow');
    osRow.classList.add('draggable');
    osRow.classList.add('folded')
    osRow.id = menuOs.MenuItemOptionSetId
    osRow.textContent = menuOs.Name

    return osRow
}

export {
    createOsContainer,
}