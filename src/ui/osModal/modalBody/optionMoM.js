import { 
    jsonData,
    itemlessOs,
    updateLocalStorage,
    updateItemlessLocalStorage
} from '../../context.js'

import {
    showToolTip,
    removeToolTip
} from '../../toolTip.js'

function createOptionMoMCell(menuOption, menuOs) {
    //MoM Cell
    const optionMoMCell = document.createElement('div');
    optionMoMCell.classList.add('optionMoMCell');

    const optionMoM = createOptionMoM(menuOption, menuOs, optionMoMCell)
    optionMoMCell.appendChild(optionMoM);
    
    return optionMoMCell
}

//Handles MoM Edits
function createOptionMoM(menuOption, menuOs, optionMoMCell) {
    const optionMoM = document.createElement('p');
    optionMoM.classList.add('optionMoM');
    optionMoM.contentEditable = true;

    if (menuOption.NextMenuItemOptionSetId == null) {
        optionMoM.textContent = 'Empty'
    } else {
        optionMoM.textContent = menuOption.NextMenuItemOptionSetId;
    }

    let originalMoM = menuOption.NextMenuItemOptionSetId;

    optionMoM.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newOptionMoM = optionMoM.textContent;

            // Check if the entered value exists in the MenuItemOptionSetId list
            const menuItemOptionSetIds = jsonData.MenuSections.flatMap(i => i.MenuItems)
                .flatMap(i => i.MenuItemOptionSets)
                .map(optionSet => optionSet.MenuItemOptionSetId);

            // Allow '-1' as a valid value
            if (newOptionMoM !== '-1' && !menuItemOptionSetIds.includes(Number(newOptionMoM))) {
                // Show tooltip if the entered value doesn't exist
                showToolTip(optionMoMCell, 'The MenuItemOptionSetId does not exist in this item');
                return;
            } 

            // If the entered value exists or is '-1', update the value and remove tooltip
            updateOptionMoM(menuOption.MenuItemOptionSetItemId, menuOs, newOptionMoM);
            originalMoM = newOptionMoM;
            optionMoM.blur();
            removeToolTip(optionMoM);

            // Update the preview if available
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
        if (optionMoM.textContent.trim() === "") {
            optionMoM.textContent = "Empty";
        } else {
            optionMoM.textContent = originalMoM;
        }
        optionMoM.classList.remove('sectionClicked');
    });

    optionMoM.addEventListener('click', () => {
        optionMoM.classList.add('sectionClicked')
        if (optionMoM.textContent == "Empty") {
            optionMoM.textContent = "";
        }
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
    const optionIndex = menuOs.MenuItemOptionSetItems.findIndex((menuOption) => {
        return menuOption.MenuItemOptionSetItemId == optionId
    })
    
    if (newOptionMoM == "") {
        menuOs.MenuItemOptionSetItems[optionIndex].NextMenuItemOptionSetId = null;
    } else {
        menuOs.MenuItemOptionSetItems[optionIndex].NextMenuItemOptionSetId = Number(newOptionMoM);
    }
        
    if (itemlessOs.includes(menuOs)) {
        updateItemlessLocalStorage();
    } else {
        updateLocalStorage()
    }
}

export { createOptionMoMCell }
