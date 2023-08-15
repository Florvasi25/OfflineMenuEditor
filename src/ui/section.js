import {
    jsonData, /*nextId,*/ getSectionIndex,
    updateCounterLocalStorage,
    updateSectionLocalStorage,
} from './context.js';

//Updates Name
function updateName(sectionId, sectionName) {
    const sectionIndex = getSectionIndex(sectionId);

    jsonData.MenuSections[sectionIndex].Name = sectionName;

    updateSectionLocalStorage()
}

//Updates Description
function updateDesc(sectionId, sectionDesc) {
    const sectionIndex = getSectionIndex(sectionId);

    jsonData.MenuSections[sectionIndex].Description = sectionDesc;

    updateSectionLocalStorage()
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

function getRandomInt() {
    return Math.floor(Math.random() * 9999999) + 1;
}

function getUniqueRandomInt() {
    const storedNumbers = JSON.parse(localStorage.getItem("sectionIDs") || "[]");
    let randomNum = getRandomInt();

    while (storedNumbers.includes(randomNum)) {
        randomNum = getRandomInt();
    }
    return randomNum;
}

//set sectionID for entire json file
function setSectionId(jsonData) {
    localStorage.setItem("sectionIDs", "[]");
    for (const section of jsonData.MenuSections) {
        let id = getRandomInt()
        section.MenuSectionId = id;
        section.MenuSectionAvailability.MenuSectionId = id;
        updateCounterLocalStorage(id, true)
    }
    updateSectionLocalStorage()
}
//Duplicates Section
function duplicateSection(sectionId) {
    const sectionIndex = getSectionIndex(sectionId);

    if (sectionIndex !== -1) {
        const originalSection = jsonData.MenuSections[sectionIndex];
        const newSection = JSON.parse(JSON.stringify(originalSection));

        const newSectionId = getUniqueRandomInt();

        newSection.MenuSectionId = newSectionId;
        newSection.MenuSectionAvailability.MenuSectionId = newSectionId;
        newSection.PublicId = crypto.randomUUID();

        const newSectionRow = createSection(newSection);
        document.getElementById('outputContainer').appendChild(newSectionRow);

        jsonData.MenuSections.push(newSection);
        updateSectionLocalStorage();
        updateCounterLocalStorage(newSectionId, true);
    }
}

//Deletes Section from UI and LS
function deleteSection(sectionToRemove) {
    const sectionId = sectionToRemove.id;
    if (sectionToRemove) {
        sectionToRemove.remove();
        const sectionIndex = getSectionIndex(sectionId);
        if (sectionIndex !== -1) {
            jsonData.MenuSections.splice(sectionIndex, 1);
            updateSectionLocalStorage();
            console.log("Section to remove " + sectionToRemove.Name);
            updateCounterLocalStorage(sectionId, false);
        }
    }
}

//Section components
function createSection(menuSection) {
    //Section Container
    const sectionRow = document.createElement('tr');
    sectionRow.classList.add('sectionContainer');
    sectionRow.classList.add('draggable');
    sectionRow.setAttribute('draggable', true)
    sectionRow.id = menuSection.MenuSectionId;

    sectionRow.addEventListener('dragstart', () => {
        sectionRow.classList.add('dragging')
    })

    sectionRow.addEventListener('dragend', () => {
        sectionRow.classList.remove('dragging')
    })

    //Name Cell
    const sectionNameCell = document.createElement('td');
    sectionNameCell.classList.add('sectionNameCell');
    sectionRow.append(sectionNameCell)

    //Name Component
    const sectionName = document.createElement('p');
    sectionName.classList.add('sectionName');
    sectionName.contentEditable = true;
    sectionName.textContent = menuSection.Name;
    sectionNameCell.appendChild(sectionName);

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

    //Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        deleteSection(sectionRow);
    });
    sectionNameCell.appendChild(deleteButton);

    //Unavailable Sections - Gray
    if (!menuSection.IsAvailable) {
        sectionRow.classList.add('unavailable');
    }

    //Availability Button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Availability';
    toggleButton.addEventListener('click', () => {
        SectionAvailability(sectionRow);
    });
    sectionNameCell.appendChild(toggleButton);

    //Duplicate Button
    const duplicateButton = document.createElement('button');
    duplicateButton.textContent = 'Duplicate';
    duplicateButton.addEventListener('click', () => {
        duplicateSection(sectionRow.id);
    });
    sectionNameCell.appendChild(duplicateButton);

    //Section Cell
    const sectionDescCell = document.createElement('td');
    sectionDescCell.classList.add('sectionDescCell');
    sectionRow.append(sectionDescCell)

    const sectionDesc = document.createElement('p');
    sectionDesc.contentEditable = true;
    sectionDesc.classList.add('sectionDesc');
    sectionDesc.textContent = menuSection.Description;
    sectionDescCell.appendChild(sectionDesc);
    
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
    
    //OS Cell
    const sectionOsCell = document.createElement('td');
    sectionOsCell.classList.add('sectionOsCell');
    sectionRow.append(sectionOsCell)

    //Price Cell
    const sectionPriceCell = document.createElement('td');
    sectionPriceCell.classList.add('sectionPriceCell');
    sectionRow.append(sectionPriceCell)

    //Tax Cell
    const sectionTaxCell = document.createElement('td');
    sectionTaxCell.classList.add('sectionTaxCell');
    sectionRow.append(sectionTaxCell)

    return sectionRow
}

export { createSection, setSectionId, getUniqueRandomInt }