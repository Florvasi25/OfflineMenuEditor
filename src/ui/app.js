import { saveToFile } from './file.js';
import { emptyMenu } from './emptyMenu.js'

let jsonData = JSON.parse(localStorage.getItem("jsonData")) ?? emptyMenu;

//Loading the File
document.getElementById('jsonFileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        jsonData = JSON.parse(e.target.result);
        localStorage.setItem("jsonData", JSON.stringify(jsonData));
        generateHTML(jsonData);
    };

    reader.readAsText(file);
});

//Builds HTML
function generateHTML(data) {
    const outputContainer = document.getElementById('outputContainer');
    outputContainer.innerHTML = '';

    data.MenuSections.forEach(menuSection => {
        let sectionDiv = createSection(menuSection)
        outputContainer.appendChild(sectionDiv);
    });
}

//Section components
function createSection(menuSection){
    //Section Container
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('sectionContainer');
    sectionDiv.id = menuSection.MenuSectionId;

    //Unavailable Sections -- Gray
    if (!menuSection.IsAvailable) {
        sectionDiv.classList.add('unavailable');
    }

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

    return sectionDiv
}

//Updates UI after changes
function updateDataFromUI() {
    const menuSections = document.getElementsByClassName('sectionContainer');

    Array.from(menuSections).forEach(section => {
        const sectionId = section.id;
        const sectionIndex = jsonData.MenuSections.findIndex(sectionIndex => sectionIndex.MenuSectionId == sectionId);

        const name = section.getElementsByClassName('sectionName')[0].textContent;

        jsonData.MenuSections[sectionIndex].Name = name;
    });

    localStorage.setItem("jsonData", JSON.stringify(jsonData));
}

//Saves JSON
document.getElementById('saveButton').addEventListener('click', function () {
    updateDataFromUI();
    
    console.log(jsonData);
    saveToFile(jsonData);
});

//Add Section
let idCounter = 0;
document.getElementById('addSectionButton').addEventListener('click', () => {
    idCounter++;

    const emptySectionJson = {
            MenuSectionId: `${idCounter}`,
            Name: "Empty",
            Description: null,
            DisplayOrder: 0,
            MenuItems: [],
            PublicId: "167876d3-b8ae-467e-ab8e-8a0dfda2b08e",
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
    
    sectionDiv.addEventListener('input', updateDataFromUI);
    document.getElementById('outputContainer').appendChild(sectionDiv);
    
    jsonData.MenuSections.push(emptySectionJson)
    localStorage.setItem("jsonData", JSON.stringify(jsonData));

});

//Delete Section
function deleteSection(sectionId) {
    const sectionToRemove = document.getElementById(sectionId);
    if (sectionToRemove) {
        sectionToRemove.remove();
        const sectionIndex = jsonData.MenuSections.findIndex(sectionIndex => sectionIndex.MenuSectionId == sectionId)
        
        if (sectionIndex !== -1) {
            jsonData.MenuSections.splice(sectionIndex, 1);
            localStorage.setItem("jsonData", JSON.stringify(jsonData));
        }
    }
}

//After loading the Data it generates the HTML
generateHTML(jsonData);


