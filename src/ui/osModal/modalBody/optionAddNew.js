import { createOption } from "./osBody.js";

import {
    jsonData,
    updateItemCounterLocalStorage,
    updateLocalStorage,
    getLocalStorageOptionSetIDs,
    getUniqueRandomInt,
    getOsIndex,
} from '../../context.js';

import { createOptionRow } from '../../optionSet/osOptionsContainer.js'

function createOptionButton(optionRowsContainer, sectionId, itemId, osId) {
    const newOptionButton = document.createElement('button')
    newOptionButton.className = 'optionAddNew'
    newOptionButton.textContent = 'New Option'

    //Add Section
    newOptionButton.addEventListener('click', () => {

        const optionIds = getLocalStorageOptionSetIDs();
        const newOptionId = getUniqueRandomInt(optionIds);
        const { sectionIndex, itemIndex, osIndex } = getOsIndex(sectionId, itemId, osId);

        const emptyOptionJson = {
            CatalogItemId: null,
            MenuId: jsonData.MenuId,
            MenuItemOptionSetItemId: newOptionId,
            Name: null,
            Price: 0,
            TaxRateId: null,
            TaxRate: null,
            TaxValue: 0,
            TaxRateName: null,
            IsAvailable: true,
            DisplayOrder: jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems.length,
            IsDeleted: false,
            Tags: [],
            NextMenuItemOptionSetId: null,
            PublicId: crypto.randomUUID(),
            ImageName: null,
            ImageUrl: null,
            CellAspectRatio: 0,
            CellLayoutType: 0,
            OptionSetItemMetadata: [],
            ExternalImageUrl: null
        };
    
        let optionRow = createOption(optionRowsContainer, menuOs, emptyOptionJson, sectionId, itemId, osId)

        optionRowsContainer.appendChild(optionRow);

        jsonData.MenuSections[sectionIndex].MenuItems[itemIndex].MenuItemOptionSets[osIndex].MenuItemOptionSetItems.push(emptyOptionJson)
        
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

        const osRowOptionPreviewArray = Array.from(document.getElementsByClassName('optionContainer'));
        const osRowOptionPreview = osRowOptionPreviewArray.find((p) => p.id == osId)
        if (osRowOptionPreview) {
            const newOptionRow = createOptionRow(emptyOptionJson)
            osRowOptionPreview.appendChild(newOptionRow);
        }
        
        updateLocalStorage();
        updateItemCounterLocalStorage(newOptionId, true);
    });

    return newOptionButton
}

export { createOptionButton }