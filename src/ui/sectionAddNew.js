import {
    createSection,
} from "./sectionContainer.js";

import {
    jsonData, 
    updateCounterLocalStorage,
    updateSectionLocalStorage,
    getUniqueRandomInt,
} from './context.js';

function createSectionButton() {
    const newSectionButton = document.createElement('button')
    newSectionButton.setAttribute('id', 'sectionAddNew')
    newSectionButton.textContent = 'New Section'

    //Add Section
    newSectionButton.addEventListener('click', () => {
        const newId = getUniqueRandomInt()
    
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
    
        document.getElementById('outputContainer').appendChild(sectionRow);
    
        jsonData.MenuSections.push(emptySectionJson)
        updateSectionLocalStorage()
        updateCounterLocalStorage(newId, true);
    
    });

    return newSectionButton
}

export { createSectionButton }