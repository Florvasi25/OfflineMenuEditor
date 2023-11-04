import {
    jsonData,
    updateItemCounterLocalStorage,
    updateLocalStorage,
    updateOptionSetItemsCounterLocalStorage,
    getLocalStorageOptionSetItemsIDs,
    setSectionDisplayOrder,
    getUniqueRandomInt,
    getOsByGroupID,
    setColorOfRows
} from '../../context.js';

import { createOption } from './osBody.js'

import { createOptionRow } from '../../optionSet/osOptionsContainer.js'

function optionDuplicateButton(optionRow, sectionId, itemId, osId, optionRowsContainer, optionButtonsCell, menuOption, menuOs) {
    const duplicateButton = document.createElement('button');
    duplicateButton.classList.add('sectionButton')
    duplicateButton.classList.add('duplicateButton')
    optionButtonsCell.appendChild(duplicateButton);
    const duplicateButtonImg = document.createElement('img')
    duplicateButtonImg.classList.add('sectionButtonImg')
    duplicateButtonImg.src = '../../assets/duplicateIcon.svg'
    duplicateButton.appendChild(duplicateButtonImg)

    duplicateButton.addEventListener('click', () => {
        duplicateOption(optionRow, sectionId, itemId, osId, optionRowsContainer, menuOption, menuOs);
        setSectionDisplayOrder(jsonData);
    });
}

function duplicateOption(optionRow, sectionId, itemId, osId, optionRowsContainer, menuOption, menuOs) {
    const optionToDuplicate = optionRow.id

    if (optionToDuplicate) {
        const matchingOS = getOsByGroupID(menuOs.groupOsId)

        const optionObject = matchingOS[0].MenuItemOptionSetItems.find(option => option.groupOptionId === optionToDuplicate)
        
        let newOption = ""
        const newGroupOptionId = crypto.randomUUID()
        matchingOS.forEach(os => {
            newOption = JSON.parse(JSON.stringify(optionObject));

            const optionIds = getLocalStorageOptionSetItemsIDs();
            const newOptionId = getUniqueRandomInt(optionIds);

            newOption.MenuItemOptionSetItemId = newOptionId;
            newOption.PublicId = crypto.randomUUID();
            newOption.groupOptionId = newGroupOptionId

            const optionIndex = os.MenuItemOptionSetItems.findIndex(option => option.groupOptionId == optionToDuplicate)
            os.MenuItemOptionSetItems.splice(optionIndex+1, 0, newOption)
            os.MenuItemOptionSetItems.forEach((obj, index) => {
                obj.DisplayOrder = index;
            })

            updateItemCounterLocalStorage(newOptionId, true);
            updateOptionSetItemsCounterLocalStorage(newOptionId, true)
        })
        
        const newOptionRow = createOption(optionRowsContainer, menuOs, newOption, sectionId, itemId, osId);
        optionRowsContainer.insertBefore(newOptionRow, optionRow.nextSibling);

        setColorOfRows(optionRowsContainer)

        const optionContainerPreviewArray = Array.from(document.getElementsByClassName('optionContainer'));
        optionContainerPreviewArray.forEach(optionContainerPreview => {
            const groupOsId = optionContainerPreview.getAttribute('groupOsId');

            if (groupOsId === menuOs.groupOsId) {
                const osRowOptionPreviewArray = Array.from(optionContainerPreview.getElementsByClassName('osRowOption'));
                osRowOptionPreviewArray.forEach(osRowOptionPreview => {
                    const newOptionRow = createOptionRow(newOption);

                    if (osRowOptionPreview.id === menuOption.groupOptionId) {
                        optionContainerPreview.insertBefore(newOptionRow, osRowOptionPreview.nextSibling);
                    }
                });
            }
        });

        updateLocalStorage();
    }
}

export { optionDuplicateButton }