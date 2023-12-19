import { createSection } from "./sectionContainer.js";

import {
    jsonData, 
    updateCounterLocalStorage,
    updateLocalStorage,
    getLocalStorageSectionIDs,
    getUniqueRandomInt,
} from '../context.js';

import { toggleSectionState } from "./sectionDropDown.js";

function createSectionButton() {
    const newSectionButton = document.createElement('button')
    newSectionButton.className = 'sectionAddNew'
    newSectionButton.textContent = 'New Section'

    newSectionButton.addEventListener('click', () => {

        const sectionIDs = getLocalStorageSectionIDs();
        const newId = getUniqueRandomInt(sectionIDs);
    
        const emptySectionJson = {
            MenuSectionId: newId,
            Name: null,
            Description: null,
            DisplayOrder: jsonData.MenuSections.length,
            MenuItems: [],
            PublicId: crypto.randomUUID(),
            IsDeleted: false,
            IsAvailable: true,
            IsHiddenFromUsers: false,
            ImageName: null,
            ImageUrl: null,
            CellAspectRatio: 0,
            CellLayoutType: 0,
            MenuSectionAvailability: {
                MenuSectionId: newId,
                AvailableTimes: null,
                AvailabilityMode: 0
            },
            ConcessionStoreId: null,
            MenuSectionMetadata: []
        };
    
        let sectionRow = createSection(emptySectionJson)
    
        document.getElementById('sectionContainer').appendChild(sectionRow);
    
        jsonData.MenuSections.push(emptySectionJson)
        toggleSectionState(sectionRow);

        updateLocalStorage()
        updateCounterLocalStorage(newId, true);
    
    });

    return newSectionButton
}

export { createSectionButton }