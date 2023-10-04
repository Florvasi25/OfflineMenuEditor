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

import {
    createOptionMoMCell
} from './optionMoM.js'

import {
    createOptionPriceCell
} from './optionPrice.js'

import {
    createOptionTaxCell
} from './optionTax.js'

import {
    createOptionButtonsCell
} from './optionButtonContainer.js'

function createOsModalBody(sectionId, itemId, osId) {
    const optionsBodyContainer = document.createElement('div')
    optionsBodyContainer.className = 'optionsBodyContainer'

    const topButtonsCell = createTopButtonsCell()
    optionsBodyContainer.appendChild(topButtonsCell)

    createOptionRow(optionsBodyContainer, sectionId, itemId, osId)
    setDragListeners(optionsBodyContainer, sectionId, itemId, osId)
    
    return optionsBodyContainer
}

function createOptionRow(optionsBodyContainer, sectionId, itemId, osId) {
    const {itemIndex, sectionIndex, osIndex} = getOsIndex(sectionId, itemId, osId)
    const menuOptions = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems;

    menuOptions.forEach((menuOption, index) => {
        const optionRow = createOption(optionsBodyContainer, menuOption, sectionId, itemId, osId)

        if (index % 2 === 0) {
            optionRow.classList.add('odd');
        } else {
            optionRow.classList.add('even');
        }

        optionsBodyContainer.appendChild(optionRow);
    });

}

function createTopButtonsCell() {
    const topButtonsCell = document.createElement('div')
    topButtonsCell.className = 'topButtonsCell'

    return topButtonsCell
}

function createOption(optionsBodyContainer, menuOption, sectionId, itemId, osId) {
    const optionRow = document.createElement('div')
    optionRow.classList.add('optionRow');
    optionRow.classList.add('draggable');
    optionRow.id = menuOption.MenuItemOptionSetItemId

    const dragOptionCell = createOptionDragCell(optionsBodyContainer, optionRow)
    optionRow.appendChild(dragOptionCell)

    const nameAndMoM = document.createElement('div')
    nameAndMoM.className = 'nameAndMoM'

    const optionNameCell = createOptionNameCell(menuOption, sectionId, itemId, osId)
    nameAndMoM.appendChild(optionNameCell)

    const optionMoMCell = createOptionMoMCell(menuOption, sectionId, itemId, osId)
    nameAndMoM.appendChild(optionMoMCell)

    optionRow.appendChild(nameAndMoM)
    
    const optionPrice = createOptionPriceCell(menuOption, sectionId, itemId, osId)
    optionRow.appendChild(optionPrice)

    const optionTax = createOptionTaxCell(menuOption, jsonData)
    optionRow.appendChild(optionTax)

    const optionButtonsCell = createOptionButtonsCell(optionRow, menuOption.MenuItemOptionSetItemId, sectionId, itemId, osId, optionsBodyContainer, menuOption)
    optionRow.appendChild(optionButtonsCell)
    
    return optionRow
}

export { 
    createOsModalBody,
    createOption
}