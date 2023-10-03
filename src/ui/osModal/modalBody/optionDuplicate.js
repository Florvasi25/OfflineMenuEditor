import {
    jsonData,
    getOptionIndex,
    updateItemCounterLocalStorage,
    updateSectionLocalStorage,
    getLocalStorageItemIDs,
    setSectionDisplayOrder,
    getUniqueRandomInt,
} from '../../context.js';

import {
    createOption
} from './osBody.js'


function optionDuplicateButton(optionRow, optionId, sectionId, itemId, osId, optionsContainer, optionButtonsCell, menuOption) {
    const duplicateButton = document.createElement('button');
    duplicateButton.classList.add('sectionButton')
    duplicateButton.classList.add('duplicateButton')
    optionButtonsCell.appendChild(duplicateButton);
    const duplicateButtonImg = document.createElement('img')
    duplicateButtonImg.classList.add('sectionButtonImg')
    duplicateButtonImg.src = '../../assets/duplicateIcon.svg'
    duplicateButton.appendChild(duplicateButtonImg)
    
    duplicateButton.addEventListener('click', () => {
        duplicateOption(optionRow, optionId, sectionId, itemId, osId, optionsContainer, menuOption);
        setSectionDisplayOrder(jsonData);
    });
}

function duplicateOption(optionRow, optionId, sectionId, itemId, osId, optionsContainer, menuOption) {
    const {sectionIndex, itemIndex, osIndex, optionIndex} = getOptionIndex(sectionId, itemId, osId, optionId);
    
    if (optionIndex !== -1) {
        const originalOption = jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems[optionIndex];
        const newOption = JSON.parse(JSON.stringify(originalOption));
        
        const optionIds = getLocalStorageItemIDs();
        const newOptionId = getUniqueRandomInt(optionIds);

        newOption.MenuItemOptionSetItemId = newOptionId;
        newOption.PublicId = crypto.randomUUID();
        
        const newOptionRow = createOption(newOption, menuOption, sectionId, itemId, osId);
        
        optionsContainer.insertBefore(newOptionRow, optionRow.nextSibling);
        
        jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems.splice(optionIndex+1, 0, newOption);
        jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems.forEach((obj, index) => {
            obj.DisplayOrder = index;
        });

        const rows = Array.from(optionsContainer.querySelectorAll(".optionRow"));
    
        rows.forEach((row, index) => {
            if (index % 2 === 0) {
                row.classList.remove('even');
                row.classList.add('odd');
            } else {
                row.classList.remove('odd');
                row.classList.add('even');
            }
        });

        updateSectionLocalStorage();
        updateItemCounterLocalStorage(newOptionId, true);
    }
}

export {
    optionDuplicateButton,
}