import {
    updateLocalStorage,
    getSectionIndex,
    jsonData,
} from '../context.js'

function createSectionNameCell(sectionRow, menuSection) {
    //Name Cell
    const sectionNameCell = document.createElement('div');
    sectionNameCell.classList.add('sectionNameCell');

    const sectionName = createSectionName(sectionRow, menuSection)
    sectionNameCell.appendChild(sectionName);
    
    if (menuSection.Name && menuSection.Name.trim() !== '') {
        const sectionIndex = getSectionIndex(sectionRow.id);
        jsonData.MenuSections[sectionIndex].Name = menuSection.Name.toUpperCase();
        updateLocalStorage()
    }

    return sectionNameCell
}

//Handles Name Edits
function createSectionName(sectionRow, menuSection) {
    const sectionName = document.createElement('p');
    sectionName.classList.add('sectionName');
    sectionName.contentEditable = true;

    sectionName.textContent = menuSection.Name ? menuSection.Name.toUpperCase() : '';

    let originalName = menuSection.Name ? menuSection.Name.toUpperCase() : '';

    sectionName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateName(sectionRow.id, sectionName.textContent);
            originalName = sectionName.textContent.toUpperCase()
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
    jsonData.MenuSections[sectionIndex].Name = sectionName.toUpperCase();

    updateLocalStorage()
}

export { createSectionNameCell }