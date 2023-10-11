import { 
    jsonData,
    getOptionIndex,
    updateLocalStorage
} from '../../context.js'

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
            const optionNamePreviewArray = Array.from(document.getElementsByClassName('optionNamePreview')); 
            const optionNamePreview = optionNamePreviewArray.find((p) => p.id == menuOption.MenuItemOptionSetItemId)
            if (optionNamePreview) {
                optionNamePreview.textContent = newOptionName;
            }
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

    updateLocalStorage()
}

export { createOptionNameCell }