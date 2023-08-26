import {
    updateSectionLocalStorage,
    getSectionIndex,
    jsonData,
} from './context.js'

import {
    sectionVisibilityButton
} from './visibilitySection.js'

import {
    sectionDeleteButton
} from './deleteSection.js'

import {
    sectionDuplicateButton,
} from './duplicateSection.js'

function createSectionNameCell(sectionRow, menuSection) {
    //Name Cell
    const sectionNameCell = document.createElement('td');
    sectionNameCell.classList.add('sectionNameCell');

    const sectionName = createSectionName(sectionRow, menuSection)
    sectionNameCell.appendChild(sectionName);
    
    //Delete Button
    sectionDeleteButton(sectionNameCell, sectionRow, menuSection.Name)

    //visibility Button
    sectionVisibilityButton(sectionRow, menuSection, sectionNameCell)

    //Duplicate Button
    sectionDuplicateButton(sectionRow, sectionNameCell, menuSection)

    return sectionNameCell
}

//Handles Name Edits
function createSectionName(sectionRow, menuSection) {
    const sectionName = document.createElement('p');
    sectionName.classList.add('sectionName');
    sectionName.contentEditable = true;
    sectionName.textContent = menuSection.Name;

    let originalName = menuSection.Name;

    sectionName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateName(sectionRow.id, sectionName.textContent);
            originalName = sectionName.textContent;
            sectionName.blur();
        } else if (e.key === 'Escape') {
            sectionName.textContent = originalName;
            sectionName.blur();
        }
    });

    sectionName.addEventListener('blur', () => {
        sectionName.textContent = originalName;
        sectionName.classList.remove('sectionClicked')
    });

    sectionName.addEventListener('click', () => {
        sectionName.classList.add('sectionClicked')
    })

    return sectionName
}

//Updates Name
function updateName(sectionId, sectionName) {
    const sectionIndex = getSectionIndex(sectionId);
    jsonData.MenuSections[sectionIndex].Name = sectionName;

    updateSectionLocalStorage()
}

export {
    createSectionNameCell,
}