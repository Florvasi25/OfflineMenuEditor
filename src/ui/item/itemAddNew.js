import {
    createItem,
} from "./itemContainer.js";

import {
    jsonData, 
    updateItemCounterLocalStorage,
    updateSectionLocalStorage,
    getLocalStorageItemIDs,
    getUniqueRandomInt,
    getSectionIndex,
} from '../context.js';

function createItemButton(itemContainer, sectionId) {
    const newItemButton = document.createElement('button')
    newItemButton.className = 'itemAddNew'
    newItemButton.textContent = 'New Item'
    
    //Add Section
    newItemButton.addEventListener('click', () => {

        const itemIDs = getLocalStorageItemIDs();
        const newId = getUniqueRandomInt(itemIDs);
        const sectionIndex = getSectionIndex(sectionId);
    
        const emptyItemJson = {
            MenuId: jsonData.MenuId,
            MenuItemId: newId,
            Name: null,
            Description: null,
            SpicinessRating: 0,
            Price: 0,
            DisplayOrder: jsonData.MenuSections[sectionIndex].MenuItems.length,
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
            MenuSectionId: jsonData.MenuSections[sectionIndex].MenuSectionId,
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

        jsonData.MenuSections[sectionIndex].MenuItems.push(emptyItemJson)
    
        updateSectionLocalStorage()
        updateItemCounterLocalStorage(newId, true);
    });

    return newItemButton
}

export { createItemButton }