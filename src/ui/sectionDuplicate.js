import {
    jsonData,
    getSectionIndex,
    updateCounterLocalStorage,
    updateSectionLocalStorage,
    setSectionDisplayOrder,
    getUniqueRandomInt,
} from './context.js';

import {
    createSection
} from './sectionContainer.js'

import { 
    showToolTip 
} from './toolTip.js'

function sectionDuplicateButton(sectionRow, sectionNameCell) {

    const duplicateButton = document.createElement('button');
    duplicateButton.classList.add('sectionButton')
    duplicateButton.classList.add('duplicateButton')
    sectionNameCell.appendChild(duplicateButton);
    const duplicateButtonImg = document.createElement('img')
    duplicateButtonImg.classList.add('sectionButtonImg')
    duplicateButtonImg.src = '../../assets/duplicateIcon.svg'
    duplicateButton.appendChild(duplicateButtonImg)

    //show tooltip on mouseover
    duplicateButtonImg.addEventListener('mouseover', () => {
        if (sectionRow.classList.contains('expanded')) {
            showToolTip(duplicateButton, "You must close this section before duplicating.");
        } else {
            
        }
    });
    
    duplicateButton.addEventListener('click', () => {
        if (sectionRow.classList.contains('expanded')) return;

        duplicateSection(sectionRow);
        setSectionDisplayOrder(jsonData);
    });
    
}

function duplicateSection(sectionRow) {
    const sectionIndex = getSectionIndex(sectionRow.id);
    
    if (sectionIndex !== -1) {
        const originalSection = jsonData.MenuSections[sectionIndex];
        const newSection = JSON.parse(JSON.stringify(originalSection));

        const newSectionId = getUniqueRandomInt();

        newSection.MenuSectionId = newSectionId;
        newSection.MenuSectionAvailability.MenuSectionId = newSectionId;
        newSection.PublicId = crypto.randomUUID();

        const newSectionRow = createSection(newSection);

        document.getElementById('sectionContainer').insertBefore(newSectionRow, sectionRow.nextSibling);

        jsonData.MenuSections.splice(sectionIndex+1, 0, newSection);
        jsonData.MenuSections.forEach((obj, index) => {
            obj.DisplayOrder = index;
        });
        updateSectionLocalStorage();
        updateCounterLocalStorage(newSectionId, true);
    }
}

export {
    sectionDuplicateButton,
}