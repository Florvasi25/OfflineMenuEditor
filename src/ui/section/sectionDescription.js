import {
    jsonData,
    getSectionIndex,
    updateLocalStorage,
    closeOsModalContainer
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

    sectionDesc.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.originalEvent || e).clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    });

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
        closeOsModalContainer()
        sectionDesc.classList.add('sectionClicked')
    })

    return sectionDesc
}

// Utility function to decode HTML entities and replace <br> with newline characters
function decodeAndReplace(html) {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value.replace(/<br>/g, '\n');
}

// Updates descriptions when the JSON loads
function updateSectionDesc(sectionId, sectionDesc) {
    const sectionIndex = getSectionIndex(sectionId);

    // Decode HTML entities and replace <br> with newline characters
    const normalizedDesc = decodeAndReplace(sectionDesc);

    jsonData.MenuSections[sectionIndex].Description = normalizedDesc;

    updateLocalStorage(slotManagerInstance.currentSlot);
}

export { createSectionDescCell }