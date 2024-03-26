import {
    updateLocalStorage,
    getSectionIndex,
    jsonData,
    closeOsModalContainer
} from '../context.js'

import { slotManagerInstance } from '../mainContainer.js';

import { sectionListButton } from './sectionList.js'

function createSectionNameCell(sectionRow, menuSection) {
    //Name Cell

    const sectionNameAndButtons = document.createElement('div');
    sectionNameAndButtons.classList.add('sectionNameAndButtons');

    const sectionNameCell = document.createElement('div');
    sectionNameCell.classList.add('sectionNameCell');

    const sectionButtons = document.createElement('div');
    sectionButtons.classList.add('sectionButtons');

    sectionListButton(sectionButtons, menuSection);

    sectionNameAndButtons.appendChild(sectionNameCell);
    sectionNameAndButtons.appendChild(sectionButtons);

    const sectionName = createSectionName(sectionRow, menuSection)
    sectionNameCell.appendChild(sectionName);
    
    const sectionIndex = getSectionIndex(sectionRow.id);
    if (sectionIndex != -1) {
        jsonData.MenuSections[sectionIndex].Name = menuSection.Name.toUpperCase();
    }

    return sectionNameAndButtons
}

//Handles Name Edits
function createSectionName(sectionRow, menuSection) {
    const sectionName = document.createElement('p');
    sectionName.classList.add('sectionName');
    sectionName.contentEditable = true;
    if (menuSection.Name == null || menuSection.Name == '') {
        menuSection.Name = 'EMPTY'
    }
    sectionName.textContent = menuSection.Name.toUpperCase();
    if (sectionName.textContent == "EMPTY") {
        sectionName.style.color = "#a9a9a9";
    }

    let originalName = menuSection.Name.toUpperCase();

    sectionName.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.originalEvent || e).clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    });

    sectionName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (sectionName.textContent == "" || sectionName.textContent == null) {
                sectionName.textContent = "EMPTY"
                sectionName.style.color = "#a9a9a9";
            }
            updateName(sectionRow.id, sectionName.textContent);
            originalName = sectionName.textContent.toUpperCase()
            sectionName.blur();
        } else if (e.key === 'Escape') {
            if (sectionName.textContent == "" || sectionName.textContent == null) {
                sectionName.textContent = "EMPTY"
                sectionName.style.color = "#a9a9a9";
            } else {
                sectionName.textContent = originalName;
            }
            sectionName.blur();
        }
    });

    sectionName.addEventListener('blur', () => {
        sectionName.textContent = originalName;
        if (sectionName.textContent == "EMPTY") {
            sectionName.style.color = "#a9a9a9";
        }
        sectionName.classList.remove('sectionClicked')
    });

    sectionName.addEventListener('click', () => {
        closeOsModalContainer()
        if (sectionName.textContent == "EMPTY") {
            sectionName.textContent = ""
        }
        sectionName.style.color = "#000000";
        sectionName.classList.add('sectionClicked')
    })

    return sectionName
}

//Updates Name
function updateName(sectionId, sectionName) {
    const sectionIndex = getSectionIndex(sectionId);
    jsonData.MenuSections[sectionIndex].Name = sectionName.toUpperCase();

    updateLocalStorage(slotManagerInstance.currentSlot);
}

export { createSectionNameCell }