import {
    createOsNameCell
} from './osName.js'

import { 
    createOsBtnsCell 
} from './osButtonContainer.js'

import {
    createSelectOptionContainer
} from './osSelectOption.js'

function createOsModalNav(menuOs, itemId, sectionId) {
    const osModalNav = document.createElement('div')
    osModalNav.className = 'osModalNav'

    const { closeBtnRow, closeOsModalBtn } = createCloseBtnRow()
    osModalNav.appendChild(closeBtnRow)

    const osOptionsRow = createOsOptionsNav(menuOs, itemId, sectionId)
    osModalNav.appendChild(osOptionsRow)

    const selectOptionContainer = createSelectOptionContainer(menuOs, itemId, sectionId)
    osModalNav.appendChild(selectOptionContainer)

    return { osModalNav, closeOsModalBtn }
}

function createOsOptionsNav(menuOs, itemId, sectionId) {
    const osOptionsRow = document.createElement('div')
    osOptionsRow.className = 'osOptionsRow'

    const osNameCell = createOsNameCell(menuOs, itemId, sectionId)
    osOptionsRow.appendChild(osNameCell)

    const osBtnsCell = createOsBtnsCell()
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