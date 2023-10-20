import { createOption } from "./osBody.js";

import {
    jsonData,
    updateItemCounterLocalStorage,
    updateLocalStorage,
    getLocalStorageOptionSetItemsIDs,
    getUniqueRandomInt,
    groupedOs
} from '../../context.js';

import { createOptionRow } from '../../optionSet/osOptionsContainer.js'

function createOptionButton(optionRowsContainer, sectionId, itemId, osId, menuOs) {
    const newOptionButton = document.createElement('button')
    newOptionButton.className = 'optionAddNew'
    newOptionButton.textContent = 'New Option'

    //Add Section
    newOptionButton.addEventListener('click', () => {
        
        let emptyOptionJson = {}
        const newGroupOptionId = crypto.randomUUID()

        groupedOs[menuOs.groupOsId].forEach(os => {

            const optionIds = getLocalStorageOptionSetItemsIDs();
            const newOptionId = getUniqueRandomInt(optionIds);   

            emptyOptionJson = {
                CatalogItemId: null,
                MenuId: jsonData.MenuId,
                MenuItemOptionSetItemId : newOptionId,
                Name: null,
                Price: 0,
                TaxRateId: null,
                TaxRate: null,
                TaxValue: 0,
                TaxRateName: null,
                IsAvailable: true,
                DisplayOrder: groupedOs[menuOs.groupOsId][0].MenuItemOptionSetItems.length,
                IsDeleted: false,
                Tags: [],
                NextMenuItemOptionSetId: null,
                PublicId: crypto.randomUUID(),
                ImageName: null,
                ImageUrl: null,
                CellAspectRatio: 0,
                CellLayoutType: 0,
                OptionSetItemMetadata: [],
                ExternalImageUrl: null,
                groupOptionId: newGroupOptionId
            };
        
            os.MenuItemOptionSetItems.push(emptyOptionJson)

            updateItemCounterLocalStorage(newOptionId, true);
        })

        let optionRow = createOption(optionRowsContainer, menuOs, emptyOptionJson, sectionId, itemId, osId)
        optionRowsContainer.appendChild(optionRow);

            
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

        const optionContainerPreview = optionContainerPreviewArray.filter((element) => {
          const groupOsId = element.getAttribute('groupOsId');
          return groupOsId === menuOs.groupOsId;
        });
        
        if (optionContainerPreview) {
            optionContainerPreview.forEach((osRowOptionContainerPreview) => {
                const newOptionRow = createOptionRow(emptyOptionJson)
                osRowOptionContainerPreview.appendChild(newOptionRow);
            });
        }
        
        updateLocalStorage();
    });

    return newOptionButton
}

export { createOptionButton }