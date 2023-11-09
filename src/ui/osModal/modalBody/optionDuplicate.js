import {
    jsonData,
    updateItemCounterLocalStorage,
    updateLocalStorage,
    updateOptionSetItemsCounterLocalStorage,
    getLocalStorageOptionSetItemsIDs,
    setSectionDisplayOrder,
    getUniqueRandomInt,
    groupedOs,
    setColorOfRows
} from '../../context.js';

import { createOption } from './osBody.js'

import { createOptionRow } from '../../optionSet/osOptionsContainer.js'

function optionDuplicateButton(optionRow, optionRowsContainer, optionButtonsCell, menuOption, menuOs) {
    const duplicateButton = document.createElement('button');
    duplicateButton.classList.add('sectionButton')
    duplicateButton.classList.add('duplicateButton')
    optionButtonsCell.appendChild(duplicateButton);
    const duplicateButtonImg = document.createElement('img')
    duplicateButtonImg.classList.add('sectionButtonImg')
    duplicateButtonImg.src = '../../assets/duplicateIcon.svg'
    duplicateButton.appendChild(duplicateButtonImg)

    duplicateButton.addEventListener('click', () => {
        duplicateOption(optionRow, optionRowsContainer, menuOption, menuOs);
        setSectionDisplayOrder(jsonData);
    });
}

function duplicateOption(optionRow, optionRowsContainer, menuOption, menuOs) {
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

            const optionIndex = os.MenuItemOptionSetItems.findIndex(option => option.groupOptionId == optionToDuplicate)
            os.MenuItemOptionSetItems.splice(optionIndex+1, 0, newOption)
            os.MenuItemOptionSetItems.forEach((obj, index) => {
                obj.DisplayOrder = index;
            })

            updateItemCounterLocalStorage(newOptionId, true);
            updateOptionSetItemsCounterLocalStorage(newOptionId, true)
        })
        
        const newOptionRow = createOption(optionRowsContainer, menuOs, newOption);
        optionRowsContainer.insertBefore(newOptionRow, optionRow.nextSibling);

        setColorOfRows(optionRowsContainer)

        const osRowOption =  document.getElementsByClassName('osRowOption')
        const osRowOptionPreviewArray = Array.from(osRowOption);
        
        osRowOptionPreviewArray.forEach(osRowOptionPreview => {
            const newOptionRow = createOptionRow(newOption);

            if (osRowOptionPreview.id === menuOption.groupOptionId) {
                osRowOptionPreview.parentNode.insertBefore(newOptionRow, osRowOptionPreview.nextSibling);
            }
        });

        updateLocalStorage();
    }
}

export { optionDuplicateButton }