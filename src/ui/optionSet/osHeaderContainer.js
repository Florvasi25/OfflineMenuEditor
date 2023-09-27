import { 
    jsonData,
    getItemIndex,
    getOsIndex,
    updateSectionLocalStorage 
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

    const osNameHeader = createOsNameHeader(menuOs, itemId, sectionId, osRowHeader)
    dropAndName.appendChild(osNameHeader)

    const osSelectOptionContainer = createOsSelectOption(menuOs)
    osRowHeader.appendChild(osSelectOptionContainer)

    return osRowHeader
}

//////////////////////

function createOsNameHeader(menuOs, itemId, sectionId, osRowHeader) {
    const osNameHeader = document.createElement('p')
    osNameHeader.className = 'osNameHeader'
    osNameHeader.textContent = menuOs.Name
    osNameHeader.id = menuOs.MenuItemOptionSetId

    osNameHeader.addEventListener('click', () => {
        const existingOsModal = document.querySelector('.osModalContainer')
        if (existingOsModal) {
            existingOsModal.remove()
        }
        const osModalContainer = createOsModalContainer(menuOs, itemId, sectionId, osRowHeader)
        osModalContainer.style.display = 'block';
        setTimeout(() => {
            osModalContainer.classList.add('show');
        }, 10);
    });

    return osNameHeader
}

//////////////////////

function createOsNameCell(menuOs, itemId, sectionId) {
    //Name Cell
    const osNameCell = document.createElement('div');
    osNameCell.classList.add('osNameCell');

    const osNameHeader = createOsName(menuOs, itemId, sectionId)
    osNameCell.appendChild(osNameHeader);
    
    return osNameCell
}

//Handles Name Edits
function createOsName(menuOs, itemId, sectionId) {
    const osName = document.createElement('p');
    osName.classList.add('osName');
    osName.contentEditable = true;
    osName.textContent = menuOs.Name;

    let originalName = menuOs.Name;

    osName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newOsName = osName.textContent;
            updateName(menuOs.MenuItemOptionSetId, itemId, sectionId, newOsName);
            originalName = newOsName;
            osName.blur();
            const osNameHeaderArray = Array.from(document.getElementsByClassName('osNameHeader')); 
            const osNameHeader = osNameHeaderArray.find((p) => p.id == menuOs.MenuItemOptionSetId)
            osNameHeader.textContent = newOsName;
        } else if (e.key === 'Escape') {
            osName.textContent = originalName;
            osName.blur();
        }
    });

    osName.addEventListener('blur', () => {
        osName.textContent = originalName;
        osName.classList.remove('sectionClicked')
    });

    osName.addEventListener('click', () => {
        osName.classList.add('sectionClicked')
    })

    return osName
}

//Updates Name
function updateName(osHeaderId, itemId, sectionId, osName) {
    const {itemIndex, sectionIndex, osIndex} = getOsIndex(sectionId, itemId, osHeaderId)
    jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].Name = osName;

    updateSectionLocalStorage()
}

////////////////////////////

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
    createOsNameCell
}