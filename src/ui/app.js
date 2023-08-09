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
        let sectionDiv = createSection(menuSection);
        outputContainer.appendChild(sectionDiv);
    });
}

//Section components
function createSection(menuSection) {
    //Section Container
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('sectionContainer');
    sectionDiv.id = menuSection.MenuSectionId;

    //Name Component
    const sectionName = document.createElement('p');
    sectionName.contentEditable = true;
    sectionName.classList.add('sectionName');
    sectionName.textContent = menuSection.Name;
    sectionDiv.appendChild(sectionName);

    sectionName.addEventListener('input', updateDataFromUI);

    //Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        deleteSection(sectionDiv.id);
    });
    sectionDiv.appendChild(deleteButton);

    //Unavailable Sections - Gray
    if (!menuSection.IsAvailable) {
        sectionDiv.classList.add('unavailable');
    }

    //Availability Button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Availability';
    toggleButton.addEventListener('click', () => {
        toggleSectionAvailability(sectionDiv.id);
    });
    sectionDiv.appendChild(toggleButton);

    //Duplicate Button
    const duplicateButton = document.createElement('button');
    duplicateButton.textContent = 'Duplicate';
    duplicateButton.addEventListener('click', () => {
        duplicateSection(sectionDiv.id);
    });
    sectionDiv.appendChild(duplicateButton);

    return sectionDiv
}

//Updates UI after changes
function updateDataFromUI() {
    const menuSections = document.getElementsByClassName('sectionContainer');

    Array.from(menuSections).forEach(section => {
        const sectionId = section.id;
        const sectionIndex = getSectionIndex(sectionId);

        const name = section.getElementsByClassName('sectionName')[0].textContent;

        jsonData.MenuSections[sectionIndex].Name = name;
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

    let sectionDiv = createSection(emptySectionJson)

    document.getElementById('outputContainer').appendChild(sectionDiv);

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

function toggleSectionAvailability(sectionId) {
    const sectionIndex = getSectionIndex(sectionId);
    if (sectionIndex !== -1) {
        const isAvailableNew = !jsonData.MenuSections[sectionIndex].IsAvailable
        jsonData.MenuSections[sectionIndex].IsAvailable = isAvailableNew
        const sectionDiv = document.getElementById(sectionId);
        if (sectionDiv) {
            sectionDiv.classList.toggle('unavailable', !isAvailableNew);
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
        
        const newSectionDiv = createSection(newSection);
        document.getElementById('outputContainer').appendChild(newSectionDiv);
        
        jsonData.MenuSections.push(newSection);
        updateSectionLocalStorage();
        updateCounterLocalStorage();
    }
}

//After loading the Data it generates the HTML
generateHTML(jsonData);