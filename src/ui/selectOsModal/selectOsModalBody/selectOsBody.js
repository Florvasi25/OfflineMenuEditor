import { 
    groupedOs,
    jsonData
} from '../../context.js';

import { createSelectOsDropdown } from './selectOsDropDown.js'

import {
    createOsDrag,
    setDragListeners
} from './selectOsDragAndDrop.js'

function createSelectOsModalBody(itemRow) {
    const selectOsModalBody = document.createElement('div');
    selectOsModalBody.className = 'selectOsModalBody';

    const selectOsBodyLeft = createSelectOsBodyLeft(itemRow)
    selectOsModalBody.appendChild(selectOsBodyLeft)

    const selectOsBodyRight = createSectionBodyRight(itemRow)
    selectOsModalBody.appendChild(selectOsBodyRight)

    setDragListeners(selectOsBodyRight)

    return selectOsModalBody;
}

function createSelectOsBodyLeft(itemRow) {
    const selectOsBodyLeft = document.createElement('div')
    selectOsBodyLeft.className = 'selectOsBodyLeft';
    selectOsBodyLeft.classList.add('selectOsContainer')


    const filteredMainArrays = {};
    for (const mainArrayName in groupedOs) {
        const mainArray = groupedOs[mainArrayName];
        const isExcluded = mainArray.some((subArray) => subArray.MenuItemId == itemRow.id);
        if (!isExcluded) {
            filteredMainArrays[mainArrayName] = mainArray;
        }
    }

    const filteredGroup = Object.values(filteredMainArrays).flatMap(group => group[0]);

    filteredGroup.forEach((osGroup, index) => {
        const selectOsRowHeader = createSelectOsRow(osGroup)

        if (index % 2 === 0) {
            selectOsRowHeader.classList.add('odd');
        } else {
            selectOsRowHeader.classList.add('even');
        }

        selectOsBodyLeft.appendChild(selectOsRowHeader)
    })

    return selectOsBodyLeft
}

function createSectionBodyRight(itemRow) {
    const selectOsBodyRight = document.createElement('div');
    selectOsBodyRight.className = 'selectOsBodyRight';
    selectOsBodyRight.classList.add('selectOsContainer')

    const foundItem = jsonData.MenuSections.flatMap(i => i.MenuItems).find(i => i.MenuItemId == itemRow.id)

    foundItem.MenuItemOptionSets.forEach((menuOs, index) => {
        const selectOsRowHeader = createSelectOsRow(menuOs, selectOsBodyRight, foundItem);

        if (index % 2 === 0) {
            selectOsRowHeader.classList.add('odd');
        } else {
            selectOsRowHeader.classList.add('even');
        }

        selectOsBodyRight.appendChild(selectOsRowHeader);
    });

    return selectOsBodyRight;
}


function createSelectOsRow(menuOs, selectOsBodyRight, foundItem) {
    const selectOsRowHeader = document.createElement('div');
    selectOsRowHeader.classList.add('selectOsRowHeader');
    selectOsRowHeader.classList.add('defaultColor');
    selectOsRowHeader.classList.add('draggable');
    selectOsRowHeader.classList.add('folded')
    selectOsRowHeader.id = menuOs.groupOsId

    const dropAndName = document.createElement('div')
    dropAndName.className = 'dropAndName'
    selectOsRowHeader.appendChild(dropAndName)

    const osDropDown = createSelectOsDropdown(selectOsRowHeader, menuOs)
    dropAndName.appendChild(osDropDown)

    const osDrag = createOsDrag(selectOsBodyRight, selectOsRowHeader, foundItem)
    dropAndName.appendChild(osDrag)

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