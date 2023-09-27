import {
    createOsNameCell
} from '../optionSet/osHeaderContainer.js'

import { 
    createOsBtnsCell 
} from './modalNav/osButtonContainer.js'

function createOsModalContainer(menuOs, itemId, sectionId, osRowHeader) {
    const leftContainer = document.getElementById('leftContainer')
    
    const osModalContainer = document.createElement('div')
    osModalContainer.id = 'myModal'
    osModalContainer.classList = 'osModalContainer'
    
    const {osModalNav, closeOsModalBtn } = createOsModalNav(menuOs, itemId, sectionId)
    osModalContainer.appendChild(osModalNav)

    closeOsModalBtn.addEventListener('click', () => {
        osModalContainer.classList.remove('show');
        osModalContainer.classList.add('hide');
        setTimeout(() => {
            osModalContainer.style.display = 'none'; 
            osModalContainer.classList.remove('hide'); 
            osModalContainer.remove()
        }, 300);
    });
    
    leftContainer.appendChild(osModalContainer)

    return osModalContainer
}

function createOsModalNav(menuOs, itemId, sectionId) {
    const osModalNav = document.createElement('div')
    osModalNav.className = 'osModalNav'

    const { closeBtnRow, closeOsModalBtn } = createCloseBtnRow()
    osModalNav.appendChild(closeBtnRow)

    const osOptionsRow = createOsOptionsRow(menuOs, itemId, sectionId)
    osModalNav.appendChild(osOptionsRow)

    return { osModalNav, closeOsModalBtn }
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

function createOsOptionsRow(menuOs, itemId, sectionId) {
    const osOptionsRow = document.createElement('div')
    osOptionsRow.className = 'osOptionsRow'

    const osNameCell = createOsNameCell(menuOs, itemId, sectionId)
    osOptionsRow.appendChild(osNameCell)

    const osBtnsCell = createOsBtnsCell()
    osOptionsRow.appendChild(osBtnsCell)

    return osOptionsRow
}

export { createOsModalContainer }