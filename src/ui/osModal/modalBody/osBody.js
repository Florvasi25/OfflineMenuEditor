import { 
    jsonData,
    getOsIndex, 
    getOptionIndex,
    updateSectionLocalStorage
} from '../../context.js'

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

function createOptionNameCell(menuOption, sectionId, itemId, osId) {
    //Name Cell
    const optionNameCell = document.createElement('div');
    optionNameCell.classList.add('optionNameCell');

    const optionName = createOptionName(menuOption, itemId, osId, sectionId)
    optionNameCell.appendChild(optionName);
    
    return optionNameCell
}

//Handles Name Edits
function createOptionName(menuOption, itemId, osId, sectionId) {
    const optionName = document.createElement('p');
    optionName.classList.add('optionName');
    optionName.contentEditable = true;
    optionName.textContent = menuOption.Name;

    let originalName = menuOption.Name;

    optionName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newOptionName = optionName.textContent;
            updateOptionName(menuOption.MenuItemOptionSetItemId, itemId, sectionId, osId, newOptionName);
            originalName = newOptionName;
            optionName.blur();
            // const osNameHeaderArray = Array.from(document.getElementsByClassName('osNameHeader')); 
            // const osNameHeader = osNameHeaderArray.find((p) => p.id == menuOs.MenuItemOptionSetId)
            // osNameHeader.textContent = newOptionName;
        } else if (e.key === 'Escape') {
            optionName.textContent = originalName;
            optionName.blur();
        }
    });

    optionName.addEventListener('blur', () => {
        optionName.textContent = originalName;
        optionName.classList.remove('sectionClicked')
    });

    optionName.addEventListener('click', () => {
        optionName.classList.add('sectionClicked')
    })

    return optionName
}

//Updates Name
function updateOptionName(optionId, itemId, sectionId, osId, newOptionName) {
    const {sectionIndex, itemIndex, osIndex, optionIndex} = getOptionIndex(sectionId, itemId, osId, optionId);
    jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems[optionIndex].Name = newOptionName;

    updateSectionLocalStorage()
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