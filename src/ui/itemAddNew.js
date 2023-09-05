import {
    createItem,
} from "./itemContainer.js";

import {
    jsonData, 
    updateCounterLocalStorage,
    updateSectionLocalStorage,
    getUniqueRandomInt,
    getSectionIndex,
} from './context.js';

function createItemButton(itemContainer, sectionId) {
    const newItemButton = document.createElement('button')
    newItemButton.setAttribute('id', 'itemAddNew')
    newItemButton.textContent = 'New Item'

    //Add Section
    newItemButton.addEventListener('click', () => {
        const newId = getUniqueRandomInt()
    
        const emptyItemJson = {
            MenuId: jsonData.MenuId,
            MenuItemId: newId,
            Name: null,
            Description: null,
            SpicinessRating: 0,
            Price: 0,
            DisplayOrder: 0,
            IsDeleted: false,
            Alcohol: false,
            CatalogItemId: null,
            Tags: [],
            PublicId: crypto.randomUUID(),
            IsAvailable: true,
            MenuItemOptionSets: [],
            TaxRate: null,
            TaxRateId: null,
            TaxValue: 0,
            TaxRateName: null,
            MenuSectionId: sectionId,
            ImageName: null,
            ImageUrl: null,
            CellAspectRatio: 4,
            CellLayoutType: 0,
            ActualPrice: 0,
            DisableVouchers: false,
            ExcludeFromVoucherDiscounting: false,
            DailySpecialHours: [],
            PriceCanIncrease: false,
            MenuItemMetadata: [],
            ExternalImageUrl: null
        };
    
        let itemRow = createItem(emptyItemJson, sectionId, itemContainer)
    
        itemContainer.appendChild(itemRow);

        const sectionIndex = getSectionIndex(sectionId);
        jsonData.MenuSections[sectionIndex].MenuItems.push(emptyItemJson)
    
        updateSectionLocalStorage()
        updateCounterLocalStorage(newId, true);
    });

    return newItemButton
}

export { createItemButton }