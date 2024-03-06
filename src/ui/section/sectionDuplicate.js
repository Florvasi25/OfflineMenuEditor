import {
    jsonData,
    getSectionIndex,
    updateLocalStorage,
    setSectionDisplayOrder,
    getRandomInt,
    groupOptionSets,
    setOptionSetIdForSection,
    setOptionSetItemsIdForSection,
    closeOsModalContainer,
    removePublicId
} from '../context.js';

import { createSection } from './sectionContainer.js'

import { showToolTip } from '../toolTip.js'

import { changeSectionClockIcon } from '../clock/sectionClock.js'

import { slotManagerInstance } from '../mainContainer.js';

function sectionDuplicateButton(sectionRow, rightSectionContainer) {
    const duplicateButton = document.createElement('button');
    duplicateButton.classList.add('sectionButton')
    duplicateButton.classList.add('duplicateButton')
    rightSectionContainer.appendChild(duplicateButton);
    const duplicateButtonImg = document.createElement('img')
    duplicateButtonImg.classList.add('sectionButtonImg')
    duplicateButtonImg.src = '../../assets/duplicateIcon.svg'
    duplicateButton.appendChild(duplicateButtonImg)

    duplicateButtonImg.addEventListener('mouseover', () => {
        if (sectionRow.classList.contains('expanded')) {
            showToolTip(duplicateButton, "You must close this Section before duplicating");
        }
    });
    
    duplicateButton.addEventListener('click', () => {
        if (sectionRow.classList.contains('expanded')) return;
        
        closeOsModalContainer()

        duplicateSection(sectionRow);
        setSectionDisplayOrder(jsonData);
    });
    
}

function duplicateSection(sectionRow) {
    const sectionIndex = getSectionIndex(sectionRow.id);
    if (sectionIndex !== -1) {
        const originalSection = jsonData.MenuSections[sectionIndex];
        const newSection = JSON.parse(JSON.stringify(originalSection));

        const section = newIDs(newSection, originalSection.MenuSectionId);

        const newSectionRow = createSection(section);

        document.getElementById('sectionContainer').insertBefore(newSectionRow, sectionRow.nextSibling);
        jsonData.MenuSections.splice(sectionIndex+1, 0, section);
        jsonData.MenuSections.forEach((menuSection, index) => {
            menuSection.DisplayOrder = index;
        });
        groupOptionSets()
        changeSectionClockIcon(newSectionRow, newSectionRow.id);
        updateLocalStorage(slotManagerInstance.currentSlot);
    }
}

function newIDs(newSection, sectionId){
    const newSectionId = getRandomInt();
    newSection.MenuSectionId = newSectionId;
    newSection.MenuSectionAvailability.MenuSectionId = newSectionId;
    if(newSection.PublicId){ delete newSection.PublicId; }

    if (newSection.MenuItems) {
        newSection.MenuItems.forEach(item => {
            if (item) {
                const newItemId = getRandomInt();
                item.MenuItemId = newItemId;
                item.MenuSectionId = newSectionId;
                if( item.PublicId ) { delete item.PublicId}
                if( item.MenuItemOptionSets && item.MenuItemOptionSets.length > 0)
                {
                    removePublicId(item.MenuItemOptionSets);
                    let map = setOptionSetIdForSection(sectionId);
                    setOptionSetItemsIdForSection(sectionId, map);
                }
            }
        });
    }
    return newSection;
}
export { sectionDuplicateButton }