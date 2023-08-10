import { saveToFile } from './file.js';
import { emptyMenu } from './emptyMenu.js'

let jsonData = JSON.parse(localStorage.getItem("jsonData")) ?? emptyMenu;
let idCounter = JSON.parse(localStorage.getItem("idCounter")) ?? 0;

//Loading the File
document.getElementById('jsonFileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        jsonData = JSON.parse(e.target.result);
        updateSectionLocalStorage()
        generateHTML(jsonData);
    };

    reader.readAsText(file);
});

//Builds HTML
function generateHTML(data) {
    const outputContainer = document.getElementById('outputContainer');
    outputContainer.innerHTML = '';

    data.MenuSections.forEach(menuSection => {
        let sectionRow = createSection(menuSection);
        outputContainer.appendChild(sectionRow);
    });
}

//Section components
function createSection(menuSection) {
    //Section Container
    const sectionRow = document.createElement('tr');
    sectionRow.classList.add('sectionContainer');
    sectionRow.id = menuSection.MenuSectionId;

    //Name Cell
    const sectionNameCell = document.createElement('td');
    sectionNameCell.classList.add('sectionNameCell');
    sectionRow.append(sectionNameCell)
    
    //Name Component
    const sectionName = document.createElement('p');
    sectionName.contentEditable = true;
    sectionName.classList.add('sectionName');
    sectionName.textContent = menuSection.Name;
    sectionNameCell.appendChild(sectionName);
    
    sectionName.addEventListener('input', updateDataFromUI);
    
    //Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        deleteSection(sectionRow.id);
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
        SectionAvailability(sectionRow.id);
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

    //Section Description
    const sectionDesc = document.createElement('p');
    sectionDesc.contentEditable = true;
    sectionDesc.classList.add('sectionDesc');
    sectionDesc.textContent = menuSection.Description;
    sectionDescCell.appendChild(sectionDesc);

    sectionDesc.addEventListener('input', updateDataFromUI);

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

//Updates UI after changes
function updateDataFromUI() {
    const menuSections = document.getElementsByClassName('sectionContainer');

    Array.from(menuSections).forEach(section => {
        const sectionId = section.id;
        const sectionIndex = getSectionIndex(sectionId);

        const sectionName = section.getElementsByClassName('sectionName')[0].textContent;
        const sectionDesc = section.getElementsByClassName('sectionDesc')[0].textContent;

        jsonData.MenuSections[sectionIndex].Name = sectionName;
        jsonData.MenuSections[sectionIndex].Description = sectionDesc;
    });

    updateSectionLocalStorage()
}

//Gets Section Index
function getSectionIndex(sectionId) {
    const sectionIndex = jsonData.MenuSections.findIndex(sectionElement => sectionElement.MenuSectionId == sectionId)

    return sectionIndex
}

//Saves JSON
document.getElementById('saveButton').addEventListener('click', function () {
    updateDataFromUI();

    console.log(jsonData);
    saveToFile(jsonData);
});

//Add Section
document.getElementById('addSectionButton').addEventListener('click', () => {
    idCounter++;

    const emptySectionJson = {
        MenuSectionId: `${idCounter}`,
        Name: "Empty",
        Description: null,
        DisplayOrder: 0,
        MenuItems: [],
        PublicId: crypto.randomUUID(),
        IsDeleted: false,
        IsAvailable: true,
        IsHiddenFromUsers: false,
        ImageName: null,
        ImageUrl: null,
        CellAspectRatio: 0,
        CellLayoutType: 0,
        MenuSectionAvailability: {
            MenuSectionId: `${idCounter}`,
            AvailableTimes: null,
            AvailabilityMode: 0
        },
        ConcessionStoreId: null,
        MenuSectionMetadata: []
    };

    let sectionRow = createSection(emptySectionJson)

    document.getElementById('outputContainer').appendChild(sectionRow);

    jsonData.MenuSections.push(emptySectionJson)
    updateSectionLocalStorage()
    updateCounterLocalStorage();

});

//Deletes Section from UI and LS
function deleteSection(sectionId) {
    const sectionToRemove = document.getElementById(sectionId);
    if (sectionToRemove) {
        sectionToRemove.remove();

        const sectionIndex = getSectionIndex(sectionId);

        if (sectionIndex !== -1) {
            jsonData.MenuSections.splice(sectionIndex, 1);
            updateSectionLocalStorage();
        }
    }
}

//Updates JSON LocalStorage
function updateSectionLocalStorage() {
    localStorage.setItem("jsonData", JSON.stringify(jsonData));
}

//Updates Counter LocalStorage
function updateCounterLocalStorage() {
    localStorage.setItem("idCounter", JSON.stringify(idCounter));
}

//Section Availability
function SectionAvailability(sectionId) {
    const sectionIndex = getSectionIndex(sectionId);
    if (sectionIndex !== -1) {
        const isAvailableNew = !jsonData.MenuSections[sectionIndex].IsAvailable
        jsonData.MenuSections[sectionIndex].IsAvailable = isAvailableNew
        const sectionRow = document.getElementById(sectionId);
        if (sectionRow) {
            sectionRow.classList.toggle('unavailable', !isAvailableNew);
        }
        updateSectionLocalStorage()
    }
}

//Duplicates Section
function duplicateSection(sectionId) {
    const sectionIndex = getSectionIndex(sectionId);
    
    if (sectionIndex !== -1) {
        const originalSection = jsonData.MenuSections[sectionIndex];
        const newSection = JSON.parse(JSON.stringify(originalSection));

        const newSectionId = `${++idCounter}`
                
        newSection.MenuSectionId = newSectionId;
        newSection.MenuSectionAvailability.MenuSectionId = newSectionId;
        newSection.PublicId = crypto.randomUUID();
        
        const newSectionRow = createSection(newSection);
        document.getElementById('outputContainer').appendChild(newSectionRow);
        
        jsonData.MenuSections.push(newSection);
        updateSectionLocalStorage();
        updateCounterLocalStorage();
    }
}

//After loading the Data it generates the HTML
generateHTML(jsonData);