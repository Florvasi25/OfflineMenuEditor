import { 
    jsonData,
    getItemIndex,
} from '../context.js'

import { createOsDropdown } from './osDropDown.js'

import { createOsModalContainer } from '../osModal/modalContainer.js'

import { createOsNameCell } from '../osModal/modalNav/osName.js'

import { createSelectOsModalContainer } from '../selectOsModal/selectOsModalContainer.js'

function createOsContainer(itemRow, sectionId, itemId) {
    const osTable = document.createElement('div')
    osTable.className = 'osTable'

    const osContainer = document.createElement('div');
    osContainer.classList.add('osContainer');
    osContainer.id = itemId
    osTable.appendChild(osContainer)

    itemRow.parentNode.insertBefore(osTable, itemRow.nextSibling);
    createOs(osContainer, sectionId, itemId);

    const osAddNew = addNewOs(itemRow)
    osTable.appendChild(osAddNew)
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

    const osNameHeader = createOsNameHeader(menuOs)
    nameAndOsId.appendChild(osNameHeader)

    const optionSetIdPreview = createOptionSetIdPreview(menuOs)
    nameAndOsId.appendChild(optionSetIdPreview)

    const osSelectOptionContainer = createOsSelectOption(menuOs)
    osRowHeader.appendChild(osSelectOptionContainer)

    return osRowHeader
}

function createOsNameHeader(menuOs) {
    const osNameHeader = document.createElement('p')
    osNameHeader.className = 'osNameHeader'
    osNameHeader.textContent = menuOs.Name
    osNameHeader.id = menuOs.MenuItemOptionSetId
    osNameHeader.addEventListener('click', () => {
        const existingOsModal = document.querySelector('.osModalContainer')
        if (existingOsModal) {
            existingOsModal.remove()
        }
        const osModalContainer = createOsModalContainer(menuOs)
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
    const newOsBtnContainer = document.createElement('div')
    newOsBtnContainer.className = 'newOsBtnContainer'

    const osEditButton = document.createElement('button')
    osEditButton. className = 'osEditButton'
    osEditButton.id = itemRow.id

    const editButtonImg = document.createElement('img')
    editButtonImg.className = 'osEditButtonImg'
    editButtonImg.src = '../../assets/editIcon.svg'

    osEditButton.appendChild(editButtonImg)

    osEditButton.addEventListener('click', () => {
        const selectOsModalContainer = createSelectOsModalContainer(itemRow)
        selectOsModalContainer.style.display = 'block';
        setTimeout(() => {
            selectOsModalContainer.style.opacity = 1;
        }, 10);
    });

    newOsBtnContainer.appendChild(osEditButton)

    return newOsBtnContainer
}

export {
    createOsContainer,
    createOsNameCell,
    createOsRow
}