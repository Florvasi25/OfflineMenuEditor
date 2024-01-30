import { createItem } from "./itemContainer.js";

import {
    jsonData,
    updateLocalStorage,
    getRandomInt,
    getSectionIndex,
    getSectionRow
} from '../context.js';

import {
    toggleItemState
} from './itemDropDown.js'

import {
    getsectionClockColor
} from '../clock/sectionClock.js'

function createItemButton(itemContainer, sectionId) {
    const newItemButton = document.createElement('button')
    newItemButton.className = 'itemAddNew'
    newItemButton.textContent = 'New Item'
    
    //Add Section
    newItemButton.addEventListener('click', () => {

        const newId = getRandomInt();
        const sectionIndex = getSectionIndex(sectionId);
        const sectionRow = getSectionRow(sectionId);
    
        const emptyItemJson = {
            MenuId: jsonData.MenuId,
            MenuItemId: newId,
            Name: "Empty",
            Description: null,
            SpicinessRating: 0,
            Price: 0,
            DisplayOrder: jsonData.MenuSections[sectionIndex].MenuItems.length,
            IsDeleted: false,
            Alcohol: false,
            CatalogItemId: null,
            Tags: [],
            PublicId: "00000000-0000-0000-0000-000000000000",
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
        
        CreateItem(itemContainer, emptyItemJson, sectionIndex, sectionId, newId, sectionRow)
    });

    return newItemButton
}

function CreateItem(itemContainer, item, sectionIndex, sectionId, newId, sectionRow){

    let itemRow = createItem(item, sectionId, itemContainer)
    
    itemContainer.appendChild(itemRow);
    
    if(getsectionClockColor(sectionRow) == 'rgb(128, 214, 111)'){

        let lastMenuItemIndex = jsonData.MenuSections[sectionIndex].MenuItems.length - 1;

        let itemDailyHours = jsonData.MenuSections[sectionIndex].MenuItems[lastMenuItemIndex].DailySpecialHours;

        let itemDailySpecialHours = modifyBusinessHoursPeriodIds(itemDailyHours)

        item.DailySpecialHours = itemDailySpecialHours;
        setClockIcon(itemRow);
    }
        
    jsonData.MenuSections[sectionIndex].MenuItems.push(item)
    toggleItemState(itemRow, sectionId)

    updateLocalStorage()
}

function modifyBusinessHoursPeriodIds(itemDailyHours) {
    for (let item of itemDailyHours) {

        item.BusinessHoursPeriodId += 1;
    }
    return itemDailyHours;
}

function setClockIcon(itemRow){
    const clockButton = itemRow.querySelector('.sectionButton.clockButton');

    clockButton.style.backgroundColor = '#80d66f';
}

export { createItemButton, CreateItem }