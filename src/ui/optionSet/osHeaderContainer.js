import { 
    jsonData,
    getItemIndex,
    closeOsModalContainerQuick
} from '../context.js'

import { createOsDropdown } from './osDropDown.js'

import { createOsModalContainer } from '../osModal/modalContainer.js'

import { createOsNameCell } from '../osModal/modalNav/osName.js'

import { createSelectOsModalContainer } from '../selectOsModal/selectOsModalContainer.js'

import { osNewButton } from '../osModal/modalNav/osAddNew.js'

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
        const osRow = createOsRow(menuOs, sectionId, itemId);

        if (index % 2 === 0) {
            osRow.firstChild.classList.add('odd');
        } else {
            osRow.firstChild.classList.add('even');
        }
        osContainer.appendChild(osRow);
    });
}

function createOsRow(menuOs, sectionId, itemId) {
    const osRow = document.createElement('div');
    osRow.classList.add('osRow');

    const osRowHeader = document.createElement('div');
    osRowHeader.classList.add('osRowHeader');
    osRowHeader.classList.add('defaultColor');
    osRowHeader.classList.add('folded')
    osRowHeader.id = menuOs.MenuItemOptionSetId

    // Apply background color based on group
    osRowHeader.style.backgroundColor = menuOs.groupColor;

    osRow.appendChild(osRowHeader);

    const dropAndName = document.createElement('div')
    dropAndName.className = 'dropAndName'
    osRowHeader.appendChild(dropAndName)

    const osDropDown = createOsDropdown(osRowHeader, sectionId, itemId)
    dropAndName.appendChild(osDropDown)

    const nameAndOsId = document.createElement('div')
    nameAndOsId.className = 'nameAndOsId'
    dropAndName.appendChild(nameAndOsId)

    const osNameHeader = createOsNameHeader(menuOs, sectionId, itemId)
    nameAndOsId.appendChild(osNameHeader)

    const optionSetIdPreview = createOptionSetIdPreview(menuOs)
    nameAndOsId.appendChild(optionSetIdPreview)

    const osSelectOptionContainer = createOsSelectOption(menuOs)
    osRowHeader.appendChild(osSelectOptionContainer)

    return osRow
}


function createOsNameHeader(menuOs, sectionId, itemId) {
    const osNameHeader = document.createElement('p')
    osNameHeader.className = 'osNameHeader'
    if (menuOs.Name == null || menuOs.Name == '') {
        menuOs.Name = 'Empty'
        osNameHeader.textContent = 'Empty'
    } else {
        osNameHeader.textContent = menuOs.Name
    }
    osNameHeader.id = menuOs.MenuItemOptionSetId

    osNameHeader.addEventListener('click', () => {
        closeOsModalContainerQuick()

        const osModalContainer = createOsModalContainer(menuOs, sectionId, itemId)
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
    <p class='minSelectCount' id='${menuOs.MenuItemOptionSetId}'>${menuOs.MinSelectCount}</p>
    <p class='dashCountCell'> - </p>
    <p class='maxSelectCount' id='${menuOs.MenuItemOptionSetId}'>${menuOs.MaxSelectCount}</p>`
    
    return osSelectOptionContainer
}

function addNewOs(itemRow) {
    const newOsBtnContainer = document.createElement('div')
    newOsBtnContainer.className = 'newOsBtnContainer'

    const osEditButton = document.createElement('button')
    osEditButton.className = 'osEditButton'
    osEditButton.id = itemRow.id

    const editButtonImg = document.createElement('img')
    editButtonImg.className = 'osEditButtonImg'
    editButtonImg.src = '../../assets/editIcon.svg'

    osEditButton.appendChild(editButtonImg)

    osEditButton.addEventListener('click', () => {
        const selectOsModalContainer = createSelectOsModalContainer(itemRow)
        selectOsModalContainer.style.display = 'flex';
        selectOsModalContainer.style.justifyContent = 'center';
        selectOsModalContainer.style.alignItems = 'center';
        setTimeout(() => {
            selectOsModalContainer.style.opacity = 1;
        }, 10);
    });
    
    newOsBtnContainer.appendChild(osEditButton)
    const addNewOsButton = osNewButton(newOsBtnContainer)
    addNewOsButton.className = 'addNewOsButton'

    return newOsBtnContainer
}

export {
    createOsContainer,
    createOsNameCell,
    createOsRow
}