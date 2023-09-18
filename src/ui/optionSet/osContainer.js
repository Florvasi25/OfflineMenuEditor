import { 
    jsonData,
    getItemIndex, 
} from '../context.js'

function createOsContainer(itemRow, sectionRow, itemId) {
    const osContainer = document.createElement('tr');
    osContainer.classList.add('osContainer');
    itemRow.parentNode.insertBefore(osContainer, itemRow.nextSibling);
    createOsRows(osContainer, sectionRow, itemId);

    const osAddNew = addNewOs()
    osContainer.appendChild(osAddNew)
    
}

function createOsRows(osContainer, sectionId, itemId) {
    const {itemIndex, sectionIndex} = getItemIndex(sectionId, itemId)
    const menuOsItems = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets;
    
    menuOsItems.forEach(menuOs => {
        const osRowHeader = createOsHeader(menuOs)
        osContainer.appendChild(osRowHeader);
    });
}


function createOsHeader(menuOs) {
    const osRowHeader = document.createElement('td');
    osRowHeader.classList.add('osRowHeader');
    osRowHeader.classList.add('draggable');
    osRowHeader.classList.add('folded')
    osRowHeader.id = menuOs.MenuItemOptionSetId
    const osNameHeader = createOsNameHeader(menuOs)
    osRowHeader.appendChild(osNameHeader)
    const osSelectOptionContainer = createOsSelectOption(menuOs)
    osRowHeader.appendChild(osSelectOptionContainer)

    return osRowHeader
}

function createOsNameHeader(menuOs) {
    const osNameHeader = document.createElement('p')
    osNameHeader.className = 'osNameHeader'
    osNameHeader.textContent = menuOs.Name    

    return osNameHeader
}

function createOsSelectOption(menuOs) {
    const osSelectOptionContainer = document.createElement('div')
    osSelectOptionContainer.className = 'osSelectOptionContainer'
    osSelectOptionContainer.innerHTML = `${menuOs.MinSelectCount} - ${menuOs.MaxSelectCount}`

    return osSelectOptionContainer
}

function addNewOs() {
    const osAddNew = document.createElement('button')
    osAddNew.textContent = '+'
    osAddNew. className = 'osAddNew'

    return osAddNew
}

export {
    createOsContainer,
}