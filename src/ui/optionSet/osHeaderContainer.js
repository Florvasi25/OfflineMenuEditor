import { 
    jsonData,
    getItemIndex,
} from '../context.js'

import { createOsDropdown } from './osDropDown.js'

import { createOsModalContainer } from '../osModal/modalContainer.js'

import { createOsNameCell } from '../osModal/modalNav/osName.js'

import { createSelectOsModalContainer } from '../selectOsModal/selectOsModalContainer.js'

function createOsContainer(itemRow, sectionId, itemId) {
    const osContainer = document.createElement('div');
    osContainer.classList.add('osContainer');
    itemRow.parentNode.insertBefore(osContainer, itemRow.nextSibling);
    createOs(osContainer, sectionId, itemId);

    const osAddNew = addNewOs(itemRow)
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
    const osRowHeader = document.createElement('div');
    osRowHeader.classList.add('osRowHeader');
    osRowHeader.classList.add('defaultColor');
    osRowHeader.classList.add('draggable');
    osRowHeader.classList.add('folded')
    osRowHeader.id = menuOs.MenuItemOptionSetId

    const dropAndName = document.createElement('div')
    dropAndName.className = 'dropAndName'
    osRowHeader.appendChild(dropAndName)

    const osDropDown = createOsDropdown(osRowHeader, menuOs, sectionId, itemId)
    dropAndName.appendChild(osDropDown)

    const nameAndOsId = document.createElement('div')
    nameAndOsId.className = 'nameAndOsId'
    dropAndName.appendChild(nameAndOsId)

    const osNameHeader = createOsNameHeader(menuOs, itemId, sectionId, osRowHeader.id)
    nameAndOsId.appendChild(osNameHeader)

    const optionSetIdPreview = createOptionSetIdPreview(menuOs)
    nameAndOsId.appendChild(optionSetIdPreview)

    const osSelectOptionContainer = createOsSelectOption(menuOs)
    osRowHeader.appendChild(osSelectOptionContainer)

    return osRowHeader
}

function createOsNameHeader(menuOs, itemId, sectionId, osId) {
    const osNameHeader = document.createElement('p')
    osNameHeader.className = 'osNameHeader'
    osNameHeader.textContent = menuOs.Name
    osNameHeader.id = menuOs.groupOsId
    osNameHeader.addEventListener('click', () => {
        const existingOsModal = document.querySelector('.osModalContainer')
        if (existingOsModal) {
            existingOsModal.remove()
        }
        const osModalContainer = createOsModalContainer(menuOs, itemId, sectionId, osId)
        osModalContainer.style.display = 'block';
        setTimeout(() => {
            osModalContainer.classList.add('show');
        }, 10);
    });

    return osNameHeader
}

function createOptionSetIdPreview(menuOs) {
    const optionSetIdPreview = document.createElement('p')
    optionSetIdPreview.textContent = menuOs.MenuItemOptionSetId
    optionSetIdPreview.className = 'optionSetIdPreview'

    return optionSetIdPreview
}

function createOsSelectOption(menuOs) {
    const osSelectOptionContainer = document.createElement('div')
    osSelectOptionContainer.className = 'osSelectOptionContainer'
    osSelectOptionContainer.innerHTML = `
    <p class='minSelectCount' id='${menuOs.groupOsId}'>${menuOs.MinSelectCount}</p>
    <p class='dashCountCell'> - </p>
    <p class='maxSelectCount' id='${menuOs.groupOsId}'>${menuOs.MaxSelectCount}</p>`
    
    return osSelectOptionContainer
}

function addNewOs(itemRow) {
    const osAddNew = document.createElement('button')
    osAddNew.textContent = '+'
    osAddNew. className = 'osAddNew'
    osAddNew.id = itemRow.id

    osAddNew.addEventListener('click', () => {
        const selectOsModalContainer = createSelectOsModalContainer()
        selectOsModalContainer.style.display = 'block';
        setTimeout(() => {
            selectOsModalContainer.style.opacity = 1;
        }, 10);
    });

    return osAddNew
}

export {
    createOsContainer,
    createOsNameCell
}