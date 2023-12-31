import {
    jsonData,
    getSectionIndex,
    updateCounterLocalStorage,
    updateLocalStorage,
    setSectionDisplayOrder,
    updateItemCounterLocalStorage,
    updateOptionSetCounterLocalStorage,
    updateOptionSetItemsCounterLocalStorage,
    getLocalStorageItemIDs,
    getLocalStorageOptionSetItemsIDs,
    getLocalStorageOptionSetIDs,
    getLocalStorageSectionIDs,
    getUniqueRandomInt,
    groupOptionSets,
    setOptionSetId, 
    setOptionSetItemsId,
    setOptionSetIdForSection,
    setOptionSetItemsIdForSection
} from '../context.js';

import { createSection } from './sectionContainer.js'

import { 
    showToolTip,
    removeToolTip
} from '../toolTip.js'

import { changeSectionClockIcon } from '../clock/sectionClock.js'

function sectionDuplicateButton(sectionRow, sectionButtonsCell) {
    const duplicateButton = document.createElement('button');
    duplicateButton.classList.add('sectionButton')
    duplicateButton.classList.add('duplicateButton')
    sectionButtonsCell.appendChild(duplicateButton);
    const duplicateButtonImg = document.createElement('img')
    duplicateButtonImg.classList.add('sectionButtonImg')
    duplicateButtonImg.src = '../../assets/duplicateIcon.svg'
    duplicateButton.appendChild(duplicateButtonImg)

    duplicateButtonImg.addEventListener('mouseover', () => {
        if (sectionRow.classList.contains('expanded')) {
            showToolTip(duplicateButton, "You must close this section before duplicating.");
        }
    });
    
    sectionRow.addEventListener('transitionend', () => {
        if (sectionRow.classList.contains('folded')) {
            // Remove the tooltip if the section is folded
            removeToolTip(duplicateButton);
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

        const section = newIDs(newSection, originalSection.MenuSectionId);

        const newSectionRow = createSection(section);

        document.getElementById('sectionContainer').insertBefore(newSectionRow, sectionRow.nextSibling);
        jsonData.MenuSections.splice(sectionIndex+1, 0, section);
        jsonData.MenuSections.forEach((menuSection, index) => {
            menuSection.DisplayOrder = index;
        });
        groupOptionSets()
        changeSectionClockIcon(newSectionRow, newSectionRow.id);
        updateLocalStorage();
    }
}

function newIDs(newSection, sectionId){
    const sectionIDs = getLocalStorageSectionIDs();
    const newSectionId = getUniqueRandomInt(sectionIDs);
    newSection.MenuSectionId = newSectionId;
    newSection.MenuSectionAvailability.MenuSectionId = newSectionId;
    newSection.PublicId = crypto.randomUUID();

    if (newSection.MenuItems) {
        newSection.MenuItems.forEach(item => {
            if (item) {
                const itemsIDs = getLocalStorageItemIDs();
                const newItemId = getUniqueRandomInt(itemsIDs);
                item.MenuItemId = newItemId;
                item.MenuSectionId = newSectionId;
                updateItemCounterLocalStorage(newItemId, true);
                if( item.MenuItemOptionSets && item.MenuItemOptionSets.length > 0)
                {
                    //setOptionSetId(jsonData);
                    let map = setOptionSetIdForSection(sectionId);
                    setOptionSetItemsIdForSection(sectionId, map);
                    //setOptionSetItemsId(jsonData);
                }
            }
        });
    }
    
    updateCounterLocalStorage(newSectionId, true);
    return newSection;
}
export { sectionDuplicateButton }