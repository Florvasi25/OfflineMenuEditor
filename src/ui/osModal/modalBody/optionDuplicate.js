import {
    jsonData,
    updateItemCounterLocalStorage,
    updateLocalStorage,
    updateOptionSetItemsCounterLocalStorage,
    getLocalStorageOptionSetItemsIDs,
    setSectionDisplayOrder,
    getUniqueRandomInt,
    groupedOs,
    setColorOfRows,
    groupOptionSets,
    itemlessOs,
    updateItemlessOsKey,
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
    const oldGroupOsId = menuOs.groupOsId;

    const indexOfOption = menuOs.MenuItemOptionSetItems.findIndex(
        option => option.MenuItemOptionSetItemId == menuOption.MenuItemOptionSetItemId
    )

    if (optionToDuplicate) {
        if (groupedOs[oldGroupOsId]) {

            let newOption = ""
            groupedOs[menuOs.groupOsId].forEach(os => {
                const optionObject = os.MenuItemOptionSetItems[indexOfOption]
                newOption = JSON.parse(JSON.stringify(optionObject));

                const optionIds = getLocalStorageOptionSetItemsIDs();
                const newOptionId = getUniqueRandomInt(optionIds);

                newOption.MenuItemOptionSetItemId = newOptionId;
                newOption.PublicId = crypto.randomUUID();
                newOption.Name = menuOption.Name + "_copy"

                const optionIndex = os.MenuItemOptionSetItems.findIndex(option => option.groupOptionId == optionToDuplicate)
                os.MenuItemOptionSetItems.splice(optionIndex+1, 0, newOption)
                os.MenuItemOptionSetItems.forEach((obj, index) => {
                    obj.DisplayOrder = index;
                })

                updateItemCounterLocalStorage(newOptionId, true);
                updateOptionSetItemsCounterLocalStorage(newOptionId, true)
            })
            groupOptionSets()
            updateLocalStorage();

            const newOptionRow = createOption(optionRowsContainer, menuOs, newOption);
            optionRowsContainer.insertBefore(newOptionRow, optionRow.nextSibling);

            updatePreview(indexOfOption, newOption, menuOs)

        } else if (itemlessOs[oldGroupOsId]) {
            const optionObject = itemlessOs[groupOsId].MenuItemOptionSetItems[indexOfOption]
            const newGroupOptionId = crypto.randomUUID()

            const newOption = JSON.parse(JSON.stringify(optionObject));

            const optionIds = getLocalStorageOptionSetItemsIDs();
            const newOptionId = getUniqueRandomInt(optionIds);

            newOption.MenuItemOptionSetItemId = newOptionId;
            newOption.PublicId = crypto.randomUUID();
            newOption.groupOptionId = newGroupOptionId

            const optionIndex = itemlessOs[oldGroupOsId].MenuItemOptionSetItems.findIndex(option => option.groupOptionId == optionToDuplicate)
            itemlessOs[oldGroupOsId].MenuItemOptionSetItems.splice(optionIndex+1, 0, newOption)
            itemlessOs[oldGroupOsId].MenuItemOptionSetItems.forEach((obj, index) => {
                obj.DisplayOrder = index;
            })

            updateItemCounterLocalStorage(newOptionId, true);
            updateOptionSetItemsCounterLocalStorage(newOptionId, true)

            const newOptionRow = createOption(optionRowsContainer, menuOs, newOption);
            optionRowsContainer.insertBefore(newOptionRow, optionRow.nextSibling);

            updateItemlessOsKey(oldGroupOsId);
        }
        setColorOfRows(optionRowsContainer)
    }
}

function updatePreview(indexOfOption, newOption, menuOs) {
    const optionsIds = groupedOs[menuOs.groupOsId].map(
        os => os.MenuItemOptionSetItems[indexOfOption].MenuItemOptionSetItemId.toString()
    );
    const osRowOptionPreviewArray = Array.from(document.getElementsByClassName('osRowOption'));
    const osRowOptionPreview = osRowOptionPreviewArray.filter(p => optionsIds.includes(p.id));
    osRowOptionPreview.forEach(os => {
        const newOptionRow = createOptionRow(newOption);
        os.parentNode.insertBefore(newOptionRow, os.nextSibling);
    })
}
export { optionDuplicateButton }