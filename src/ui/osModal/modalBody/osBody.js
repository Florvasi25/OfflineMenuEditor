import { 
    jsonData,
    getOsIndex
} from '../../context.js'

import { 
    createOptionNameCell
} from './optionName.js'

import {
    createOptionDragCell,
    setDragListeners
} from './optionDragAndDrop.js'

function createOsModalBody(sectionId, itemId, osId) {
    const optionsContainer = document.createElement('div')
    optionsContainer.className = 'osModalBody'

    const topButtonsCell = createTopButtonsCell()
    optionsContainer.appendChild(topButtonsCell)

    createOptions(optionsContainer, sectionId, itemId, osId)
    setDragListeners(optionsContainer, sectionId, itemId, osId)
    
    return optionsContainer
}

function createOptions(optionsContainer, sectionId, itemId, osId) {
    const {itemIndex, sectionIndex, osIndex} = getOsIndex(sectionId, itemId, osId)
    const menuOptions = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems;

    menuOptions.forEach((menuOption, index) => {
        const optionRow = createOptionRow(optionsContainer, menuOption, sectionId, itemId, osId)

        if (index % 2 === 0) {
            optionRow.classList.add('odd');
        } else {
            optionRow.classList.add('even');
        }

        optionsContainer.appendChild(optionRow);
    });

}

function createTopButtonsCell() {
    const topButtonsCell = document.createElement('div')
    topButtonsCell.className = 'topButtonsCell'

    return topButtonsCell
}

function createOptionRow(optionsContainer, menuOption, sectionId, itemId, osId) {
    const optionRow = document.createElement('div')
    optionRow.classList.add('optionRow');
    optionRow.classList.add('draggable');
    optionRow.id = menuOption.MenuItemOptionSetItemId

    const dragOptionCell = createOptionDragCell(optionsContainer, optionRow)
    optionRow.appendChild(dragOptionCell)

    const optionName = createOptionNameCell(menuOption, sectionId, itemId, osId)
    optionRow.appendChild(optionName)

    return optionRow
}

export { createOsModalBody }