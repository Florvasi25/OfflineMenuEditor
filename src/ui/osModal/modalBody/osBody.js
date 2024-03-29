import { 
    jsonData
} from '../../context.js'

import {
    createOptionDragCell,
    setDragListeners
} from './optionDragAndDrop.js'

import { createOptionNameCell } from './optionName.js'

import { createOptionMoMCell } from './optionMoM.js'

import { createOptionReturnCell } from './optionReturn.js'

import { createOptionPriceCell } from './optionPrice.js'

import { createOptionTaxCell } from './optionTax.js'

import { createOptionButtonsCell } from './optionButtonContainer.js'

import { createOptionButton } from './optionAddNew.js'

import { createOptionSetListButton } from './optionList.js'

import { createSameMoMButton } from './optionSameMoM.js'

import { createSamePriceButton } from './optionSamePrice.js'

function createOsModalBody(menuOs) {
    const optionsBodyContainer = document.createElement('div')
    optionsBodyContainer.className = 'optionsBodyContainer'
    
    const optionRowsContainer = document.createElement('div')
    optionRowsContainer.className = 'optionRowsContainer'
    optionRowsContainer.id = menuOs.MenuItemOptionSetId

    const topButtonsCell = createTopButtonsCell(menuOs, optionRowsContainer)
    optionsBodyContainer.appendChild(topButtonsCell)

    createOptionRow(optionRowsContainer, menuOs)
    setDragListeners(optionRowsContainer, menuOs)
    
    optionsBodyContainer.appendChild(optionRowsContainer)
    
    const newOptionBtnContainer = createNewOptionBtnContainer(optionRowsContainer, menuOs)
    optionsBodyContainer.appendChild(newOptionBtnContainer)

    return optionsBodyContainer
}

function createNewOptionBtnContainer(optionRowsContainer, menuOs) {
    const newOptionBtnContainer = document.createElement('div')
    newOptionBtnContainer.className = 'newOptionBtnContainer'
    const newOptionButton = createOptionButton(optionRowsContainer, menuOs)
    newOptionBtnContainer.appendChild(newOptionButton)

    return newOptionBtnContainer
}

function createOptionRow(optionRowsContainer, menuOs) {

    menuOs.MenuItemOptionSetItems.forEach((menuOption, index) => {
        const optionRow = createOption(optionRowsContainer, menuOs, menuOption)

        if (index % 2 === 0) {
            optionRow.classList.add('odd');
        } else {
            optionRow.classList.add('even');
        }

        optionRowsContainer.appendChild(optionRow);
    });
}

function createTopButtonsCell(menuOs, optionRowsContainer) {
    const topButtonsCell = document.createElement('div')
    topButtonsCell.className = 'topButtonsCell'

    const osListContainer = document.createElement('div')
    osListContainer.className = 'osListContainer'

    const optionSetListButton = createOptionSetListButton(menuOs, optionRowsContainer)
    osListContainer.appendChild(optionSetListButton)
    topButtonsCell.appendChild(osListContainer)

    createSameMoMButton(menuOs, topButtonsCell)

    createSamePriceButton(menuOs, topButtonsCell)

    return topButtonsCell
}

function createOption(optionRowsContainer, menuOs, menuOption) {
    const optionRow = document.createElement('div')
    optionRow.classList.add('optionRow');
    optionRow.classList.add('draggable');
    optionRow.id = menuOption.MenuItemOptionSetItemId

    const dragOptionCell = createOptionDragCell(optionRowsContainer, optionRow)
    optionRow.appendChild(dragOptionCell)

    const nameAndMoM = document.createElement('div')
    nameAndMoM.className = 'nameAndMoM'

    const optionNameCell = createOptionNameCell(menuOption, menuOs)
    nameAndMoM.appendChild(optionNameCell)

    const optionMoMCell = createOptionMoMCell(menuOption, menuOs)
    nameAndMoM.appendChild(optionMoMCell)

    optionRow.appendChild(nameAndMoM)
    
    const optionPrice = createOptionPriceCell(menuOption, menuOs)
    optionRow.appendChild(optionPrice)
    
    const optionTax = createOptionTaxCell(menuOption, jsonData)
    optionRow.appendChild(optionTax)
    
    const optionButtonsCell = createOptionButtonsCell(optionRow, menuOs, optionRowsContainer, menuOption)
    optionRow.appendChild(optionButtonsCell)
    
    const optionReturnCell = createOptionReturnCell(menuOption, menuOs)
    optionRow.appendChild(optionReturnCell)
    
    return optionRow
}

export { 
    createOsModalBody,
    createOption
}