import { 
    jsonData,
    getOsIndex
} from '../../context.js'

import {
    createOptionDragCell,
    setDragListeners
} from './optionDragAndDrop.js'

import { createOptionNameCell } from './optionName.js'

import { createOptionMoMCell } from './optionMoM.js'

import { createOptionPriceCell } from './optionPrice.js'

import { createOptionTaxCell } from './optionTax.js'

import { createOptionButtonsCell } from './optionButtonContainer.js'

import { createOptionButton } from './optionAddNew.js'

function createOsModalBody(menuOs, sectionId, itemId, osId) {
    const optionsBodyContainer = document.createElement('div')
    optionsBodyContainer.className = 'optionsBodyContainer'
    const optionRowsContainer = document.createElement('div')
    optionRowsContainer.className = 'optionRowsContainer'
    optionRowsContainer.id = osId

    const topButtonsCell = createTopButtonsCell()
    optionsBodyContainer.appendChild(topButtonsCell)
    
    createOptionRow(optionRowsContainer, menuOs, sectionId, itemId, osId)
    setDragListeners(optionRowsContainer, sectionId, itemId, osId)
    
    optionsBodyContainer.appendChild(optionRowsContainer)
    
    const newOptionBtnContainer = createNewOptionBtnContainer(optionRowsContainer, sectionId, itemId, osId)
    optionsBodyContainer.appendChild(newOptionBtnContainer)

    return optionsBodyContainer
}

function createNewOptionBtnContainer(optionRowsContainer, sectionId, itemId, osId) {
    const newOptionBtnContainer = document.createElement('div')
    newOptionBtnContainer.className = 'newOptionBtnContainer'
    const newOptionButton = createOptionButton(optionRowsContainer, sectionId, itemId, osId)
    newOptionBtnContainer.appendChild(newOptionButton)

    return newOptionBtnContainer
}

function createOptionRow(optionRowsContainer, menuOs, sectionId, itemId, osId) {
    const {itemIndex, sectionIndex, osIndex} = getOsIndex(sectionId, itemId, osId)
    const menuOptions = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems;

    menuOptions.forEach((menuOption, index) => {
        const optionRow = createOption(optionRowsContainer, menuOs, menuOption, sectionId, itemId, osId)

        if (index % 2 === 0) {
            optionRow.classList.add('odd');
        } else {
            optionRow.classList.add('even');
        }

        optionRowsContainer.appendChild(optionRow);
    });
}

function createTopButtonsCell() {
    const topButtonsCell = document.createElement('div')
    topButtonsCell.className = 'topButtonsCell'

    return topButtonsCell
}

function createOption(optionRowsContainer, menuOs, menuOption, sectionId, itemId, osId) {
    const optionRow = document.createElement('div')
    optionRow.classList.add('optionRow');
    optionRow.classList.add('draggable');
    optionRow.id = menuOption.groupOptionId

    const dragOptionCell = createOptionDragCell(optionRowsContainer, optionRow)
    optionRow.appendChild(dragOptionCell)

    const nameAndMoM = document.createElement('div')
    nameAndMoM.className = 'nameAndMoM'

    const optionNameCell = createOptionNameCell(menuOption, menuOs)
    nameAndMoM.appendChild(optionNameCell)

    const optionMoMCell = createOptionMoMCell(menuOption, sectionId, itemId, osId)
    nameAndMoM.appendChild(optionMoMCell)

    optionRow.appendChild(nameAndMoM)
    
    const optionPrice = createOptionPriceCell(menuOption, menuOs)
    optionRow.appendChild(optionPrice)

    const optionTax = createOptionTaxCell(menuOption, jsonData)
    optionRow.appendChild(optionTax)

    const optionButtonsCell = createOptionButtonsCell(optionRow, menuOption.MenuItemOptionSetItemId, sectionId, itemId, osId, optionRowsContainer, menuOption)
    optionRow.appendChild(optionButtonsCell)
    
    return optionRow
}

export { 
    createOsModalBody,
    createOption
}