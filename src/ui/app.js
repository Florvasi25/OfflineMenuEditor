import { saveToFile } from './file.js';

import { 
    createSection,
    setSectionId,
    getUniqueRandomInt
} from "./section.js";

import {
    jsonData, setJsonData,
    updateCounterLocalStorage,
    updateSectionLocalStorage,
    //nextId,
} from './context.js';

//Loading the File
document.getElementById('jsonFileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        setJsonData(JSON.parse(e.target.result));
        updateSectionLocalStorage()
        setSectionId(jsonData);
        generateHTML(jsonData);
    };

    if (!file) return

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

//Saves JSON
document.getElementById('saveButton').addEventListener('click', function () {
    console.log(jsonData);
    saveToFile(jsonData);
});

//Add Section
document.getElementById('addSectionButton').addEventListener('click', () => {
    const newId = getUniqueRandomInt()

    const emptySectionJson = {
        MenuSectionId: newId,
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
            MenuSectionId: newId,
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
    updateCounterLocalStorage(newId, true);

});


//After loading the Data it generates the HTML
generateHTML(jsonData);