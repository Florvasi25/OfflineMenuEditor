import {
    jsonData,
    getOptionIndex,
    updateItemCounterLocalStorage,
    updateSectionLocalStorage,
    getLocalStorageOptionSetIDs,
    setSectionDisplayOrder,
    getUniqueRandomInt,
} from '../../context.js';

import {
    createOption
} from './osBody.js'


function optionDuplicateButton(optionRow, optionId, sectionId, itemId, osId, optionsBodyContainer, optionButtonsCell, menuOption) {
    const duplicateButton = document.createElement('button');
    duplicateButton.classList.add('sectionButton')
    duplicateButton.classList.add('duplicateButton')
    optionButtonsCell.appendChild(duplicateButton);
    const duplicateButtonImg = document.createElement('img')
    duplicateButtonImg.classList.add('sectionButtonImg')
    duplicateButtonImg.src = '../../assets/duplicateIcon.svg'
    duplicateButton.appendChild(duplicateButtonImg)

    duplicateButton.addEventListener('click', () => {
        duplicateOption(optionRow, optionId, sectionId, itemId, osId, optionsBodyContainer, menuOption);
        setSectionDisplayOrder(jsonData);
    });
}

function duplicateOption(optionRow, optionId, sectionId, itemId, osId, optionsBodyContainer, menuOption) {
    const {sectionIndex, itemIndex, osIndex, optionIndex} = getOptionIndex(sectionId, itemId, osId, optionId);
    
    if (optionIndex !== -1) {
        const originalOption = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems[optionIndex];
        const newOption = JSON.parse(JSON.stringify(originalOption));
        console.log('original option:', originalOption);
        console.log('duplicate option:', newOption);
        
        const optionIds = getLocalStorageOptionSetIDs();
        const newOptionId = getUniqueRandomInt(optionIds);

        newOption.MenuItemOptionSetItemId = newOptionId;
        newOption.PublicId = crypto.randomUUID();
        
        const newOptionRow = createOption(newOption, menuOption, sectionId, itemId, osId);
        console.log('newOptionRow:', newOptionRow);
        
        optionsContainer.insertBefore(newOptionRow, optionRow.nextSibling);
        
        jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems.splice(optionIndex+1, 0, newOption);
        jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems.forEach((obj, index) => {
            obj.DisplayOrder = index;
        });

        const rows = Array.from(optionsBodyContainer.querySelectorAll(".optionRow"));
    
        rows.forEach((row, index) => {
            if (index % 2 === 0) {
                row.classList.remove('even');
                row.classList.add('odd');
            } else {
                row.classList.remove('odd');
                row.classList.add('even');
            }
        });

        
        // const optionContainer = Array.from(document.getElementsByClassName('optionContainer')); 
        // if (optionContainer) {
        //     const optionContainerPreview = optionContainer.find((p) => p.id == menuOption.MenuItemOptionSetItemId)
        // }

        updateSectionLocalStorage();
        updateItemCounterLocalStorage(newOptionId, true);
    }
}

export {
    optionDuplicateButton,
}