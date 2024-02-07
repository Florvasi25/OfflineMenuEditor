import {
    jsonData,
    updateLocalStorage,
    setSectionDisplayOrder,
    getRandomInt,
    groupedOs,
    setColorOfRows,
    groupOptionSets,
    itemlessOs,
    updateItemlessLocalStorage,
} from '../../context.js';

import { createOption } from './osBody.js'

import { createOptionRow } from '../../optionSet/osOptionsContainer.js'

import { slotManagerInstance } from  "../../mainContainer.js";

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
    const groupOsId = menuOs.groupOsId;

    const indexOfOption = menuOs.MenuItemOptionSetItems.findIndex(
        option => option.MenuItemOptionSetItemId == menuOption.MenuItemOptionSetItemId
    )

    if (groupedOs[groupOsId]) {
        groupedOs[groupOsId].forEach(os => {
            const sourceOption = os.MenuItemOptionSetItems[indexOfOption]
            const newOption = JSON.parse(JSON.stringify(sourceOption));
            
            // Get new unique ID
            const newOptionId = getRandomInt();

            newOption.MenuItemOptionSetItemId = newOptionId;
            if(newOption.PublicId){ delete newOption.PublicId; }
            newOption.Name = menuOption.Name + "_copy"

            os.MenuItemOptionSetItems.splice(indexOfOption+1, 0, newOption)
            os.MenuItemOptionSetItems.forEach((obj, index) => {
                obj.DisplayOrder = index;
                
            })

            if (os.MenuItemOptionSetId === menuOs.MenuItemOptionSetId) {
                const newOptionRow = createOption(optionRowsContainer, menuOs, newOption);
                optionRowsContainer.insertBefore(newOptionRow, optionRow.nextSibling);
            }

            updatePreview(sourceOption, newOption)
        })

        groupOptionSets()
        updateLocalStorage(slotManagerInstance.currentSlot);
    } else if (itemlessOs.includes(menuOs)){
        const sourceOption = menuOs.MenuItemOptionSetItems[indexOfOption]

        const newOption = JSON.parse(JSON.stringify(sourceOption));

        // Get new unique ID
        const newOptionId = getRandomInt();

        newOption.MenuItemOptionSetItemId = newOptionId;
        if(newOption.PublicId){ delete newOption.PublicId; }

        menuOs.MenuItemOptionSetItems.splice(indexOfOption+1, 0, newOption)
        menuOs.MenuItemOptionSetItems.forEach((obj, index) => {
            obj.DisplayOrder = index;
        })

        const newOptionRow = createOption(optionRowsContainer, menuOs, newOption);
        optionRowsContainer.insertBefore(newOptionRow, optionRow.nextSibling);

        updateItemlessLocalStorage(slotManagerInstance.currentItemlessOs);
    }

    setColorOfRows(optionRowsContainer)
}

function updatePreview(sourceOption, newOption) {
    const osRowOptionPreviewArray = Array.from(document.getElementsByClassName('osRowOption'));
    const osRowOptionPreview = osRowOptionPreviewArray.find(
        p => p.id === sourceOption.MenuItemOptionSetItemId.toString()
    );
    if (osRowOptionPreview) {
        const newOptionRow = createOptionRow(newOption);
        osRowOptionPreview.parentNode.insertBefore(newOptionRow, osRowOptionPreview.nextSibling);
    }
}

export { optionDuplicateButton }
