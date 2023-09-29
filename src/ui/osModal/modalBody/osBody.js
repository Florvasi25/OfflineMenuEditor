import { 
    jsonData,
    getOsIndex
} from '../../context.js'

import { 
    createOptionNameCell
} from './optionName.js'

function createOsModalBody(sectionId, itemId, osId) {
    const optionsContainer = document.createElement('div')
    optionsContainer.className = 'osModalBody'

    const topButtonsCell = createTopButtonsCell()
    optionsContainer.appendChild(topButtonsCell)

    createOptions(optionsContainer, sectionId, itemId, osId)
    
    return optionsContainer
}

function createOptions(optionsContainer, sectionId, itemId, osId) {
    const {itemIndex, sectionIndex, osIndex} = getOsIndex(sectionId, itemId, osId)
    const menuOptions = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems;

    menuOptions.forEach(menuOption => {
        const optionRow = createOptionRow(menuOption, sectionId, itemId, osId)
        optionsContainer.appendChild(optionRow);
    });
    console.log(menuOptions);
}

function createTopButtonsCell() {
    const topButtonsCell = document.createElement('div')
    topButtonsCell.className = 'topButtonsCell'

    return topButtonsCell
}

function createOptionRow(menuOption, sectionId, itemId, osId) {
    const optionRow = document.createElement('div')
    optionRow.classList.add('optionRow');
    optionRow.classList.add('draggable');
    optionRow.id = menuOption.MenuItemOptionSetItemId
    // optionRow.textContent = menuOption.Name

    const dragOptionCell = createOptionDragCell()
    optionRow.appendChild(dragOptionCell)

    const optionName = createOptionNameCell(menuOption, sectionId, itemId, osId)
    optionName.className = 'optionName'
    optionRow.appendChild(optionName)

    return optionRow
}

function createOptionDragCell() {
    const optionDragCell = document.createElement('div')
    optionDragCell.className = 'sectionDragCell'
    const optionDragImg = document.createElement('img')
    optionDragImg.src = '../../assets/dragIcon.svg'
    optionDragImg.className = 'sectionDragImg'
    optionDragCell.appendChild(optionDragImg)

    return optionDragCell
}

export { createOsModalBody }