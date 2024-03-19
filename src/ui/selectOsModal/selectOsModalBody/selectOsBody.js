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

import { createOsModalContainer } from '../../osModal/modalContainer.js'

import { showToolTip } from '../../toolTip.js';

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

    const MOContainer = document.createElement('div');
    MOContainer.className = 'MOContainer';
    selectOsBodyRight.appendChild(MOContainer)

    const OSContainer = document.createElement('div')
    OSContainer.className = 'OSContainer'
    selectOsBodyRight.appendChild(OSContainer)


    const foundItem = jsonData.MenuSections.flatMap(i => i.MenuItems).find(i => i.MenuItemId == itemRowId)

    foundItem.MenuItemOptionSets.forEach((menuOs) => {
        if (menuOs.IsMasterOptionSet == true) {
            const selectOsRowHeader = createSelectOsRowRight(menuOs, MOContainer, foundItem);
            MOContainer.appendChild(selectOsRowHeader);
        } else {
            const selectOsRowHeader = createSelectOsRowRight(menuOs, OSContainer, foundItem);
            OSContainer.appendChild(selectOsRowHeader);
        }
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
    
        const masterOptionSetExists = foundItem.MenuItemOptionSets.some(optionSet => optionSet.IsMasterOptionSet === true);
    
        if (os.IsMasterOptionSet == false) {                
            addOsOrMo(selectOsRowHeader, os, itemRowId, foundItem, selectOsBodyLeft)
        } else {
            if (!masterOptionSetExists) {
                foundItem.Price = 0
                const itemRow = document.getElementById(foundItem.MenuItemId);
                if (itemRow) {
                    const itemPriceCell = itemRow.querySelector('.itemPriceCell');
                    if (itemPriceCell) {
                        itemPriceCell.style.display = 'none';
                    }
                }
                addOsOrMo(selectOsRowHeader, os, itemRowId, foundItem, selectOsBodyLeft)
            } else {
                showToolTip(addBtn, 'Only one Master Option is allowed per Item')
            }
        }
    }) 

    btnAndSelectOption.appendChild(addBtn)
    btnAndSelectOption.appendChild(selectOptionContainer)

    selectOsRowHeader.appendChild(btnAndSelectOption)

    return selectOsRowHeader
}

function addOsOrMo(selectOsRowHeader, os, itemRowId, foundItem, selectOsBodyLeft) {
    selectOsRowHeader.parentNode.removeChild(selectOsRowHeader);
    
    const newOs = JSON.parse(JSON.stringify(os));

    deleteItemlessOs(newOs)

    newOs.MenuItemId = foundItem.MenuItemId

    const newOptionSetId = getRandomInt();
    newOs.MenuItemOptionSetId = newOptionSetId;

    newOs.MenuItemOptionSetItems.forEach(option => {
        const newOptionId = getRandomInt();
        option.MenuItemOptionSetItemId = newOptionId
    })
    
    // Filter if foundItem has some MenuItemOptionSets that have its key IsMasterOptionSet == true
    const hasMasterOptionSet = foundItem.MenuItemOptionSets.some(optionSet => optionSet.IsMasterOptionSet);

    if (hasMasterOptionSet) {
        if (os.IsMasterOptionSet == true) {
            newOs.IsMasterOptionSet = true;
            newOs.DisplayOrder = -1;
            foundItem.MenuItemOptionSets.unshift(newOs);
        } else {
            const maxDisplayOrder = Math.max(...foundItem.MenuItemOptionSets.map(optionSet => optionSet.DisplayOrder));
            newOs.DisplayOrder = maxDisplayOrder + 1;
            foundItem.MenuItemOptionSets.push(newOs);
        }
    } else {
        if (os.IsMasterOptionSet == false) {
            const maxDisplayOrder = Math.max(...foundItem.MenuItemOptionSets.map(optionSet => optionSet.DisplayOrder));
            newOs.DisplayOrder = maxDisplayOrder + 1;
            foundItem.MenuItemOptionSets.push(newOs);
        } else {
            newOs.IsMasterOptionSet = true;
            newOs.DisplayOrder = -1;
            foundItem.MenuItemOptionSets.unshift(newOs);
        }
    }
    
    const selectOsBodyRight = selectOsBodyLeft.parentNode.getElementsByClassName('selectOsBodyRight')[0]
    selectOsBodyRight.replaceWith(createSelectOsBodyRight(itemRowId))

    const osContainerPreviewArray = Array.from(document.getElementsByClassName('osContainer'));
    const osContainerPreview = osContainerPreviewArray.find((p) => p.id == foundItem.MenuItemId);
    
    const newOptionRow = createOsRow(newOs, foundItem.MenuSectionId, foundItem.MenuItemId);
    
    if (newOs.IsMasterOptionSet) {
        const justMOContainer = osContainerPreview.querySelector('.justMOContainer');
        if (justMOContainer) {
            justMOContainer.appendChild(newOptionRow);
        }
    } else {
        const justOSContainer = osContainerPreview.querySelector('.justOSContainer');
        if (justOSContainer) {
            justOSContainer.appendChild(newOptionRow);
        } 
    }
    
    groupOptionSets();
    updateLocalStorage(slotManagerInstance.currentSlot);
}

