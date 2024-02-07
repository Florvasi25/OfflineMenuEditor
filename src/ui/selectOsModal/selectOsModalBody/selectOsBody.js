import {
    groupedOs,
    jsonData,
    updateLocalStorage,
    groupOptionSets,
    getRandomInt,
    itemlessOs,
    deleteItemlessOs,
    addItemlessOs,
} from '../../context.js';

import { createSelectOsDropdown } from './selectOsDropDown.js'

import { createOsDrag } from './selectOsDragAndDrop.js'

import {
    createOsRow
} from '../../optionSet/osHeaderContainer.js'

import { slotManagerInstance } from '../../mainContainer.js';

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
    selectOsBodyLeft.classList.add('selectOsContainer');

    const foundItem = jsonData.MenuSections.flatMap(i => i.MenuItems).find(i => i.MenuItemId == itemRowId)
    const menuOptionSetsGroupIds = foundItem.MenuItemOptionSets.map((os) => os.groupOsId);

    // get entries from groupedOs where key not in menuOptionSetsGroupIds
    const filteredMainArrays = Object.fromEntries(Object.entries(groupedOs).filter(
        ([key]) => !(menuOptionSetsGroupIds.includes(key))
    ));

    const filteredGroup = Object.values(filteredMainArrays).flatMap(group => group[0]);

    const searchOsInput = searchOs(selectOsBodyLeft)
    selectOsBodyLeft.appendChild(searchOsInput)

    filteredGroup.forEach(os => {
        const selectOsRowHeader = createSelectOsRowLeft(os, selectOsBodyLeft, itemRowId)

        selectOsBodyLeft.appendChild(selectOsRowHeader)
    })

    itemlessOs.forEach(os => {
        const selectOsRowHeader = createSelectOsRowLeft(os, selectOsBodyLeft, itemRowId)

        selectOsBodyLeft.appendChild(selectOsRowHeader)
    })

    const rows = Array.from(selectOsBodyLeft.querySelectorAll('.selectOsRowHeader'));

    rows.sort((a, b) => {
        const nameA = a.querySelector('.selectOsNameHeader').textContent.toUpperCase();
        const nameB = b.querySelector('.selectOsNameHeader').textContent.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    rows.forEach(row => {
        selectOsBodyLeft.appendChild(row);
    });

    selectOsBodyLeft.childNodes.forEach((selectOsRowHeader, index) => {
        if (index % 2 === 0) {
            selectOsRowHeader.classList.add('odd');
        } else {
            selectOsRowHeader.classList.add('even');
        }
    })

    return selectOsBodyLeft
}

function createSelectOsBodyRight(itemRowId) {
    const selectOsBodyRight = document.createElement('div');
    selectOsBodyRight.className = 'selectOsBodyRight';
    selectOsBodyRight.classList.add('selectOsContainer')

    const osInThisItem = document.createElement('div')
    osInThisItem.className = 'osInThisItem'
    osInThisItem.textContent = 'OS in this item:'

    selectOsBodyRight.appendChild(osInThisItem)

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

function createSelectOsRowLeft(os, selectOsBodyLeft, itemRowId) {
    const selectOsRowHeader = createSelectOsRow(os)

    const btnAndSelectOption = document.createElement('div')
    btnAndSelectOption.className = 'btnAndSelectOption'

    const selectOptionContainer = selectOsRowHeader.getElementsByClassName('osSelectOptionContainer')[0]

    const addBtn = document.createElement('button')
    addBtn.className = 'addOrDeleteBtn'
    addBtn.textContent = '+'

    const foundItem = jsonData.MenuSections.flatMap(i => i.MenuItems).find(i => i.MenuItemId == itemRowId)

    addBtn.addEventListener('click', () => {
        if (selectOsRowHeader.classList.contains('expanded')) {
            let option = selectOsRowHeader.nextElementSibling;
            if (option.tagName == 'DIV' && option.classList.contains('osOptionContainer')) {
                option.remove();
            }
        }

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

        const newOs = JSON.parse(JSON.stringify(os));

        deleteItemlessOs(newOs)

        newOs.MenuItemId = foundItem.MenuItemId

        const newOptionSetId = getRandomInt();
        newOs.MenuItemOptionSetId = newOptionSetId;

        newOs.MenuItemOptionSetItems.forEach(option => {
            const newOptionId = getRandomInt();
            option.MenuItemOptionSetItemId = newOptionId
        })

        newOs.DisplayOrder = foundItem.MenuItemOptionSets.length

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

        groupOptionSets();
        updateLocalStorage(slotManagerInstance.currentSlot);
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
        if (selectOsRowHeader.classList.contains('expanded')) {
            let option = selectOsRowHeader.nextElementSibling;
            if (option.tagName == 'DIV' && option.classList.contains('osOptionContainer')) {
                option.remove();
            }
        }

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

        if (groupedOs[menuOs.groupOsId].length === 1) {
            delete groupedOs[menuOs.groupOsId]
            addItemlessOs(menuOs)
        }

        const selectOsBodyLeft = selectOsBodyRight.parentNode.getElementsByClassName('selectOsBodyLeft')[0]
        selectOsBodyLeft.replaceWith(createSelectOsBodyLeft(foundItem.MenuItemId))

        const osRowHeaderPreviewArray = Array.from(document.getElementsByClassName('osRowHeader'));
        const osRowOptionPreview = osRowHeaderPreviewArray.find((p) => p.id == menuOs.MenuItemOptionSetId);

        if (osRowOptionPreview.classList.contains('expanded')) {
            let option = osRowOptionPreview.nextElementSibling;
            if (option.tagName === 'DIV' && option.classList.contains('optionContainer')) {
                option.remove();
            }
        }

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

        groupOptionSets();
        updateLocalStorage(slotManagerInstance.currentSlot);
    })

    btnAndSelectOption.appendChild(deleteBtn)
    btnAndSelectOption.appendChild(selectOptionContainer)

    selectOsRowHeader.appendChild(btnAndSelectOption)

    return selectOsRowHeader
}

function searchOs(selectOsBodyLeft) {
    const searchOsInput = document.createElement('input');
    searchOsInput.type = 'text';
    searchOsInput.placeholder = 'Search for OS...';
    searchOsInput.id = 'searchOsInput';

    // Add event listener for input
    searchOsInput.addEventListener('input', function () {
        const searchText = searchOsInput.value.toLowerCase();
        const selectOsRowHeaders = selectOsBodyLeft.querySelectorAll('.selectOsRowHeader');
        let visibleRowCounter = 0;

        selectOsRowHeaders.forEach(selectOsRowHeader => {
            const text = selectOsRowHeader.querySelector('.selectOsNameHeader').textContent.toLowerCase();
            if (text.includes(searchText)) {
                selectOsRowHeader.style.display = 'flex';
                if (visibleRowCounter % 2 === 0) {
                    selectOsRowHeader.classList.remove('even');
                    selectOsRowHeader.classList.add('odd');
                } else {
                    selectOsRowHeader.classList.remove('odd');
                    selectOsRowHeader.classList.add('even');
                }
                visibleRowCounter++;
            } else {
                selectOsRowHeader.style.display = 'none';
            }
        });
    });
    
    return searchOsInput;
}

function createSelectOsRow(menuOs) {
    const selectOsRowHeader = document.createElement('div');
    selectOsRowHeader.classList.add('selectOsRowHeader');
    selectOsRowHeader.classList.add('defaultColor');
    selectOsRowHeader.classList.add('draggable');
    selectOsRowHeader.classList.add('folded');
    selectOsRowHeader.id = menuOs.MenuItemOptionSetId;

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
    if (menuOs.Name == null || menuOs.Name == '') {
        osNameHeader.textContent = 'Empty'
    } else {
        osNameHeader.textContent = menuOs.Name
    }

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
    <p class='minSelectCount'>${menuOs.MinSelectCount}</p>
    <p class='dashCountCell'> - </p>
    <p class='maxSelectCount'>${menuOs.MaxSelectCount}</p>`

    return osSelectOptionContainer
}

export { createSelectOsModalBody };