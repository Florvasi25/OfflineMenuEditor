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

import { showToolTip } from './toolTip.js'

function sectionDuplicateButton(sectionRow, sectionNameCell) {

    const duplicateButton = document.createElement('button');
    duplicateButton.classList.add('duplicateButton')
    sectionNameCell.appendChild(duplicateButton);
    const duplicateButtonImg = document.createElement('img')
    duplicateButtonImg.classList.add('duplicateButtonImg')
    duplicateButtonImg.src = '../../assets/duplicateIcon.svg'
    duplicateButton.appendChild(duplicateButtonImg)

    //show tooltip on mouseover
    duplicateButtonImg.addEventListener('mouseover', () => {
        if (sectionRow.classList.contains('expanded')) {
            showToolTip(duplicateButton, "You must close this section before duplicating.");
        }
    });

    duplicateButton.addEventListener('click', () => {
        if (sectionRow.classList.contains('expanded')) return;

        duplicateSection(sectionRow);
        setSectionDisplayOrder(jsonData);
    });
    
}

/*function showTooltip(element, message) {
    let tooltip = element.querySelector('.tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('span');
        tooltip.classList.add('tooltip');
        element.appendChild(tooltip);
    }
    
    tooltip.textContent = message;
    
    // Manually set the position based on the button's coordinates
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = rect.bottom + window.scrollY + 'px';
    
    tooltip.style.display = 'block';
    
    setTimeout(() => {
        tooltip.style.display = 'none';
    }, 2000);
}*/

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
    sectionDuplicateButton
    
}