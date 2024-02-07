import { createSection } from "./sectionContainer.js";

import {
    jsonData,
    updateLocalStorage,
    getRandomInt,
} from '../context.js';

import { toggleSectionState } from "./sectionDropDown.js";

import { slotManagerInstance } from '../mainContainer.js';

function createSectionButton() {
    const newSectionButton = document.createElement('button')
    newSectionButton.className = 'sectionAddNew'
    newSectionButton.textContent = 'New Section'

    newSectionButton.addEventListener('click', () => {
        const newId = getRandomInt();
    
        const emptySectionJson = {
            MenuSectionId: newId,
            Name: "EMPTY",
            Description: null,
            DisplayOrder: jsonData.MenuSections.length,
            MenuItems: [],
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

        updateLocalStorage(slotManagerInstance.currentSlot);
    
    });

    return newSectionButton
}

export { createSectionButton }