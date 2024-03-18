import { createOsNameCell } from './osName.js'

import {  createOsBtnsCell  } from './osButtonContainer.js'

import { createSelectOptionContainer } from './osSelectOption.js'

import { createIsMOContainer } from './isMO.js'

function createOsModalNav(menuOs) {
    const osModalNav = document.createElement('div')
    osModalNav.className = 'osModalNav'

    const { closeBtnRow, closeOsModalBtn } = createCloseBtnRow()
    osModalNav.appendChild(closeBtnRow)

    const osOptionsRow = createOsOptionsNav(menuOs)
    osModalNav.appendChild(osOptionsRow)

    const selectOptionAndMO = document.createElement('div')
    selectOptionAndMO.className = 'selectOptionAndMO'

    const selectOptionContainer = createSelectOptionContainer(menuOs)
    
    if (menuOs.IsMasterOptionSet) {
        selectOptionContainer.style.opacity = 0.50
        selectOptionContainer.style.cursor = 'not-allowed'
    } 

    const isMOContainer = createIsMOContainer(menuOs)
    
    selectOptionAndMO.appendChild(selectOptionContainer)
    selectOptionAndMO.appendChild(isMOContainer)
    osModalNav.appendChild(selectOptionAndMO)
    
    const optionSetId = document.createElement('p')
    optionSetId.textContent = menuOs.MenuItemOptionSetId
    optionSetId.className = 'optionSetId'
    osModalNav.appendChild(optionSetId)
    
    return { osModalNav, closeOsModalBtn }
}

function createOsOptionsNav(menuOs) {
    const osOptionsRow = document.createElement('div')
    osOptionsRow.className = 'osOptionsRow'

    const osNameCell = createOsNameCell(menuOs)
    osOptionsRow.appendChild(osNameCell)

    const osBtnsCell = createOsBtnsCell(menuOs)
    osOptionsRow.appendChild(osBtnsCell)

    return osOptionsRow
}

function createCloseBtnRow() {
    const closeBtnRow = document.createElement('div')
    closeBtnRow.className = 'closeBtnRow'

    const closeOsModalBtn = createCloseOsModalBtn()
    closeBtnRow.appendChild(closeOsModalBtn)

    return { closeBtnRow, closeOsModalBtn }
}

function createCloseOsModalBtn() {
    const closeOsModalBtn = document.createElement('button')
    closeOsModalBtn.className = 'closeOsModalBtn'
    closeOsModalBtn.id = 'closeOsModalBtn'
    closeOsModalBtn.textContent = 'X'

    return closeOsModalBtn
}

export { createOsModalNav }