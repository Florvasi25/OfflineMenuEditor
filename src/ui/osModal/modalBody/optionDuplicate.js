import {
    jsonData,
    updateItemCounterLocalStorage,
    updateLocalStorage,
    updateOptionSetItemsCounterLocalStorage,
    getLocalStorageOptionSetItemsIDs,
    setSectionDisplayOrder,
    getUniqueRandomInt,
    groupedOs,
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
        const optionObject = groupedOs[menuOs.groupOsId][0].MenuItemOptionSetItems.find(option => option.groupOptionId === optionToDuplicate)
        
        let newOption = ""
        const newGroupOptionId = crypto.randomUUID()
        groupedOs[menuOs.groupOsId].forEach(os => {
            newOption = JSON.parse(JSON.stringify(optionObject));

            const optionIds = getLocalStorageOptionSetItemsIDs();
            const newOptionId = getUniqueRandomInt(optionIds);

            newOption.MenuItemOptionSetItemId = newOptionId;
            newOption.PublicId = crypto.randomUUID();
            newOption.groupOptionId = newGroupOptionId
            console.log('newOption.groupOptionId', newOption.groupOptionId);
            const optionIndex = os.MenuItemOptionSetItems.findIndex(option => option.groupOptionId == optionToDuplicate)
            os.MenuItemOptionSetItems.splice(optionIndex+1, 0, newOption)
            os.MenuItemOptionSetItems.forEach((obj, index) => {
                obj.DisplayOrder = index;
            })
            updateItemCounterLocalStorage(newOptionId, true);
            updateOptionSetItemsCounterLocalStorage(newOptionId, true)
        })
        
        console.log('newOption', newOption);

        const newOptionRow = createOption(optionRowsContainer, menuOs, newOption, sectionId, itemId, osId);
        console.log('newOptionRow', newOptionRow);

        optionRowsContainer.insertBefore(newOptionRow, optionRow.nextSibling);

        const rows = Array.from(optionRowsContainer.querySelectorAll(".optionRow"));

        rows.forEach((row, index) => {
            if (index % 2 === 0) {
                row.classList.remove('even');
                row.classList.add('odd');
            } else {
                row.classList.remove('odd');
                row.classList.add('even');
            }
        });

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