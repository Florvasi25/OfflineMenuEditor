import {
    createOsNameCell
} from '../optionSet/osHeaderContainer.js'

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

/////////////////

function createOsOptionsRow(menuOs, itemId, sectionId) {
    const osOptionsRow = document.createElement('div')
    osOptionsRow.className = 'osOptionsRow'

    const osNameCell = createOsNameCell(menuOs, itemId, sectionId)
    osOptionsRow.appendChild(osNameCell)

    const osBtnsCell = createOsBtnsCell()
    osOptionsRow.appendChild(osBtnsCell)

    return osOptionsRow
}


/////////////////////

function createOsBtnsCell() {
    const osBtnsCell = document.createElement('div')
    osBtnsCell.className = 'osBtnsCell'

    osNewButton(osBtnsCell)

    osCaseButton(osBtnsCell)

    osDeleteButton(osBtnsCell)

    osDuplicateButton(osBtnsCell)

    return osBtnsCell
}

function osDeleteButton(osBtnsCell) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('sectionButton')
    deleteButton.classList.add('deleteButton')
    osBtnsCell.appendChild(deleteButton);
    const deleteButtonImg = document.createElement('img')
    deleteButtonImg.classList.add('sectionButtonImg')
    deleteButtonImg.src = '../../assets/deleteIcon.svg'
    deleteButton.appendChild(deleteButtonImg)
    // deleteButton.addEventListener('click', () => {
    //     confirmDelete(itemRow, itemButtonsCell, sectionId)
    // });
}

function osDuplicateButton(osBtnsCell) {
    const duplicateButton = document.createElement('button');
    duplicateButton.classList.add('sectionButton')
    duplicateButton.classList.add('duplicateButton')
    osBtnsCell.appendChild(duplicateButton);
    const duplicateButtonImg = document.createElement('img')
    duplicateButtonImg.classList.add('sectionButtonImg')
    duplicateButtonImg.src = '../../assets/duplicateIcon.svg'
    duplicateButton.appendChild(duplicateButtonImg)
}

function osNewButton(osBtnsCell) {
    const newOsButton = document.createElement('button');
    newOsButton.classList.add('sectionButton')
    newOsButton.classList.add('newOsButton')
    osBtnsCell.appendChild(newOsButton);
    const newOsButtonImg = document.createElement('img')
    newOsButtonImg.classList.add('sectionButtonImg')
    newOsButtonImg.src = '../../assets/plusIcon.svg'
    newOsButton.appendChild(newOsButtonImg)
}

function osCaseButton(osBtnsCell) {
    const caseButton = document.createElement('button');
    caseButton.classList.add('sectionButton')
    caseButton.classList.add('newOsButton')
    osBtnsCell.appendChild(caseButton);
    const caseButtonImg = document.createElement('img')
    caseButtonImg.classList.add('sectionButtonImg')
    caseButtonImg.src = '../../assets/caseIcon.svg'
    caseButton.appendChild(caseButtonImg)
}

export { createOsModalContainer }
