import {
    jsonData,
    getSectionIndex,
    updateLocalStorage,
} from '../context.js';

import { slotManagerInstance } from '../mainContainer.js';

//Creates the Cell where all the Desc components should be
function createSectionDescCell(menuSection, sectionRow) {
    const sectionDescCell = document.createElement('div');
    sectionDescCell.classList.add('sectionDescCell');

    const sectionDesc = createSectionDesc(menuSection, sectionRow)
    sectionDescCell.appendChild(sectionDesc);

    return sectionDescCell
}

//Creates the element where the Desc will be 
function createSectionDesc(menuSection, sectionRow) {
    const sectionDesc = document.createElement('p');
    sectionDesc.classList.add('sectionDesc');
    sectionDesc.contentEditable = true;

    if (menuSection.Description) {
        const formattedDesc = menuSection.Description.replace(/\n/g, '<br>');
        sectionDesc.innerHTML = formattedDesc;
    }

    let originalDesc = menuSection.Description || '';

    sectionDesc.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
            document.execCommand('insertLineBreak');
            e.preventDefault();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            updateSectionDesc(sectionRow.id, sectionDesc.innerHTML);
            originalDesc = sectionDesc.innerHTML;
            sectionDesc.blur();
        } else if (e.key === 'Escape') {
            sectionDesc.innerHTML = originalDesc;
            sectionDesc.blur();
        }
    });

    sectionDesc.addEventListener('blur', () => {
        const formattedDesc = originalDesc.replace(/\n/g, '<br>');

        sectionDesc.innerHTML = formattedDesc;
        sectionDesc.classList.remove('sectionClicked')
    });

    sectionDesc.addEventListener('click', () => {
        sectionDesc.classList.add('sectionClicked')
    })

    return sectionDesc
}

//Updates descriptions when the JSON loads
function updateSectionDesc(sectionId, sectionDesc) {
    const sectionIndex = getSectionIndex(sectionId);

    const normalizedDesc = sectionDesc.replace(/<br>/g, '\n');
    jsonData.MenuSections[sectionIndex].Description = normalizedDesc;

    updateLocalStorage(slotManagerInstance.currentSlot);
}

export { createSectionDescCell }