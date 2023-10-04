import {
    jsonData,
    getOptionIndex,
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

function optionDuplicateButton(
    optionRow,
    optionId,
    sectionId,
    itemId,
    osId,
    optionsBodyContainer,
    optionButtonsCell
) {
    const duplicateButton = document.createElement('button');
    duplicateButton.classList.add('sectionButton')
    duplicateButton.classList.add('duplicateButton')
    optionButtonsCell.appendChild(duplicateButton);
    const duplicateButtonImg = document.createElement('img')
    duplicateButtonImg.classList.add('sectionButtonImg')
    duplicateButtonImg.src = '../../assets/duplicateIcon.svg'
    duplicateButton.appendChild(duplicateButtonImg)

    duplicateButton.addEventListener('click', () => {
        duplicateOption(optionRow, optionId, sectionId, itemId, osId, optionsBodyContainer);
        setSectionDisplayOrder(jsonData);
    });
}

function duplicateOption(
    optionRow,
    optionId,
    sectionId,
    itemId,
    osId,
    optionsBodyContainer
) {
    const optionIndex = getOptionObject(sectionId, itemId, osId, optionId);
    const originalOs = getOsObject(sectionId, itemId, osId);
    const originalOption = originalOs.MenuItemOptionSetItems[optionIndex]

    if (originalOption) {
        const newOption = JSON.parse(JSON.stringify(originalOption));
        console.log('original option:', originalOption);
        console.log('duplicate option:', newOption);

        const optionIds = getLocalStorageOptionSetIDs();
        const newOptionId = getUniqueRandomInt(optionIds);

        newOption.MenuItemOptionSetItemId = newOptionId;
        newOption.PublicId = crypto.randomUUID();

        const newOptionRow = createOption(optionsBodyContainer, newOption, sectionId, itemId, osId);
        console.log('newOptionRow:', newOptionRow);

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