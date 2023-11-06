import { 
    updateLocalStorage
} from '../../context.js'

function createOptionMoMCell(menuOption, menuOs) {
    //MoM Cell
    const optionMoMCell = document.createElement('div');
    optionMoMCell.classList.add('optionMoMCell');

    const optionMoM = createOptionMoM(menuOption, menuOs)
    optionMoMCell.appendChild(optionMoM);
    
    return optionMoMCell
}

//Handles MoM Edits
function createOptionMoM(menuOption, menuOs) {
    const optionMoM = document.createElement('p');
    optionMoM.classList.add('optionMoM');
    optionMoM.contentEditable = true;
    optionMoM.textContent = menuOption.NextMenuItemOptionSetId;

    let originalMoM = menuOption.NextMenuItemOptionSetId;

    optionMoM.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newOptionMoM = optionMoM.textContent;
            updateOptionMoM(menuOption.MenuItemOptionSetItemId, menuOs, newOptionMoM);
            originalMoM = newOptionMoM;
            optionMoM.blur();
            const optionMoMPreviewArray = Array.from(document.getElementsByClassName('optionMoMPreview')); 
            const optionMoMPreview = optionMoMPreviewArray.find((p) => p.id == menuOption.MenuItemOptionSetItemId)
            if (optionMoMPreview) {
                optionMoMPreview.textContent = newOptionMoM;
            }
        } else if (e.key === 'Escape') {
            optionMoM.textContent = originalMoM;
            optionMoM.blur();
        }
    });

    optionMoM.addEventListener('blur', () => {
        optionMoM.textContent = originalMoM;
        optionMoM.classList.remove('sectionClicked')
    });

    optionMoM.addEventListener('click', () => {
        optionMoM.classList.add('sectionClicked')
    })

    optionMoM.addEventListener('input', () => {
        const newMoM = optionMoM.textContent;
        const removeCharacters = newMoM.replace(/[^-1\d.]/g, ''); // Allow positive numbers and "-1" only
        optionMoM.textContent = removeCharacters;
    });
    
    return optionMoM
}

//Updates MoM
function updateOptionMoM(optionId, menuOs, newOptionMoM) {
    // I need the index of the MenuItemOptionSetItem in the menuOs.MenuItemOptionSetItems array
    const optionIndex = menuOs.MenuItemOptionSetItems.findIndex((menuOption) => {
        return menuOption.MenuItemOptionSetItemId == optionId
    })
    
    // Update the NextMenuItemOptionSetId
    menuOs.MenuItemOptionSetItems[optionIndex].NextMenuItemOptionSetId = Number(newOptionMoM);

    updateLocalStorage()
}

export { createOptionMoMCell }