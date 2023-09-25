import { 
    jsonData,
    getItemIndex, 
} from '../context.js'

import {
    createOsDropdown,
} from './osDropDown.js'

import {
    createOsModalContainer
} from '../sidebar/sidebarContainer.js'

function createOsContainer(itemRow, sectionId, itemId) {
    const osContainer = document.createElement('div');
    osContainer.classList.add('osContainer');
    itemRow.parentNode.insertBefore(osContainer, itemRow.nextSibling);
    createOs(osContainer, sectionId, itemId);

    const osAddNew = addNewOs()
    osContainer.appendChild(osAddNew)
    
}

function createOs(osContainer, sectionId, itemId) {
    const { itemIndex, sectionIndex } = getItemIndex(sectionId, itemId);
    const menuOsItems = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets;
    
    menuOsItems.forEach((menuOs, index) => {
        const osRowHeader = createOsRow(menuOs, sectionId, itemId);

        if (index % 2 === 0) {
            osRowHeader.classList.add('odd');
        } else {
            osRowHeader.classList.add('even');
        }

        osContainer.appendChild(osRowHeader);
    });
}

function createOsRow(menuOs, sectionId, itemId) {
    const osRowHeader = document.createElement('section');
    osRowHeader.classList.add('osRowHeader');
    osRowHeader.classList.add('defaultColor');
    osRowHeader.classList.add('draggable');
    osRowHeader.classList.add('folded')
    osRowHeader.id = menuOs.MenuItemOptionSetId

    const dropAndName = document.createElement('div')
    dropAndName.className = 'dropAndName'
    osRowHeader.appendChild(dropAndName)

    const osDropDown = createOsDropdown(osRowHeader, sectionId, itemId)
    dropAndName.appendChild(osDropDown)

    const osNameHeader = createOsNameHeader(menuOs, itemId, sectionId)
    dropAndName.appendChild(osNameHeader)

    const osSelectOptionContainer = createOsSelectOption(menuOs)
    osRowHeader.appendChild(osSelectOptionContainer)

    return osRowHeader
}

function createOsNameHeader(menuOs, itemId, sectionId) {
    const osNameHeader = document.createElement('p')
    osNameHeader.className = 'osNameHeader'
    osNameHeader.textContent = menuOs.Name

    const osModalContainer = createOsModalContainer(menuOs, itemId, sectionId)

    osNameHeader.addEventListener('click', () => {
        osModalContainer.style.display = 'block';
        setTimeout(() => {
            osModalContainer.classList.add('show');
        }, 10);
    });

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
    createOsNameHeader,
}