import {
    jsonData,
    getSectionIndex,
    updateCounterLocalStorage,
    updateSectionLocalStorage,
    setSectionDisplayOrder,
    getUniqueRandomInt,
} from './context.js';

import {
    createSectionDragCell,
} from './dragAndDropSection.js'

import {
    createSectionDropdown,
} from './dropDownSection.js'

import {
    createSectionNameCell,
} from './nameSection.js'

//Section components
function createSection(menuSection) {
    //Section Container
    const sectionRow = document.createElement('tr');
    sectionRow.classList.add('sectionContainer');
    sectionRow.classList.add('draggable');
    sectionRow.classList.add('folded')
    sectionRow.id = menuSection.MenuSectionId;

    //Creates Dropdown Cell
    const sectionDropdownCell = createSectionDropdown(sectionRow)
    sectionRow.appendChild(sectionDropdownCell)

    //Creates Drag Cell
    const sectionDragCell = createSectionDragCell(sectionRow)
    sectionRow.appendChild(sectionDragCell)

    //Creates Section Name Cell
    const sectionNameCell = createSectionNameCell(sectionRow, menuSection)
    sectionRow.appendChild(sectionNameCell)

    //Section Desc Cell
    const sectionDescCell = createSectionDescCell(menuSection, sectionRow);
    sectionRow.appendChild(sectionDescCell)

    //OS Cell
    const sectionOsCell = document.createElement('td');
    sectionOsCell.classList.add('sectionOsCell');
    sectionRow.appendChild(sectionOsCell)

    //Price Cell
    const sectionPriceCell = document.createElement('td');
    sectionPriceCell.classList.add('sectionPriceCell');
    sectionRow.appendChild(sectionPriceCell)

    //Tax Cell
    const sectionTaxCell = document.createElement('td');
    sectionTaxCell.classList.add('sectionTaxCell');
    sectionRow.appendChild(sectionTaxCell)
    
    return sectionRow
}

////////////// VISIBILITY BUTTON ////////////////////

function sectionVisibilityButton(sectionRow, menuSection, sectionNameCell) {
    const visibilityButton = document.createElement('button');
    visibilityButton.classList.add('visibilityButton')
    visibilityButton.addEventListener('click', () => {
        SectionAvailability(sectionRow);
    });
    sectionNameCell.appendChild(visibilityButton);
    const visibilityButtonImg = document.createElement('img')
    visibilityButtonImg.classList.add('visibilityButtonImg')
    visibilityButtonImg.src = '../../assets/visibilityIcon.svg'
    visibilityButton.appendChild(visibilityButtonImg)

    //Unavailable Sections - Gray
    if (!menuSection.IsAvailable) {
        sectionRow.classList.add('unavailable');
        visibilityButton.classList.add('hiddenSection')
    }

    //Changes the color of the Visibility Button according to its availability
    visibilityButton.addEventListener('click', () => {
        if (!menuSection.IsAvailable) {
            visibilityButton.classList.add('hiddenSection')
        } else {
            visibilityButton.classList.remove('hiddenSection')
        }
    })
}

//Section Availability
function SectionAvailability(sectionRow) {
    const sectionIndex = getSectionIndex(sectionRow.id);
    if (sectionIndex !== -1) {
        const isAvailableNew = !jsonData.MenuSections[sectionIndex].IsAvailable
        jsonData.MenuSections[sectionIndex].IsAvailable = isAvailableNew

        sectionRow.classList.toggle('unavailable', !isAvailableNew);

        updateSectionLocalStorage()
    }
}

////////////// DELETE BUTTON ////////////////////

function sectionDeleteButton(sectionNameCell, sectionRow, sectionName) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteButton')
    sectionNameCell.appendChild(deleteButton);
    const deleteButtonImg = document.createElement('img')
    deleteButtonImg.classList.add('deleteButtonImg')
    deleteButtonImg.src = '../../assets/deleteIcon.svg'
    deleteButton.appendChild(deleteButtonImg)
    deleteButton.addEventListener('click', () => {
        confirmDelete(sectionRow, sectionName, sectionNameCell)
    });
}

//Creates a popup to confirm the deletion of the section
function confirmDelete(sectionRow, sectionName, sectionNameCell) {
    const popup = document.createElement("div");
    popup.className = "popup";

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";
    popupContent.innerHTML = `
        <p>Do you want to delete permanently "${sectionName}"</p>
        <button class="yesButton">Yes</button>
        <button class="noButton">No</button>
    `;

    popupContent.querySelector(".yesButton").addEventListener("click", function () {
        deleteSection(sectionRow);
        popup.remove();
    });

    popupContent.querySelector(".noButton").addEventListener("click", function () {
        popup.remove();
    });

    popup.appendChild(popupContent); 
    sectionNameCell.appendChild(popup);

    //Close the delete popup when clicked outside
    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("popup")) {
            e.target.remove();
        }
    });

    //Close the delete popup when pressed "Esc"
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const popup = document.querySelector(".popup");
            if (popup !== null) {
                popup.remove();
            }
        }
    });
}

//Deletes Section from UI and LS
function deleteSection(sectionToRemove) {
    const sectionId = sectionToRemove.id;
    if (sectionToRemove) {
        sectionToRemove.remove(); 
        const sectionIndex = getSectionIndex(sectionId);
        if (sectionIndex !== -1) {
            jsonData.MenuSections.splice(sectionIndex, 1);
            jsonData.MenuSections.forEach((obj, index) => {
                obj.DisplayOrder = index;
            });
            updateSectionLocalStorage();
            updateCounterLocalStorage(sectionId, false);
        }
    }
}

//////////////////// DUPLICATE BUTTON  ////////////////////

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

//////////////////// SECTION DESCRIPTION  ////////////////////

//Updates descriptions when the JSON loads
function updateDesc(sectionId, sectionDesc) {
    const sectionIndex = getSectionIndex(sectionId);

    jsonData.MenuSections[sectionIndex].Description = sectionDesc;

    updateSectionLocalStorage()
}

//Creates the Cell where all the Desc components should be
function createSectionDescCell(menuSection, sectionRow) {
    const sectionDescCell = document.createElement('td');
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
    sectionDesc.textContent = menuSection.Description;

    let originalDesc = menuSection.Description;

    sectionDesc.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateDesc(sectionRow.id, sectionDesc.textContent);
            originalDesc = sectionDesc.textContent;
            sectionDesc.blur();
        } else if (e.key === 'Escape') {
            sectionDesc.textContent = originalDesc;
            sectionDesc.blur();
        }
    });

    sectionDesc.addEventListener('blur', () => {
        sectionDesc.textContent = originalDesc;
        sectionDesc.classList.remove('sectionClicked')
    });

    sectionDesc.addEventListener('click', () => {
        sectionDesc.classList.add('sectionClicked')
    })

    return sectionDesc
}


export { 
    createSection, 
    sectionVisibilityButton, 
    sectionDeleteButton,
    sectionDuplicateButton,
}