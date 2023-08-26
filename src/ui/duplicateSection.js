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
} from './section.js'

function sectionDuplicateButton(sectionRow, sectionNameCell) {
    const duplicateButton = document.createElement('button');
    duplicateButton.classList.add('duplicateButton')
    duplicateButton.addEventListener('click', () => {
        duplicateSection(sectionRow);
        setSectionDisplayOrder(jsonData);
    });
    sectionNameCell.appendChild(duplicateButton);
    const duplicateButtonImg = document.createElement('img')
    duplicateButtonImg.classList.add('duplicateButtonImg')
    duplicateButtonImg.src = '../../assets/duplicateIcon.svg'
    duplicateButton.appendChild(duplicateButtonImg)
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

        document.getElementById('outputContainer').insertBefore(newSectionRow, sectionRow.nextSibling);

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