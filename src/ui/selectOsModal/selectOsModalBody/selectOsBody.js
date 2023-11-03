import { 
    groupedOs,
    jsonData,
    updateLocalStorage,
    // groupOptionSets,
    getUniqueRandomInt,
    getLocalStorageOptionSetIDs
} from '../../context.js';

import { createSelectOsDropdown } from './selectOsDropDown.js'

import { createOsDrag } from './selectOsDragAndDrop.js'

import {
    createOsRow
} from '../../optionSet/osHeaderContainer.js'

function createSelectOsModalBody(itemRow) {
    const selectOsModalBody = document.createElement('div');
    selectOsModalBody.className = 'selectOsModalBody';

    const selectOsBodyLeft = createSelectOsBodyLeft(itemRow.id)
    selectOsModalBody.appendChild(selectOsBodyLeft)

    const selectOsBodyRight = createSelectOsBodyRight(itemRow.id)
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
        const selectOsRowHeader = createSelectOsRowLeft(osGroup, selectOsBodyLeft, itemRowId)

        if (index % 2 === 0) {
            selectOsRowHeader.classList.add('odd');
        } else {
            selectOsRowHeader.classList.add('even');
        }

        selectOsBodyLeft.appendChild(selectOsRowHeader)
    })

    return selectOsBodyLeft
}

function createSelectOsBodyRight(itemRowId) {
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

function createSelectOsRowLeft(osGroup, selectOsBodyLeft, itemRowId) {
    const selectOsRowHeader = createSelectOsRow(osGroup)

    const btnAndSelectOption = document.createElement('div')
    btnAndSelectOption.className = 'btnAndSelectOption'
    
    const selectOptionContainer = selectOsRowHeader.getElementsByClassName('osSelectOptionContainer')[0]

    const addBtn = document.createElement('button')
    addBtn.className = 'addOrDeleteBtn'
    addBtn.textContent = '+'

    const foundItem = jsonData.MenuSections.flatMap(i => i.MenuItems).find(i => i.MenuItemId == itemRowId)

    addBtn.addEventListener('click', () => {
        selectOsRowHeader.parentNode.removeChild(selectOsRowHeader)

        const rows = Array.from(selectOsBodyLeft.querySelectorAll(".selectOsRowHeader"));
    
        rows.forEach((row, index) => {
            if (index % 2 === 0) {
                row.classList.remove('even');
                row.classList.add('odd');
            } else {
                row.classList.remove('odd');
                row.classList.add('even');
            }
        });

        const newOs = JSON.parse(JSON.stringify(osGroup));
        
        newOs.MenuItemId = foundItem.MenuItemId

        const optionSetsIds =  getLocalStorageOptionSetIDs();
        const newOptionSetId = getUniqueRandomInt(optionSetsIds);
        newOs.MenuItemOptionSetId = newOptionSetId;
        
        foundItem.MenuItemOptionSets.push(newOs)

        const selectOsBodyRight = selectOsBodyLeft.parentNode.getElementsByClassName('selectOsBodyRight')[0]
        selectOsBodyRight.replaceWith(createSelectOsBodyRight(itemRowId))

        const osContainerPreviewArray = Array.from(document.getElementsByClassName('osContainer'));
        const osContainerPreview = osContainerPreviewArray.find((p) => p.id == foundItem.MenuItemId);
         
        const newOptionRow = createOsRow(newOs, foundItem.MenuSectionId, foundItem.MenuItemId)
        osContainerPreview.appendChild(newOptionRow);

        const osRowHeadersPreview = Array.from(document.getElementsByClassName('osRowHeader'))
        
        osRowHeadersPreview.forEach((osRowHeaderPreview, index) => {
            if (index % 2 === 0) {
                osRowHeaderPreview.classList.remove('even');
                osRowHeaderPreview.classList.add('odd');
            } else {
                osRowHeaderPreview.classList.remove('odd');
                osRowHeaderPreview.classList.add('even');
            }
        });

        // groupOptionSets()
        updateLocalStorage()
    })

    btnAndSelectOption.appendChild(addBtn)
    btnAndSelectOption.appendChild(selectOptionContainer)

    selectOsRowHeader.appendChild(btnAndSelectOption)

    return selectOsRowHeader
}

function createSelectOsRowRight(menuOs, selectOsBodyRight, foundItem) {
    const selectOsRowHeader = createSelectOsRow(menuOs)

    const dropAndName = selectOsRowHeader.getElementsByClassName('dropAndName')[0]
    const nameAndOsId = dropAndName.getElementsByClassName('nameAndOsId')[0]

    const optionSetIdPreview = createOptionSetIdPreview(menuOs)
    nameAndOsId.appendChild(optionSetIdPreview)

    const osDrag = createOsDrag(selectOsBodyRight, selectOsRowHeader, foundItem)
    dropAndName.insertBefore(osDrag, nameAndOsId)

    const btnAndSelectOption = document.createElement('div')
    btnAndSelectOption.className = 'btnAndSelectOption'
    
    const selectOptionContainer = selectOsRowHeader.getElementsByClassName('osSelectOptionContainer')[0]

    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'addOrDeleteBtn'
    deleteBtn.textContent = '-'

    deleteBtn.addEventListener('click', () => {
        selectOsRowHeader.parentNode.removeChild(selectOsRowHeader)

        const rows = Array.from(selectOsBodyRight.querySelectorAll(".selectOsRowHeader"));
    
        rows.forEach((row, index) => {
            if (index % 2 === 0) {
                row.classList.remove('even');
                row.classList.add('odd');
            } else {
                row.classList.remove('odd');
                row.classList.add('even');
            }
        });

        foundItem.MenuItemOptionSets.splice(foundItem.MenuItemOptionSets.indexOf(menuOs), 1)
        menuOs.MenuItemId = null

        const selectOsBodyLeft = selectOsBodyRight.parentNode.getElementsByClassName('selectOsBodyLeft')[0]
        selectOsBodyLeft.replaceWith(createSelectOsBodyLeft(foundItem.MenuItemId))

        const osRowHeaderPreviewArray = Array.from(document.getElementsByClassName('osRowHeader'));
        const osRowOptionPreview = osRowHeaderPreviewArray.find((p) => p.id == menuOs.MenuItemOptionSetId);
        console.log('osRowOptionPreview', osRowOptionPreview);
         
        osRowOptionPreview.remove();

        const osRowHeadersPreview = Array.from(document.getElementsByClassName('osRowHeader'))
        
        osRowHeadersPreview.forEach((osRowHeaderPreview, index) => {
            if (index % 2 === 0) {
                osRowHeaderPreview.classList.remove('even');
                osRowHeaderPreview.classList.add('odd');
            } else {
                osRowHeaderPreview.classList.remove('odd');
                osRowHeaderPreview.classList.add('even');
            }
        });

        updateLocalStorage()
    })

    btnAndSelectOption.appendChild(deleteBtn)
    btnAndSelectOption.appendChild(selectOptionContainer)

    selectOsRowHeader.appendChild(btnAndSelectOption)

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

    const nameAndOsId = document.createElement('div')
    nameAndOsId.className = 'nameAndOsId'
    dropAndName.appendChild(nameAndOsId)

    const osNameHeader = createSelectOsNameHeader(menuOs)
    nameAndOsId.appendChild(osNameHeader)

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