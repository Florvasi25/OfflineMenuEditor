import { 
    groupedOs,
    jsonData,
    updateLocalStorage
} from '../../context.js';

import { createSelectOsDropdown } from './selectOsDropDown.js'

import { createOsDrag } from './selectOsDragAndDrop.js'

function createSelectOsModalBody(itemRow) {
    const selectOsModalBody = document.createElement('div');
    selectOsModalBody.className = 'selectOsModalBody';

    const selectOsBodyLeft = createSelectOsBodyLeft(itemRow.id)
    selectOsModalBody.appendChild(selectOsBodyLeft)

    const selectOsBodyRight = createSectionBodyRight(itemRow.id)
    selectOsModalBody.appendChild(selectOsBodyRight)

    return selectOsModalBody;
}

function createSelectOsBodyLeft(itemRowId) {
    const selectOsBodyLeft = document.createElement('div')
    selectOsBodyLeft.className = 'selectOsBodyLeft';
    selectOsBodyLeft.classList.add('selectOsContainer')

    const filteredMainArrays = {};
    for (const mainArrayName in groupedOs) {
        const mainArray = groupedOs[mainArrayName];
        const isExcluded = mainArray.some((subArray) => subArray.MenuItemId == itemRowId);
        if (!isExcluded) {
            filteredMainArrays[mainArrayName] = mainArray;
        }
    }

    const filteredGroup = Object.values(filteredMainArrays).flatMap(group => group[0]);

    filteredGroup.forEach((osGroup, index) => {
        const selectOsRowHeader = createSelectOsRowLeft(osGroup)

        if (index % 2 === 0) {
            selectOsRowHeader.classList.add('odd');
        } else {
            selectOsRowHeader.classList.add('even');
        }

        selectOsBodyLeft.appendChild(selectOsRowHeader)
    })

    return selectOsBodyLeft
}

function createSectionBodyRight(itemRowId) {
    const selectOsBodyRight = document.createElement('div');
    selectOsBodyRight.className = 'selectOsBodyRight';
    selectOsBodyRight.classList.add('selectOsContainer')

    const foundItem = jsonData.MenuSections.flatMap(i => i.MenuItems).find(i => i.MenuItemId == itemRowId)

    foundItem.MenuItemOptionSets.forEach((menuOs, index) => {
        const selectOsRowHeader = createSelectOsRowRight(menuOs, selectOsBodyRight, foundItem);

        if (index % 2 === 0) {
            selectOsRowHeader.classList.add('odd');
        } else {
            selectOsRowHeader.classList.add('even');
        }

        selectOsBodyRight.appendChild(selectOsRowHeader);
    });

    return selectOsBodyRight;
}

function createSelectOsRowRight(menuOs, selectOsBodyRight, foundItem) {
    const selectOsRowHeader = createSelectOsRow(menuOs)

    const dropAndName = selectOsRowHeader.getElementsByClassName('dropAndName')[0]
    const nameAndOsId = dropAndName.getElementsByClassName('nameAndOsId')[0]
    
    const osDrag = createOsDrag(selectOsBodyRight, selectOsRowHeader, foundItem)
    dropAndName.insertBefore(osDrag, nameAndOsId)

    // agregar el boton menos
    const deleteBtn = document.createElement('button')
    deleteBtn.style.width = '20px'
    deleteBtn.textContent = '-'

    deleteBtn.addEventListener('click', () => {
        selectOsRowHeader.parentNode.removeChild(selectOsRowHeader)
        foundItem.MenuItemOptionSets.splice(foundItem.MenuItemOptionSets.indexOf(menuOs), 1)
        menuOs.MenuItemId = null

        const selectOsBodyLeft = selectOsBodyRight.parentNode.getElementsByClassName('selectOsBodyLeft')[0]
        selectOsBodyLeft.replaceWith(createSelectOsBodyLeft(foundItem.MenuItemId))

        updateLocalStorage()
    })

    selectOsRowHeader.appendChild(deleteBtn)

    return selectOsRowHeader
}

function createSelectOsRowLeft(osGroup) {
    const selectOsRowHeader = createSelectOsRow(osGroup)

    const addBtn = document.createElement('button')
    addBtn.style.width = '20px'
    addBtn.textContent = '+'

    addBtn.addEventListener('click', () => {
        
    })

    selectOsRowHeader.appendChild(addBtn)

    return selectOsRowHeader
}

function createSelectOsRow(menuOs) {
    const selectOsRowHeader = document.createElement('div');
    selectOsRowHeader.classList.add('selectOsRowHeader');
    selectOsRowHeader.classList.add('defaultColor');
    selectOsRowHeader.classList.add('draggable');
    selectOsRowHeader.classList.add('folded')
    selectOsRowHeader.id = menuOs.MenuItemOptionSetId

    const dropAndName = document.createElement('div')
    dropAndName.className = 'dropAndName'
    selectOsRowHeader.appendChild(dropAndName)

    const osDropDown = createSelectOsDropdown(selectOsRowHeader, menuOs)
    dropAndName.appendChild(osDropDown)

    // const osDrag = createOsDrag(selectOsBodyRight, selectOsRowHeader, foundItem)
    // dropAndName.appendChild(osDrag)

    const nameAndOsId = document.createElement('div')
    nameAndOsId.className = 'nameAndOsId'
    dropAndName.appendChild(nameAndOsId)

    const osNameHeader = createSelectOsNameHeader(menuOs)
    nameAndOsId.appendChild(osNameHeader)

    const optionSetIdPreview = createOptionSetIdPreview(menuOs)
    nameAndOsId.appendChild(optionSetIdPreview)

    const osSelectOptionContainer = createOsSelectOption(menuOs)
    selectOsRowHeader.appendChild(osSelectOptionContainer)

    return selectOsRowHeader
}

function createSelectOsNameHeader(menuOs) {
    const osNameHeader = document.createElement('p')
    osNameHeader.className = 'selectOsNameHeader'
    osNameHeader.textContent = menuOs.Name
    osNameHeader.id = menuOs.groupOsId

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
    osSelectOptionContainer.classList.add('osModal')
    osSelectOptionContainer.innerHTML = `
    <p class='minSelectCount' id='${menuOs.groupOsId}'>${menuOs.MinSelectCount}</p>
    <p class='dashCountCell'> - </p>
    <p class='maxSelectCount' id='${menuOs.groupOsId}'>${menuOs.MaxSelectCount}</p>`

    return osSelectOptionContainer
}

export { createSelectOsModalBody };