import { 
    jsonData,
    getOsIndex,
    updateSectionLocalStorage
} from '../context.js'

function createOsModalContainer(menuOs, itemId, sectionId) {
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

    return osOptionsRow
}

function createOsNameCell(menuOs, itemId, sectionId) {
    //Name Cell
    const osHeaderCell = document.createElement('div');
    osHeaderCell.classList.add('osHeaderCell');

    const osNameHeader = createOsNameHeader(menuOs, itemId, sectionId)
    osHeaderCell.appendChild(osNameHeader);
    
    return osHeaderCell
}

//Handles Name Edits
function createOsNameHeader(menuOs, itemId, sectionId) {
    const osName = document.createElement('p');
    osName.classList.add('osName');
    osName.contentEditable = true;
    osName.textContent = menuOs.Name;

    let originalName = menuOs.Name;

    osName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateName(menuOs.MenuItemOptionSetId, itemId, sectionId, osName.textContent);
            originalName = osName.textContent;
            osName.blur();
        } else if (e.key === 'Escape') {
            osName.textContent = originalName;
            osName.blur();
        }
    });

    osName.addEventListener('blur', () => {
        osName.textContent = originalName;
        osName.classList.remove('sectionClicked')
    });

    osName.addEventListener('click', () => {
        osName.classList.add('sectionClicked')
    })

    return osName
}

//Updates Name
function updateName(osHeaderId, itemId, sectionId, osName) {
    const {itemIndex, sectionIndex, osIndex} = getOsIndex(sectionId, itemId, osHeaderId)
    jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].Name = osName;

    updateSectionLocalStorage()
}

/////////////////////

export { createOsModalContainer }
