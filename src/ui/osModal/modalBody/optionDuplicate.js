import {
    jsonData,
    updateItemCounterLocalStorage,
    updateSectionLocalStorage,
    getLocalStorageOptionSetIDs,
    setSectionDisplayOrder,
    getUniqueRandomInt,
    getOptionObject,
    getOsObject,
} from '../../context.js';

import {
    createOption
} from './osBody.js'

import {
    createOptionRow
} from '../../optionSet/osOptionsContainer.js'

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
    const optionIndex = getOptionObject(sectionId, itemId, osId, optionId);
    const originalOs = getOsObject(sectionId, itemId, osId);
    const originalOption = originalOs.MenuItemOptionSetItems[optionIndex]
    console.log('original option', originalOption);

    if (originalOption) {
        const newOption = JSON.parse(JSON.stringify(originalOption));
        console.log('new Option:', newOption);

        const optionIds = getLocalStorageOptionSetIDs();
        const newOptionId = getUniqueRandomInt(optionIds);

        newOption.MenuItemOptionSetItemId = newOptionId;
        newOption.PublicId = crypto.randomUUID();

        const newOptionRow = createOption(optionsBodyContainer, newOption, sectionId, itemId, osId);

        optionsBodyContainer.insertBefore(newOptionRow, optionRow.nextSibling);

        const MenuItemOptionSetItems = (
            originalOs
            .MenuItemOptionSetItems
        )

        MenuItemOptionSetItems.splice(optionIndex+1, 0, newOption);
        MenuItemOptionSetItems.forEach((obj, index) => {
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
        
        const osRowOptionPreviewArray = Array.from(document.getElementsByClassName('osRowOption'));
        const osRowOptionPreview = osRowOptionPreviewArray.find((p) => p.id == originalOption.MenuItemOptionSetItemId)
        if (osRowOptionPreview) {
            const newOptionRow = createOptionRow(newOption)
            const optionContainerPreview = document.querySelector('.optionContainer')
            optionContainerPreview.insertBefore(newOptionRow, osRowOptionPreview.nextSibling);
        }
        
        updateSectionLocalStorage();
        updateItemCounterLocalStorage(newOptionId, true);
    }
}

export {
    optionDuplicateButton,
}