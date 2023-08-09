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
        updateLocalStorage()
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

    updateLocalStorage()
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
    updateLocalStorage()
    localStorage.setItem("idCounter", JSON.stringify(idCounter));

});

//Deletes Section from UI and LS
function deleteSection(sectionId) {
    const sectionToRemove = document.getElementById(sectionId);
    if (sectionToRemove) {
        sectionToRemove.remove();

        const sectionIndex = getSectionIndex(sectionId);

        if (sectionIndex !== -1) {
            jsonData.MenuSections.splice(sectionIndex, 1);
            updateLocalStorage();
        }
    }
}

//Updates LocalStorage
function updateLocalStorage() {
    localStorage.setItem("jsonData", JSON.stringify(jsonData));
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
        updateLocalStorage()
    }
}

//After loading the Data it generates the HTML
generateHTML(jsonData);