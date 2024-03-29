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

import { clickCount } from '../mainContainer.js'

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
    
    if (osTable) {
        var osTableParagraphs = osTable.querySelectorAll('p');
        osTableParagraphs.forEach(function(paragraph) {
            var currentSize = parseInt(window.getComputedStyle(paragraph).fontSize);
            paragraph.style.fontSize = (currentSize + clickCount) + 'px';
        });
    }
}

function createOs(osContainer, sectionId, itemId) {
    const { itemIndex, sectionIndex } = getItemIndex(sectionId, itemId);
    const menuOsItems = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets;
   
    const justMOContainer = document.createElement('div');
    justMOContainer.className = 'justMOContainer';
    osContainer.appendChild(justMOContainer)

    const justOSContainer = document.createElement('div')
    justOSContainer.className = 'justOSContainer'
    justOSContainer.id = itemId
    osContainer.appendChild(justOSContainer)

   
    menuOsItems.forEach((menuOs) => {
        if (menuOs.IsMasterOptionSet == true) {
            const osRow = createOsRow(menuOs, sectionId, itemId);
            justMOContainer.appendChild(osRow);
        } else {
            const osRow = createOsRow(menuOs, sectionId, itemId);
            justOSContainer.appendChild(osRow);
        }
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

    const MOContainer = createMOContainer(menuOs)
    osRowHeader.appendChild(MOContainer)

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

function createMOContainer(menuOs) {
    const MOContainer = document.createElement('div');
    MOContainer.className = 'MOContainer';

    if (menuOs.IsMasterOptionSet === true) {
        const MOHeader = document.createElement('p');
        MOHeader.className = 'MOHeader';
        MOHeader.textContent = '(Master Option)';
        MOContainer.appendChild(MOHeader); // Append the header to the container
    }

    return MOContainer;
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