function createSelectOsRowRight(menuOs, selectOsBodyRight, foundItem) {
    const selectOsRowHeader = createSelectOsRow(menuOs)

    const dropAndName = selectOsRowHeader.getElementsByClassName('dropAndName')[0]
    const nameAndOsId = dropAndName.getElementsByClassName('nameAndOsId')[0]

    const optionSetIdPreview = createOptionSetIdPreview(menuOs)
    nameAndOsId.appendChild(optionSetIdPreview)

    const osDrag = createOsDrag(selectOsBodyRight, selectOsRowHeader, foundItem)
    dropAndName.insertBefore(osDrag, nameAndOsId)

    if (menuOs.IsMasterOptionSet == true) {
        osDrag.style.display = 'none'
    }

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

        const masterOptionSetExists = foundItem.MenuItemOptionSets.some(optionSet => optionSet.IsMasterOptionSet === true);
        if (masterOptionSetExists) {
            const itemRow = document.getElementById(foundItem.MenuItemId);
            if (itemRow) {
                const itemPriceCell = itemRow.querySelector('.itemPriceCell');
                if (itemPriceCell) {
                    itemPriceCell.style.display = 'flex';
                }
            }
        }

        selectOsRowHeader.parentNode.removeChild(selectOsRowHeader)

        foundItem.MenuItemOptionSets.splice(foundItem.MenuItemOptionSets.indexOf(menuOs), 1)

        if (groupedOs[menuOs.groupOsId].length === 1) {
            delete groupedOs[menuOs.groupOsId]
            addItemlessOs(menuOs)
        }

        const parentContainer = selectOsRowHeader.closest('.MOContainer, .OSContainer'); // Get the parent container
        if (parentContainer) {
            parentContainer.removeChild(selectOsRowHeader); // Remove selectOsRowHeader from parent container
        }

        const selectOsBodyLeft = selectOsBodyRight.closest('.selectOsModalBody').querySelector('.selectOsBodyLeft');
        selectOsBodyLeft.replaceWith(createSelectOsBodyLeft(foundItem.MenuItemId));

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

    selectOsRowHeader.style.backgroundColor = menuOs.groupColor;

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

    const MOContainer = createMOContainer(menuOs)
    selectOsRowHeader.appendChild(MOContainer)

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

    osNameHeader.addEventListener('click', () => {
        const osModalContainer = createOsModalContainer(menuOs)
        osModalContainer.style.display = 'block';
        setTimeout(() => {
            osModalContainer.classList.add('show');
        }, 10);

        const selectOsModal = document.querySelector('.selectOsModal')

        if (selectOsModal) {
            selectOsModal.style.opacity = 0
            setTimeout(() => {
                const existingSelectOsModal = document.querySelector('.selectOsModal')
                if (existingSelectOsModal) {
                    existingSelectOsModal.remove()
                }
                selectOsModal.style.display = 'none';
            }, 200);
        }
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
    osSelectOptionContainer.classList.add('osModal')
    osSelectOptionContainer.innerHTML = `
    <p class='minSelectCount'>${menuOs.MinSelectCount}</p>
    <p class='dashCountCell'> - </p>
    <p class='maxSelectCount'>${menuOs.MaxSelectCount}</p>`

    return osSelectOptionContainer
}

export { createSelectOsModalBody };